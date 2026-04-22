import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HotkeyDoodle,
  VoiceDoodle,
  LanguageDoodle,
  PrivateDoodle,
  UpdateDoodle,
  PillDoodle,
} from "@/components/Doodles";

export const metadata: Metadata = {
  title: "Features — LoudFlow",
  description:
    "Everything LoudFlow can do: instant hotkey, natural AI voices, 15+ languages, local & private, auto-updates.",
};

const features = [
  {
    Doodle: HotkeyDoodle,
    title: "Instant hotkey",
    body: "A global shortcut works in every app — browsers, PDFs, IDEs, chats. Zero tab-switching.",
  },
  {
    Doodle: VoiceDoodle,
    title: "Natural AI voices",
    body: "Voices that sound human, not robotic. Multiple styles and languages built in.",
  },
  {
    Doodle: LanguageDoodle,
    title: "Multi-language",
    body: "15+ languages with auto-detect. Translate on the fly with Ctrl+Shift+Space.",
  },
  {
    Doodle: PrivateDoodle,
    title: "Local & private",
    body: "Your text stays on your machine for processing. Keys are OS-encrypted via DPAPI.",
  },
  {
    Doodle: UpdateDoodle,
    title: "Always up to date",
    body: "Auto-updates in the background. New voices, new features, zero clicks.",
  },
  {
    Doodle: PillDoodle,
    title: "Designed to disappear",
    body: "A floating pill, nothing more. No tabs, no bloat — just audio when you need it.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-20 pb-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm text-neutral-500">Features</p>
            <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-neutral-900 sm:text-6xl">
              Everything you want.
              <br />
              Nothing you don&apos;t.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-neutral-600">
              Built for the moments when reading slows you down.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ Doodle, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <div className="mb-5 flex h-20 w-full items-center justify-center rounded-xl bg-neutral-50 text-neutral-900">
                    <Doodle className="h-14 w-auto" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-neutral-900">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              Get started in under a minute
            </h2>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/download"
                className="inline-flex items-center rounded-full bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-neutral-800"
              >
                Download LoudFlow
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center text-sm text-neutral-600 transition hover:text-neutral-900"
              >
                See how it works →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
