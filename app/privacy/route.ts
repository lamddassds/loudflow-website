import { legalResponse, PRIVACY } from "../../lib/legal";

// A static segment beats the catch-all in `app/[...slug]`, so this answers 200
// while the rest of the site is still parked behind the maintenance notice.
export const dynamic = "force-dynamic";

export function GET() {
  return legalResponse(PRIVACY);
}

export function HEAD() {
  return legalResponse(PRIVACY);
}
