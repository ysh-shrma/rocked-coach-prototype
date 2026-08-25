/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { CHANGES, MISTAKES, THEIR_VERDICT, type Change } from "@/components/tour/changes";
import { Deck } from "@/components/deck/Deck";
import { Slide } from "@/components/deck/Slide";
import { Shot } from "@/components/deck/Shot";
import {
  Assumed,
  Chain,
  Cite,
  Em,
  Fact,
  Label,
  Layers,
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

const LABELS = [
  "The claim",
  "The call",
  "Their own coaching",
  "Why it happens",
  "What it costs",
  "The integration",
  "What I built",
  ...CHANGES.map((c) => c.title),
  "What I'd ship first",
  "Who's writing this",
];

export default function SubmissionPage() {
  return (
    <Deck labels={LABELS}>
      {/* ---------- 1. Start at the end ---------- */}

      <Slide
        kicker="RockED · Product Manager take-home"
        right={
          <figure>
            <img
              src="/before/result.png"
              alt="RockED's own score report for the call: 14 out of 30."
              className="block w-full max-w-[300px] rounded-[14px] border border-rule shadow-[0_26px_60px_-30px_rgba(20,19,26,0.5)]"
            />
            <figcaption className="mt-4 max-w-[300px] text-doc-small text-r-ink-3">
              RockED&rsquo;s own report for that call.
            </figcaption>
          </figure>
        }
      >
        <h1 className="display text-doc-hero">
          I build the voice agents that make these calls. I ran RockED&rsquo;s AI
          Coach as the worst salesperson I could invent — and its coaching advice
          was &ldquo;build excitement.&rdquo;
        </h1>
        <Who />
        <p className="mt-7 text-doc-body text-r-ink-2">
          Eleven things went wrong in one conversation. She stayed warm through
          every one of them.
        </p>
        <Ways className="mt-8" />
      </Slide>

      {/* ---------- 2. The proof. A list, not prose — the order is the argument. ---------- */}

      <Slide
        kicker="The call"
        title="Eleven things went wrong. She still asked to see the car."
        right={
          <div className="lg:pt-1">
            <Label>How it ended</Label>
            <p className="mt-4 text-doc-body text-r-ink">
              &ldquo;I guess I&rsquo;m sort of leaning toward it. Could I at least
              see it?&rdquo;
            </p>
            <p className="mt-5 text-doc-small text-r-ink-2">
              She said she&rsquo;d keep looking at items eight and nine.{" "}
              <Em>Both times the call carried on.</Em>
            </p>
            <Cite kind="first-party">
              Three sessions, 21&ndash;22 August 2026. This is the third, run
              deliberately to find what she would react to.
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
        right={
          <figure>
            <img
              src="/before/result-bars.png"
              alt="RockED's scorecard: Introduction 5/10 on a green bar, Qualifying 6/10, Closing 3/10."
              className="block w-full max-w-[500px] rounded-[12px] border border-rule shadow-[0_20px_50px_-28px_rgba(20,19,26,0.5)]"
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

      {/* ---------- 4. The mechanism, drawn ---------- */}

      <Slide
        kicker="Why it happens"
        title="She has no memory of being lied to."
        flip
        right={
          <div data-artifact>
            <TrustLine />
          </div>
        }
        consequence="A smarter customer wouldn't fix this. She needs a memory, not a bigger vocabulary."
      >
        <p className="text-doc-body text-r-ink-2">
          She corrected the model. She flagged the price jump. Then carried on as
          though neither had happened, because{" "}
          <Em>each turn is judged fresh and trust never compounds downward.</Em>
        </p>
        <p className="mt-4 text-doc-body text-r-ink-2">
          I recognised it because it&rsquo;s the hard part of my own work.{" "}
          <Em>A prompt-driven roleplay can hold facts and can&rsquo;t hold a
          grudge.</Em>
        </p>
        <dl className="mt-7 divide-y divide-rule-2 border-y border-rule">
          <Fact term="What a turn can see today">
            The facts stated in it. A contradiction inside one claim is catchable;
            a pattern across nine turns isn&rsquo;t.
          </Fact>
          <Fact term="What it needs">
            A trust value that persists between turns, moves on conduct as well as
            on facts, and can reach a floor.
          </Fact>
        </dl>
      </Slide>

      {/* ---------- 5. The cost. One arc — the sim ignores conduct because
                       nothing downstream measures conduct. ---------- */}

      <Slide
        kicker="What it costs"
        title="It rehearses toward two numbers the store is already paid on."
        right={
          <div className="rounded-[14px] border border-rule bg-paper-2 p-8">
            <Label>And the part that hides it</Label>
            <p className="mt-4 text-doc-body text-r-ink-2">
              RockED publishes a{" "}
              <Rk>10&ndash;15% average lift in service upsell</Rk>.{" "}
              <Cite kind="vendor" inline>
                across 300+ live dealers, not audited.
              </Cite>
            </p>
            <p className="mt-4 text-doc-body text-r-ink-2">
              Nobody can check it, because{" "}
              <Em>nothing connects a practice session to a real outcome.</Em>
            </p>
            <p data-claim className="mt-6 border-t border-rule pt-6 text-doc-h3">
              The same gap from the other end.
            </p>
            <p className="mt-3 text-doc-body text-r-ink-2">
              Nothing upstream has to be faithful to what moves a close rate if
              nothing downstream measures one.
            </p>
          </div>
        }
        consequence="So a practice tool that lets all eleven pass isn't neutral. It rehearses toward the bill."
      >
        <div data-artifact>
          <Chain />
        </div>
      </Slide>

      {/* ---------- 6. THE TURN. Moved up from 12 — this is the finding, and
                       it's the answer to everything above it. ---------- */}

      <Slide
        kicker="The integration"
        title="Read the CRM. Listen to the calls. Prove it next month."
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
            you&rsquo;re doing wrong. We&rsquo;ll help you fix it, and we&rsquo;ll
            show you it moved next month.&rdquo;
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
        right={
          <figure>
            <img
              src="/after/report.png"
              alt="The redesigned score report, headed “You lost her.”"
              className="block w-full max-w-[262px] rounded-[14px] border border-rule shadow-[0_26px_60px_-30px_rgba(20,19,26,0.5)]"
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
            Coverage across eight customers, plus scenarios the rep writes himself.
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
            <Fact term="Real-time turn-taking is the one I couldn't build">
              Push-to-talk gives a rep unlimited think time. Fixing it needs
              latency-aware turn-taking and barge-in, so I&rsquo;m naming it as a
              requirement rather than pretending this demonstrates it.
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
 * `alsoShort` and `caveat` are deliberately not rendered here even though both
 * exist on the change. They're the second and third argument, /tour has room for
 * them, and a deck slide carrying five stacked paragraphs is the thing this pass
 * was fixing. The stated limits still ship — on the walkthrough, next to the
 * screen they apply to.
 */
function ChangeSlide({ change: c, n }: { change: Change; n: number }) {
  const desktop = c.frame === "desktop";
  return (
    <Slide
      kicker={`What I built · ${n} of ${CHANGES.length}`}
      title={c.title}
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
            mine
            desktop={desktop}
          />
        </div>
      }
    >
      <p className="text-doc-body text-r-ink-2">
        <span className="mono mr-[6px] text-doc-label uppercase text-r-brand">
          today
        </span>
        {c.beforeShort ?? c.before}
      </p>
      <p className="mt-5 text-doc-body text-r-ink-2">
        <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
          instead
        </span>
        {c.afterShort ?? c.after}
      </p>
      {(c.forTheRepShort ?? c.forTheRep) && (
        <p className="mt-5 text-doc-body text-r-ink-2">
          <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
            why he&rsquo;d use it
          </span>
          {c.forTheRepShort ?? c.forTheRep}
        </p>
      )}
    </Slide>
  );
}

/** Both paths, always together. Named on the first slide and the last, because
 *  the one thing this submission can't afford is a reader who never clicks. */
function Ways({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href="/tour"
        className="rounded-full bg-r-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
      >
        Walk the five changes &rarr;
      </Link>
      <Link
        href="/prototype"
        className="rounded-full border border-rule px-6 py-3 text-[15px] font-semibold text-r-ink-2 transition-colors hover:border-r-ink-4"
      >
        Open the prototype
      </Link>
    </div>
  );
}
