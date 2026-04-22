"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/icon.png"
              alt="LoudFlow"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-6 text-[15px] text-neutral-900 md:flex">
            <a href="#how" className="transition hover:text-neutral-500">
              How it works
            </a>
            <a href="#features" className="transition hover:text-neutral-500">
              Features
            </a>
            <Link href="/download" className="transition hover:text-neutral-500">
              Download
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/download"
            className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}
