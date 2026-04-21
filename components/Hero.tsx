"use client";

import { motion } from "framer-motion";
import { Download, Sparkles } from "lucide-react";

const DOWNLOAD_URL =
  "https://github.com/lamddassds/Loudflow-updat/releases/latest";

export default function Hero() {
  return (
    <section className="relative pt-40 pb-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/70 backdrop-blur-xl"
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          Now in early access — free for Windows
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="gradient-text text-balance text-6xl font-semibold leading-[1.05] tracking-tight sm:text-7xl md:text-[88px]"
        >
          Hear anything.
          <br />
          Instantly.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          Press a hotkey. LoudFlow reads any text aloud in natural AI voice —
          articles, emails, docs, code. Everywhere on Windows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={DOWNLOAD_URL}
            className="pill-shadow group inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-ink-950 transition hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" />
            Download for Windows
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-[15px] text-white/80 transition hover:bg-white/10"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-xs text-white/40"
        >
          Free · Windows 10/11 · Auto-updating
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto mt-20 w-full max-w-4xl"
        >
          <div className="glow-ring relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-3 text-xs text-white/40">LoudFlow</span>
            </div>
            <div className="relative flex h-[360px] items-center justify-center bg-gradient-to-b from-ink-800 to-ink-950">
              <FloatingPill />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingPill() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pill-shadow flex items-center gap-3 rounded-full border border-white/10 bg-ink-900/80 px-5 py-3 backdrop-blur-xl"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/20">
          <div className="flex gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                animate={{ height: ["6px", "14px", "6px"] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: "easeInOut",
                }}
                className="w-0.5 rounded-full bg-brand-400"
              />
            ))}
          </div>
        </div>
        <span className="pr-1 text-sm font-medium text-white/90">
          Reading selection…
        </span>
      </motion.div>
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-brand-500/20 blur-3xl" />
    </div>
  );
}
