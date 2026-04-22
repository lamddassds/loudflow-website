"use client";

import Image from "next/image";
import Link from "next/link";
import { Download as DownloadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useOS } from "@/hooks/useOS";
import { downloadUrl, OS_STATUS, RELEASES_PAGE, type OS } from "@/lib/os";
import { APP_VERSION } from "@/lib/version";

export default function Navbar() {
  const detected = useOS();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href =
    detected !== "unknown" && OS_STATUS[detected as Exclude<OS, "unknown">] === "live"
      ? downloadUrl(detected as Exclude<OS, "unknown">, APP_VERSION)
      : RELEASES_PAGE;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-ink-900/85 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            : "border-white/5 bg-ink-900/40"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="LoudFlow"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-[15px] font-semibold tracking-tight">
            LoudFlow
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          <a href="#how" className="transition hover:text-white">
            How it works
          </a>
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#download" className="transition hover:text-white">
            Download
          </a>
        </nav>

        <a
          href={href}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-white/90"
        >
          <DownloadIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>
    </header>
  );
}
