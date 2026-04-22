const features = [
  {
    title: "Instant hotkey",
    body: "A global shortcut works in every app — browsers, PDFs, IDEs, chats. Zero tab-switching.",
  },
  {
    title: "Natural AI voices",
    body: "Voices that sound human, not robotic. Multiple styles and languages built in.",
  },
  {
    title: "Multi-language",
    body: "15+ languages with auto-detect. Switch accents on the fly.",
  },
  {
    title: "Local & private",
    body: "Your text never leaves your machine. Keys are OS-encrypted via DPAPI.",
  },
  {
    title: "Always up to date",
    body: "Auto-updates in the background. New voices, new features, zero clicks.",
  },
  {
    title: "Designed to disappear",
    body: "A floating pill, nothing more. No tabs, no bloat — just audio when you need it.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-neutral-200 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Everything you want. Nothing you don&apos;t.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            Built for the moments when reading slows you down.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-neutral-200 bg-white p-6"
            >
              <h3 className="mb-2 text-base font-semibold text-neutral-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
