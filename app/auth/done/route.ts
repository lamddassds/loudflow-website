import { authDoneResponse } from "../../../lib/authdone";

// A static segment beats the catch-all in `app/[...slug]`, so this answers 200
// while the rest of the site is still parked behind the maintenance notice —
// the same arrangement `app/privacy` and `app/terms` use.
//
// `force-dynamic` is not decoration here: the page is built from the query
// string Supabase appends, so a cached or statically rendered copy would hand
// every visitor the first person's link.
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  return authDoneResponse(req);
}

export function HEAD(req: Request) {
  return authDoneResponse(req);
}
