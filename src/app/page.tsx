import { readFileSync } from "node:fs";
import { join } from "node:path";
import Script from "next/script";

/**
 * The submission deck. This is the URL that gets sent.
 *
 * Sixteen 1920x1080 slides, authored in Claude Design and imported from that
 * project (`rocked-submission-deck.dc.html`). It replaced the React deck that
 * used to live here — same argument, four acts instead of a flat run, and laid
 * out as a real presentation rather than a scroll-snapped web page.
 *
 * THE SLIDES ARE A FILE, NOT JSX, and that's the point. They round-trip: the
 * design project stays the source of truth, and re-importing means re-extracting
 * `src/deck/slides.html` rather than hand-porting 66KB of inline-styled markup
 * into JSX and re-escaping every `style` attribute. Two transforms are applied
 * on the way in, both mechanical:
 *
 *   - `src="public/after/x.png"` -> `src="/after/x.png"`, because Next serves
 *     `public/` at the root and the design project referenced it by folder.
 *   - the CTA on all sixteen slides pointed at the absolute Vercel URL; it's
 *     relative now, so it resolves in dev, in preview, and wherever this ships.
 *
 * `deck-stage` is a vendored web component from the same project, in
 * `public/deck-stage.js`. It handles keyboard nav, the slide-count overlay, the
 * thumbnail rail, print-to-PDF at one slide per page, and the transform-scale
 * that fits 1920x1080 to whatever viewport a reviewer has. Plain-HTML mode, not
 * the `.dc.html` `x-import` mode — which is what lets us skip the design canvas
 * runtime (`support.js`) entirely, since nothing here needs the editor.
 *
 * The font links are not redundant with `next/font` in layout.tsx. The slides
 * name families literally (`font-family: Inter, sans-serif`) and `next/font`
 * exposes hashed family names through CSS variables, so the two never meet.
 * These stylesheet links are what make the deck render as authored.
 *
 * ONE GOTCHA, because it will cost you twenty minutes otherwise: `slides.html`
 * is read at module scope, so editing it does NOT hot-reload. Next only
 * invalidates this module when a file it *watches* changes, and a bare .html
 * under src/ isn't one — the dev server keeps serving the previously-read
 * string, and touching this file isn't reliably enough either. Restart
 * `npm run dev` after editing the slides. A production build has no such
 * problem: readFileSync runs at build time, which is exactly what a static
 * export wants.
 */

const slides = readFileSync(join(process.cwd(), "src/deck/slides.html"), "utf8");

/**
 * `:not(:defined)` hides the stage until the component upgrades, which stops a
 * flash of slide one at its authored 1920px width before the scale transform
 * exists. The body colour is the deck's own letterbox surround, overriding the
 * app canvas globals.css sets for the prototype routes.
 */
const deckCss = `
  body { margin: 0; background: #e8e6ee; }
  deck-stage:not(:defined) { visibility: hidden; }
  deck-stage a { color: #16151f; }
  deck-stage a:hover { color: #0f766e; }
`;

export default function SubmissionDeckPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: deckCss }} />

      <deck-stage
        width="1920"
        height="1080"
        dangerouslySetInnerHTML={{ __html: slides }}
      />

      <Script src="/deck-stage.js" strategy="afterInteractive" />
    </>
  );
}
