import Link from "next/link";

export default function Download() {
  return (
    <section id="download" className="border-t border-neutral-200 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
          Get started with LoudFlow
        </h2>
        <div className="mt-8">
          <Link
            href="/download"
            className="inline-flex items-center rounded-full bg-black px-6 py-3 text-base font-medium text-white transition hover:bg-neutral-800"
          >
            Download
          </Link>
        </div>
      </div>
    </section>
  );
}
