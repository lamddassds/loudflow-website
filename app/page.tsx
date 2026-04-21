"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const INSTALL_COMMAND = "irm https://loudflow.xyz/install.ps1 | iex";

export default function Page() {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-black text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[140px]" />

      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icon.png"
            alt="LoudFlow"
            width={32}
            height={32}
            priority
            className="h-8 w-8"
          />
          <span className="text-base font-medium tracking-tight">LoudFlow</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-white/60">
          <Link href="/download" className="transition hover:text-white">
            Download
          </Link>
          <a
            href="https://github.com/lamddassds/LoudFlow-"
            target="_blank"
            rel="noreferrer"
            className="hidden transition hover:text-white sm:inline"
          >
            GitHub
          </a>
        </nav>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <Image
            src="/icon.png"
            alt="LoudFlow"
            width={112}
            height={112}
            priority
            className="mb-8 h-24 w-24 md:h-28 md:w-28"
          />
          <h1 className="max-w-2xl text-center text-4xl font-medium tracking-tight md:text-5xl">
            Hear anything,
            <br />
            instantly.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-10 w-full max-w-md"
        >
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
            <code className="truncate font-mono text-sm text-white/90">
              {INSTALL_COMMAND}
            </code>
            <button
              onClick={copyCommand}
              aria-label="Copy install command"
              className="shrink-0 rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-white/50">
            paste this in PowerShell, or{" "}
            <Link
              href="/download"
              className="text-white/90 underline-offset-4 hover:underline"
            >
              download LoudFlow
            </Link>
          </p>
        </motion.div>
      </div>

      <footer className="flex items-center justify-between border-t border-white/5 px-6 py-5 text-xs text-white/30 md:px-10">
        <span>© 2026 LoudFlow</span>
        <div className="flex items-center gap-5">
          <Link href="/download" className="transition hover:text-white/70">
            Download
          </Link>
          <a
            href="https://github.com/lamddassds/LoudFlow-"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white/70"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
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
      className="h-4 w-4 text-emerald-400"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
