/* eslint-disable @next/next/no-img-element */

/**
 * A framed screenshot, and the thing that replaces three paragraphs.
 *
 * Two states, and the empty one is not a placeholder — for the rep profile there
 * *is* no RockED screen to show, and an empty phone-shaped frame where the
 * reader is already looking for one lands harder than a sentence about it would.
 * The manager slide states its absence in words instead, because a full-width
 * empty rectangle reads as a loading failure rather than as a point.
 *
 * Plain <img> rather than next/image: these are pre-sized static assets on a
 * prototype with no image pipeline, and next/image would want explicit
 * dimensions per shot for no benefit here.
 */

/** One number, so the two sides of a pair can never drift out of alignment.
 *  Sized to fill the slide frame: at 420 the change slides sat at 61% vertical
 *  fill on a 1000px viewport, which read as an unfinished slide. */
const PHONE_H = 470;
const DESKTOP_H = 520;

export function Shot({
  src,
  alt,
  label,
  mine,
  desktop,
}: {
  /** Undefined renders the "no screen exists" frame instead. */
  src?: string;
  alt: string;
  /** "RockED today" / "In the prototype" — sits above the frame. */
  label: string;
  /** True for the prototype side. Ink label; RockED's side gets purple. */
  mine?: boolean;
  desktop?: boolean;
}) {
  const h = desktop ? DESKTOP_H : PHONE_H;
  return (
    <figure className="flex min-w-0 flex-col">
      <p
        className={`mono text-doc-label uppercase ${
          mine ? "text-r-ink-4" : "text-r-brand"
        }`}
      >
        {label}
      </p>

      <div className="mt-3">
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{ maxHeight: h }}
            className="block w-auto max-w-full rounded-[10px] border border-rule bg-paper shadow-[0_18px_44px_-26px_rgba(20,19,26,0.45)]"
          />
        ) : (
          <div
            style={{ height: h, width: Math.round(h * 0.47) }}
            className="flex items-center justify-center rounded-[10px] border border-dashed border-rule bg-paper-2"
          >
            <p className="mono px-4 text-center text-doc-label uppercase leading-relaxed text-r-ink-4">
              No screen
              <br />
              exists today
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}
