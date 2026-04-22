"use client";

import { motion } from "framer-motion";
import { Download, Sparkles, Apple, Monitor, Terminal } from "lucide-react";
import { useOS } from "@/hooks/useOS";
import {
  downloadUrl,
  OS_LABELS,
  OS_STATUS,
  RELEASES_PAGE,
  type OS,
} from "@/lib/os";
import { APP_VERSION } from "@/lib/version";

type KnownOS = Exclude<OS, "unknown">;

const OS_ICON: Record<KnownOS, React.ComponentType<{ className?: string }>> = {
  windows: Monitor,
  mac: Apple,
  linux: Terminal,
};

export default function Hero() {
  const detected = useOS();
  const primary: KnownOS =
    detected === "unknown" ? "windows" : (detected as KnownOS);
  const Icon = OS_ICON[primary];
  const isLive = OS_STATUS[primary] === "live";
  const primaryHref = isLive ? downloadUrl(primary, APP_VERSION) : "#download";

  return (
    <section className="relative pt-40 pb-28">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[160px]" />
      <div className="pointer-events-none absolute left-[20%] top-[30%] -z-0 h-[300px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/75 backdrop-blur-xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          Now in early access — free while we polish
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-text text-balance text-6xl font-semibold leading-[1.02] tracking-tight sm:text-7xl md:text-[92px]"
        >
          Hear anything.
          <br />
          <span className="relative inline-block">
            Instantly.
            <Sparkles
              aria-hidden
              className="absolute -right-10 -top-3 h-7 w-7 text-brand-400 md:-right-14 md:-top-4 md:h-10 md:w-10"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
        >
          Press a hotkey. LoudFlow reads any text aloud in a natural AI voice —
          articles, emails, docs, code. Quiet when you don't need it, instant
          when you do.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={primaryHref}
            className="pill-shadow group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-ink-950 transition hover:scale-[1.02] hover:bg-white/95"
          >
            <Icon className="h-4 w-4" />
            {isLive
              ? `Download for ${OS_LABELS[primary]}`
              : `See ${OS_LABELS[primary]} options`}
            <Download className="h-4 w-4 opacity-60 transition group-hover:translate-y-0.5" />
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-[15px] text-white/80 transition hover:bg-white/10"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xs text-white/40"
        >
          Free · Windows / macOS / Linux · Auto-updating ·{" "}
          <a href={RELEASES_PAGE} className="underline-offset-2 hover:underline">
            v{APP_VERSION}
          </a>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-20 w-full max-w-4xl"
        >
          <div className="glow-ring relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 text-xs text-white/40">
                Any app · Any text · Any time
              </span>
            </div>
            <div className="relative flex h-[380px] items-center justify-center bg-gradient-to-b from-ink-800 to-ink-950">
              <DemoCanvas />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DemoCanvas() {
  return (
    <div className="relative w-full max-w-2xl px-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative rounded-xl border border-white/5 bg-white/[0.02] p-5 text-left text-sm leading-relaxed text-white/70"
      >
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
          Research paper
        </div>
        <p>
          <span className="rounded bg-brand-500/30 px-0.5 py-0 text-white">
            The neural substrate of attention is not a single region but a
            distributed network that selectively amplifies relevant signals
            while suppressing noise.
          </span>{" "}
          Recent work suggests that this gating is modulated by cholinergic
          projections from the basal forebrain…
        </p>
      </motion.div>

      <FloatingPill />
    </div>
  );
}

function FloatingPill() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pill-shadow flex items-center gap-3 rounded-full border border-white/10 bg-ink-900/85 px-5 py-3 backdrop-blur-xl"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/25">
          <div className="flex items-end gap-0.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                animate={{ height: ["5px", "14px", "5px"] }}
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
        <div className="pr-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Reading
          </div>
          <div className="text-sm font-medium text-white/90">
            The neural substrate…
          </div>
        </div>
      </motion.div>
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-brand-500/25 blur-3xl" />
    </motion.div>
  );
}
