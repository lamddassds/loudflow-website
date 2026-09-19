// The two documents the rest of the product needs to exist.
//
// WHY THEY ARE HERE AND NOT IN THE APP: Google will not let an OAuth app leave
// "Testing" without a reachable home page, privacy policy and terms of service
// (Branding page, 2026-09-17). Beyond that gate they are simply what an app
// that holds somebody's voice recording owes them.
//
// THE SHAPE IS THE MAINTENANCE PAGE'S, deliberately. Same white field, same
// Figtree, same #16150f ink out of the Hub's own stylesheet — this is not the
// place to invent a second look for the brand, and the redesign that IS coming
// will replace both pages at once.
//
// THEY RETURN 200, NOT 503. The rest of loudflow.xyz is parked behind a real
// "temporarily unavailable"; these two have to answer normally or Google's
// checker, and anyone following the link from the sign-in screen, sees the
// notice instead of the document.
//
// WRITTEN TO BE TRUE TODAY. Where a feature is not switched on yet, the page
// says so rather than describing a future as a fact. Drafted by the build, NOT
// reviewed by a lawyer, and the owner knows that.
//
// 2026-09-19 — LOCAL FIRST. The app no longer uploads for a one-computer
// account; a second computer is approved on the first, the approval dialog
// names the encrypted cloud copy before anything is uploaded, and the
// database keeps which wording was agreed to and when (LoudFlowBKE
// app/src/main/sync.js CONSENT_VERSION, supabase/schema.sql devices).
// Resend, which sends the sign-in code, was missing from "who else".

const INK = "#16150f";
const MUTED = "#71716e";
const LINE = "#e7e5dd";

export type Doc = {
  slug: string;
  title: string;
  updated: string;
  lead: string;
  sections: { h: string; p: string[] }[];
};

const CONTACT = "loudflow.app@gmail.com";

export const PRIVACY: Doc = {
  slug: "privacy",
  title: "Privacy",
  updated: "19 September 2026",
  lead:
    "LoudFlow reads text aloud on your own computer. You sign in with an account, " +
    "and we keep as little as a working account allows.",
  sections: [
    {
      h: "The short version",
      p: [
        "The text you have read aloud, the audio LoudFlow produces and the voice models it uses stay on your computer. There is no analytics, no tracking, no advertising and no profiling anywhere in the app or on this site.",
        "We know your email address. As long as you use LoudFlow on one computer, your voices and texts never leave it.",
        "Only when you approve a second computer of your own — and LoudFlow asks you before anything is uploaded — do your saved voices and texts travel between your computers, end-to-end encrypted. The key exists only on your computers; we cannot read what we store.",
        "Deleting your account deletes all of it, at once and for good.",
      ],
    },
    {
      h: "What stays on your computer",
      p: [
        "Everything the app does to make speech: the text you paste or select, the audio it generates, the voices it ships with, the reference recordings you make, and the diagnostic log it keeps for itself. LoudFlow speaks offline; that is the product, not a setting.",
        "Each account keeps its own voices, texts and settings. Two accounts on one computer do not see each other's things, and a new account starts empty.",
      ],
    },
    {
      h: "What we hold when you sign in",
      p: [
        "Your email address, an account identifier, and the times you signed in. That is what an account is. We do not email you marketing.",
        "For each computer you use LoudFlow on, a short record: the computer's name as Windows reports it, its operating system and app version, a public key, and when it was last seen. It holds no content. We use it for one purpose — to know which computers are yours — and for nothing else.",
      ],
    },
    {
      h: "What we hold when you use a second computer",
      p: [
        "Nothing, until you say so. When you sign in on another computer, the first one asks you to approve it, and that question says — before anything is uploaded — that your saved voices and texts will from then on be stored in the cloud, end-to-end encrypted. Approving is your consent. We record which wording you agreed to and when.",
        "What travels: the voices you saved — the short reference recording, its name, language and transcript, and the settings measured from it — and the texts you had read aloud, with their date. Not the generated audio.",
        "How: everything is encrypted on your computer before it is uploaded (AES-256-GCM), with a key that only your approved computers hold; the key passes from one of your computers to the next sealed with that computer's own key. We store only the encrypted files and cannot open them.",
        "When it goes: if you are back to one computer — because you removed the other one in the app, or it has not been used for 60 days — the encrypted copy is deleted at the next check. Removing a computer also withdraws its approval: to come back it has to be approved again.",
        "A voice recording is personal data, and where it is somebody else's voice it is their personal data. Only save a recording you made yourself or have permission to use.",
      ],
    },
    {
      h: "Where it is kept",
      p: [
        "On Supabase, in their Zurich region (eu-central-2) — servers in Switzerland. Supabase processes the data on our instructions and holds nothing of its own. Row-level rules in the database mean an account can only ever read its own rows and its own files.",
      ],
    },
    {
      h: "Who else is involved",
      p: [
        "Google, only if you choose to sign in with Google: they tell us your email address and name, and they know that you signed in to LoudFlow. Their handling of that is covered by Google's own privacy policy.",
        "Resend, only if you sign in with your email address: it delivers the email with your sign-in code, and for that it receives your email address and the code.",
        "Supabase, as described above. Nobody else. We do not sell, rent or share your data, and we do not train anything on your voice or your texts.",
      ],
    },
    {
      h: "Cookies",
      p: [
        "This website sets none. The app sets none. There is nothing to consent to, which is why you are not being asked.",
      ],
    },
    {
      h: "How long we keep it",
      p: [
        "Until you delete it. Deleting your account from inside LoudFlow removes your rows, your computer records, your encrypted copies and the account itself in one step — we hold no separate copy and no archive. Backups of the database are kept for a short period by our host and roll off by themselves.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "Under Swiss data protection law and the GDPR you can ask what we hold about you, have it corrected, have it deleted, have a copy of it, or object to how it is used. You can withdraw your consent to the encrypted copy at any time by removing your other computers in the app. Write to " +
          CONTACT +
          " and we will answer within thirty days. You may also complain to your data protection authority.",
        "The controller is the maker of LoudFlow, reachable at " + CONTACT + ". A postal address is available on request.",
      ],
    },
    {
      h: "Children",
      p: ["LoudFlow is not intended for people under 16."],
    },
    {
      h: "Changes",
      p: [
        "If this page changes, the date at the top changes with it, and anything material is announced in the app before it takes effect.",
      ],
    },
  ],
};

export const TERMS: Doc = {
  slug: "terms",
  title: "Terms",
  updated: "19 September 2026",
  lead:
    "The rules for using LoudFlow. Short, because the app does little that " +
    "needs rules — except one thing, and that one is in bold.",
  sections: [
    {
      h: "What you get",
      p: [
        "A licence to use LoudFlow on the computers you control, for your own purposes, private or commercial. The software stays ours; what you make with it stays yours.",
      ],
    },
    {
      h: "Your account",
      p: [
        "One account per person, and it is yours to look after. Tell us at " +
          CONTACT +
          " if you think somebody else is using it.",
        "Each account has its own voices, texts and settings; on a shared computer another account starts empty. Approve only computers that belong to you.",
      ],
    },
    {
      h: "Voices — the rule that matters",
      p: [
        "Only clone a voice you own or have clear permission to use. Do not use LoudFlow to impersonate anybody, to make somebody appear to say something they did not say, or for fraud, harassment or anything unlawful. An account used that way is suspended, and where the law requires it we co-operate with the authorities.",
      ],
    },
    {
      h: "Your content",
      p: [
        "Texts you paste, recordings you make and audio LoudFlow produces belong to you. We store them only once you approve a second computer, only encrypted, and only to give them back to you there — and we do not use them to train models, our own or anybody else's.",
      ],
    },
    {
      h: "What it costs",
      p: [
        "Nothing today. If a paid plan arrives, you will be told before anything is charged, and using the app up to that point will never become retroactively payable.",
      ],
    },
    {
      h: "No warranty",
      p: [
        "LoudFlow is provided as it is. It is a text-to-speech tool: do not rely on it for anything safety-critical, medical or legal, and do not use it where a failure to speak — or a mistaken word — would cause harm.",
      ],
    },
    {
      h: "Liability",
      p: [
        "To the extent the law allows, we are not liable for indirect or consequential loss, lost data or lost profit. Nothing here limits liability for intent, gross negligence, or anything else that cannot be limited under Swiss law.",
      ],
    },
    {
      h: "Ending it",
      p: [
        "Delete your account in the app whenever you like; that is the whole termination process. We may suspend an account that breaks the voice rule above, and we may stop offering the service with reasonable notice.",
      ],
    },
    {
      h: "Law",
      p: [
        "Swiss law applies. If you are a consumer, this does not take away the protection of the law of the country you live in.",
      ],
    },
    {
      h: "Changes",
      p: [
        "Changes are dated at the top of this page and announced in the app when they are material.",
      ],
    },
  ],
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function render(doc: Doc): string {
  const body = doc.sections
    .map(
      (s) =>
        `<section><h2>${esc(s.h)}</h2>${s.p
          .map((p) => `<p>${esc(p)}</p>`)
          .join("")}</section>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LoudFlow — ${esc(doc.title)}</title>
<meta name="description" content="LoudFlow ${esc(doc.title.toLowerCase())}." />
<link rel="icon" href="/icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600&display=swap" rel="stylesheet" />
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; background: #ffffff; }
  body {
    color: ${INK};
    font-family: "Figtree", "Segoe UI", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 64px 16px 96px;
  }
  main { max-width: 620px; margin: 0 auto; }
  h1 { margin: 0 0 4px; font-size: 28px; line-height: 34px; font-weight: 600; letter-spacing: -0.02em; }
  .u { margin: 0 0 28px; font-size: 13px; line-height: 20px; color: ${MUTED}; }
  .lead { margin: 0 0 8px; font-size: 16px; line-height: 26px; }
  section { border-top: 1px solid ${LINE}; margin-top: 28px; padding-top: 20px; }
  h2 { margin: 0 0 8px; font-size: 15px; line-height: 22px; font-weight: 600; }
  p { margin: 0 0 10px; font-size: 14px; line-height: 22px; color: #3b3a35; }
  p:last-child { margin-bottom: 0; }
  footer { margin-top: 40px; font-size: 13px; line-height: 20px; color: ${MUTED}; }
  a { color: ${INK}; text-underline-offset: 2px; }
  @media (max-width: 520px) { body { padding: 40px 16px 64px; } h1 { font-size: 24px; line-height: 30px; } }
</style>
</head>
<body>
<main>
  <h1>${esc(doc.title)}</h1>
  <p class="u">Last updated ${esc(doc.updated)}</p>
  <p class="lead">${esc(doc.lead)}</p>
  ${body}
  <footer>${esc(CONTACT)} · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer>
</main>
</body>
</html>
`;
}

export function legalResponse(doc: Doc): Response {
  return new Response(render(doc), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Short, not immutable: these are documents that get corrected.
      "cache-control": "public, max-age=300, must-revalidate",
      // The rest of the site is noindex while it is parked. These two are the
      // exception: Google's own checker has to be able to see them.
      "x-robots-tag": "all",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
    },
  });
}
