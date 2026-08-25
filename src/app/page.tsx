/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CHANGES, MISTAKES, THEIR_VERDICT, type Change } from "@/components/tour/changes";
import { Deck } from "@/components/deck/Deck";
import { Slide } from "@/components/deck/Slide";
import { Shot } from "@/components/deck/Shot";
import { Comparison } from "@/components/deck/Comparison";
import {
  Assumed,
  Cite,
  Em,
  Fact,
  Label,
  Layers,
  Ledger,
  Ordered,
  Pull,
  Rk,
  TrustLine,
  Who,
} from "@/components/deck/prims";

/**
 * The submission. This is the URL that gets sent.
 *
 * Four readers in a known order: Kashish (HRBP — screens it and decides whether
 * to spend a CPO's attention), then a CPO, a Head of Engineering, possibly CXO
 * leadership. They read it once, on a laptop, and may never open the prototype.
 *
 * Claim-first, which is the opposite of a report. A report goes findings →
 * recommendations and is written for someone obliged to read it. A deck is for
 * someone who isn't, so this opens at the end and every later slide is
 * confirmation rather than suspense. That's what stops a reader skipping — and
 * it's why there's no contents list on slide 1, since a contents list is an
 * invitation to jump.
 *
 * ONE problem arc, deliberately. An earlier draft had two problem statements —
 * the simulation doesn't react, and nothing connects practice to outcomes — and a
 * reader hit the second and thought the argument had restarted. They're the same
 * problem from both ends: the simulation can afford to ignore conduct *because*
 * nothing downstream measures conduct. Slide 5 says exactly that, and there is no
 * second section.
 *
 * THE INTEGRATION IS SLIDE 6, not slide 12. It's the strongest finding in the
 * submission and it used to sit at 86% depth, behind five feature slides, where a
 * reader who stopped early never reached it. It's also the *answer* to slides 2–5
 * rather than an appendix to the build, so it now takes the turn and the five
 * changes become the evidence that the answer is buildable.
 *
 * Four rules held throughout:
 *
 * 1. Assertion-evidence. The title is a full sentence carrying the slide's claim;
 *    the body's job is to show evidence, capped at ~45 words of prose. Lists and
 *    verbatim quotes aren't prose and don't count against it — they're the
 *    evidence. Every slide that broke this cap was also one of the half-empty
 *    ones, because prose is what a slide reaches for when it has no artifact.
 * 2. Every number carries provenance via `Cite`. No dealership statistic appears
 *    that isn't sourced, and nothing vendor-published is dressed as audited.
 * 3. Purple means RockED's. `Rk` and `Pull theirs` spend it; `Em` is the same
 *    emphasis in the candidate's own voice and stays ink. Named third-party
 *    systems are the dealer's, so they stay ink too.
 * 4. Nothing is scored on detection. An earlier draft had a caught/missed probe
 *    table, which conceded that the product mostly works. The finding is that
 *    damage never accumulates, not that one probe was missed.
 */

/**
 * The four acts, and the only place slide order is declared.
 *
 * `LABELS`, the dot rail's section breaks, and every slide's top-right badge all
 * derive from this, so they cannot disagree with each other. The cover carries no
 * section — a badge on slide 1 would be answering a question nobody has yet.
 */
const SECTION_PLAN: { section: string | null; labels: string[] }[] = [
  { section: null, labels: ["The claim"] },
  { section: "The finding", labels: ["The call", "Their own coaching"] },
  { section: "The stakes", labels: ["What it costs"] },
  {
    section: "The fix",
    labels: ["The integration", "One loop, four moves", ...CHANGES.map((c) => c.title)],
  },
  { section: "What I'd ship", labels: ["Ship first", "Who's writing this"] },
];

const LABELS = SECTION_PLAN.flatMap((g) => g.labels);
const SECTIONS = SECTION_PLAN.flatMap((g) => g.labels.map(() => g.section));

/** The badge props for slide `n` (1-based). Sections of one slide get no step. */
function sec(n: number): { section?: string; step?: string } {
  let i = 0;
  for (const g of SECTION_PLAN) {
    if (n <= i + g.labels.length) {
      if (!g.section) return {};
      return {
        section: g.section,
        step: g.labels.length > 1 ? `${n - i} of ${g.labels.length}` : undefined,
      };
    }
    i += g.labels.length;
  }
  return {};
}

export default function SubmissionPage() {
  return (
    <Deck labels={LABELS} sections={SECTIONS}>
      {/* ---------- 1. Start at the end ---------- */}

      <Slide
        kicker="RockED · Product Manager take-home"
        right={
          // Both reports, because the before/after of the whole submission in one
          // glance is what "start at the end" actually means. Shot already renders
          // this pair with the purple/ink labels the rest of the deck uses.
          <div className="flex gap-5">
            <Shot
              src="/before/result.png"
              alt="RockED's own report for the call: 14 out of 30."
              label="RockED today"
            />
            <Shot
              src="/after/report.png"
              alt="The redesigned report, headed “You lost her.”"
              label="In the prototype"
            />
          </div>
        }
      >
        {/* Two tiers, not one block. The finding sets it up and the claim is what
            the eye should land on — at one hero size a ~48-word opening runs
            seven lines and neither half wins. */}
        <p className="text-doc-h3 text-r-ink-2">
          I ran RockED&rsquo;s AI Coach as the worst salesperson I could invent —
          and its coaching advice was <Rk>&ldquo;build excitement.&rdquo;</Rk>
        </p>
        <h1 className="display mt-5 text-doc-hero">
          So I rebuilt the loop: the call can be lost, the report names the mistake
          that lost it, and his real calls show within days whether he stopped.
        </h1>
        <Who />
        <Ways className="mt-8" />
      </Slide>

      {/* ---------- 2. The proof. A list, not prose — the order is the argument. ---------- */}

      <Slide
        kicker="The call"
        title="Eleven things went wrong. She still asked to see the car."
        {...sec(2)}
        right={
          // The list and the plot are the same eleven turns in two
          // representations, which is why the old standalone "why it happens"
          // slide folded in here rather than being cut: the mechanism belongs
          // next to the evidence for it, not on a slide of its own arguing
          // architecture.
          <div data-artifact>
            <TrustLine />
            <p className="mt-5 text-doc-body text-r-ink">
              &ldquo;I guess I&rsquo;m sort of leaning toward it. Could I at least
              see it?&rdquo;
            </p>
            <p className="mt-3 text-doc-small text-r-ink-2">
              Her last line. She said she&rsquo;d keep looking at items eight and
              nine and <Em>both times the call carried on</Em> — because each turn
              is judged fresh and trust never compounds downward.
            </p>
            <Cite kind="first-party">
              Session 3 of 3, 22 August 2026 — run deliberately to find what she
              would react to.
            </Cite>
          </div>
        }
        consequence="A real customer is gone by item four. This one was still negotiating at item eleven."
      >
        <Ordered items={[...MISTAKES]} />
      </Slide>

      {/* ---------- 3. Their own screen. No argument required. ---------- */}

      <Slide
        kicker="Their own coaching"
        title="Then it told me to build excitement."
        {...sec(3)}
        right={
          <figure>
            <img
              src="/before/result-bars.png"
              alt="RockED's scorecard: Introduction 5/10 on a green bar, Qualifying 6/10, Closing 3/10."
              style={{ maxHeight: "min(46vh, 470px)" }}
              className="block w-auto max-w-full rounded-[12px] border border-rule shadow-[0_20px_50px_-28px_rgba(20,19,26,0.5)]"
            />
            <figcaption className="mt-4 max-w-[500px] text-doc-small text-r-ink-3">
              <Rk>Introduction, 5 out of 10, green</Rk> — for a call that opened at
              the wrong dealership, with the wrong model, in the wrong colour.
            </figcaption>
          </figure>
        }
        consequence="The advice isn't wrong. It's aimed at a different call than the one I had."
        source={
          <Cite kind="first-party">
            The report as delivered, unedited. Scored <Rk>14 / 30</Rk>.
          </Cite>
        }
      >
        <Label>Its entire coaching advice, verbatim</Label>
        <div className="mt-4">
          <Pull theirs>{THEIR_VERDICT.suggestion}</Pull>
        </div>
        <p className="mt-7 text-doc-body text-r-ink-2">
          Not one word about the lie, the two prices, or the line about her budget.{" "}
          <Em>It coaches the close, because the close is what the rubric has a row
          for.</Em>
        </p>
      </Slide>

      {/* ---------- 4. The cost, as the gap between two columns ---------- */}

      <Slide
        kicker="What it costs"
        title="The scorecard said halfway there. She was already gone."
        {...sec(4)}
        // The hinge of the whole deck, and it has to be on this slide: the left
        // column is measured and the right isn't, *because* nothing joins a
        // practice session to a real outcome. Slide 5 is the answer to this
        // sentence, which is what keeps slides 2-5 one arc instead of two.
        consequence="Every line on the left is a number in a system. Nothing on the right is, because nothing connects a practice session to a real outcome."
        source={
          <Cite kind="vendor">
            RockED publishes a <Rk>10&ndash;15% average lift in service upsell</Rk>{" "}
            across 300+ live dealers, not audited. Nothing in the right-hand column
            could confirm or deny it, which is the gap the next slide closes.
          </Cite>
        }
      >
        {/* Full width, no second column: the two halves of the argument ARE the
            two halves of the table, so handing them to Slide's own grid would
            nest a comparison inside a comparison and let the two sides drift
            apart vertically. Read across, not down — each right cell is the cost
            of the left cell beside it. */}
        <div data-artifact>
          <Ledger
            left="What RockED measured"
            right="What the store lost"
            rows={[
              ["14 out of 30", "The deal, and the F&I gross behind it"],
              [
                "Introduction 5/10, on a green bar",
                "A customer who was lied to about the car",
              ],
              [
                "\u201cFocus on building excitement\u201d",
                "A CSI survey the GM answers for",
              ],
              [
                "Docked for not collecting contact details",
                "Any follow-up \u2014 he never took her number",
              ],
            ]}
          />
        </div>
      </Slide>

      {/* ---------- 6. THE TURN. Moved up from 12 — this is the finding, and
                       it's the answer to everything above it. ---------- */}

      <Slide
        kicker="The integration"
        title="Read the CRM. Listen to the calls. Prove it in days."
        {...sec(5)}
        flip
        right={
          <div data-artifact>
            <Layers />
          </div>
        }
        consequence="Nobody can say that today — not this product, and not the call-scoring tools already in these stores."
      >
        <Label>What a rep has to hear, because he&rsquo;s paid on units</Label>
        <div className="mt-4">
          <Pull>
            &ldquo;We read your CRM and we listen to your calls. We know what
            you&rsquo;re doing wrong. We&rsquo;ll help you fix it, and your next
            week of calls will show whether it worked.&rdquo;
          </Pull>
        </div>
        <p className="mt-7 text-doc-body text-r-ink-2">
          <Em>Practice is a cost centre until you can show that the rep who
          practised closed more deals.</Em>
        </p>
        <dl className="mt-7 divide-y divide-rule-2 border-y border-rule">
          <Fact term="Read">
            Close rate and upsell per RO by rep, and the call recordings behind
            them.
          </Fact>
          <Fact term="Write back">
            The assignment, and whether the number moved after it.
          </Fact>
          <Fact term="Ranks last to build">
            Every other change ships without it. This one decides whether the loop
            can ever be proven.
          </Fact>
        </dl>
      </Slide>

      {/* ---------- 7. What I built ---------- */}

      <Slide
        kicker="What I built"
        title="One loop, four moves."
        {...sec(6)}
        right={
          <figure>
            <img
              src="/after/report.png"
              alt="The redesigned score report, headed “You lost her.”"
              style={{ maxHeight: "min(48vh, 500px)" }}
              className="block w-auto max-w-full rounded-[14px] border border-rule shadow-[0_26px_60px_-30px_rgba(20,19,26,0.5)]"
            />
            <figcaption className="mt-4 max-w-[262px] text-doc-small text-r-ink-3">
              Eight screens, a working consequence engine, no backend.
            </figcaption>
          </figure>
        }
        consequence="Detection is a compliance function. Coaching has to prescribe, drill, and prove."
      >
        <dl className="divide-y divide-rule-2 border-y border-rule">
          <Fact term="Diagnose">
            Cumulative sentiment with a walk-away point, so a call can be lost.
          </Fact>
          <Fact term="Prescribe">
            A report naming the one thing that cost the call, and the drill for it.
          </Fact>
          <Fact term="Drill">
            Coverage across eight customer personas, plus scenarios the rep writes himself.
          </Fact>
          <Fact term="Prove">
            A profile and a GM view that put practice next to the floor.
          </Fact>
        </dl>
      </Slide>

      {/* ---------- 8-12. The five changes ---------- */}

      {CHANGES.map((c, i) => (
        <ChangeSlide key={c.id} change={c} n={i + 1} />
      ))}

      {/* ---------- 13. The cut, and the metric ---------- */}

      <Slide
        kicker="What I'd ship first"
        title="Two of the seven. The other five wait."
        {...sec(12)}
        right={
          <div className="space-y-3" data-artifact>
            {[
              {
                k: "North star — did behaviour change",
                v: "A rep who drills a named gap improves on that pillar, and it shows in their close rate",
                d: "Per rep against their own baseline, one quarter, Enhanced tier.",
                lead: true,
              },
              {
                k: "Shipping check",
                v: "≥80% of planted pressure tactics produce a visible consequence",
                d: "Baseline nil. Necessary, nowhere near sufficient — it only measures detection.",
              },
              {
                k: "Guardrail",
                v: "Completion for reps using honest technique must not fall",
                d: "If both move together I built a difficulty knob, not a coach.",
              },
            ].map((m) => (
              <div
                key={m.k}
                className={`rounded-[14px] p-6 ${
                  m.lead
                    ? "border-2 border-r-ink bg-paper"
                    : "border border-rule bg-paper-2"
                }`}
              >
                <Label>{m.k}</Label>
                <p className="mt-3 text-doc-h3">{m.v}</p>
                <p className="mt-3 text-doc-small text-r-ink-3">{m.d}</p>
              </div>
            ))}
          </div>
        }
      >
        <p className="text-doc-body text-r-ink-2">
          Building all seven proves the loop is coherent. It isn&rsquo;t a roadmap.
          With one week: <Em>the consequence mechanic and the redesigned report</Em>,
          nothing else. Neither works alone.
        </p>
        <dl className="mt-7 divide-y divide-rule-2 border-y border-rule">
          <Fact term="What waits">
            The coverage map, rep-created scenarios, the profile, the manager view.
          </Fact>
          <Fact term="Why those two last">
            They&rsquo;re the most interesting and they wait on the integration. The
            first two need nobody&rsquo;s permission.
          </Fact>
        </dl>
      </Slide>

      {/* ---------- 14. Who, and what's theatre ---------- */}

      <Slide
        kicker="Who's writing this"
        title="And what in here is real."
        {...sec(13)}
        right={
          <dl className="divide-y divide-rule-2 border-y border-rule">
            <Fact term="The consequence engine is real">
              Real deltas against three pillars, a hard threshold that ends the
              call. Play the honest path and the dishonest one on the same customer
              and they diverge.
            </Fact>
            <Fact term="The dialogue is authored, not a live model">
              A directed graph, each line written for the choice that reaches it. A
              live model would make the demo non-reproducible.
            </Fact>
            <Fact term="CRM and call data is seeded">
              Tagged on screen wherever it appears, in two registers: mocked but it
              exists today, and doesn&rsquo;t exist yet.
            </Fact>
            <Fact term="Real-time turn-taking isn't demonstrated">
              Push-to-talk gives a rep unlimited think time, and a clickable mock
              can&rsquo;t fix that. Specified as part two of the first change.
            </Fact>
            <Fact term="What would change my mind">
              If reps who complete AI Coach already close at a materially higher
              rate, the fidelity gap matters less than I&rsquo;m claiming and the
              priority is content volume. My evidence is one tester, three
              sessions, and I never watched a real rep use it.
            </Fact>
          </dl>
        }
      >
        <Who full />
        <p className="mt-4 text-doc-body text-r-ink-2">
          Designed for the sales floor; the loop should generalise to service and
          parts.{" "}
          <Assumed>I couldn&rsquo;t verify Booster is the same engine.</Assumed>
        </p>
        <Ways className="mt-9" />
        <p className="mt-10 border-t border-rule pt-5 text-doc-small text-r-ink-3">
          Transcripts, App Store review themes and the full spec, on request. Built
          with AI assistance; the product thinking and the calls are mine.
        </p>
      </Slide>
    </Deck>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One of the five changes: RockED's real screen, the prototype's, and the
 * argument. The screenshots carry the slide — a reader who never opens the
 * prototype should still see what changed, which is the whole reason this format
 * replaced the prose write-up.
 *
 * The comparison is `Comparison`, shared with the walkthrough, so the two
 * surfaces can't drift on what a before/after looks like. It replaced two
 * stacked paragraphs whose old-side label was purple — which on these pages
 * means "RockED's", but in a two-column layout read as "this is the better one."
 *
 * At most one subordinate line here. The walkthrough has room for `limit`, `note`
 * and `tryIt`; a slide doesn't, and a deck slide carrying five stacked paragraphs
 * is exactly what this format exists to prevent.
 */
function ChangeSlide({ change: c, n }: { change: Change; n: number }) {
  const desktop = c.frame === "desktop";
  return (
    <Slide
      kicker={`What I built · ${n} of ${CHANGES.length}`}
      title={c.title}
      // Changes are slides 7-11: two slides of "The fix" precede them.
      {...sec(6 + n)}
      consequence={c.consequence}
      flip={desktop}
      right={
        // No `beforeShot` on the last two: RockED has no rep profile and no
        // manager view, and the empty frame is the finding.
        <div className="flex gap-5">
          {!desktop && (
            <Shot
              src={c.beforeShot}
              alt={`RockED today — ${c.title}`}
              label="RockED today"
            />
          )}
          <Shot
            src={c.afterShot}
            alt={`In the prototype — ${c.title}`}
            label="In the prototype"
            desktop={desktop}
          />
        </div>
      }
    >
      <Comparison today={c.today} build={c.build} />

      {/* `limit` wins where a change has both: a stated limit is the one a
          reviewer is entitled to see. `tryIt` never appears on the deck — its
          phone is a screenshot, so the invitation can't be taken up. */}
      {(c.limit ?? c.note) && (
        <p className="mt-7 text-doc-small text-r-ink-3">
          {c.limit && (
            <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
              stated limit
            </span>
          )}
          {c.limit ?? c.note}
        </p>
      )}
    </Slide>
  );
}

/**
 * One door. On the first slide and the last, because the one thing this
 * submission can't afford is a reader who never clicks.
 *
 * This was two buttons — "walk the five changes" and "open the prototype" —
 * which made a reader choose between two things before knowing what either was.
 * Both still exist; they're now the two modes of one screen, and the switch
 * lives in that screen's header.
 */
function Ways({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href="/prototype"
        className="rounded-full bg-r-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
      >
        View the prototype &rarr;
      </Link>
      <span className="text-doc-small text-r-ink-3">
        Explore it yourself, or switch to the guided walkthrough in one click.
      </span>
    </div>
  );
}
