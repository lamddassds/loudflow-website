// THE SITE ON CLOUDFLARE — 2026-10-02.
//
// Lauro bought loudflow.ai and loudflow.si and moved the site off Vercel. His
// words: every domain goes to loudflow.ai, and the address bar says loudflow.ai.
//
// ONE HOST IS REAL. loudflow.ai answers; every other host this Worker is
// attached to (www.loudflow.ai, loudflow.si, loudflow.xyz and their www) gets
// a 301 to the same path AND query on loudflow.ai. The query is not optional:
// installs up to 0.3.79 send Supabase `https://loudflow.xyz/auth/done`, and the
// sign-in code rides in that query — drop it and nobody can sign in.
//
// THE ROUTES ARE THE NEXT APP'S, one for one (`app/**/route.ts`), and they call
// the same `lib/` functions, so the pages are byte for byte what Vercel served.
// public/ is served by Cloudflare's asset layer before this code runs, the way
// Next served it before its routes.

import { maintenanceResponse } from "../lib/maintenance";
import { authDoneResponse } from "../lib/authdone";
import { legalResponse, PRIVACY, TERMS } from "../lib/legal";
import { POST as googleTokenPost, GET as googleTokenGet } from "../app/api/google-token/route";

export const CANONICAL = "loudflow.ai";

export function route(req: Request): Response | Promise<Response> {
  const url = new URL(req.url);
  const host = url.hostname.toLowerCase();

  // workers.dev and localhost stay as they are, so the deploy can be checked
  // before any domain points here.
  const ours = host === CANONICAL || /(^|\.)loudflow\.(ai|si|xyz)$/.test(host);
  if (ours && host !== CANONICAL) {
    return new Response(null, {
      status: 301,
      headers: {
        location: `https://${CANONICAL}${url.pathname}${url.search}`,
        "cache-control": "public, max-age=3600",
      },
    });
  }

  // Next answered /privacy/ with a redirect to /privacy; same here.
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    return new Response(null, {
      status: 308,
      headers: { location: `${url.pathname.replace(/\/+$/, "")}${url.search}` },
    });
  }

  switch (url.pathname) {
    case "/auth/done":
      return authDoneResponse(req);
    case "/privacy":
      return legalResponse(PRIVACY);
    case "/terms":
      return legalResponse(TERMS);
    case "/api/google-token":
      return req.method === "POST" ? googleTokenPost(req) : googleTokenGet();
    default:
      return maintenanceResponse();
  }
}

export default {
  fetch(req: Request): Response | Promise<Response> {
    return route(req);
  },
};
