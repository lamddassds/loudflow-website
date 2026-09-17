import { legalResponse, TERMS } from "../../lib/legal";

export const dynamic = "force-dynamic";

export function GET() {
  return legalResponse(TERMS);
}

export function HEAD() {
  return legalResponse(TERMS);
}
