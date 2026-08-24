import { Label } from "./prims";

/**
 * One panel of the deck.
 *
 * `min-h-screen` rather than `h-screen`: a slide that outgrows the viewport
 * should scroll past rather than clip its own last line, and snap-start still
 * lands cleanly on its top edge when that happens. It should not happen —
 * outgrowing the panel is the signal that the slide has too much copy on it,
 * which is the discipline this format exists to impose.
 */
export function Slide({
  kicker,
  title,
  children,
  wide,
}: {
  kicker?: string;
  title?: string;
  children?: React.ReactNode;
  /** Slides 7–11 carry two screenshots and need the extra measure. */
  wide?: boolean;
}) {
  return (
    <section
      data-slide
      className="flex min-h-screen w-full snap-start flex-col justify-center px-6 py-14 md:px-14 lg:px-20"
    >
      <div className={`mx-auto w-full ${wide ? "max-w-[1240px]" : "max-w-[900px]"}`}>
        {kicker && <Label>{kicker}</Label>}
        {title && <h2 className="display mt-3 text-doc-h2">{title}</h2>}
        {children}
      </div>
    </section>
  );
}
