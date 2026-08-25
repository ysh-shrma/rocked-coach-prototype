"use client";

export type Mode = "explore" | "guided";

/**
 * The flip. Ink, never purple — purple on these pages means RockED's, and this
 * is the author's chrome.
 *
 * Both options are visible at rest rather than one label that swaps on click.
 * A toggle that renames itself can't tell you a second mode exists until you
 * press it, which is the whole failure this control was added to prevent: with
 * Explore as the default and a single CTA on the deck, this is the only thing
 * standing between a reviewer and the walkthrough.
 */
export function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Prototype mode"
      className="inline-flex rounded-full border border-rule bg-paper p-1"
    >
      {(
        [
          { id: "explore", label: "Explore" },
          { id: "guided", label: "Guided" },
        ] as const
      ).map((opt) => {
        const active = mode === opt.id;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-4 py-[7px] text-[13.5px] font-semibold transition-colors ${
              active ? "bg-r-ink text-white" : "text-r-ink-3 hover:text-r-ink"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
