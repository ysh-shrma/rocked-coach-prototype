import { Label } from "./prims";

/**
 * One panel of the deck. Five zones, same position on every slide.
 *
 *   kicker      where you are
 *   claim       one sentence, the whole point of the slide
 *   body        two columns, 58/42 — left carries substance, right the artifact
 *   consequence one line behind an ink rule, the so-what
 *   source      optional cite, bottom
 *
 * Three decisions worth not undoing:
 *
 * `justify-start` with a fixed top offset, not `justify-center`. Centring made a
 * three-line slide begin mid-screen and a twelve-line slide begin near the top,
 * so the eye had to re-find the start on every advance. That was the real
 * complaint behind "too much whitespace" — not the amount of space, the fact that
 * it moved.
 *
 * One measure. The old `wide` variant capped narrow slides at 900px, which on an
 * 1860px viewport left a paragraph floating in a void. A slide with nothing to put
 * in its second column isn't a slide, it's a paragraph that belongs on another
 * one, so removing the variant fixes the emptiness and the density together.
 *
 * The measure is 1320, not 1200: at 1200 on a 1860px viewport a third of the
 * frame was margin, which is what "a crazy amount of unused whitespace" meant.
 *
 * Body copy is capped at ~45 words per slide, which is the assertion-evidence
 * rule (Alley): the title is a full sentence carrying the claim, and the slide's
 * job below it is to *show* evidence, not restate the claim in prose. Every slide
 * that broke this rule was also one of the empty-looking ones — prose is what a
 * slide reaches for when it has no artifact.
 *
 * `min-h-screen` rather than `h-screen`: a slide that outgrows the viewport should
 * scroll rather than clip its last line. It shouldn't happen — outgrowing is the
 * signal that the slide has too much on it, which is the discipline this format
 * exists to impose. The rule: more than ~120 words in the left column, or nothing
 * real for the right, means split it or turn the prose into a list. Never shrink
 * the type.
 */
export function Slide({
  kicker,
  title,
  children,
  right,
  consequence,
  source,
  flip,
  section,
  step,
}: {
  kicker?: string;
  title?: string;
  /**
   * Widen the artifact column instead of the prose column.
   *
   * Not a style choice — a portrait phone screenshot fills a 1fr column and a
   * landscape desktop console does not: it hits `max-w-full` long before its
   * height cap, so the manager slide sat at 56% fill with a shot half the size
   * of the phone shots beside it. The device decides, so `frame: "desktop"` sets
   * this and nothing else does.
   */
  flip?: boolean;
  /** Which act of the argument this slide belongs to. Absent on the cover. */
  section?: string;
  /** Position within that section, e.g. "3 of 7". Derived, never hand-written. */
  step?: string;
  /** The left column. Substance. */
  children?: React.ReactNode;
  /** The right column. Never empty on an argument slide. */
  right?: React.ReactNode;
  /** The so-what, one line. */
  consequence?: React.ReactNode;
  source?: React.ReactNode;
}) {
  return (
    <section
      data-slide
      className="flex min-h-screen w-full snap-start flex-col justify-start px-6 pb-12 pt-[9vh] md:px-12 lg:px-16"
    >
      <div className="mx-auto w-full max-w-[1320px]">
        {/* The header rail. Kicker left, section right, one baseline.
            Bottom-right is the page counter and right-centre is the dot rail, so
            top-right was the only corner free — and a reader who can't see which
            phase they're in reads a deck as a pile of slides. The step count is
            deliberate: it says how much of this section is left, which is what
            stops someone skipping ahead. */}
        {(kicker || section) && (
          <div className="flex items-baseline justify-between gap-6">
            {kicker ? <Label>{kicker}</Label> : <span />}
            {section && (
              <p className="mono shrink-0 text-doc-label uppercase text-r-ink-4">
                {section}
                {step && <span className="text-r-ink-4/60"> · {step}</span>}
              </p>
            )}
          </div>
        )}
        {title && <h2 className="display mt-3 max-w-[19ch] text-doc-h2 lg:max-w-none">{title}</h2>}

        {(children || right) && (
          <div
            className={`mt-9 grid gap-10 lg:gap-14 ${
              !right
                ? "lg:grid-cols-1"
                : flip
                  ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.62fr)]"
                  : "lg:grid-cols-[minmax(0,1.38fr)_minmax(0,1fr)]"
            }`}
          >
            <div className="min-w-0">{children}</div>
            {right && <div className="min-w-0">{right}</div>}
          </div>
        )}

        {consequence && (
          <p data-claim className="mt-10 border-l-2 border-r-ink pl-5 text-doc-h3">
            {consequence}
          </p>
        )}
        {source && <div className="mt-8">{source}</div>}
      </div>
    </section>
  );
}
