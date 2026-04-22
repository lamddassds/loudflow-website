"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Globe2,
  Lock,
  RefreshCw,
  Mic,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant hotkey",
    body: "A global shortcut works in every app — browsers, PDFs, IDEs, chats. Zero tab-switching.",
    accent: "from-amber-500/20 to-amber-500/0",
  },
  {
    icon: Mic,
    title: "Natural AI voices",
    body: "Voices that sound human, not robotic. Multiple styles and languages built in.",
    accent: "from-brand-500/20 to-brand-500/0",
  },
  {
    icon: Globe2,
    title: "Multi-language",
    body: "15+ languages with auto-detect. Switch accents on the fly.",
    accent: "from-sky-500/20 to-sky-500/0",
  },
  {
    icon: Lock,
    title: "Local & private",
    body: "Your text never leaves your machine. Keys are OS-encrypted via DPAPI / Keychain.",
    accent: "from-emerald-500/20 to-emerald-500/0",
  },
  {
    icon: RefreshCw,
    title: "Always up to date",
    body: "Auto-updates in the background. New voices, new features, zero clicks.",
    accent: "from-fuchsia-500/20 to-fuchsia-500/0",
  },
  {
    icon: Sparkles,
    title: "Designed to disappear",
    body: "A floating pill, nothing more. No tabs, no bloat — just audio when you need it.",
    accent: "from-rose-500/20 to-rose-500/0",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-[160px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="gradient-text text-balance text-4xl font-semibold tracking-tight md:text-5xl"
          >
            Everything you want. Nothing you don't.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-4 max-w-xl text-white/60"
          >
            Built for the moments when reading slows you down.
          </motion.p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${f.accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-ink-800 transition group-hover:border-white/20 group-hover:bg-ink-700">
                  <f.icon className="h-4.5 w-4.5 text-brand-400" />
                </div>
                <h3 className="mb-1.5 text-base font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{f.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
