export type OS = "windows" | "mac" | "linux" | "unknown";

export function detectOS(): OS {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform || "").toLowerCase();
  if (/win/.test(platform) || /windows/.test(ua)) return "windows";
  if (/mac/.test(platform) || /mac os x|macintosh/.test(ua)) return "mac";
  if (/linux/.test(platform) || /linux|x11/.test(ua)) return "linux";
  return "unknown";
}

export const OS_LABELS: Record<Exclude<OS, "unknown">, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};

export const OS_REQUIREMENTS: Record<Exclude<OS, "unknown">, string> = {
  windows: "Windows 10 or 11 · 64-bit",
  mac: "macOS 12 Monterey or newer",
  linux: "Ubuntu 22.04+ · Fedora 38+ · any x64 distro",
};

export const OS_STATUS: Record<Exclude<OS, "unknown">, "live" | "beta" | "soon"> = {
  windows: "live",
  mac: "soon",
  linux: "soon",
};

const RELEASES_ROOT =
  "https://github.com/lamddassds/Loudflow-updat/releases/latest/download";

export function downloadUrl(os: Exclude<OS, "unknown">, version: string): string {
  switch (os) {
    case "windows":
      return `${RELEASES_ROOT}/LoudFlow-Setup-${version}.exe`;
    case "mac":
      return `${RELEASES_ROOT}/LoudFlow-${version}.dmg`;
    case "linux":
      return `${RELEASES_ROOT}/LoudFlow-${version}.AppImage`;
  }
}

export const RELEASES_PAGE =
  "https://github.com/lamddassds/Loudflow-updat/releases/latest";
