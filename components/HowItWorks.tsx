"use client";

import { motion } from "framer-motion";
import { MousePointer2, Keyboard, Volume2 } from "lucide-react";

const steps = [
  {
    icon: MousePointer2,
    title: "Select text",
    body: "Highlight anything — an article, email, doc, chat message.",
  },
  {
    icon: Keyboard,
    title: "Press the hotkey",
    body: "Your global shortcut triggers LoudFlow from any Windows app.",
  },
  {
    icon: Volume2,
    title: "Listen",
    body: "A natural AI voice reads it aloud. Pause, resume, or stop anytime.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="gradient-text text-4xl font-semibold tracking-tight md:text-5xl">
            Three steps. Zero friction.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            LoudFlow lives quietly in your system tray and activates only when
            you need it.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-ink-800/80 to-ink-900/40 p-7 transition hover:border-white/20"
            >
              <div className="absolute right-5 top-5 text-xs font-mono text-white/20">
                0{i + 1}
              </div>
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <step.icon className="h-5 w-5 text-brand-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
