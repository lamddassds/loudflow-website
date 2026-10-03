import { legalResponse, PRIVACY_DE } from "../../lib/legal";

// Die Datenschutzerklärung auf Deutsch (2026-10-03), neben /agb. A static
// segment beats the catch-all in `app/[...slug]`, like /privacy and /terms, so
// this answers 200 while the rest of the site is parked behind the notice. The
// live site is the Cloudflare Worker (worker/index.ts), which carries the same
// route; this file keeps the Next app one for one with it.
export const dynamic = "force-dynamic";

export function GET() {
  return legalResponse(PRIVACY_DE);
}

export function HEAD() {
  return legalResponse(PRIVACY_DE);
}
