// THE ONE PLACE THE GOOGLE CLIENT SECRET IS USED — 2026-09-30.
//
// WHY IT EXISTS. Through Supabase's authorize page, Google's sign-in screen
// said "Weiter zu rxycyzbdbgurwymkwdgx.supabase.co". Google names the domain of
// the redirect URI until a brand is verified, and a brand cannot be verified on
// a domain you do not own. So the LoudFlow app now goes to Google itself and
// Google returns to https://loudflow.xyz/auth/done — our page, our domain.
//
// THE ROUND TRIP (the app side is `app/src/main/auth.js`, "GOOGLE DIRECTLY"):
//   1. app → Google with PKCE (S256), a hashed nonce and a state
//   2. Google → loudflow.xyz/auth/done?code=… → loudflow://auth?code=…
//   3. app → THIS function: { code, code_verifier }  ← the verifier comes from
//      the app over HTTPS, never through the browser
//   4. this function → Google's token endpoint with the client secret
//   5. app ← { id_token, access_token } → Supabase grant_type=id_token
//
// WHAT IT KEEPS TRUE:
// * The code the browser carried is still worthless alone: Google refuses the
//   exchange without the verifier, and only the app that started the sign-in
//   has it. Somebody who calls this function can only swap a code THEY started
//   — for their own ID token, which Supabase would give them anyway.
// * It stores nothing and logs no code, verifier or token — only a status word.
// * It answers a few fixed words, never Google's own text about a code.
// * Until GOOGLE_CLIENT_SECRET is set on Vercel it answers 503
//   `not_configured`, and the app says "the sign-in service had a problem" —
//   the app only comes here once supabase.json names this URL, which happens
//   after the round trip has been measured.

export const dynamic = "force-dynamic";

// Public values: the client id is in every Google sign-in URL, and the
// redirect URI must match, to the byte, the one the app sent and the one
// registered at Google.
const CLIENT_ID = "656202119404-eq7eajdb9n0u1li7g44oss3c3cgbl7hg.apps.googleusercontent.com";
const REDIRECT_URI = "https://loudflow.xyz/auth/done";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";

const HEADERS = {
  "content-type": "application/json; charset=utf-8",
  // An ID token is in the answer. It goes in no cache, anywhere.
  "cache-control": "no-store, max-age=0",
  "x-robots-tag": "noindex, nofollow",
  "x-content-type-options": "nosniff",
};

function answer(status: number, body: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers: HEADERS });
}

// What Google's refusals may be passed on as. Anything else becomes
// `exchange_failed` — the app only needs to know it was refused.
const WORDS = new Set(["invalid_grant", "invalid_client", "unauthorized_client", "invalid_request"]);

export async function POST(req: Request): Promise<Response> {
  const secret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  if (!secret) return answer(503, { error: "not_configured" });

  let code = "";
  let verifier = "";
  try {
    const text = await req.text();
    if (text.length > 4096) return answer(413, { error: "too_large" });
    const body = JSON.parse(text);
    code = typeof body?.code === "string" ? body.code : "";
    verifier = typeof body?.code_verifier === "string" ? body.code_verifier : "";
  } catch {
    return answer(400, { error: "bad_request" });
  }
  // A Google code is short and printable; a PKCE verifier is 43–128 of the
  // unreserved characters (RFC 7636 §4.1). Anything else is not ours.
  if (!/^[\x21-\x7e]{10,512}$/.test(code)) return answer(400, { error: "bad_request" });
  if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier)) return answer(400, { error: "bad_request" });

  let res: Response;
  try {
    res = await fetch(GOOGLE_TOKEN, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        code_verifier: verifier,
        client_id: CLIENT_ID,
        client_secret: secret,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.warn("[google-token] google unreachable");
    return answer(502, { error: "google_unreachable" });
  }

  let data: Record<string, unknown> | null = null;
  try {
    data = (await res.json()) as Record<string, unknown>;
  } catch {
    data = null;
  }
  const idToken = data && typeof data.id_token === "string" ? data.id_token : "";
  if (!res.ok || !idToken) {
    const said = data && typeof data.error === "string" ? data.error : "";
    const word = WORDS.has(said) ? said : "exchange_failed";
    console.warn(`[google-token] refused: ${res.status} ${word}`);
    return answer(res.status >= 500 ? 502 : 400, { error: word });
  }
  const out: Record<string, string> = { id_token: idToken };
  if (data && typeof data.access_token === "string") out.access_token = data.access_token;
  return answer(200, out);
}

export function GET(): Response {
  return new Response(null, { status: 405, headers: { allow: "POST", ...HEADERS } });
}
