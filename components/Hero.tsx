"use client";

import Link from "next/link";
import { useState } from "react";
import { HeroDoodle } from "./Doodles";

const INSTALL_COMMAND = "irm https://loudflow.xyz/install.ps1 | iex";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  return (
    <section className="pt-20 pb-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <HeroDoodle className="mx-auto h-28 w-auto text-neutral-900" />

        <p className="mt-8 text-sm text-neutral-500">
          Press <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-700">Ctrl+Space</kbd> to hear any text
        </p>

        <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
          The easiest way to
          <br />
          read any text aloud
        </h1>

        <div className="mt-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 rounded-lg bg-neutral-100 px-4 py-2.5 font-mono text-sm text-neutral-800">
            <code className="whitespace-nowrap">{INSTALL_COMMAND}</code>
            <button
              onClick={copy}
              aria-label="Copy install command"
              className="rounded p-1 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>

          <p className="mt-5 text-sm text-neutral-500">
            paste this in PowerShell, or{" "}
            <Link
              href="/download"
              className="text-neutral-900 underline underline-offset-2 hover:no-underline"
            >
              download LoudFlow
            </Link>
          </p>
        </div>
      </div>
    </section>
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
