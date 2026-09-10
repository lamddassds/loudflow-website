import { maintenanceResponse } from "../../lib/maintenance";

// Every path — /features, /download, /how-it-works, anything — lands on the
// same notice. public/ files (icon.png, install.ps1) are served before this.
export const dynamic = "force-dynamic";

export function GET() {
  return maintenanceResponse();
}

export function HEAD() {
  return maintenanceResponse();
}
