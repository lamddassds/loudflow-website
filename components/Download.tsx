"use client";

import { motion } from "framer-motion";
import { Download as DownloadIcon, Apple, Monitor } from "lucide-react";

const DOWNLOAD_URL =
  "https://github.com/lamddassds/Loudflow-updat/releases/latest";

export default function Download() {
  return (
    <section id="download" className="relative py-32">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glow-ring relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-12 text-center md:p-16"
        >
          <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]" />

          <div className="relative">
            <h2 className="gradient-text text-4xl font-semibold tracking-tight md:text-5xl">
              Get LoudFlow.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-white/60">
              Free while in early access. One-click installer. Auto-updates
              forever.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={DOWNLOAD_URL}
                className="pill-shadow group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-ink-950 transition hover:scale-[1.02]"
              >
                <Monitor className="h-4 w-4" />
                Download for Windows
                <DownloadIcon className="h-4 w-4 opacity-60 transition group-hover:translate-y-0.5" />
              </a>
              <div className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/40">
                <Apple className="h-4 w-4" />
                macOS — coming soon
              </div>
            </div>

            <p className="mt-7 text-xs text-white/35">
              Windows 10 or 11 · 64-bit · ~120 MB
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
