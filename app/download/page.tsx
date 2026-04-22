"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { HeroDoodle } from "@/components/Doodles";

const RELEASES_API =
  "https://api.github.com/repos/lamddassds/Loudflow-updat/releases/latest";
const RELEASES_PAGE =
  "https://github.com/lamddassds/Loudflow-updat/releases/latest";
const INSTALL_COMMAND = "irm https://loudflow.xyz/install.ps1 | iex";

function formatBytes(bytes: number) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${Math.round(mb)} MB`;
}

type OS = "macos" | "linux" | "windows";

function detectOS(): OS {
  if (typeof window === "undefined") return "windows";
  const ua = window.navigator.userAgent.toLowerCase();
  const platform = (window.navigator.platform || "").toLowerCase();
  if (platform.includes("mac") || ua.includes("mac os")) return "macos";
  if (platform.includes("linux") || ua.includes("linux")) return "linux";
  return "windows";
}

export default function DownloadPage() {
  const [os, setOs] = useState<OS>("windows");
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>(RELEASES_PAGE);
  const [fileName, setFileName] = useState<string>("LoudFlow.Setup.exe");
  const [fileSize, setFileSize] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOs(detectOS());

    fetch(RELEASES_API)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        if (d.tag_name) setVersion(String(d.tag_name).replace(/^v/, ""));
        const exe = Array.isArray(d.assets)
          ? d.assets.find(
              (a: { name?: string }) =>
                typeof a?.name === "string" &&
                a.name.toLowerCase().endsWith(".exe") &&
                /setup|installer/i.test(a.name)
            ) ||
            d.assets.find(
              (a: { name?: string }) =>
                typeof a?.name === "string" &&
                a.name.toLowerCase().endsWith(".exe")
            )
          : null;
        if (exe?.browser_download_url) {
          setDownloadUrl(exe.browser_download_url);
          if (exe.name) setFileName(exe.name);
          if (typeof exe.size === "number") setFileSize(formatBytes(exe.size));
        }
      })
      .catch(() => {});
  }, []);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col">
        <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
          <HeroDoodle className="h-20 w-auto text-neutral-900" />

          <h1 className="mt-8 text-center text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Download LoudFlow
          </h1>

          <div className="mt-10 flex items-center gap-3 md:gap-5">
            <OsTab
              active={os === "macos"}
              onClick={() => setOs("macos")}
              label="macOS"
              icon={<AppleIcon />}
            />
            <OsTab
              active={os === "linux"}
              onClick={() => setOs("linux")}
              label="Linux"
              icon={<LinuxIcon />}
            />
            <OsTab
              active={os === "windows"}
              onClick={() => setOs("windows")}
              label="Windows"
              icon={<WindowsIcon />}
            />
          </div>

          <div className="mt-10 flex w-full max-w-md flex-col items-center">
            {os === "windows" ? (
              <div className="flex w-full flex-col items-center">
                <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-neutral-100 px-4 py-2.5">
                  <code className="truncate font-mono text-sm text-neutral-800">
                    {INSTALL_COMMAND}
                  </code>
                  <button
                    onClick={copyCommand}
                    aria-label="Copy install command"
                    className="shrink-0 rounded p-1 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>

                <p className="mt-4 text-sm text-neutral-500">
                  paste this in PowerShell
                </p>
                <p className="my-4 text-sm text-neutral-400">or</p>

                <a
                  href={downloadUrl}
                  download={fileName}
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 text-base font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                >
                  Download for Windows
                </a>

                <p className="mt-5 text-sm text-neutral-600">
                  Requires Windows 10 or later
                </p>
                {mounted && (version || fileSize) && (
                  <p className="mt-1 text-xs text-neutral-400">
                    {version ? `Version ${version}` : ""}
                    {version && fileSize ? " · " : ""}
                    {fileSize}
                  </p>
                )}
                <p className="mt-4 max-w-xs text-center text-xs text-neutral-400">
                  Voice model (~1 GB) downloads on first launch
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="rounded-xl border border-neutral-200 px-8 py-10 text-center">
                  <p className="text-lg text-neutral-800">
                    Coming soon for {os === "macos" ? "macOS" : "Linux"}
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">
                    We&apos;re polishing it. For now, the Windows build is
                    available.
                  </p>
                </div>
                <button
                  onClick={() => setOs("windows")}
                  className="mt-6 text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline"
                >
                  Download for Windows instead →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function OsTab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-24 flex-col items-center gap-2 rounded-xl px-4 py-4 transition md:w-28 ${
        active
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      <span className="h-7 w-7">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M16.365 1.43c0 1.14-.435 2.22-1.217 3.023-.83.853-2.17 1.517-3.27 1.43-.13-1.117.44-2.276 1.19-3.02.837-.834 2.26-1.462 3.297-1.433zm4.146 17.137c-.568 1.273-.84 1.84-1.574 2.965-1.026 1.576-2.473 3.54-4.265 3.553-1.592.015-2.002-1.037-4.163-1.022-2.16.013-2.612 1.04-4.205 1.024-1.793-.013-3.163-1.784-4.19-3.36-2.868-4.398-3.17-9.56-1.4-12.308 1.258-1.95 3.24-3.09 5.104-3.09 1.897 0 3.09 1.04 4.66 1.04 1.52 0 2.447-1.041 4.64-1.041 1.663 0 3.422.905 4.676 2.464-4.106 2.25-3.44 8.13.717 9.775z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path
        fill="currentColor"
        d="M12 1.5c-2.6 0-4.3 2-4.3 4.5 0 1.2.3 2.1.7 2.9.3.5.5 1 .5 1.4 0 .4-.2.8-.5 1.1-1 1-2.8 2.8-2.8 5.3 0 2 1.7 3.3 3.9 3.7.6.1 1.2.1 1.6.2h.8c.4 0 1-.1 1.6-.2 2.2-.4 3.9-1.7 3.9-3.7 0-2.5-1.8-4.3-2.8-5.3-.3-.3-.5-.7-.5-1.1 0-.4.2-.9.5-1.4.4-.8.7-1.7.7-2.9 0-2.5-1.7-4.5-4.3-4.5z"
      />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M3 5.1L11 4v7.5H3zM12 3.9L21.5 2.5v9H12zM3 12.5h8V20L3 18.9zM12 12.5h9.5V22L12 20.6z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
