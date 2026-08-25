"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The deck shell: a landscape, paged read.
 *
 * Scroll-snap panels rather than a keyboard-only deck, and that choice is the
 * whole point. A reviewer who opens a link scrolls by instinct; a deck that only
 * answers to arrow keys strands them on slide 1, which is the exact failure this
 * rebuild exists to prevent. So scrolling works natively and snaps, and the
 * keyboard and the rail are additions on top rather than the only way through.
 *
 * Below 900px the snap turns off entirely and the slides become a normal
 * document scroll — a phone gets a long page, not a broken deck.
 */

export function Deck({
  labels,
  sections,
  children,
}: {
  /** One per slide, in order. Drives the rail's hover labels and the counter. */
  labels: string[];
  /**
   * One per slide, parallel to `labels` — the section each slide belongs to,
   * `null` for the cover. The rail breaks between sections so its shape matches
   * the argument's; without it thirteen identical dots say nothing about
   * structure. Derived upstream from the same plan the slides read, so the rail
   * can't disagree with the badges.
   */
  sections?: (string | null)[];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = labels.length;

  const go = useCallback(
    (next: number) => {
      const el = ref.current;
      if (!el) return;
      const slides = el.querySelectorAll<HTMLElement>("[data-slide]");
      slides[Math.max(0, Math.min(n - 1, next))]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [n],
  );

  /* Which slide is showing. Rooted at the viewport rather than at the scroll
     container on purpose: the container is only the scroller above 900px, and
     an observer rooted at a non-scrolling element reports everything as
     intersecting at once. The viewport is correct in both modes. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const slides = Array.from(el.querySelectorAll<HTMLElement>("[data-slide]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setI(slides.indexOf(e.target as HTMLElement));
        }
      },
      { threshold: 0.55 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(i + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(i - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  return (
    <div
      ref={ref}
      className="doc min-[900px]:h-screen min-[900px]:snap-y min-[900px]:snap-mandatory min-[900px]:overflow-y-auto"
    >
      {children}

      {/* Rail and counter are presentation chrome for the paged read, so they
          disappear along with the snap on a narrow screen. */}
      <nav
        aria-label="Slides"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-[10px] min-[900px]:flex"
      >
        {labels.map((label, k) => (
          <button
            key={label}
            style={
              // A break, not a separator element: keeps every dot on the same
              // grid so the rail stays a rail.
              sections && k > 0 && sections[k] !== sections[k - 1]
                ? { marginTop: 9 }
                : undefined
            }
            onClick={() => go(k)}
            aria-label={`${k + 1}. ${label}`}
            aria-current={k === i}
            title={label}
            className="group flex items-center gap-2"
          >
            <span className="pointer-events-none whitespace-nowrap text-doc-label uppercase text-r-ink-4 opacity-0 transition-opacity group-hover:opacity-100">
              {label}
            </span>
            <span
              className={`block h-[7px] w-[7px] rounded-full transition-colors ${
                k === i ? "bg-r-ink" : "bg-rule group-hover:bg-r-ink-4"
              }`}
            />
          </button>
        ))}
      </nav>

      <p className="mono fixed bottom-5 right-5 z-40 hidden text-doc-label uppercase text-r-ink-4 min-[900px]:block">
        {i + 1} / {n}
      </p>
    </div>
  );
}
