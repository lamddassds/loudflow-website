// The two documents the rest of the product needs to exist.
//
// WHY THEY ARE HERE AND NOT IN THE APP: Google will not let an OAuth app leave
// "Testing" without a reachable home page, privacy policy and terms of service
// (Branding page, 2026-09-17). Beyond that gate they are simply what an app
// that holds somebody's voice recording owes them.
//
// THE SHAPE IS THE MAINTENANCE PAGE'S, deliberately. Same white field, same
// Figtree (served from /fonts, OFL), same #16150f ink out of the Hub's own stylesheet — this is not the
// place to invent a second look for the brand, and the redesign that IS coming
// will replace both pages at once.
//
// THEY RETURN 200, NOT 503. The rest of loudflow.ai is parked behind a real
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
//
// 2026-09-29 — A LEGAL PASS BEFORE THE WELCOME TOUR ASKS QUESTIONS. Researched
// against the Swiss revFADP, the GDPR, the Swiss TCA art. 45c, EU consumer and
// product-liability law and the EU AI Act art. 50 (report in LoudFlowBKE
// ui/onboarding-v5/LEGAL.md, every requirement with its source). What changed:
// every party that sees data is named (PostHog, Vercel, GitHub were missing),
// transfers abroad and legal bases are stated, the welcome-tour answers are
// OPT-IN, signing in (the line under the button) is the assent, both documents carry a
// version id the app records, the voice consent is per recording, liability
// is limited only as far as consumer law allows, and the fonts come from this
// site instead of Google's (a font request sends the visitor's IP to Google).
// Still NOT reviewed by a lawyer.

const INK = "#16150f";
const MUTED = "#71716e";
const LINE = "#e7e5dd";

export type Doc = {
  slug: string;
  title: string;
  version: string;
  updated: string;
  lead: string;
  sections: { h: string; p: string[] }[];
};

const CONTACT = "loudflow.app@gmail.com";

// The version ids below are what the app records when somebody chooses
// "Agree and continue" (LoudFlowBKE app/src/main/legal.js LEGAL_VERSIONS). Bump
// a version whenever the wording of that document changes in substance —
// the app then asks everybody again. The two must move together.
export const PRIVACY: Doc = {
  slug: "privacy",
  title: "Privacy",
  version: "2026-09-29.1",
  updated: "29 September 2026",
  lead:
    "LoudFlow reads text aloud on your own computer. You sign in with an account, " +
    "and we keep as little as a working account allows. This page says exactly what that is.",
  sections: [
    {
      h: "The short version",
      p: [
        "The text you have read aloud, the audio LoudFlow produces and the voice models it uses stay on your computer. There is no advertising, no tracking across apps or websites, and we do not sell, rent or share your data.",
        "We know your email address and keep a short record of each computer you use. As long as you use LoudFlow on one computer, your voices and texts never leave it.",
        "Two things are sent only if you switch them on: your answers from the welcome tour, and error reports. Both switches are off until you turn them on.",
        "Only when you approve a second computer of your own — and LoudFlow asks you before anything is uploaded — do your saved voices and texts travel between your computers, end-to-end encrypted. The key exists only on your computers; we cannot read what we store.",
        "Deleting your account deletes all of it, at once and for good.",
      ],
    },
    {
      h: "What stays on your computer",
      p: [
        "Everything the app does to make speech: the text you paste or select, the audio it generates, the voices it ships with, the reference recordings you make, your settings, and the diagnostic log it keeps for itself. LoudFlow speaks offline; that is the product, not a setting.",
        "Your answers in the welcome tour are always used on your computer to set LoudFlow up for you — for example, to start in the fast mode when your computer is slow. That use never leaves your computer.",
        "Each account keeps its own voices, texts and settings. Two accounts on one computer do not see each other's things, and a new account starts empty.",
      ],
    },
    {
      h: "What we hold when you sign in",
      p: [
        "Your email address, an account identifier, the times you signed in, and which version of these Terms and this Privacy page you agreed to and when. That is what an account is. We do not email you marketing.",
        "For each computer you use LoudFlow on, a short record: the computer's name as Windows reports it, its operating system and app version, a public key, and when it was last seen. It holds no content. We use it for one purpose — to know which computers are yours — and for nothing else.",
      ],
    },
    {
      h: "Your welcome-tour answers — only if you switch it on",
      p: [
        "The first page of the welcome tour has a switch: \"Help improve LoudFlow with my answers\". It is off until you turn it on, and you can turn it off again in the tour or in Settings.",
        "If it is on, we save with your account: the choices you make in the tour (what you want read to you, why you listen, speed or best voice, whether you made your own voice or picked one), which pages of the tour you saw and for how long, which version of the tour you were shown, the app version and language, and — after your first day — how many texts were read and how fast speech was made on your computer. Never your texts, recordings, voices or name.",
        "How reading feels to you (easy, okay, tiring or very hard) is sent only if you ALSO turn on a second switch, right under that question, which is off until you turn it on. This answer can say something about your health, so we take it only with that separate, explicit yes, and without it the answer stays on your computer.",
        "It is linked to your account, so it is not anonymous. Your account can read only its own row; we, the makers, can read all rows in our database's admin view. We use it for two things only: to see which version of the tour works better, and to understand who LoudFlow helps — for example how many people find reading hard — so that we build it for them. Never for advertising, never sold, never passed on. Turning the first switch off (in the tour or in Settings) deletes what was sent; turning off only the second one removes your reading answer. Otherwise it stays until you delete your account.",
      ],
    },
    {
      h: "Error reports — only if you switch them on",
      p: [
        "If you switch on error reports in Settings, the app sends PostHog (servers in Frankfurt, Germany) the app version, your Windows version and what went wrong — never your texts, your name or your voices. The report itself carries no IP address; PostHog's servers see the address of the connection, as any server does. Switching it off deletes the random identifier the reports used.",
      ],
    },
    {
      h: "What we hold when you use a second computer",
      p: [
        "Nothing, until you say so. When you sign in on another computer, the first one asks you to approve it, and that question says — before anything is uploaded — that your saved voices and texts will from then on be stored in the cloud, end-to-end encrypted. Approving is your consent. We record which wording you agreed to and when.",
        "What travels: the voices you saved — the short reference recording, its name, language and transcript, and the settings measured from it — and the texts you had read aloud, with their date. Not the generated audio.",
        "How: everything is encrypted on your computer before it is uploaded (AES-256-GCM), with a key that only your approved computers hold; the key passes from one of your computers to the next sealed with that computer's own key. We store only the encrypted files and cannot open them.",
        "When it goes: if you are back to one computer — because you removed the other one in the app, or it has not been used for 60 days — the encrypted copy is deleted at the next check. Removing a computer also withdraws its approval: to come back it has to be approved again.",
        "A voice can identify a person, so we treat saved voices as sensitive data: they travel only with your explicit consent, only encrypted, and we cannot open them. A voice recording of somebody else is their personal data — only save a recording you made yourself or have their permission to use.",
      ],
    },
    {
      h: "Who else is involved",
      p: [
        "Supabase — our database and sign-in, servers in Zurich, Switzerland. It processes the data on our instructions. Row-level rules in the database mean an account can only ever read its own rows and its own files.",
        "Google — only if you choose to sign in with Google: they tell us your email address and name, and they know that you signed in to LoudFlow. Google handles that under its own privacy policy.",
        "Resend (United States) — only if you sign in with your email address: it delivers the email with your sign-in code, and for that it receives your email address and the code.",
        "Vercel (United States) — hosts this website. Like every web host it logs your IP address and the page you asked for, to deliver the site and keep it secure, and deletes those logs after a short time.",
        "GitHub (United States) — hosts the installer and the updates. Downloading LoudFlow or checking for an update shows GitHub your IP address.",
        "PostHog (Frankfurt) — only if you switch on error reports, as described above.",
        "Nobody else. We do not train anything on your voice or your texts, and neither does anybody we work with.",
      ],
    },
    {
      h: "Sending data abroad",
      p: [
        "Resend, Google, Vercel and GitHub are in the United States. Those transfers rest on the safeguards in each provider's data processing terms — the EU standard contractual clauses, which Switzerland recognises, or the provider's certification under the Swiss-U.S. and EU-U.S. Data Privacy Framework.",
      ],
    },
    {
      h: "Why the law lets us",
      p: [
        "Your account, your computer records and the sign-in emails: to give you the service you signed up for. Website logs: our interest in a secure website. The encrypted copy for a second computer, your welcome-tour answers and error reports: your consent, which you can withdraw at any time with the same switch or by removing the computer. Your answer on how reading feels: your explicit consent to that one answer (Art. 9(2)(a) GDPR, Art. 6(7) Swiss FADP), withdrawn with its own switch. Nothing about you is decided by a computer alone.",
      ],
    },
    {
      h: "Cookies",
      p: [
        "This website sets no cookies, uses no analytics and loads its fonts from its own server. The app sets no cookies and keeps your settings on your computer. There is nothing to consent to, which is why you are not asked.",
      ],
    },
    {
      h: "How long we keep it",
      p: [
        "Until you delete it. Deleting your account from inside LoudFlow removes your rows, your computer records, your welcome-tour answers, your encrypted copies and the account itself in one step — we hold no separate copy and no archive. Backups of the database are kept for a short period by our host and roll off by themselves.",
        "If a breach of our data is likely to put you at high risk, we tell you and the authority as quickly as possible.",
      ],
    },
    {
      h: "Your rights",
      p: [
        "Under Swiss data protection law and, where it applies, the GDPR you can ask what we hold about you, have it corrected, have it deleted, have a copy of it, or object to how it is used. Write to " +
          CONTACT +
          " and we will answer within thirty days. You may also complain to the Swiss Federal Data Protection and Information Commissioner (edoeb.admin.ch) or to the data protection authority where you live.",
        "The controller is Lauro Maffei, the maker of LoudFlow, canton of St. Gallen, Switzerland, reachable at " +
          CONTACT +
          ". A postal address is available on request.",
      ],
    },
    {
      h: "Children",
      p: ["LoudFlow is not intended for people under 16."],
    },
    {
      h: "Changes",
      p: [
        "If this page changes, its version and date at the top change with it. If the change matters, the app asks you to agree again before it applies to you.",
      ],
    },
  ],
};

export const TERMS: Doc = {
  slug: "terms",
  title: "Terms",
  version: "2026-09-29.1",
  updated: "29 September 2026",
  lead:
    "The rules for using LoudFlow. Short, because the app does little that " +
    "needs rules — except one thing about voices, and that one comes first.",
  sections: [
    {
      h: "Agreeing",
      p: [
        "Signing in to LoudFlow is how you agree: the line directly under the sign-in button says that by signing in you confirm you are at least 16 and accept these Terms and the Privacy page, with links to both. The app records which version you agreed to and when. If we change them in a way that matters, the app asks you to sign in and agree again; until you do, the old version applies to you. If you do not agree, you can delete your account, and nothing else happens. We never treat silence as agreement.",
      ],
    },
    {
      h: "Voices — the rule that matters",
      p: [
        "Each time you make a voice from a recording, you confirm that it is your own voice, or that the speaker clearly agreed to a synthetic copy and to how you will use it. You are responsible for what you make and what you share.",
        "Do not use LoudFlow to imitate a real person in order to mislead, defraud, harass or defame anybody, to make somebody appear to say something they did not say, to fake evidence or to get past voice checks, or for anything else unlawful. An account used that way is suspended, and where the law requires it we co-operate with the authorities.",
      ],
    },
    {
      h: "AI-generated speech",
      p: [
        "All speech LoudFlow makes is generated by AI. If you publish audio made with LoudFlow, especially audio that sounds like a real person, or use it in your work, you are responsible for telling listeners it is AI-generated wherever the law requires it — in the European Union, for example, under the AI Act.",
        "Synthetic speech can mispronounce, skip or invent words and get numbers and names wrong. Check anything that matters before you rely on it.",
      ],
    },
    {
      h: "What you get",
      p: [
        "A licence to use LoudFlow on the computers you control, for your own purposes, private or commercial, within the voice rule above. The software stays ours; what you make with it stays yours.",
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
      h: "Updates",
      p: [
        "LoudFlow updates itself to fix bugs and security problems and to bring improvements. An update can change features; we tell you in the app about changes that matter, and you can uninstall LoudFlow at any time.",
      ],
    },
    {
      h: "No promises beyond the law",
      p: [
        "LoudFlow is provided as it is; we do not promise that it is free of errors or always available. Do not rely on it for anything safety-critical, medical or legal. Rights that the law gives consumers for faulty digital products stay untouched.",
      ],
    },
    {
      h: "Liability",
      p: [
        "We are liable without limit for intent and gross negligence, for injury to life, body or health, and wherever the law does not allow a limit, including mandatory product liability. For slight negligence we are liable only for foreseeable direct damage, up to CHF 100 or what you paid us in the last twelve months, whichever is higher, and not for lost profit or indirect loss. Keep your own copies of anything that matters to you.",
      ],
    },
    {
      h: "Ending it",
      p: [
        "Delete your account in the app whenever you like; that is the whole termination process. We may suspend an account at once if it breaks the voice rule or the law, and we may stop offering the service with 30 days' notice in the app. Voices and texts on your computer stay there.",
      ],
    },
    {
      h: "Open-source software",
      p: [
        "LoudFlow is built on open-source software and models under their own licences, among them Qwen3-TTS (Apache 2.0, Alibaba Cloud), Pocket TTS (Kyutai; code MIT, model weights CC BY 4.0, converted by us for this app), Electron and Chromium. Their licences and notices ship with the app in its installation folder. Where a licence gives you more rights than these Terms, it prevails for that component.",
      ],
    },
    {
      h: "Law and courts",
      p: [
        "Swiss law applies. For business customers the courts of St. Gallen, Switzerland, have exclusive jurisdiction. If you are a consumer, you may also go to court where you live, and the mandatory consumer rules of your country of residence stay in force.",
      ],
    },
    {
      h: "Changes",
      p: [
        "We change these Terms only for a good reason — a change in the law, a new feature, or a sentence that was unclear. For changes that matter we tell you in the app at least 30 days ahead and ask you to agree again; until then the old Terms apply, and you may delete your account before the change starts.",
      ],
    },
    {
      h: "Who we are",
      p: [
        "LoudFlow is made by Lauro Maffei, canton of St. Gallen, Switzerland, " +
          CONTACT +
          ". A postal address is available on request.",
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
<style>
  @font-face {
    font-family: "Figtree";
    font-style: normal;
    font-weight: 300 900;
    font-display: swap;
    src: url("/fonts/Figtree-Variable.woff2") format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: "Figtree";
    font-style: normal;
    font-weight: 300 900;
    font-display: swap;
    src: url("/fonts/Figtree-Variable-ext.woff2") format("woff2");
    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
</style>
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
  <p class="u">Version ${esc(doc.version)} · last updated ${esc(doc.updated)}</p>
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
