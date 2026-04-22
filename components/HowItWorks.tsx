const steps = [
  {
    n: "01",
    title: "Select text",
    body: "Highlight anything — an article, email, doc, chat message.",
  },
  {
    n: "02",
    title: "Press the hotkey",
    body: "Your global shortcut triggers LoudFlow from any Windows app.",
  },
  {
    n: "03",
    title: "Listen",
    body: "A natural AI voice reads it aloud. Pause, resume, or stop anytime.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-neutral-200 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Three steps. Zero friction.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            LoudFlow lives quietly in your system tray and activates only when
            you need it.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-xl border border-neutral-200 bg-white p-6"
            >
              <div className="mb-4 font-mono text-xs text-neutral-400">
                {step.n}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-600">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
