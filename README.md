# LoudFlow

> The easiest way to read any text aloud.

> [!NOTE]
> **The site is under construction.** [loudflow.ai](https://loudflow.ai) is
> parked behind a maintenance notice while a much newer version of LoudFlow
> takes its place. The previous site is kept on the
> [`site-v1`](https://github.com/lamddassds/loudflow-website/tree/site-v1) branch.

LoudFlow is a native Windows app that turns any text into natural-sounding speech.
Select text anywhere — a browser, a PDF, your IDE, a chat — press `Ctrl+Space`, and listen.

This repository contains the source for the marketing site at **[loudflow.ai](https://loudflow.ai)**.
loudflow.xyz, loudflow.si and every `www.` answer with a 301 to the same path on loudflow.ai.

---

## About LoudFlow

- **Instant hotkey.** A global `Ctrl+Space` works in every app — no tab-switching.
- **Natural AI voices.** Human-sounding voices across multiple styles.
- **15+ languages.** Auto-detected; translate on the fly with `Ctrl+Shift+Space`.
- **Local & private.** Text stays on your machine. API keys are OS-encrypted via DPAPI.
- **Auto-updates.** New features and voices arrive silently in the background.
- **Minimal UI.** A floating pill, nothing more.

## Install LoudFlow

One line in PowerShell:

```powershell
irm https://loudflow.ai/install.ps1 | iex
```

Or grab the `.exe` installer from the [latest release](https://github.com/lamddassds/Loudflow-updat/releases/latest).

---

## About this repo

This is just the marketing site. Since 2026-10-02 it runs as a **Cloudflare Worker**
(`worker/index.ts`, `wrangler.jsonc`); the Next.js app under `app/` is the
former Vercel deployment and the Worker reuses its `lib/` and route code unchanged.

### Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com) (was Vercel until 2026-10-02)

### Local development

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Deployment

**Not automatic any more:** `npm run cf:deploy` (= `wrangler deploy`) publishes
the Worker and attaches all six hostnames as custom domains. A push to `main`
only saves the code. The **Download** buttons resolve the latest Windows installer from the public release feed:

```
https://github.com/lamddassds/Loudflow-updat/releases/latest
```

## `/auth/done` — the page the browser lands on after Google

`lib/authdone.ts`, four states: signed in (`?code=`), cancelled
(`?error=access_denied`), failed (`?error=…`), and **empty** — the bare address
claims nothing and has no button (since 2026-09-30). Before you push a change to
it:

```
node scripts/check-authdone.mjs
```

67 assertions over 9 visits, no build and no dependencies; it must print
`CHECK PASS`.

### `/api/google-token` — Google sign-in on our own domain (2026-09-30)

Swaps a Google sign-in code (plus its PKCE verifier, sent by the app directly)
for Google's ID token, so Google's screen says `loudflow.ai` instead of the
Supabase project host. Needs one Worker secret: `npx wrangler secret put
GOOGLE_CLIENT_SECRET` (from the Google OAuth client). Without it the route answers `503
not_configured`. Check: `node scripts/check-google-token.mjs`.


---

## Related

- [**Loudflow-updat**](https://github.com/lamddassds/Loudflow-updat) — release feed & Windows installers (auto-update source)
- [**loudflow.ai**](https://loudflow.ai) — live site

## License

© 2026 LoudFlow. All rights reserved.
