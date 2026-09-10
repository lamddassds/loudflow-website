// The whole site is parked behind this single response while LoudFlow is
// rebuilt. Real 503 + Retry-After so search engines treat it as temporary and
// keep the old pages out of the index instead of replacing them with this one.
//
// EVERY VALUE BELOW IS THE APP'S OWN, not a web-design choice. The page has to
// read as one surface of the Hub, per ui/design-law/LOUDFLOW_DESIGN_LAW.md in
// the LoudFlowBKE repo:
//
//   palette   app/src/hub/skeleton.css:108-154
//             --sk-canvas #f5f4f0 (warm, NOT #fff - "that single choice is what
//             stops the window reading as a spreadsheet"), --sk-card #fcfcfb,
//             --sk-line #eeebe3, --sk-ink #16150f, --sk-ink-mid #55524a,
//             --sk-ink-lo #71716e
//   faces     skeleton.css:927  --sk-font   Figtree, Instrument Sans, Segoe UI
//             skeleton.css:939  --sk-serif  EB Garamond - and design law R2:
//             the serif is for NUMBERS AND THE WORDMARK ONLY
//   radii     skeleton.css:716-720  4 content / 8 controls / 16 the page card
//   type      design law R2  28/34 @600 title, 15/20 @600 section,
//             14/20 body, 12/20 meta. 20px is the line-height of this app.
//   stack     design law R1 (Wispr CardStack.module.scss:3-20) - ONE ring
//             around a stack of sections, sections butted against each other,
//             2px #eeebe3 between them, no gap, no second ring, no shadow
//   rhythm    design law R5  8 title-to-content, 12 in-section,
//             24 section-to-section, 32 page edge
//   colour    design law R4 and his own rule: colour is data, the brand, or a
//             live state. The teal dot is the live state. Nothing else on this
//             page is coloured.
//   motion    design law R8 - the dot breathes because it reports a state,
//             nothing else moves, and prefers-reduced-motion stops that too.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LoudFlow — under construction</title>
<meta name="robots" content="noindex, nofollow" />
<meta name="description" content="LoudFlow is being rebuilt. The site is offline while a much newer version takes its place." />
<link rel="icon" href="/icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=EB+Garamond:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    color-scheme: light;
    --canvas: #f5f4f0;
    --card: #fcfcfb;
    --sunk: #f5f4f0;
    --line: #eeebe3;
    --ink: #16150f;
    --ink-mid: #55524a;
    --ink-lo: #71716e;
    --teal: #034f46;
    --font: "Figtree", "Instrument Sans", "Segoe UI Variable Text", "Segoe UI", system-ui, sans-serif;
    --serif: "EB Garamond", Georgia, serif;
    --mono: "Cascadia Mono", Consolas, ui-monospace, monospace;
    --r-ctl: 8px;
    --r-lg: 16px;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; }
  body {
    background: var(--canvas);
    color: var(--ink);
    font-family: var(--font);
    font-size: 14px;
    line-height: 20px;
    font-feature-settings: "salt" on;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px;
  }
  ::selection { background: var(--ink); color: var(--card); }

  .page { width: 100%; max-width: 720px; margin: auto 0; }

  .card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    overflow: hidden;
  }

  .head { padding: 32px; }

  .wordmark {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    color: var(--ink);
  }
  .wordmark svg { display: block; }
  .wordmark span {
    font-family: var(--serif);
    font-size: 20px;
    line-height: 20px;
    letter-spacing: -0.02em;
  }

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    line-height: 34px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .lede { margin: 0; max-width: 56ch; color: var(--ink-mid); }

  .row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding: 24px;
    background: var(--sunk);
    border-top: 2px solid var(--line);
  }
  .row h2 {
    margin: 0;
    font-size: 15px;
    line-height: 20px;
    font-weight: 600;
  }
  .row p { margin: 0; color: var(--ink-lo); font-size: 12px; line-height: 20px; }
  .row .txt > * + * { margin-top: 12px; }

  code {
    display: inline-block;
    font-family: var(--mono);
    font-size: 12px;
    line-height: 20px;
    color: var(--ink-mid);
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 0 6px;
  }

  .chip {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    line-height: 20px;
    font-weight: 600;
    color: var(--ink-lo);
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--r-ctl);
    padding: 2px 10px;
    white-space: nowrap;
  }
  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--teal);
    animation: breathe 2.8s ease-in-out infinite;
  }
  @keyframes breathe { 0%, 100% { opacity: .4; } 50% { opacity: 1; } }

  footer {
    width: 100%;
    max-width: 720px;
    padding-top: 24px;
    font-size: 12px;
    line-height: 20px;
    color: var(--ink-lo);
  }

  @media (max-width: 560px) {
    body { padding: 24px 16px; }
    .head { padding: 24px; }
    .row { flex-direction: column; align-items: flex-start; gap: 12px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .dot { animation: none; }
  }
</style>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="head">
        <div class="wordmark">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 7.5h2.6L10 4v12L5.6 12.5H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z"
                  stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
            <path d="M13 7a4.2 4.2 0 0 1 0 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            <path d="M15.6 4.6a7.6 7.6 0 0 1 0 10.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <span>LoudFlow</span>
        </div>
        <h1>LoudFlow is being rebuilt</h1>
        <p class="lede">LoudFlow reads any text aloud &mdash; select it, press a hotkey, hear it.
        The site is offline while a much newer version of the app takes its place.</p>
      </div>

      <div class="row">
        <div class="txt">
          <h2>The site is offline</h2>
          <p>Every page here is parked. Nothing you can reach is the current version.</p>
        </div>
        <span class="chip"><span class="dot"></span>Under construction</span>
      </div>

      <div class="row">
        <div class="txt">
          <h2>The installer is paused</h2>
          <p><code>irm https://loudflow.xyz/install.ps1 | iex</code></p>
          <p>It prints a notice now instead of downloading the old build.</p>
        </div>
        <span class="chip">Paused</span>
      </div>

      <div class="row">
        <div class="txt">
          <h2>It comes back with the new version</h2>
          <p>No date yet. This page is what changes when it is ready.</p>
        </div>
        <span class="chip">Soon</span>
      </div>
    </div>
  </div>
  <footer>&copy; 2026 LoudFlow</footer>
</body>
</html>
`;

export function maintenanceResponse(): Response {
  return new Response(HTML, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0, must-revalidate",
      "retry-after": "86400",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
