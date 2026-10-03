import { legalResponse, TERMS_DE } from "../../lib/legal";

// Die AGB auf Deutsch (2026-09-30). A static segment beats the catch-all in
// `app/[...slug]`, like /terms and /privacy, so this answers 200 while the rest
// of the site is still parked behind the maintenance notice.
export const dynamic = "force-dynamic";

export function GET() {
  return legalResponse(TERMS_DE);
}

export function HEAD() {
  return legalResponse(TERMS_DE);
}
