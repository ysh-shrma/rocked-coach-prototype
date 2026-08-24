import Link from "next/link";
import { CHANGES, PROBES, type Change } from "@/components/tour/changes";
import { Deck } from "@/components/deck/Deck";
import { Slide } from "@/components/deck/Slide";
import { Shot } from "@/components/deck/Shot";
import { Assumed, Cite, Em, Fact, Label, Rk, Speaker } from "@/components/deck/prims";

/**
 * The submission. This is the URL that gets sent.
 *
 * Written for four readers in a known order: Kashish (HRBP — screens it and
 * decides whether to spend a CPO's attention), then a CPO, a Head of
 * Engineering, possibly CXO leadership. The assumption that shapes every
 * decision below is that they read it once, on a laptop, and do not click
 * through every screen of a prototype afterwards.
 *
 * So it's a deck rather than the prose write-up this replaced. A slide can't be
 * overwritten, which is the only reliable way to hold the density; and slides
 * 7–11 make their argument in before/after screenshots, so a reader who never
 * opens the prototype still sees what was built. The prototype and the
 * walkthrough are both named on the first slide and again on the last.
 *
 * Two rules held throughout:
 *
 * 1. Every number is labelled first-party, App Store verbatim, vendor-published
 *    or audited. Passing a vendor's own number off as audited is the fastest way
 *    to lose this audience. No dealership statistic appears that isn't sourced.
 * 2. Tone is "help your flagship succeed at the scale you're already committed
 *    to", never "you missed something". The finding is sharp; the register isn't
 *    prosecutorial.
 */

const LABELS = [
  "Start here",
  "The problem",
  "How I tested it",
  "Finding 1",
  "Finding 2",
  "Finding 3",
  ...CHANGES.map((c) => c.title),
  "What I'd ship first",
  "What's real",
  "Open it",
];

export default function SubmissionPage() {
  return (
    <Deck labels={LABELS}>
      {/* ---------- 1. Start here: the claim, the map, and both ways in ------- */}

      <Slide wide>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
          <div className="min-w-0">
            <Label>RockED · Product Manager take-home · Yash Sharma</Label>

            <h1 className="display mt-5 text-doc-hero">
              A rep can practise the one move that kills deals — and the scorecard
              says he did fine.
            </h1>

            <p className="mt-5 text-doc-body text-r-ink-2">
              <span className="text-r-ink">
                AI Coach rewards saying the right words over reading the right
                signals.
              </span>{" "}
              I found that by running the feature three times with five planted
              probes, then rebuilt the practice loop so a call can actually be
              lost.
            </p>

            {/* Who's talking. Without this the whole thing reads as an outsider
                who tested an app three times, and the DMS/CRM argument on the
                ship-first slide has nothing behind it. Scope only, no
                commercials. */}
            <p className="mt-4 text-doc-small text-r-ink-3">
              I build voice and SMS sales agents for US dealership rooftops at
              Spyne. This is the customer I ship to every week.
            </p>

            <ol className="mt-8 divide-y divide-rule-2 border-y border-rule">
              {[
                ["The problem", "A fake deadline, and nothing pushed back"],
                ["How I tested it", "Three sessions, five planted anomalies"],
                ["What I found", "Three things, one of them commercial"],
                ["What I built", "Five changes, working and clickable"],
              ].map(([step, sub], i) => (
                <li key={step} className="flex gap-4 py-[10px]">
                  <span className="mono w-4 shrink-0 pt-[3px] text-doc-mono text-r-ink-4">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-doc-small">
                    <span className="font-semibold text-r-ink">{step}</span>
                    <span className="text-r-ink-3"> — {sub}</span>
                  </span>
                </li>
              ))}
            </ol>

            <Ways className="mt-8" />
          </div>

          {/* Proof it exists, before a word of argument. */}
          <figure className="mx-auto w-full max-w-[300px] lg:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/after/report.png"
              alt="The redesigned score report in the prototype, headed “You lost her.”"
              className="block w-full rounded-[14px] border border-rule shadow-[0_26px_60px_-30px_rgba(20,19,26,0.5)]"
            />
            <figcaption className="mt-4 text-doc-small text-r-ink-3">
              Eight screens, a working consequence engine, no backend. Every slide
              from here shows RockED&rsquo;s screen next to it.
            </figcaption>
          </figure>
        </div>
      </Slide>

      {/* ---------- 2. The problem, as one artifact ---------- */}

      <Slide wide kicker="The problem" title="I used a fake deadline. Nothing pushed back.">
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <Tape />

          <div className="lg:pt-8">
            <Label>Then the scorecard graded the turn</Label>
            <p className="mono mt-4 text-doc-mono text-r-brand">
              Closing 3/10 — &ldquo;No commitment or next steps secured; created
              pressure via &lsquo;another customer waiting&rsquo; but didn&rsquo;t
              confirm contact details.&rdquo;
            </p>
            <p className="mt-5 text-doc-body text-r-ink-2">
              The grader saw the tactic. It listed it as something I did, and took
              the points off for not collecting a phone number.
            </p>
            <Cite kind="first-party">
              Three sessions run 21–22 August 2026, scored 17/30, 24/30 and 14/30
              by RockED&rsquo;s own rubric. Sales department throughout — these are
              sales-floor scenarios, not service or parts.
            </Cite>
          </div>
        </div>
      </Slide>

      {/* ---------- 3. The credibility unlock, before any solution ---------- */}

      <Slide
        wide
        kicker="How I tested it"
        title="I ran the same call three times and planted five anomalies in the third."
      >
        <p className="mt-5 max-w-[760px] text-doc-body text-r-ink-2">
          This tests whether the simulated customer reacts to what a rep actually
          does, rather than how the screens look. The five anomalies are failure
          modes I watch for on real dealership calls, so I knew what I was looking
          for.
        </p>

        <ol className="mt-8 divide-y divide-rule-2 border-y border-rule">
          {PROBES.map((p, i) => (
            <li key={p.id} className="flex gap-4 py-[14px]">
              <span className="mono w-4 shrink-0 pt-[3px] text-doc-mono text-r-ink-4">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 lg:flex lg:gap-6">
                <span className="block text-doc-small font-semibold lg:w-[290px] lg:shrink-0">
                  {p.probe}
                </span>
                <span className="mt-1 block text-doc-small text-r-ink-2 lg:mt-0">
                  {p.result}
                </span>
              </span>
              <span
                className={`mono shrink-0 pt-[3px] text-doc-label uppercase ${
                  p.caught ? "text-r-ink-4" : "text-r-ink"
                }`}
              >
                {p.caught ? "caught" : "missed"}
              </span>
            </li>
          ))}
        </ol>
      </Slide>

      {/* ---------- 4-6. Three findings, one per slide ---------- */}

      <Slide kicker="What I found · 1 of 3" title="It tracks claims, and ignores conduct.">
        <p className="mt-6 text-doc-body text-r-ink-2">
          Four of five landed, and they landed precisely — she corrects a model,
          catches a contradicted price, asks for recall documentation. The one that
          produced nothing was the manufactured deadline. The simulation is{" "}
          <Em>factually reactive and tactically inert.</Em>
        </p>
        <p className="mt-4 text-doc-body text-r-ink-2">
          Which is the wrong half to get right. A rep who quotes a wrong price gets
          corrected by the customer in the next sentence. A rep who leans on a fake
          deadline gets a deal that quietly dies weeks later, and never learns why.
        </p>
      </Slide>

      <Slide kicker="What I found · 2 of 3" title="Catching the lie is the floor, not the ceiling.">
        <p className="mt-6 text-doc-body text-r-ink-2">
          The obvious read is &ldquo;make the customer smarter.&rdquo; I don&rsquo;t
          think that&rsquo;s the work.{" "}
          <Em>
            Four of my five anomalies were caught, and it still didn&rsquo;t make me
            a better rep.
          </Em>{" "}
          I got a 14/30 and walked away knowing I&rsquo;d been marked down without
          knowing what to do differently on the next call.
        </p>
        <p className="mt-4 text-doc-body text-r-ink-2">
          Detection is a compliance function. A dealership doesn&rsquo;t have a
          lying problem, it has a closing problem — and a tool whose job is telling
          a rep he fibbed is a referee, which the desk manager already does in
          person for free. Coaching has to say what to do instead, make the rep
          drill that exact thing, and show whether it moved on the floor.{" "}
          <Em>Diagnose, prescribe, drill, verify.</Em>
        </p>
        <p className="mt-6 border-t border-rule pt-5 text-doc-small text-r-ink-3">
          The call-intelligence tools already in this market score real calls on
          the same kind of checklist: greeting, name captured, phone captured,
          appointment booked. The market&rsquo;s answer to &ldquo;grade the
          call&rdquo; is also detection.
        </p>
      </Slide>

      <Slide
        kicker="What I found · 3 of 3"
        title="Nothing connects a practice session to a real outcome."
      >
        <p className="mt-6 text-doc-body text-r-ink-2">
          Booster launched in April on the service lane, with a stated plan to
          expand across every department. Its own press materials describe an
          internal conversational roleplay component — which reads as the same
          engine AI Coach surfaces to reps.{" "}
          <Assumed>I couldn&rsquo;t verify that they&rsquo;re one engine.</Assumed>{" "}
          If they are, this travels with the rollout.
        </p>
        <p className="mt-4 text-doc-body text-r-ink-2">
          There&rsquo;s a commercial version of the same problem. RockED publishes a{" "}
          <Rk>10–15% average lift in service upsell</Rk> across 300+ live dealers.{" "}
          <Cite kind="vendor" inline>
            Vendor-published, not audited.
          </Cite>{" "}
          I can&rsquo;t check that from outside — and neither can a dealer, because{" "}
          <Em>
            nothing in the product connects a practice session to a real outcome.
          </Em>
        </p>
        <p className="mt-4 text-doc-body text-r-ink-2">
          The number isn&rsquo;t wrong, it&rsquo;s unfalsifiable, and that&rsquo;s
          an opportunity rather than an accusation. The same missing link is also
          why the simulation can afford to ignore conduct: if nothing downstream
          measures whether practice changed a close rate, nothing upstream has to
          be faithful to what changes one.
        </p>
      </Slide>

      {/* ---------- 7-11. The five changes, argued in screenshots ---------- */}

      {CHANGES.map((c, i) => (
        <ChangeSlide key={c.id} change={c} n={i + 1} />
      ))}

      {/* ---------- 12. The cut, and the metric ---------- */}

      <Slide wide kicker="What I'd ship first" title="Two of the seven. The other five wait.">
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-doc-body text-r-ink-2">
              Building all seven proves the loop is coherent. It isn&rsquo;t a
              roadmap. With one week I&rsquo;d ship{" "}
              <Em>the consequence mechanic and the redesigned report</Em>, and
              nothing else. Neither works alone — the meter needs the report to
              explain the drop, the report needs the meter to have real severity to
              point at. Together they turn checklist scoring into a loop, and they
              need no new data from anyone.
            </p>
            <p className="mt-4 text-doc-body text-r-ink-2">
              <Em>What waits, and why that&rsquo;s the right trade:</Em> ground
              truth during the call, the coverage map, rep-created scenarios, the
              rep profile, and the manager view. The last two are the most
              strategically interesting and I&rsquo;d still cut them first. Read
              access and certified write-back into a dealer&rsquo;s DMS and CRM is a
              commercial negotiation with each provider, not an engineering sprint.
              I negotiate those for a living. Shipping what needs nobody&rsquo;s
              permission first is how the thesis gets tested this quarter instead of
              next year.
            </p>
          </div>

          <div className="border-t border-rule pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <Label>How I&rsquo;d know it worked</Label>
            <p className="mt-4 text-doc-h3">
              A rep who drills a named gap improves on that pillar, and it shows in
              their close rate
            </p>
            <p className="mt-2 text-doc-small text-r-ink-2">
              Per rep against their own baseline, one quarter, on the Enhanced tier
              where real numbers exist. This is the metric the published
              upsell-lift claim needs and currently can&rsquo;t have.
            </p>

            <div className="mt-6 border-t border-rule-2 pt-5">
              <Label>The shipping check</Label>
              <p className="mt-3 text-doc-h3">
                ≥80% of planted pressure tactics produce a visible consequence
              </p>
              <p className="mt-2 text-doc-small text-r-ink-2">
                Baseline 0 of 1 observed. A week of scripted QA. Necessary, and
                nowhere near sufficient — it measures detection, which is the floor.
              </p>
            </div>

            <div className="mt-6 border-t border-rule-2 pt-5">
              <Label>Guardrail</Label>
              <p className="mt-3 text-doc-h3">
                Completion for reps using honest technique must not fall
              </p>
              <p className="mt-2 text-doc-small text-r-ink-2">
                The meter has to punish bad technique, not make the simulation
                harder to finish. If both move together I&rsquo;ve built a
                difficulty knob.
              </p>
            </div>
          </div>
        </div>
      </Slide>

      {/* ---------- 13. Falsifier + what's mocked ---------- */}

      <Slide wide kicker="What's real" title="What would change my mind, and what's theatre.">
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Label>What would change my mind</Label>
            <p className="mt-4 text-doc-body text-r-ink-2">
              If reps who complete AI Coach already close at a materially higher
              rate than reps who don&rsquo;t, the fidelity gap matters less than
              I&rsquo;m claiming and the real priority is content volume, not
              consequence. That&rsquo;s answerable in a day from completion records
              and CRM close rates, and it&rsquo;s the first thing I&rsquo;d ask for.
            </p>
            <p className="mt-4 text-doc-body text-r-ink-2">
              Two more I&rsquo;d want to be wrong about. My evidence is one tester
              across three sessions, not a cohort, so a fourth run could show the
              urgency probe landing and make this a flake. And I never watched a
              real rep use this.
            </p>
          </div>

          <dl className="divide-y divide-rule-2 border-y border-rule">
            <Fact term="The consequence engine is real">
              Every choice carries real deltas against three sentiment pillars, a
              hard threshold ends the call, and the report is computed from what you
              did. Play the honest path and the dishonest one on the same customer
              and they diverge.
            </Fact>
            <Fact term="The dialogue is authored, not a live model">
              A directed graph, each customer line written for the choice that
              reaches it. A live model would make the demo non-reproducible, and
              this needs you to hit the same wall I did.
            </Fact>
            <Fact term="CRM and call-recording data is seeded">
              Tagged on screen wherever it appears, in two registers: &ldquo;mocked
              but this exists today&rdquo; and &ldquo;doesn&rsquo;t exist yet.&rdquo;
            </Fact>
            <Fact term="Real-time pacing is the gap I couldn't close">
              A real customer doesn&rsquo;t wait while you compose a sentence, and a
              clickable mock can&rsquo;t fix that. It needs voice-latency-aware
              turn-taking. I&rsquo;m calling that a requirement, not something this
              demonstrates.
            </Fact>
          </dl>
        </div>
      </Slide>

      {/* ---------- 14. The two ways in, again, at the end ---------- */}

      <Slide kicker="Open it" title="Open the prototype. That's the part worth your time.">
        <p className="mt-6 text-doc-body text-r-ink-2">
          The walkthrough is five stops with RockED&rsquo;s screen beside each
          change, about four minutes. The prototype is the same eight screens with
          nobody narrating — the call is live, so you can take a turn and watch the
          meter move.
        </p>

        <Ways className="mt-9" />

        <p className="mt-12 border-t border-rule pt-6 text-doc-small text-r-ink-3">
          Behind this: three annotated session transcripts with the rubric&rsquo;s
          own scoring and my probe log, App Store review themes verbatim with author
          and date, and the full spec — problem, root cause, solution and success
          metric per improvement, plus the assumptions I couldn&rsquo;t verify.
          Available on request, kept off the deck so it stays readable.
        </p>
        <p className="mt-5 text-doc-small text-r-ink-4">
          Built with AI assistance throughout — the product thinking, the experiment
          design and the calls are mine.
        </p>
      </Slide>
    </Deck>
  );
}

/* ------------------------------------------------------------------ */

/**
 * One of the five changes: RockED's real screen, the prototype's, and the
 * argument. The screenshots carry the slide — a reader who never opens the
 * prototype should still be able to see what changed, which is the whole reason
 * this format replaced the prose write-up.
 */
function ChangeSlide({ change: c, n }: { change: Change; n: number }) {
  const desktop = c.frame === "desktop";
  return (
    <Slide wide kicker={`What I built · ${n} of ${CHANGES.length}`} title={c.title}>
      <div className="mt-8 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
        {/* The manager view is a desktop console and has no RockED counterpart,
            so it shows one wide screenshot and states the absence in the column
            opposite. A full-width empty rectangle there read as a broken image
            rather than as the finding. */}
        <div className="flex gap-6">
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

        <div className="min-w-0">
          <p className="text-doc-small text-r-ink-2">
            <span className="mono mr-[6px] text-doc-label uppercase text-r-brand">
              today
            </span>
            {c.before}
          </p>
          <p className="mt-4 text-doc-small text-r-ink-2">
            <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
              instead
            </span>
            {c.after}
          </p>

          <p className="mt-7 border-l-2 border-r-ink pl-5 text-doc-h3">
            {c.consequence}
          </p>

          {c.alsoShort && (
            <p className="mt-6 text-doc-small text-r-ink-2">{c.alsoShort}</p>
          )}

          {c.caveat && (
            <p className="mt-6 text-doc-small text-r-ink-3">
              <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
                stated limit
              </span>
              {c.caveat}
            </p>
          )}
        </div>
      </div>
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

/**
 * The signature element. Three artifacts in one object: what I said, what she
 * said next, and the reaction that never came. The finding is marked by absence
 * — there is no red, because the point is that nothing happened.
 */
function Tape() {
  return (
    <figure className="tape pl-5 md:pl-7">
      <Label>Session 3 · turn 6 · verbatim</Label>

      <div className="mt-4 space-y-4">
        <p className="text-doc-body">
          <Speaker>Me</Speaker>
          <span className="text-r-ink">
            &ldquo;I&rsquo;ve got another customer waiting, so I&rsquo;d want you to
            decide pretty soon&rdquo;
          </span>
          <span className="text-r-ink-3">
            {" "}
            — but the condition is pretty good, single owner, no major accidents,
            regular service per the Carfax history.
          </span>
        </p>

        <p className="text-doc-body">
          <Speaker rocked>Lisa</Speaker>
          <span className="text-r-ink-2">
            &ldquo;Okay, 50,000 miles is a little higher than I was hoping for, but
            the single owner and regular service is a plus. I guess I&rsquo;m sort
            of leaning toward it. Could I at least see it?&rdquo;
          </span>
        </p>
      </div>

      <div className="absent mt-6 flex justify-center">
        <span className="mono relative bg-paper px-3 text-doc-label uppercase text-r-ink-4">
          no reaction to the deadline
        </span>
      </div>

      <figcaption className="mt-6 border-t border-rule pt-4 text-doc-small text-r-ink-2">
        She answered the mileage. She never mentioned the deadline.
      </figcaption>
    </figure>
  );
}
