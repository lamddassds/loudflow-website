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
    body: "A global shortcut works in every app — browsers, PDFs, IDEs, chats.",
  },
  {
    icon: Mic,
    title: "Natural AI voices",
    body: "Voices that sound human, not robotic. Multiple styles to choose from.",
  },
  {
    icon: Globe2,
    title: "Multi-language",
    body: "English, German, and more — the engine auto-detects what you selected.",
  },
  {
    icon: Lock,
    title: "Local & private",
    body: "Your text never sits on a server. Keys and settings stay encrypted on your machine.",
  },
  {
    icon: RefreshCw,
    title: "Always up to date",
    body: "Auto-updates in the background. New voices, new features, zero clicks.",
  },
  {
    icon: Sparkles,
    title: "Designed to disappear",
    body: "A floating pill, nothing more. No tabs, no bloat — just audio when you need it.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/10 blur-[140px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="gradient-text text-4xl font-semibold tracking-tight md:text-5xl">
            Everything you want. Nothing you don't.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Built for the moments when reading slows you down.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-ink-800">
                <f.icon className="h-4.5 w-4.5 text-brand-400" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
