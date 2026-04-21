import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="LoudFlow"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-sm font-semibold">LoudFlow</span>
        </Link>

        <div className="flex items-center gap-6 text-sm text-white/50">
          <a
            href="https://github.com/lamddassds/LoudFlow-"
            className="transition hover:text-white"
          >
            GitHub
          </a>
          <a
            href="https://github.com/lamddassds/Loudflow-updat/releases"
            className="transition hover:text-white"
          >
            Releases
          </a>
          <a href="mailto:lauro.maffei11@gmail.com" className="transition hover:text-white">
            Contact
          </a>
        </div>

        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} LoudFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
