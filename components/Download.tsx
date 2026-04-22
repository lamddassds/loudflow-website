"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Download as DownloadIcon,
  Apple,
  Monitor,
  Terminal,
  Check,
  Info,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useOS } from "@/hooks/useOS";
import {
  downloadUrl,
  OS_LABELS,
  OS_REQUIREMENTS,
  OS_STATUS,
  RELEASES_PAGE,
  type OS,
} from "@/lib/os";
import { APP_VERSION, INSTALLER_SIZE, FIRST_RUN_MODEL_SIZE } from "@/lib/version";

type DownloadOS = Exclude<OS, "unknown">;

const OS_ICON: Record<DownloadOS, React.ComponentType<{ className?: string }>> = {
  windows: Monitor,
  mac: Apple,
  linux: Terminal,
};

export default function Download() {
  const detected = useOS();
  const userChanged = useRef(false);
  const [active, setActive] = useState<DownloadOS>("windows");

  useEffect(() => {
    if (!userChanged.current && detected !== "unknown") {
      setActive(detected);
    }
  }, [detected]);

  return (
    <section id="download" className="relative py-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <h2 className="gradient-text mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Made for your machine.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/60">
            Free while in early access. One-click installer. Auto-updates
            forever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <div className="glow-ring relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-6 md:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-gradient-to-b from-brand-600/30 to-transparent blur-3xl" />

            <OSTabs
              active={active}
              detected={detected}
              onChange={(o) => {
                userChanged.current = true;
                setActive(o);
              }}
            />

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-ink-950/60 p-7 backdrop-blur-xl md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <OSPanel os={active} detected={detected} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mt-5 flex flex-col items-center justify-center gap-2 text-[12px] text-white/45 sm:flex-row sm:gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Info className="h-3 w-3" /> {FIRST_RUN_MODEL_SIZE}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
              <a
                href={RELEASES_PAGE}
                className="transition hover:text-white/80"
              >
                All platforms & older versions →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function OSTabs({
  active,
  detected,
  onChange,
}: {
  active: DownloadOS;
  detected: OS;
  onChange: (os: DownloadOS) => void;
}) {
  const options: DownloadOS[] = ["windows", "mac", "linux"];
  return (
    <div className="relative flex gap-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5">
      {options.map((os) => {
        const Icon = OS_ICON[os];
        const isActive = os === active;
        const isDetected = os === detected;
        const status = OS_STATUS[os];
        return (
          <button
            key={os}
            onClick={() => onChange(os)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive ? "text-white" : "text-white/55 hover:text-white/90"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="os-tab-active"
                className="absolute inset-0 rounded-xl bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {OS_LABELS[os]}
              {isDetected && (
                <span className="hidden rounded-full border border-brand-400/30 bg-brand-400/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-400 sm:inline">
                  You
                </span>
              )}
              {status === "soon" && (
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/45 md:inline">
                  Soon
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OSPanel({ os, detected }: { os: DownloadOS; detected: OS }) {
  const status = OS_STATUS[os];
  const Icon = OS_ICON[os];

  return (
    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02]">
          <Icon className="h-7 w-7 text-white" />
          {detected === os && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink-900 bg-brand-500">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold md:text-xl">
              LoudFlow for {OS_LABELS[os]}
            </h3>
            {status === "live" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-white/55">
            {OS_REQUIREMENTS[os]} · v{APP_VERSION}
            <span className="mx-2 text-white/20">·</span>
            {INSTALLER_SIZE[os]}
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row md:w-auto">
        {status === "live" ? (
          <a
            href={downloadUrl(os, APP_VERSION)}
            className="pill-shadow group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-ink-950 transition hover:scale-[1.02] hover:bg-white/95"
          >
            <DownloadIcon className="h-4 w-4" />
            Download
            <span className="text-white/40">·</span>
            <span className="font-mono text-[11px] text-ink-950/60">
              {INSTALLER_SIZE[os]}
            </span>
          </a>
        ) : (
          <div className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3.5 text-[14px] text-white/40">
            <Icon className="h-4 w-4" />
            Coming soon
          </div>
        )}
      </div>
    </div>
  );
}
