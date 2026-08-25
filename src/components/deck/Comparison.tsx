import { ArrowDown, ArrowRight } from "lucide-react";

/**
 * One thing, before and after. The only place a before/after is declared — the
 * walkthrough and the deck's five change slides both render this, so the two
 * surfaces can't disagree about what a comparison looks like.
 *
 * It replaced two stacked paragraphs under two labels, which failed twice over.
 * A reader got to the end of both before realising the second described the same
 * screen as the first — two paragraphs is a document, not a comparison. And the
 * label on the *old* side was purple, which on these pages means "this belongs to
 * RockED": correct as provenance in running prose, disastrous in a two-column
 * layout, where colour reads as valence and purple therefore said "this is the
 * good one." Reported exactly that way in review.
 *
 * So: no colour on either side. VALENCE IS CARRIED BY CONTRAST AND WEIGHT ONLY.
 * The old column is recessive — muted surface, hairline border, grey text. The
 * new one is prominent — white, two-pixel ink border, full-ink text, elevated.
 * The eye lands on the better half first, which is the correct default, and
 * nothing accuses anyone of anything. That last part is a tone rule the whole
 * submission is held to: help your flagship succeed, never you missed something.
 *
 * The arrow is doing real work, not decoration. It's the single glyph that says
 * "this became that" rather than "here are two lists", and it's why the pair
 * reads as a comparison before a word is read.
 */
export function Comparison({
  today,
  build,
  todayLabel = "RockED today",
  buildLabel = "In the prototype",
  stack,
}: {
  today: string[];
  build: string[];
  todayLabel?: string;
  buildLabel?: string;
  /**
   * Force 1-up regardless of viewport.
   *
   * The side-by-side breakpoint is `sm`, which is viewport-based and therefore
   * blind to how much room this component actually has. The walkthrough's
   * manager step gives the console most of the width, leaving the annotation
   * ~430px — wide enough for a stacked card, far too narrow for two. Set by the
   * caller that knows its own column, never guessed here.
   */
  stack?: boolean;
}) {
  /**
   * Stacked and side-by-side are two renders, not one with a positioning tweak.
   *
   * The arrow was absolutely positioned at 50%/50% of the grid, which is correct
   * across a two-column gutter and wrong down a two-row stack: the rows are
   * different heights, so the midpoint lands inside the taller card rather than
   * between them. In the stack the arrow is a flow item, which cannot miss.
   */
  if (stack) {
    return (
      <div data-comparison className="flex flex-col gap-3">
        <Card label={todayLabel} items={today} />
        <span aria-hidden className="flex justify-center text-r-ink-4">
          <ArrowDown size={20} strokeWidth={2} />
        </span>
        <Card label={buildLabel} items={build} strong />
      </div>
    );
  }

  return (
    <div
      data-comparison
      // The gutter is sized for the arrow, not for the cards: the glyph plus its
      // ring is 28px, so a narrower gap left it sitting on both card borders.
      className="relative grid gap-4 sm:grid-cols-2 sm:gap-8"
    >
      <Card label={todayLabel} items={today} />

      {/* Below sm this grid is one column, so the arrow goes between the rows as
          a flow item — same reason as the `stack` branch. `sm:hidden` removes it
          from the grid entirely at two columns (a display:none item takes no
          cell), which is what stops it claiming the second column there. */}
      <span aria-hidden className="flex justify-center text-r-ink-4 sm:hidden">
        <ArrowDown size={20} strokeWidth={2} />
      </span>

      <Card label={buildLabel} items={build} strong />

      {/* Two columns only: centred on the gutter, above both cards — hence the
          ring, which punches it out of whichever card edge it overlaps. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-r-ink-4 ring-4 ring-paper sm:flex"
      >
        <ArrowRight size={20} strokeWidth={2} />
      </span>
    </div>
  );
}

function Card({
  label,
  items,
  strong,
}: {
  label: string;
  items: string[];
  strong?: boolean;
}) {
  return (
    <div
      className={`rounded-[14px] p-5 sm:p-6 ${
        strong
          ? "border-2 border-r-ink bg-paper shadow-[0_1px_2px_rgba(30,15,60,0.05),0_10px_28px_-14px_rgba(30,15,60,0.18)]"
          : "border border-rule bg-paper-2"
      }`}
    >
      {/* Both labels ink. Never purple — see the note at the top of this file. */}
      <p className="mono text-doc-label uppercase text-r-ink-4">{label}</p>

      <ul className="mt-4 space-y-3">
        {items.map((it) => (
          <li key={it} className="flex gap-3">
            <span
              aria-hidden
              className={`mt-[0.62em] h-[5px] w-[5px] shrink-0 rounded-full ${
                strong ? "bg-r-ink" : "bg-r-ink-4"
              }`}
            />
            <span
              className={`text-doc-list ${strong ? "text-r-ink" : "text-r-ink-3"}`}
            >
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
