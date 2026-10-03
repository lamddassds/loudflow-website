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
//
// 2026-09-30 — AGREEING IS A BUTTON NOW, AND THE TERMS EXIST IN GERMAN. Lauro
// asked for AGB "im Stil von anderen Apps" that say plainly what is agreed to,
// including the data from the welcome tour, and for a clean screen where it is
// clicked. So: the app shows a screen right after the first sign-in (the
// summary in pictures, links to both pages, "Agree and continue"), and then a
// second one, "Help us improve?", with Yes and No as two equal buttons. The
// Terms gained a short summary at the top, "What you may not do", "Your data,
// and how we make LoudFlow better" and "Ideas you send us"; TERMS_DE is the
// same document in German at /agb, under the same version. The welcome-tour
// answers stay a SEPARATE yes (never bundled into agreeing to the Terms —
// GDPR art. 7(2) and 7(4), EDPB guidelines 05/2020 on consent, Swiss FADP
// art. 7(3) privacy by default). LoudFlowBKE ui/onboarding-v5/LEGAL.md, "Nachtrag 30.09.".
//
// SECOND PASS, SAME DAY — the voice rule is ticked ONCE on that screen and
// each clone only reminds under its button (nothing forces a tick per clone);
// and the Terms were read the way a court would read them (research with
// sources in LEGAL.md, "Nachtrag 30.09., zweiter Durchgang"): no fixed CHF 100
// cap (German § 307 BGB, "Kardinalpflichten"), every change needs consent
// except typo-level corrections, the Privacy page is information and not
// something to accept, updates only for a stated reason, reasons for a
// suspension, a fault-based indemnity, a narrow licence for sync, a place to
// report a voice copied without consent, children's voices only with the
// parents, no claim of copyright in AI audio, and "save or print" before
// agreeing (§ 312i BGB). Still NOT reviewed by a lawyer.

const INK = "#16150f";
const MUTED = "#71716e";
const LINE = "#e7e5dd";

export type Doc = {
  slug: string;
  lang: "en" | "de";
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
  lang: "en",
  title: "Privacy",
  version: "2026-09-30.1",
  updated: "30 September 2026",
  lead:
    "LoudFlow reads text aloud on your own computer. You sign in with an account, " +
    "and we keep as little as a working account allows. This page says exactly what that is.",
  sections: [
    {
      h: "The short version",
      p: [
        "The text you have read aloud, the audio LoudFlow produces and the voice models it uses stay on your computer. There is no advertising, no tracking across apps or websites, and we do not sell, rent or share your data.",
        "We know your email address and keep a short record of each computer you use. As long as you use LoudFlow on one computer, your voices and texts never leave it.",
        "Two things are sent only if you say yes: your answers from the welcome tour — we ask you once, right after you sign in, with Yes and No equally easy — and error reports, a switch in Settings. Saying no changes nothing about what the app can do.",
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
        "Your email address, an account identifier, the times you signed in, which version of the Terms you agreed to and which version of this Privacy page was shown to you, and when (you agree with \"Agree and continue\" on the screen that follows your first sign-in, after ticking the voice rule), and your answer to \"Help us improve?\" with its time. That is what an account is. We do not email you marketing.",
        "For each computer you use LoudFlow on, a short record: the computer's name as Windows reports it, its operating system and app version, a public key, and when it was last seen. It holds no content. We use it for one purpose — to know which computers are yours — and for nothing else.",
      ],
    },
    {
      h: "Your welcome-tour answers — only if you say yes",
      p: [
        "Right after your first sign-in, LoudFlow asks \"Help us improve?\" and shows what would be sent. Yes and No are two buttons of the same size, and nothing is sent until you choose Yes. You can change your answer at any time on the first page of the welcome tour or in Settings › Data & privacy.",
        "If you say Yes, we save with your account: the choices you make in the tour (what you want read to you, why you listen, speed or best voice, whether you made your own voice or picked one), which pages of the tour you saw and for how long, which version of the tour you were shown, the app version and language, and — after your first day — how many texts were read and how fast speech was made on your computer. Never your texts, recordings, voices or name.",
        "How reading feels to you (easy, okay, tiring or very hard) is sent only if you ALSO turn on a second switch, right under that question, which is off until you turn it on — a Yes to the first question does not include it. This answer can say something about your health, so we take it only with that separate, explicit yes, and without it the answer stays on your computer.",
        "It is linked to your account, so it is not anonymous. Your account can read only its own row; we, the makers, can read all rows in our database's admin view. We use it for two things only: to see which version of the tour works better, and to understand who LoudFlow helps — for example how many people find reading hard — so that we build it for them. Never for advertising, never sold, never passed on. Turning the first switch off (in the tour or in Settings) deletes what was sent; turning off only the second one removes your reading answer. Otherwise it stays until you delete your account. Totals worked out from many people's answers together — for example how many chose the fast voice — no longer point to anybody and are kept after you switch sharing off.",
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
        "If this page changes, its version and date at the top change with it. If the change matters, the app shows it to you again before it applies to you. You do not have to accept this page; it informs you.",
      ],
    },
  ],
};

export const TERMS: Doc = {
  slug: "terms",
  lang: "en",
  title: "Terms",
  version: "2026-09-30.1",
  updated: "30 September 2026",
  lead:
    "The rules for using LoudFlow, in short sentences. The most important " +
    "points come first; the details follow. Auf Deutsch: loudflow.xyz/agb.",
  sections: [
    {
      h: "In short",
      p: [
        "LoudFlow reads text aloud, on your own computer.",
        "You must be at least 16.",
        "Only make a voice from your own recording, or from somebody who clearly agreed.",
        "Your texts and voices are yours. No advertising, and we sell nothing about you.",
        "Right after you sign in, we ask you once whether you share your answers from the welcome tour with us. Yes helps us make LoudFlow better. No is just as fine, and the app works the same.",
        "You are responsible for the voices you make and for what you share.",
        "LoudFlow is free and not free of errors. For slight mistakes our liability is limited (see \"Liability\").",
        "You can delete your account in the app at any time.",
      ],
    },
    {
      h: "Agreeing",
      p: [
        "The first time you sign in, LoudFlow shows you what these Terms say, with links to them and to the Privacy page. There you tick, on its own, that you only clone your own voice or one you have permission for. By then choosing \"Agree and continue\" you accept these Terms and confirm that you are at least 16. You do not have to accept the Privacy page — it tells you what happens to your data. LoudFlow records which version you agreed to, that you ticked the voice rule, and when.",
        "You can read, save (Ctrl+S) or print (Ctrl+P) these Terms here at any time — also before you agree.",
        "If you do not agree, sign out or delete your account, and nothing else happens. We never treat silence as agreement.",
      ],
    },
    {
      h: "What LoudFlow does",
      p: [
        "LoudFlow turns text into speech with AI voices that run on your computer. You can use the voices it ships with or make one from a short recording or an audio file. Signing in needs an account and the internet; the reading itself happens offline.",
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
        "You may only make a voice from a recording of your own voice, or of a person who clearly agreed to a synthetic copy and to how you will use it — for a child's voice, the parents must agree. This also applies to files you upload. You confirm it once, with its own tick when you agree to these Terms, and it covers all your voices; each time you press the button that makes a voice, a line under it reminds you. You are responsible for what you make and what you share.",
        "Do not use LoudFlow to imitate a real person in order to mislead, defraud, harass or defame anybody, to make somebody appear to say something they did not say, to fake evidence or to get past voice checks, or for anything else unlawful. An account used that way is suspended, and where the law requires it we co-operate with the authorities.",
        "Did somebody copy your voice without your yes? Write to " +
          CONTACT +
          ". If it is true, we suspend the account and delete whatever of it we store.",
      ],
    },
    {
      h: "What you may not do",
      p: [
        "Do not use LoudFlow to break the law or somebody else's rights; to publish audio of texts you have no right to publish; to get around the sign-in, the approval of computers or any other protection of the service; to overload or attack our services; or to resell access to LoudFlow. The voice rule above applies on top.",
      ],
    },
    {
      h: "Your responsibility",
      p: [
        "You may use the texts, recordings and files you put into LoudFlow. If you culpably break these Terms or somebody else's rights and somebody therefore makes a claim against us, you compensate us for the damage, including reasonable lawyers' fees.",
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
      h: "Your content",
      p: [
        "Texts, recordings and files you put in belong to you. We claim no rights in the audio LoudFlow produces; whether anybody holds a copyright in AI audio is often unclear.",
        "You allow us only to store and transmit your content, encrypted, once you approve a second computer — and only to give it back to you there, until you delete it or your account. We do not use it to train models, our own or anybody else's.",
      ],
    },
    {
      h: "Your data, and how we make LoudFlow better",
      p: [
        "What we always need: your email address, an account identifier, when you signed in, which version of these Terms you agreed to, and for each computer a short record (its name, operating system and app version). Without that there is no account.",
        "What you can choose to share: right after you sign in, LoudFlow asks \"Help us improve?\" with Yes and No. If you say Yes, LoudFlow sends us your answers from the welcome tour (for example what you want read to you, why you listen, speed or best voice, your own voice or a ready one), which pages of the tour you saw and for how long, and — after your first day — how many texts were read and how fast your computer made speech. Never your texts, recordings, voices or name.",
        "How reading feels to you is sent only with a second, separate Yes right at that question, because that answer can say something about your health.",
        "What for: to see which version of the welcome tour works better, and to understand who LoudFlow helps, so that we build it for them. Never for advertising, never sold, never passed on.",
        "Your choice: No has no disadvantage — LoudFlow does exactly the same. You can change your answer at any time in Settings › Data & privacy; switching it off deletes what was sent.",
        "Numbers that no longer point to anybody: from many answers together we work out totals, such as how many people choose the fast voice. They say nothing about you and remain after you switch sharing off.",
        "Error reports are sent only if you switch them on in Settings.",
        "Who sees the data, where it is kept and for how long is on the Privacy page.",
      ],
    },
    {
      h: "Ideas you send us",
      p: [
        "If you send us feedback, ideas or bug reports, we may use them to improve LoudFlow without owing you anything for them. Your own texts and recordings are never feedback.",
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
        "LoudFlow updates itself to fix bugs and security problems and to bring improvements. An update changes features only for a good reason: security, a change in the law, or to make LoudFlow better. It costs you nothing extra, and the reading aloud stays. If something gets noticeably worse for you, we tell you beforehand. You can uninstall LoudFlow at any time.",
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
        "We are liable without limit for intent and gross negligence, for injury to life, body or health, and wherever the law does not allow a limit, including mandatory product liability. For slight negligence we are liable only if we breach a duty without which LoudFlow does not work for you and on which you may rely — and then only for the damage that is typical and foreseeable for a contract like this. Otherwise we are not liable for slight negligence. Keep your own copies of anything that matters to you.",
      ],
    },
    {
      h: "Ending it",
      p: [
        "Delete your account in the app whenever you like; that is the whole termination process. We may suspend an account at once if it breaks the voice rule or the law. If we suspend yours, we tell you why by email; you can answer, and we look at it again. We may stop offering the service with 30 days' notice in the app. Voices and texts on your computer stay there.",
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
        "We change these Terms only for a good reason — a change in the law, a new feature, or a sentence that was unclear. A change applies to you only once you agree to it in the app; until then the old Terms apply to you, and you may delete your account instead. Only small corrections that change nothing about your rights — a typo or a new address, say — we make without asking.",
      ],
    },
    {
      h: "Languages",
      p: [
        "These Terms exist in English and in German (loudflow.xyz/agb). Both say the same; if they ever disagree, the version more favourable to you applies.",
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

// DIE AGB AUF DEUTSCH — 2026-09-30. Dieselben Regeln wie TERMS oben, Satz für
// Satz, mit derselben Version: die App zeichnet EINE Version auf, und beide
// Sprachen sind diese Version. Schweizer Schreibweise (ss statt ß), Du-Form wie
// in der App. Kurze Sätze, weil LoudFlows Nutzer oft ungern lesen.
export const TERMS_DE: Doc = {
  slug: "agb",
  lang: "de",
  title: "AGB",
  version: TERMS.version,
  updated: "30. September 2026",
  lead:
    "Die Regeln für LoudFlow, in kurzen Sätzen. Oben das Wichtigste, " +
    "darunter die Einzelheiten. In English: loudflow.xyz/terms.",
  sections: [
    {
      h: "Das Wichtigste in Kürze",
      p: [
        "LoudFlow liest dir Texte vor, auf deinem eigenen Computer.",
        "Du musst mindestens 16 Jahre alt sein.",
        "Mach eine Stimme nur aus deiner eigenen Aufnahme – oder von jemandem, der klar zugestimmt hat.",
        "Deine Texte und Stimmen gehören dir. Keine Werbung, und wir verkaufen nichts über dich.",
        "Direkt nach der Anmeldung fragen wir dich einmal, ob du uns deine Antworten aus der Einführung schickst. Ja hilft uns, LoudFlow besser zu machen. Nein ist genauso okay – die App funktioniert gleich.",
        "Du bist verantwortlich für die Stimmen, die du machst, und für das, was du damit teilst.",
        "LoudFlow ist gratis und nicht fehlerfrei. Für leichte Fehler haften wir nur begrenzt (siehe „Haftung“).",
        "Du kannst dein Konto jederzeit in der App löschen.",
      ],
    },
    {
      h: "Zustimmen",
      p: [
        "Wenn du dich zum ersten Mal anmeldest, zeigt dir LoudFlow, was in diesen AGB steht, mit Links zu ihnen und zur Datenschutzerklärung. Dort hakst du einzeln ab, dass du nur deine eigene Stimme klonst oder eine, für die du die Erlaubnis hast. Mit „Zustimmen und weiter“ nimmst du dann diese AGB an und bestätigst, dass du mindestens 16 bist. Die Datenschutzerklärung musst du nicht annehmen – sie erklärt dir, was mit deinen Daten passiert. LoudFlow speichert, welche Version du angenommen hast, dass du die Stimmen-Regel abgehakt hast, und wann.",
        "Diese AGB kannst du jederzeit hier lesen, speichern (Strg+S) oder drucken (Strg+P) – auch bevor du zustimmst.",
        "Stimmst du nicht zu, meldest du dich ab oder löschst dein Konto – sonst passiert nichts. Schweigen gilt nie als Zustimmung.",
      ],
    },
    {
      h: "Was LoudFlow macht",
      p: [
        "LoudFlow macht aus Text Sprache, mit KI-Stimmen, die auf deinem Computer laufen. Du kannst die mitgelieferten Stimmen nutzen oder aus einer kurzen Aufnahme oder einer Audiodatei eine eigene machen. Zum Anmelden brauchst du ein Konto und Internet; das Vorlesen selbst passiert offline.",
      ],
    },
    {
      h: "Dein Konto",
      p: [
        "Ein Konto pro Person, und du passt darauf auf. Schreib uns an " +
          CONTACT +
          ", wenn du glaubst, dass jemand anderes es benutzt.",
        "Jedes Konto hat seine eigenen Stimmen, Texte und Einstellungen; auf einem geteilten Computer beginnt ein anderes Konto leer. Gib nur Computer frei, die dir gehören.",
      ],
    },
    {
      h: "Stimmen – die Regel, die zählt",
      p: [
        "Du darfst eine Stimme nur aus einer Aufnahme deiner eigenen Stimme machen – oder einer Person, die klar zugestimmt hat: zur künstlichen Kopie und dazu, wie du sie verwendest. Bei der Stimme eines Kindes müssen die Eltern zustimmen. Das gilt auch für Dateien, die du hochlädst. Du bestätigst es einmal mit einem eigenen Häkchen, wenn du diesen AGB zustimmst, und es gilt für alle deine Stimmen; jedes Mal, wenn du den Knopf drückst, der eine Stimme macht, erinnert dich eine Zeile darunter daran. Du bist verantwortlich für das, was du machst und teilst.",
        "Benutze LoudFlow nicht, um eine echte Person nachzuahmen, damit du jemanden täuschst, betrügst, belästigst oder schlechtmachst; um eine Person etwas sagen zu lassen, das sie nie gesagt hat; um Beweise zu fälschen oder Stimm-Prüfungen zu umgehen; oder für sonst etwas Unerlaubtes. Ein Konto, das so benutzt wird, sperren wir, und wo das Gesetz es verlangt, arbeiten wir mit den Behörden zusammen.",
        "Hat jemand deine Stimme ohne dein Ja kopiert? Schreib an " +
          CONTACT +
          ". Stimmt es, sperren wir das Konto und löschen, was davon bei uns gespeichert ist.",
      ],
    },
    {
      h: "Was nicht erlaubt ist",
      p: [
        "Benutze LoudFlow nicht, um Gesetze oder die Rechte anderer zu verletzen; um Audio von Texten zu veröffentlichen, die du nicht veröffentlichen darfst; um die Anmeldung, die Freigabe von Computern oder einen anderen Schutz des Dienstes zu umgehen; um unsere Dienste zu überlasten oder anzugreifen; oder um den Zugang zu LoudFlow weiterzuverkaufen. Die Stimmen-Regel oben gilt zusätzlich.",
      ],
    },
    {
      h: "Deine Verantwortung",
      p: [
        "Du darfst die Texte, Aufnahmen und Dateien verwenden, die du in LoudFlow gibst. Verletzt du schuldhaft diese AGB oder das Recht einer anderen Person und geht deshalb jemand gegen uns vor, ersetzt du uns den Schaden, auch angemessene Anwaltskosten.",
      ],
    },
    {
      h: "KI-Sprache",
      p: [
        "Alles, was LoudFlow spricht, erzeugt eine KI. Veröffentlichst du Audio aus LoudFlow – besonders solches, das wie eine echte Person klingt – oder nutzt du es bei der Arbeit, bist du dafür verantwortlich, es als KI-erzeugt zu kennzeichnen, wo das Gesetz es verlangt, in der Europäischen Union zum Beispiel nach dem AI Act.",
        "Künstliche Sprache kann Wörter falsch aussprechen, auslassen oder erfinden und Zahlen und Namen verwechseln. Prüfe alles Wichtige, bevor du dich darauf verlässt.",
      ],
    },
    {
      h: "Was du bekommst",
      p: [
        "Das Recht, LoudFlow auf den Computern zu nutzen, über die du bestimmst, für deine eigenen Zwecke, privat oder beruflich, im Rahmen der Stimmen-Regel. Die Software bleibt unsere; was du damit machst, bleibt deins.",
      ],
    },
    {
      h: "Deine Inhalte",
      p: [
        "Texte, Aufnahmen und Dateien, die du einfügst, gehören dir. Am Audio, das LoudFlow erzeugt, beanspruchen wir keine Rechte; ob jemand ein Urheberrecht daran hat, ist bei KI-Audio oft unklar.",
        "Du erlaubst uns nur, deine Inhalte verschlüsselt zu speichern und zu übertragen, wenn du einen zweiten Computer freigibst – und nur, um sie dir dort zurückzugeben, bis du sie oder dein Konto löschst. Wir trainieren damit keine Modelle, weder unsere noch die von anderen.",
      ],
    },
    {
      h: "Deine Daten und wie wir LoudFlow besser machen",
      p: [
        "Was wir immer brauchen: deine E-Mail-Adresse, eine Konto-Nummer, wann du dich angemeldet hast, welche Version dieser AGB du angenommen hast, und pro Computer einen kurzen Eintrag (Name, Betriebssystem, App-Version). Ohne das gibt es kein Konto.",
        "Was du teilen kannst: Direkt nach der Anmeldung fragt LoudFlow „Hilfst du mit?“ – mit Ja und Nein. Sagst du Ja, schickt LoudFlow uns deine Antworten aus der Einführung (zum Beispiel was du dir vorlesen lässt, warum du zuhörst, schnell oder schön, eigene oder fertige Stimme), welche Seiten der Einführung du gesehen hast und wie lange, und nach deinem ersten Tag, wie viele Texte vorgelesen wurden und wie schnell dein Computer Sprache macht. Nie deine Texte, Aufnahmen, Stimmen oder deinen Namen.",
        "Wie sich Lesen für dich anfühlt, schicken wir nur mit einem zweiten, eigenen Ja direkt bei dieser Frage – denn diese Antwort kann etwas über deine Gesundheit sagen.",
        "Wofür: um zu sehen, welche Version der Einführung besser funktioniert, und um zu verstehen, wem LoudFlow hilft – damit wir die App für diese Menschen bauen. Nie für Werbung, nie verkauft, nie weitergegeben.",
        "Deine Wahl: Nein hat keinen Nachteil – LoudFlow kann dann genau dasselbe. Du kannst deine Antwort jederzeit in den Einstellungen unter „Daten & Datenschutz“ ändern; Ausschalten löscht, was geschickt wurde.",
        "Zahlen ohne Personenbezug: Aus vielen Antworten zusammen rechnen wir Summen aus, zum Beispiel wie viele die schnelle Stimme wählen. Sie sagen nichts über dich und bleiben, auch wenn du das Teilen später ausschaltest.",
        "Fehlerberichte schicken wir nur, wenn du sie in den Einstellungen einschaltest.",
        "Wer die Daten sieht, wo sie liegen und wie lange, steht in der Datenschutzerklärung.",
      ],
    },
    {
      h: "Ideen, die du uns schickst",
      p: [
        "Schickst du uns Feedback, Ideen oder Fehlermeldungen, dürfen wir sie nutzen, um LoudFlow besser zu machen, ohne dir dafür etwas zu schulden. Deine eigenen Texte und Aufnahmen sind nie Feedback.",
      ],
    },
    {
      h: "Was es kostet",
      p: [
        "Heute nichts. Kommt ein bezahltes Angebot, erfährst du es, bevor etwas verrechnet wird, und die Nutzung bis dahin wird nie nachträglich kostenpflichtig.",
      ],
    },
    {
      h: "Updates",
      p: [
        "LoudFlow aktualisiert sich selbst, um Fehler und Sicherheitslücken zu beheben und Verbesserungen zu bringen. Ein Update ändert Funktionen nur aus gutem Grund: für die Sicherheit, wegen neuem Recht oder um LoudFlow besser zu machen. Es kostet dich nichts extra, und das Vorlesen bleibt. Wird etwas für dich deutlich schlechter, sagen wir es dir vorher. Du kannst LoudFlow jederzeit deinstallieren.",
      ],
    },
    {
      h: "Keine Versprechen über das Gesetz hinaus",
      p: [
        "LoudFlow wird so bereitgestellt, wie es ist; wir versprechen nicht, dass es fehlerfrei oder immer verfügbar ist. Verlass dich für nichts Sicherheitskritisches, Medizinisches oder Rechtliches darauf. Rechte, die das Gesetz Konsumentinnen und Konsumenten bei fehlerhaften digitalen Produkten gibt, bleiben unberührt.",
      ],
    },
    {
      h: "Haftung",
      p: [
        "Wir haften unbeschränkt bei Absicht und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit und überall, wo das Gesetz keine Begrenzung erlaubt, auch nach zwingender Produkthaftung. Bei leichter Fahrlässigkeit haften wir nur, wenn wir eine Pflicht verletzen, ohne die LoudFlow für dich nicht funktioniert und auf die du dich verlassen darfst – und dann nur für den Schaden, der bei so einem Vertrag typisch und vorhersehbar ist. Sonst haften wir bei leichter Fahrlässigkeit nicht. Bewahre eigene Kopien von allem auf, was dir wichtig ist.",
      ],
    },
    {
      h: "Beenden",
      p: [
        "Lösch dein Konto in der App, wann du willst – das ist die ganze Kündigung. Wir dürfen ein Konto sofort sperren, wenn es gegen die Stimmen-Regel oder das Gesetz verstösst. Sperren wir dein Konto, sagen wir dir per E-Mail, warum; du kannst antworten, und wir schauen es noch einmal an. Den Dienst dürfen wir mit 30 Tagen Ankündigung in der App einstellen. Stimmen und Texte auf deinem Computer bleiben dort.",
      ],
    },
    {
      h: "Open-Source-Software",
      p: [
        "LoudFlow baut auf Open-Source-Software und -Modellen mit eigenen Lizenzen auf, darunter Qwen3-TTS (Apache 2.0, Alibaba Cloud), Pocket TTS (Kyutai; Code MIT, Modellgewichte CC BY 4.0, von uns für diese App umgewandelt), Electron und Chromium. Ihre Lizenzen und Hinweise liegen im Installationsordner der App. Wo eine Lizenz dir mehr Rechte gibt als diese AGB, gilt für diesen Teil die Lizenz.",
      ],
    },
    {
      h: "Recht und Gericht",
      p: [
        "Es gilt Schweizer Recht. Für Geschäftskunden sind ausschliesslich die Gerichte in St. Gallen, Schweiz, zuständig. Bist du Konsumentin oder Konsument, kannst du auch dort klagen, wo du wohnst, und die zwingenden Konsumentenschutz-Regeln deines Wohnlandes gelten weiter.",
      ],
    },
    {
      h: "Änderungen",
      p: [
        "Wir ändern diese AGB nur aus gutem Grund – eine neue Rechtslage, eine neue Funktion oder ein Satz, der unklar war. Eine Änderung gilt für dich erst, wenn du ihr in der App zustimmst; bis dahin gelten für dich die alten AGB, und du kannst dein Konto stattdessen löschen. Nur kleine Korrekturen, die an deinen Rechten nichts ändern – etwa ein Tippfehler oder eine neue Adresse –, machen wir ohne Frage.",
      ],
    },
    {
      h: "Sprachen",
      p: [
        "Diese AGB gibt es auf Deutsch und auf Englisch (loudflow.xyz/terms). Beide sagen dasselbe; sollten sie sich einmal widersprechen, gilt die Fassung, die für dich günstiger ist.",
      ],
    },
    {
      h: "Wer wir sind",
      p: [
        "LoudFlow wird von Lauro Maffei gemacht, Kanton St. Gallen, Schweiz, " +
          CONTACT +
          ". Eine Postadresse gibt es auf Anfrage.",
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

const LABELS = {
  en: { version: "Version", updated: "last updated", privacy: "Privacy", terms: "Terms", termsHref: "/terms" },
  de: { version: "Version", updated: "zuletzt geändert", privacy: "Datenschutz (Englisch)", terms: "AGB", termsHref: "/agb" },
} as const;

function render(doc: Doc): string {
  const L = LABELS[doc.lang];
  const body = doc.sections
    .map(
      (s) =>
        `<section><h2>${esc(s.h)}</h2>${s.p
          .map((p) => `<p>${esc(p)}</p>`)
          .join("")}</section>`
    )
    .join("");

  return `<!doctype html>
<html lang="${doc.lang}">
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
  <p class="u">${L.version} ${esc(doc.version)} · ${L.updated} ${esc(doc.updated)}</p>
  <p class="lead">${esc(doc.lead)}</p>
  ${body}
  <footer>${esc(CONTACT)} · <a href="/privacy">${L.privacy}</a> · <a href="${L.termsHref}">${L.terms}</a></footer>
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
