import Link from "next/link";
import { PROBES, SESSIONS, type Session } from "@/deck/transcripts";

/**
 * The three calls, in full.
 *
 * The deck used to end "transcripts and the full spec on request", which asks a
 * reviewer to write an email for the strongest thing in the submission. These
 * are the primary evidence: the argument is that damage never compounds across a
 * call, and this is every turn of every call, with RockED's own scoring beside
 * it. Attached, not offered.
 *
 * Purple is RockED's, the same rule the deck holds. Lisa is their simulation, so
 * her turns carry it. The rep is me, so those are ink. RockED's scoring tables
 * are their output and get the same treatment.
 *
 * Rendered from `src/deck/transcripts.ts`, which was extracted by script and is
 * never hand-edited: see the note at the top of that file.
 */

export const metadata = {
  title: "The three calls, in full",
  description:
    "Every turn of three AI Coach sessions, with RockED's own scoring. The third is a deliberate stress test with five planted anomalies.",
};

export default function TranscriptsPage() {
  return (
    <div className="doc min-h-screen bg-paper">
      <header className="border-b border-rule px-6 py-4 md:px-10">
        <Link
          href="/"
          className="mono text-doc-label uppercase text-r-ink-4 transition-colors hover:text-r-ink"
        >
          &larr; Back to the deck
        </Link>
      </header>

      <main className="mx-auto max-w-[880px] px-6 pb-28 pt-14 md:px-10">
        <p className="mono text-doc-label uppercase text-r-ink-4">
          First-party evidence
        </p>
        <h1 className="display mt-3 text-doc-hero">The three calls, in full.</h1>
        <p className="mt-6 text-doc-body text-r-ink-2">
          Every turn of three AI Coach sessions on the same scenario, with the same
          simulated customer, run 21 to 22 August 2026. Each is followed by
          RockED&rsquo;s own scoring, exactly as it came back. Nothing here is
          edited, including the filler and the mid-sentence corrections.
        </p>
        <p className="mt-4 text-doc-body text-r-ink-2">
          Sessions 1 and 2 are the same call played badly and then well. Session 3
          is a deliberate stress test: five anomalies planted to find out what she
          reacts to.
        </p>

        <nav className="mt-9 flex flex-wrap gap-3">
          {SESSIONS.map((s) => (
            <a
              key={s.n}
              href={`#session-${s.n}`}
              className="rounded-full border border-rule px-5 py-[10px] text-doc-small font-semibold text-r-ink-2 transition-colors hover:border-r-ink-4"
            >
              Session {s.n} &middot; {s.score}/30
            </a>
          ))}
        </nav>

        {SESSIONS.map((s) => (
          <SessionBlock key={s.n} s={s} />
        ))}

        <p className="mt-20 border-t border-rule pt-6 text-doc-small text-r-ink-3">
          These are the calls the deck&rsquo;s finding rests on.{" "}
          <Link href="/" className="font-semibold text-r-ink underline decoration-rule underline-offset-4">
            Back to the deck
          </Link>{" "}
          or{" "}
          <Link href="/prototype" className="font-semibold text-r-ink underline decoration-rule underline-offset-4">
            open the prototype
          </Link>
          .
        </p>
      </main>
    </div>
  );
}

function SessionBlock({ s }: { s: Session }) {
  return (
    <section id={`session-${s.n}`} className="mt-20 scroll-mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-r-ink pb-4">
        <h2 className="display text-doc-h2">Session {s.n}</h2>
        <p className="mono text-doc-mono uppercase text-r-ink-4">
          Scored <span className="text-r-brand">{s.score} / 30</span> by RockED
        </p>
      </div>

      {s.note && (
        <p className="mt-6 border-l-2 border-r-ink pl-5 text-doc-body text-r-ink-2">
          {s.note}
        </p>
      )}

      {/* Session 3's five probes, and what she did with each. On the deck this
          table is deliberately absent: scoring the simulation on detection
          concedes that it mostly works, and the finding is about accumulation,
          not detection. On an evidence page it belongs, because a reviewer
          digging this far is entitled to the result that complicates the story. */}
      {s.n === 3 && (
        <div className="mt-8">
          <p className="mono text-doc-label uppercase text-r-ink-4">
            The five planted anomalies
          </p>
          <ol className="mt-4 divide-y divide-rule-2 border-y border-rule">
            {PROBES.map((p) => (
              <li key={p.n} className="flex gap-4 py-4">
                <span className="mono w-5 shrink-0 pt-[3px] text-doc-mono text-r-ink-4">
                  {p.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-doc-body font-semibold text-r-ink">
                    {p.probe}
                  </span>
                  <span className="mt-1 block text-doc-small text-r-ink-2">
                    {stripBold(p.result)}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <p className="mono mt-10 text-doc-label uppercase text-r-ink-4">
        The call
      </p>
      <div className="mt-4 divide-y divide-rule-2 border-y border-rule">
        {s.turns.map((t, i) => (
          <div key={i} className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
            <span
              className={`mono shrink-0 text-doc-label uppercase sm:w-[104px] ${
                t.speaker === "customer" ? "text-r-brand" : "text-r-ink-4"
              }`}
            >
              {t.speaker === "customer" ? "Lisa" : "Me"}
            </span>
            <p
              className={`min-w-0 flex-1 text-doc-body ${
                t.speaker === "customer" ? "text-r-ink" : "text-r-ink-2"
              }`}
            >
              {t.text}
            </p>
          </div>
        ))}
      </div>

      <p className="mono mt-10 text-doc-label uppercase text-r-ink-4">
        What RockED scored it
      </p>
      <div className="mt-4 divide-y divide-rule-2 border-y border-rule">
        {s.categories.map((c) => (
          <div key={c.name} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-doc-body font-semibold text-r-ink">{c.name}</p>
              <p className="mono shrink-0 text-doc-mono text-r-brand">{c.score}</p>
            </div>
            <p className="mt-2 text-doc-small text-r-ink-2">{c.reason}</p>
            {c.suggestion && (
              <p className="mt-2 text-doc-small text-r-ink-3">
                <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
                  suggested
                </span>
                {c.suggestion}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** The source table marks its verdicts with markdown bold. Nothing else in the
 *  string is touched: the words, the quotes and the punctuation are as filed. */
function stripBold(s: string) {
  return s.replace(/\*\*/g, "");
}
