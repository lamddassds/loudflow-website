// The whole site is parked behind this single response while LoudFlow is
// rebuilt. Real 503 + Retry-After so search engines treat it as temporary and
// keep the old pages out of the index instead of replacing them with this one.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LoudFlow — under construction</title>
<meta name="robots" content="noindex, nofollow" />
<meta name="description" content="LoudFlow is being rebuilt. The site will be back shortly." />
<link rel="icon" href="/icon.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  :root {
    color-scheme: light;
    --ink: #0a0a0a;
    --muted: #6b6b6b;
    --faint: #9b9b98;
    --line: #e9e9e7;
    --brand: #034f46;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    background: #ffffff;
    color: var(--ink);
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  ::selection { background: var(--ink); color: #fff; }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 48px 24px 64px;
    gap: 28px;
  }

  .mark { width: 132px; height: 88px; color: var(--ink); }
  .mark .wave { transform-origin: 22px 44px; }
  .mark .w1 { animation: pulse 2.8s ease-in-out infinite; }
  .mark .w2 { animation: pulse 2.8s ease-in-out infinite .35s; }
  .mark .w0 { animation: pulse 2.8s ease-in-out infinite .7s; }
  @keyframes pulse {
    0%, 100% { opacity: .28; }
    45%      { opacity: 1; }
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 6px 12px;
    letter-spacing: .01em;
  }
  .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--brand);
    animation: breathe 2.8s ease-in-out infinite;
  }
  @keyframes breathe { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 6.4vw, 3.5rem);
    line-height: 1.04;
    font-weight: 700;
    letter-spacing: -0.035em;
    max-width: 18ch;
  }
  p.sub {
    margin: 0;
    font-size: clamp(1rem, 2.2vw, 1.125rem);
    line-height: 1.55;
    color: var(--muted);
    max-width: 40ch;
  }

  footer {
    border-top: 1px solid var(--line);
    padding: 20px 24px;
    display: flex;
    justify-content: center;
    font-size: 13px;
    color: var(--faint);
  }

  @media (prefers-reduced-motion: reduce) {
    .mark .wave, .dot { animation: none; opacity: 1; }
  }
</style>
</head>
<body>
  <main>
    <svg class="mark" viewBox="0 0 132 88" fill="none" aria-hidden="true">
      <path d="M16 34h14L48 18v52L30 54H16a2 2 0 0 1-2-2V36a2 2 0 0 1 2-2Z"
            stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
      <path class="wave w0" d="M8 38a10 10 0 0 0 0 12"
            stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <path class="wave w1" d="M62 26a26 26 0 0 1 0 36"
            stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
      <path class="wave w2" d="M76 16a40 40 0 0 1 0 56"
            stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
    </svg>

    <span class="status"><span class="dot"></span>Under construction</span>

    <h1>LoudFlow is being rebuilt</h1>
    <p class="sub">The site is down while a much newer version takes its place. We&rsquo;ll be back soon.</p>
  </main>
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
