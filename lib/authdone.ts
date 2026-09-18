import { createHash } from "crypto";

// THE PAGE THE BROWSER LANDS ON AFTER GOOGLE.
//
// Asked for by Lauro on 2026-09-18, with a screenshot of Claude's own version:
// "Nach dem Login auf deiner Seite steht irgendwie 'Success'. Du kannst den Tab
// schliessen oder so, und wenn man draufklickt, wird direkt die App geöffnet."
//
// WHAT IT REPLACES. Supabase used to send the browser straight to
// `loudflow://auth?code=…`. That works — Windows hands the URL to the app — but
// the person is left looking at whatever their browser does with a protocol it
// was asked to open: a blank tab, a permission bar, sometimes an error page.
// There was no moment that said "this worked".
//
// WHAT IT IS. A static page with one link. The link is a `loudflow://` URL, so
// clicking it is the same handoff Windows was doing anyway — only now it is a
// button somebody pressed instead of something that happened to them.
//
// ---------------------------------------------------------------------------
// THE FOUR RULES THIS FILE FOLLOWS, BECAUSE THE URL CARRIES AN AUTH CODE
//
// 1. IT LOADS NOTHING FROM ANYWHERE. No font, no icon file, no analytics, no
//    framework on the client. The mark is inline SVG and the type is the
//    system stack. A page that makes no outbound request cannot leak the code
//    in a referrer, a DNS lookup or a third party's log — and the CSP below is
//    `default-src 'none'`, which is only honest because of this rule.
// 2. NOTHING FROM THE QUERY IS REFLECTED AS IT ARRIVED. Five parameter names
//    are allowed through, each value is re-encoded with `encodeURIComponent`,
//    and the result is escaped again for the attribute. Anything else in the
//    URL is dropped. There is no path by which a crafted link becomes markup.
// 3. NO STORE, NO INDEX, NO REFERRER. A URL with a single-use credential in it
//    must not sit in a CDN, a search index or a Referer header.
// 4. THE CODE ALONE IS WORTHLESS ANYWAY, and that is the property that makes
//    this page acceptable at all: the PKCE verifier never leaves the app, so
//    Supabase refuses the exchange to anybody who only has what is on screen
//    here. This page is a convenience, never a secret-keeper.
//
// ---------------------------------------------------------------------------
// IT WORKS WITH JAVASCRIPT SWITCHED OFF. The success/cancelled decision and the
// link itself are both rendered on the server, so the button is live before a
// single line of script runs. The script does exactly two things: it takes the
// code out of the address bar, and it tries the handoff once by itself. If it
// never runs, the page is still a page with a working button.

const INK = "#16150f";
const MUTED = "#6b6960";
const GROUND = "#fbf7eb"; // the sign-in window's own backgroundColor, so the
                          // browser tab and the app window share one ground
const CANVAS = "#faf9f5";
const LIFT = "#30302f"; // --sk-ink-lift, the app's measured hover step

/* The scheme Windows hands to the app. `deeplink.js` registers it; `auth.js`
 * parses it. One verb, and it is the only URL this page ever builds. */
const APP_SCHEME = "loudflow://auth";

/* THE ALLOW-LIST. Supabase sends `code` on success and the three `error*`
 * fields on a refusal; `state` is there for the day we use it. Every other
 * parameter a link might carry is dropped rather than forwarded, so the URL the
 * app receives is one this file can describe in full. */
const FORWARD = ["code", "state", "error", "error_code", "error_description"];

/* Two things and no more: forget the code, then try the handoff once.
 *
 * `history.replaceState` FIRST, so the address bar stops showing a credential
 * while the person reads the page — and so a bookmark or a screenshot of this
 * tab carries nothing. The link keeps its own href; it was written by the
 * server and the address bar is not where it lives.
 *
 * 250 ms, not zero: a protocol handoff that fires before the first paint is a
 * permission prompt on top of a blank page, and the person cannot tell what is
 * asking. Long enough to see the page, short enough not to be a wait. */
const SCRIPT = `(function(){
try{history.replaceState(null,'',location.pathname);}catch(e){}
var a=document.getElementById('open');
if(a){setTimeout(function(){try{location.href=a.href;}catch(e){}},250);}
})();`;

const SCRIPT_HASH = createHash("sha256").update(SCRIPT, "utf8").digest("base64");

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Rebuild the query from the allow-list, re-encoding every value. */
function handoffUrl(url: URL): string {
  const parts: string[] = [];
  for (const k of FORWARD) {
    const v = url.searchParams.get(k);
    if (v === null) continue;
    // A value longer than this is not one of ours; Supabase's codes are short.
    if (v.length > 2048) continue;
    parts.push(`${k}=${encodeURIComponent(v)}`);
  }
  return parts.length ? `${APP_SCHEME}?${parts.join("&")}` : APP_SCHEME;
}

/* His own mark, redrawn: one tall rounded bar and three short ones, all
 * standing on the same line. `public/icon.png` is the same drawing in cream on
 * black; this is it in ink, because the page is cream. Inline, so the page
 * still makes no request. */
const MARK = `<svg class="mark" width="34" height="34" viewBox="0 0 40 40" fill="${INK}" aria-hidden="true">
<rect x="8" y="4" width="4.6" height="32" rx="2.3"/>
<rect x="16.2" y="27.6" width="4.6" height="8.4" rx="2.3"/>
<rect x="23.4" y="29.2" width="4.6" height="6.8" rx="2.3"/>
<rect x="30.6" y="29.8" width="4.6" height="6.2" rx="2.3"/>
</svg>`;

/* WHAT WENT WRONG, IN WORDS — added 2026-09-18, hours after the page shipped.
 *
 * The first version of this page said "Sign-in cancelled" and nothing else. The
 * owner hit it on his own first attempt and wrote: "Ich bin jetzt ein bisschen
 * verwirrt. Hab ich was vergessen zu machen, oder was liegt es jetzt?"
 *
 * That is the page's fault, not his. It had the reason — Supabase puts it in
 * the query — and threw it away. A refusal a person cannot read is a refusal
 * they cannot act on, and it is also the one thing a support conversation needs
 * to start from.
 *
 * `access_denied` GETS ITS OWN HEADLINE because it is the ordinary one: it is
 * what Google sends when somebody presses Cancel, and calling that "didn't
 * work" would file a decision as a fault. Everything else is a fault.
 *
 * The description is shown as it arrived, escaped and cut to 300 characters.
 * It is written by Google and Supabase, not by us — so it is data on a page
 * that already treats its whole query as hostile (rule 2 in the header). */
function reason(url: URL): string {
  const code = (url.searchParams.get("error") || "").slice(0, 64);
  const desc = (url.searchParams.get("error_description") || "").slice(0, 300);
  if (desc && code) return `${desc} (${code})`;
  return desc || code;
}

function render(url: URL): string {
  const failed = url.searchParams.has("error");
  const cancelled = url.searchParams.get("error") === "access_denied";
  const target = handoffUrl(url);
  const why = reason(url);

  const ok = `
  <h1>You're signed in</h1>
  <p>LoudFlow should open automatically. If it doesn't, select Open LoudFlow. You can close this window once the app has opened.</p>
  <a class="btn" id="open" href="${esc(target)}">Open LoudFlow</a>`;

  /* THE REFUSAL GETS A BUTTON TOO, and that is not symmetry for its own sake.
   * The app is sitting on its sign-in screen waiting for an answer; the
   * `loudflow://auth?error=…` URL IS the answer, and `signin.js` has a state
   * built to draw it. Without this button the refusal stops here, in a browser
   * tab, and the app waits out its fifteen seconds knowing nothing. */
  const bad = `
  <h1>${cancelled ? "Sign-in cancelled" : "Sign-in didn't work"}</h1>
  <p>${cancelled
      ? "Nothing was changed and no account was created."
      : "Nothing was changed and no account was created. Try again from LoudFlow — if it keeps happening, the line below is what to send on."}</p>
  ${why ? `<p class="why">${esc(why)}</p>` : ""}
  <a class="btn" id="open" href="${esc(target)}">Back to LoudFlow</a>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<meta name="referrer" content="no-referrer" />
<title>LoudFlow</title>
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; height: 100%; background: ${GROUND}; }
  body {
    color: ${INK};
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 16px;
  }
  main { max-width: 420px; text-align: center; }
  .mark { display: block; margin: 0 auto 28px; }
  h1 { margin: 0 0 10px; font-size: 22px; line-height: 28px; font-weight: 600; letter-spacing: -0.01em; }
  p { margin: 0 0 24px; font-size: 14px; line-height: 22px; color: ${MUTED}; }
  /* The machine's own words. Monospace so a code reads as a code, and a tint
     of the ground so it sits apart from the sentence above it without
     shouting — this is a line to copy, not a line to be alarmed by. */
  .why {
    font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
    font-size: 12px; line-height: 19px; color: ${INK};
    background: rgba(22, 21, 15, 0.05);
    border-radius: 6px; padding: 10px 12px;
    margin: -8px 0 24px; word-break: break-word; text-align: left;
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 40px; padding: 0 20px;
    background: ${INK}; color: ${CANVAS};
    border: 1px solid ${INK}; border-radius: 8px;
    font-size: 14px; font-weight: 600; line-height: 20px;
    text-decoration: none;
  }
  .btn:hover { background: ${LIFT}; border-color: ${LIFT}; }
  .btn:active { transform: scale(0.97); }
  .btn:focus-visible { outline: 2px solid ${INK}; outline-offset: 2px; }
</style>
</head>
<body>
<main>
${MARK}${failed ? bad : ok}
</main>
<script>${SCRIPT}</script>
</body>
</html>
`;
}

export function authDoneResponse(req: Request): Response {
  const url = new URL(req.url);
  return new Response(render(url), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // A single-use credential is in this URL. It goes in no cache, anywhere.
      "cache-control": "no-store, max-age=0",
      "x-robots-tag": "noindex, nofollow",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      // Honest only because the page loads nothing: no font, no image file, no
      // client framework. The one script is allowed by its hash, so an injected
      // one would not run even if rule 2 above were ever broken.
      "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; " +
        `script-src 'sha256-${SCRIPT_HASH}'; ` +
        "base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    },
  });
}

// Exported for the eye: the hash the header carries, so a change to SCRIPT that
// forgets this file's contract shows up as a different string rather than as a
// page whose button silently stops working.
export const SCRIPT_SHA256 = SCRIPT_HASH;
