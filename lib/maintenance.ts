// The whole site is parked behind this single response while LoudFlow is
// rebuilt. Real 503 + Retry-After so search engines treat it as temporary and
// keep the old pages out of the index instead of replacing them with this one.
//
// A white screen and a line of text, on his instruction of 2026-09-10: no mark
// of any kind. The speaker glyph an earlier version drew was not the LoudFlow
// logo - his own drawing is, and it is not in this repo, so nothing stands in
// for it here.
//
// The two values that are not web defaults: Figtree is the Hub's base face
// (app/src/hub/skeleton.css:927) and #16150f is its ink (skeleton.css:125).

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>LoudFlow — under maintenance</title>
<meta name="robots" content="noindex, nofollow" />
<meta name="description" content="LoudFlow is being rebuilt. Back soon." />
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
  html, body { height: 100%; margin: 0; }
  body {
    background: #ffffff;
    color: #16150f;
    font-family: "Figtree", "Segoe UI", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 32px;
  }
  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    line-height: 34px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: #71716e;
  }
</style>
</head>
<body>
  <h1>Under maintenance</h1>
  <p>LoudFlow is being rebuilt. Back soon.</p>
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
