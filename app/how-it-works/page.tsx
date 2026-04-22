import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  SelectDoodle,
  HotkeyDoodle,
  ListenDoodle,
  PillDoodle,
} from "@/components/Doodles";

export const metadata: Metadata = {
  title: "How it works — LoudFlow",
  description:
    "Select any text, press Ctrl+Space, and LoudFlow reads it aloud in a natural AI voice.",
};

const steps = [
  {
    n: "01",
    title: "Select text",
    body: "Highlight anything — an article, email, PDF, chat message. Works in every Windows app.",
    Doodle: SelectDoodle,
  },
  {
    n: "02",
    title: "Press the hotkey",
    body: "Hit Ctrl+Space. LoudFlow picks up your selection instantly — no window switching, no copy-paste.",
    Doodle: HotkeyDoodle,
  },
  {
    n: "03",
    title: "Listen",
    body: "A natural AI voice reads it aloud. Pause, resume, or stop from the floating pill anytime.",
    Doodle: ListenDoodle,
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-20 pb-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm text-neutral-500">How it works</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
              Three steps.
              <br />
              Zero friction.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-neutral-600">
              LoudFlow lives quietly in your system tray and activates only
              when you need it.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-5xl space-y-4 px-6">
            {steps.map(({ n, title, body, Doodle }) => (
              <div
                key={n}
                className="flex flex-col items-center gap-6 rounded-2xl border border-neutral-200 bg-white p-8 md:flex-row md:p-10"
              >
                <div className="flex h-28 w-40 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-900">
                  <Doodle className="h-20 w-auto" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-2 font-mono text-xs text-neutral-400">
                    {n}
                  </div>
                  <h3 className="text-2xl font-semibold text-neutral-900">
                    {title}
                  </h3>
                  <p className="mt-2 text-neutral-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-200 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <PillDoodle className="mx-auto h-16 w-auto text-neutral-900" />
            <h2 className="mt-8 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              The floating pill
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-neutral-600">
              While LoudFlow reads, a small pill floats at the bottom of your
              screen. Tap it to pause, hold to stop. That&apos;s it.
            </p>
          </div>
        </section>

        <section className="border-t border-neutral-200 py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              Ready to listen?
            </h2>
            <div className="mt-8">
              <Link
                href="/download"
                className="inline-flex items-center rounded-full bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-neutral-800"
              >
                Download LoudFlow
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
