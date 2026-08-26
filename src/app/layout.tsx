import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * v2 only. Loaded additively so `/` keeps Inter untouched — the two routes are
 * meant to be comparable, so v1's type must not shift when v2's does.
 *
 * Chosen over Inter for v2 because RockED's real app runs a rounder, more
 * geometric face at display weight (see app-screenshot/IMG_1408.PNG, where
 * "Contests" is ~40px extrabold), and because Inter is the default every
 * AI-generated UI reaches for.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/**
 * The submission pages (`/` and `/tour`) only — deliberately NOT the prototype's
 * face.
 *
 * Those pages are an argument *about* RockED's product, not a piece of it. If
 * they shared Plus Jakarta Sans a reader couldn't tell where the case ends and
 * the product begins, and it would read as though a candidate had built them a
 * marketing site.
 *
 * Bricolage over a display serif because the headline runs ~30 words: a
 * high-contrast serif at that length turns into a magazine spread, and this needs
 * to read as a document. Its slightly irregular widths carry the personality so
 * nothing else on the page has to.
 */
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Coach — a fidelity gap, and what I'd do about it",
  description:
    "A rep can practise a pressure close in RockED's AI Coach and get no reaction from the customer. Three sessions, five planted probes, and a working prototype of the fix.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} ${jakarta.variable} ${bricolage.variable}`}
    >
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
      >
        {children}
        {/* Page views across every route: the deck, the transcripts, the
            prototype and the walkthrough. In the root layout rather than on one
            page because the question worth answering is which of them a reviewer
            actually opens, and whether anyone gets past the deck. No-ops in
            development and reports nothing until the app is deployed. */}
        <Analytics />
      </body>
    </html>
  );
}
