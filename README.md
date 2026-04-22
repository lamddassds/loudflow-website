# LoudFlow

> The easiest way to read any text aloud.

<p>
  <a href="https://loudflow.xyz"><strong>loudflow.xyz</strong></a> ·
  <a href="https://loudflow.xyz/download">Download</a> ·
  <a href="https://loudflow.xyz/features">Features</a> ·
  <a href="https://loudflow.xyz/how-it-works">How it works</a>
</p>

LoudFlow is a native Windows app that turns any text into natural-sounding speech.
Select text anywhere — a browser, a PDF, your IDE, a chat — press `Ctrl+Space`, and listen.

This repository contains the source for the marketing site at **[loudflow.xyz](https://loudflow.xyz)**.

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
irm https://loudflow.xyz/install.ps1 | iex
```

Or grab the `.exe` installer from the [latest release](https://github.com/lamddassds/Loudflow-updat/releases/latest).

---

## About this repo

This is just the marketing site — a small Next.js app deployed to Vercel.

### Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- Deployed on [Vercel](https://vercel.com)

### Local development

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### Deployment

Auto-deployed to Vercel on every push to `main`. The **Download** buttons resolve the latest Windows installer from the public release feed:

```
https://github.com/lamddassds/Loudflow-updat/releases/latest
```

---

## Related

- [**Loudflow-updat**](https://github.com/lamddassds/Loudflow-updat) — release feed & Windows installers (auto-update source)
- [**loudflow.xyz**](https://loudflow.xyz) — live site

## License

© 2026 LoudFlow. All rights reserved.
