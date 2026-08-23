import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
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
  variable: "--font-jakarta",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Coach | RockED",
  description: "RockED AI Coach — redesign prototype (internal concept, not a shipped RockED product).",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable} ${jakarta.variable}`}>
      <body
        className="antialiased"
        style={{ fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
