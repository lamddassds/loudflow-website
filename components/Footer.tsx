import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-xs text-neutral-500 md:flex-row">
        <p>© {new Date().getFullYear()} LoudFlow</p>
        <div className="flex items-center gap-5">
          <Link href="/download" className="transition hover:text-neutral-900">
            Download
          </Link>
          <a
            href="https://github.com/lamddassds/LoudFlow-"
            className="transition hover:text-neutral-900"
          >
            GitHub
          </a>
          <a
            href="https://github.com/lamddassds/Loudflow-updat/releases"
            className="transition hover:text-neutral-900"
          >
            Releases
          </a>
          <a
            href="mailto:lauro.maffei11@gmail.com"
            className="transition hover:text-neutral-900"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
