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

/* EVERY VALUE BELOW IS READ OUT OF THE APP, not chosen here. Somebody crossing
 * from the sign-in window into this tab and back should not be able to tell
 * that they changed programs — so the ground, the ink, the wordmark's size
 * and the button's fill are the app's own, with the file they come from
 * written beside them. `app/src/hub/skeleton.css` is the source. */
const INK = "#16150f";       // --sk-ink
const INK_MID = "#55524a";   // --sk-ink-mid, the app's secondary line
const GROUND = "#fbf7eb";    // signin-window.js backgroundColor — literally the
                             // colour of the window this tab was opened from
const CANVAS = "#faf9f5";    // the label on a filled button
const LIFT = "#30302f";      // --sk-ink-lift, its measured hover step

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

/* THE LOCKUP, AND IT IS THE APP'S, NOT A NEW ONE.
 *
 * The visible word is "Flow", not "LoudFlow" — the mark itself draws the L.
 * That is the wordmark decision of 2026-09-12 (`signin.js:463`), and
 * `signin.css:134` sets the one treatment it is allowed anywhere: 26 / 26 /
 * 600 / -0.02em, 8 px from the mark, in ink. A second size for the same word
 * on a second screen is how a product ends up with two logos.
 *
 * The drawing is his own: one tall rounded bar and three short ones on a
 * common line. `public/icon.png` is the same thing in cream on black; this is
 * it in ink, because the page is cream. Inline, so the page still makes no
 * request of anybody. */
const LOCKUP = `<div class="brand">
<svg width="26" height="26" viewBox="0 0 40 40" fill="${INK}" aria-hidden="true">
<rect x="8" y="4" width="4.6" height="32" rx="2.3"/>
<rect x="16.2" y="27.6" width="4.6" height="8.4" rx="2.3"/>
<rect x="23.4" y="29.2" width="4.6" height="6.8" rx="2.3"/>
<rect x="30.6" y="29.8" width="4.6" height="6.2" rx="2.3"/>
</svg><span>Flow</span></div>`;

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
  <p>LoudFlow should open by itself. If it doesn't, use the button.</p>
  <a class="btn" id="open" href="${esc(target)}">Open LoudFlow</a>
  <p class="after">You can close this tab once the app is open.</p>`;

  /* THE REFUSAL GETS A BUTTON TOO, and that is not symmetry for its own sake.
   * The app is sitting on its sign-in screen waiting for an answer; the
   * `loudflow://auth?error=…` URL IS the answer, and `signin.js` has a state
   * built to draw it. Without this button the refusal stops here, in a browser
   * tab, and the app waits out its fifteen seconds knowing nothing. */
  const bad = `
  <h1>${cancelled ? "Sign-in cancelled" : "Sign-in didn't work"}</h1>
  <p>Nothing was changed and no account was created.${
    cancelled ? "" : " Try again from LoudFlow."}</p>
  ${why ? `<p class="why">${esc(why)}</p>` : ""}
  <a class="btn" id="open" href="${esc(target)}">Back to LoudFlow</a>
  <p class="after">You can close this tab.</p>`;

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
  main { width: 100%; max-width: 380px; text-align: center; }

  /* THE APP'S ONE TREATMENT: signin.css:134 — 26 / 26 / 600 / -0.02em, 8 px
     from the mark. Nothing here invents a second one. */
  .brand { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 32px; }
  .brand span { font-size: 26px; line-height: 26px; font-weight: 600; letter-spacing: -0.02em; }

  /* 28 / 34 / 600, the same .sg-title the sign-in window draws. */
  h1 { margin: 0 0 8px; font-size: 28px; line-height: 34px; font-weight: 600; letter-spacing: -0.01em; }
  /* 14 / 20 on --sk-ink-mid, the same .sg-lead. text-wrap: balance for the
     reason the app gives: a short tail must not sit alone on the last row. */
  p { margin: 0 0 28px; font-size: 14px; line-height: 20px; color: ${INK_MID}; text-wrap: balance; }

  /* The machine's own words — a line to copy, not a line to be alarmed by.
     Monospace so a code reads as a code, on a tint of the ground so it sits
     apart from the sentence without shouting. */
  .why {
    font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
    font-size: 12px; line-height: 19px; color: ${INK};
    background: rgba(22, 21, 15, 0.05);
    border-radius: 8px; padding: 10px 12px;
    margin: -10px 0 28px; word-break: break-word; text-align: left;
  }

  /* --sk-ctl-h 36, --sk-r-ctl 8, and the ink fill hub-kit.css gives
     .hk-btn--primary: "the primary is ink and never the accent". */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 36px; padding: 0 16px;
    background: ${INK}; color: ${CANVAS};
    border: 1px solid ${INK}; border-radius: 8px;
    font-size: 14px; font-weight: 600; line-height: 20px;
    text-decoration: none;
  }
  .btn:hover { background: ${LIFT}; border-color: ${LIFT}; }
  .btn:active { transform: scale(0.97); }
  .btn:focus-visible { outline: 2px solid ${INK}; outline-offset: 2px; }

  /* The quiet line after the action. Half a step down from the lead, because
     it is the one sentence nobody has to read. */
  .after { margin: 20px 0 0; font-size: 13px; line-height: 19px; opacity: 0.75; }

  @media (max-width: 420px) {
    h1 { font-size: 24px; line-height: 30px; }
    .brand { margin-bottom: 26px; }
  }
</style>
</head>
<body>
<main>
${LOCKUP}${failed ? bad : ok}
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
