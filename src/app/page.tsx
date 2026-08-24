import Link from "next/link";
import { PROBES, CHANGES } from "@/components/tour/changes";

/**
 * The submission's landing page. This is the URL that gets sent.
 *
 * Written for four readers in a known order: Kashish (HRBP — screens it and
 * decides whether to spend a CPO's attention), then a CPO, a Head of
 * Engineering, possibly CXO leadership. So the page has one spine that reads in
 * about a minute and three drill-downs underneath, and everything above the fold
 * exists to make forwarding feel safe.
 *
 * Two rules held throughout:
 *
 * 1. Every number is labelled first-party, App Store verbatim, or
 *    vendor-published. Passing a vendor's own number off as audited is the
 *    fastest way to lose this audience. No dealership statistic appears that
 *    isn't sourced.
 * 2. Tone is "help your flagship succeed at the scale you're already committed
 *    to", never "you missed something". The finding is sharp; the register isn't
 *    prosecutorial.
 */

export default function SubmissionPage() {
  return (
    <div className="doc min-h-screen">
      <main className="mx-auto max-w-[760px] px-6 pb-24 pt-10 md:px-8 md:pt-14">
        <Eyebrow>RockED · Product Manager take-home · Yash Sharma</Eyebrow>

        {/* ---------- Above the fold: the tape, the claim, what exists ---------- */}

        <Tape />

        <h1 className="display mt-10 text-doc-hero">
          A rep can practise the one move that kills deals — and the scorecard
          says he did fine.
        </h1>

        {/* The locked storyline sentence — the thesis for all seven improvements
            rather than for the one turn above it. Kept to two sentences: the
            headline runs three lines, and the buttons have to stay above a
            1440x900 fold, which is the only job this screenful has. The method
            line moved to the section below, where it was already the subject, and
            the "help your flagship succeed" framing moved to the end of "why it
            matters now" where it lands better anyway. */}
        <p className="mt-6 text-doc-body text-r-ink-2">
          <span className="text-r-ink">
            AI Coach rewards saying the right words over reading the right
            signals.
          </span>{" "}
          I rebuilt the practice loop so a call can actually be lost — eight
          screens, working consequence engine, clickable.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/tour"
            className="rounded-full bg-r-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
          >
            Walk me through it &rarr;
          </Link>
          <Link
            href="/prototype"
            className="rounded-full border border-rule px-6 py-3 text-[15px] font-semibold text-r-ink-2 transition-colors hover:border-r-ink-4"
          >
            Just let me click around
          </Link>
        </div>

        <Rule />

        {/* ---------- The credibility unlock, before any solution ---------- */}

        <Section
          kicker="How I found it"
          title="I ran the same call three times and planted five anomalies in the third."
        >
          <p>
            Not a UX read of the screens — a test of whether the simulated
            customer reacts to what a rep actually does. Same scenario three
            times, five deliberate anomalies in the third, and I logged her
            response to each one.
          </p>

          <ol className="mt-7 divide-y divide-rule-2 border-y border-rule">
            {PROBES.map((p, i) => (
              <li key={p.id} className="flex gap-4 py-4">
                <span className="mono w-5 shrink-0 pt-[3px] text-doc-mono text-r-ink-4">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-doc-body font-semibold">{p.probe}</span>
                  <span className="mt-1 block text-doc-small text-r-ink-2">
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

          <p className="mt-7">
            Four of five landed, and they landed precisely — she corrects a model,
            catches a contradicted price, asks for recall documentation. The
            simulation is <Em>factually reactive and tactically inert.</Em> It
            tracks claims and ignores conduct.
          </p>
          <p className="mt-4">
            Which is the wrong half to get right. A rep who quotes a wrong price
            gets corrected by the customer in the next sentence. A rep who leans
            on a manufactured deadline gets a deal that quietly dies weeks later,
            and never learns why.
          </p>
          <Cite kind="first-party">
            Three sessions run 21–22 August 2026, scored 17/30, 24/30 and 14/30 by
            RockED&rsquo;s own rubric. Scoped to the sales department throughout —
            these are sales-floor scenarios, not service or parts.
          </Cite>
        </Section>

        {/* ---------- The reframe. Detection is not coaching. ---------- */}

        <Section
          kicker="Why a better simulation isn't the fix"
          title="Catching the lie is the floor, not the ceiling."
        >
          <p>
            The obvious read of the table above is &ldquo;make the customer
            smarter.&rdquo; I don&rsquo;t think that&rsquo;s the work.{" "}
            <Em>
              Four of my five anomalies were caught, and it still didn&rsquo;t
              make me a better rep.
            </Em>{" "}
            She corrected the model and questioned the recall, I got a 14/30, and
            I walked away knowing I&rsquo;d been marked down without knowing what
            to do differently on the next call.
          </p>
          <p className="mt-4">
            Detection is a compliance function. A dealership doesn&rsquo;t have a
            lying problem, it has a closing problem — and a tool whose job is
            telling a rep he fibbed is a referee, which the desk manager already
            does in person for free. Coaching has to do three things a referee
            doesn&rsquo;t: say what to do instead, make the rep drill that exact
            thing, and show whether it moved on the floor.
          </p>
          <p className="mt-4">
            That&rsquo;s the shape of everything below.{" "}
            <Em>Diagnose, prescribe, drill, verify.</Em> The report names the one
            thing that cost the call and offers the drill for it, the coverage map
            makes the next session deliberate instead of a repeat, and the profile
            and manager view check it against what actually happened on the floor.
            Not five features — one loop, which is why a smarter customer on her
            own wouldn&rsquo;t close it.
          </p>
        </Section>

        {/* ---------- CPO layer: why this, why now ---------- */}

        <Section
          kicker="Why it matters now"
          title="This isn't a side feature. It's the engine you're scaling."
        >
          <p>
            Booster launched in April on the service lane, and the stated plan is
            to expand across every department. Its own press materials describe an
            internal conversational roleplay component — which reads as the same
            engine AI Coach surfaces to reps.{" "}
            <Assumed>
              I couldn&rsquo;t verify they&rsquo;re one engine, so I&rsquo;m
              treating it as an assumption rather than a fact.
            </Assumed>{" "}
            If they are, this travels with the rollout.
          </p>
          <p className="mt-4">
            There&rsquo;s a commercial version of the same problem. RockED
            publishes a <Rk>10–15% average lift in service upsell</Rk> across 300+
            live dealers.{" "}
            <Cite kind="vendor" inline>
              Vendor-published, not audited.
            </Cite>{" "}
            I can&rsquo;t check that from outside — and neither can a dealer,
            because{" "}
            <Em>nothing in the product connects a practice session to a real outcome.</Em>
          </p>
          <p className="mt-4">
            That&rsquo;s the opportunity, not an accusation. The number
            isn&rsquo;t wrong; it&rsquo;s currently unfalsifiable. And the same
            missing link is why the simulation can afford to ignore conduct in the
            first place — if nothing downstream measures whether practice changed
            a close rate, nothing upstream has to be faithful to what changes one.
            Close the link and the claim becomes defensible to a procurement team.
          </p>
          <p className="mt-4">
            All of which is to say: this is about helping the engine you&rsquo;re
            already scaling earn the trust it&rsquo;s meant to build.
          </p>
        </Section>

        {/* ---------- The integration. Mike's answer: this is the only part a GM
                      actually buys. ---------- */}

        <Section
          kicker="What closes the link"
          title="The CRM and the phone system, in two independent layers."
        >
          <p>
            This is the part I&rsquo;d want to build most, and it&rsquo;s
            deliberately structured so it isn&rsquo;t a dependency.
          </p>

          <dl className="mt-7 divide-y divide-rule-2 border-y border-rule">
            <Fact term="Base — every dealership, day one">
              The rep profile is built from in-app practice alone: which pillars
              run low, which customers get avoided, which mistakes recur. No
              integration, no data agreement, nothing to negotiate. This is what
              makes the loop work for a store that will never connect anything.
            </Fact>
            <Fact term="Enhanced — where the CRM and the calling system are connected">
              The rep&rsquo;s real close and upsell numbers, and their actual
              recorded calls, mapped onto the same profile. Now &ldquo;practise
              holding price&rdquo; isn&rsquo;t a guess from a practice score — it
              comes from the three real calls last month where he dropped the
              price inside four minutes.
            </Fact>
          </dl>

          <p className="mt-7">
            <Em>Two layers, not a fallback.</Em> That distinction matters more
            than it looks: a product that needs integrations to be useful sells
            against every dealer&rsquo;s worst IT memory, and one that works
            standalone and compounds with integration doesn&rsquo;t. The second is
            also the only version a GM has a reason to care about — practice is a
            cost centre until someone can show the rep who did the practice closed
            more deals.
          </p>
          <p className="mt-4">
            It&rsquo;s also the honest reason this sits at the bottom of my
            ranking rather than the top. Read access and certified write-back into
            a dealer&rsquo;s DMS and CRM is a commercial negotiation with each
            provider, not an engineering sprint — so I&rsquo;d ship the parts that
            need nobody&rsquo;s permission first and earn the right to ask.
          </p>
        </Section>

        {/* ---------- The vision, and the way in ---------- */}

        <Section
          kicker="What it looks like when it works"
          title="Seven improvements. Five of them carry the argument."
        >
          <p>
            The spec has seven. The walkthrough covers the five that make the loop
            legible, one at a time, with RockED&rsquo;s current screen beside each
            one.
          </p>
          <ol className="mt-7 space-y-4">
            {CHANGES.map((c, i) => (
              <li key={c.id} className="flex gap-4">
                <span className="mono w-5 shrink-0 pt-[2px] text-doc-mono text-r-ink-4">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-doc-body font-semibold">{c.title}</span>
                  <span className="mt-[2px] block text-doc-small text-r-ink-2">
                    {c.consequence}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-7">
            The other two are built and clickable, they just don&rsquo;t need
            their own stop on the tour.{" "}
            <Em>Ground truth during the call</Em> — a rep answering &ldquo;is it
            in stock, what does it cost&rdquo; from memory when a real rep has an
            inventory screen open, which rewards sounding confident over being
            right. And <Em>rep-created scenarios</Em> — the rep describes what
            he&rsquo;s stuck on in his own words and practises that, instead of
            picking from a fixed list.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/tour"
              className="rounded-full bg-r-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
            >
              Walk the five &rarr;
            </Link>
            <Link
              href="/prototype"
              className="text-[15px] font-semibold text-r-ink-3 underline decoration-rule underline-offset-4 transition-colors hover:text-r-ink"
            >
              or explore it unguided
            </Link>
          </div>
        </Section>

        {/* ---------- The cut, immediately after the vision ---------- */}

        <Section
          kicker="What I'd ship first"
          title="Two of the seven. The other five wait."
        >
          <p>
            Building all seven proves the loop is coherent. It isn&rsquo;t a
            roadmap. With one week I&rsquo;d ship{" "}
            <Em>the consequence mechanic and the redesigned report</Em> — and
            nothing else.
          </p>
          <p className="mt-4">
            Those two are the whole thesis: a call that can be lost, and a report
            that names what lost it and hands over the drill. Neither works alone.
            The meter needs the report to explain the drop; the report needs the
            meter to have real severity to point at. Together they turn checklist
            scoring into a loop, and they need no new data from anyone.
          </p>
          <p className="mt-4">
            <Em>What waits, and why that&rsquo;s the right trade:</Em> ground
            truth during the call, the coverage map, rep-created scenarios, the
            rep profile, and the manager view. The last two are the most
            strategically interesting and I&rsquo;d still cut them first — they
            depend on the CRM and telephony access described above, which is a
            negotiation rather than a sprint. Shipping what needs nobody&rsquo;s
            permission first is how the thesis gets tested this quarter instead of
            next year.
          </p>
        </Section>

        {/* ---------- Metric, in two tiers, matching floor and ceiling ---------- */}

        <Section
          kicker="How I'd know it worked"
          title="One number that proves the mechanism, one that proves the point."
        >
          <div className="mt-2 border-y border-rule py-6">
            <Label>The real one — did behaviour change</Label>
            <p className="mt-3 text-doc-h3">
              A rep who drills a named gap improves on that pillar, and it shows
              in their close rate
            </p>
            <p className="mt-2 text-doc-small text-r-ink-2">
              Measured per rep against their own baseline, one quarter, on the
              Enhanced tier where real numbers exist. This is the metric the
              published upsell-lift claim needs and currently can&rsquo;t have. If
              this doesn&rsquo;t move, the loop is theatre no matter how good the
              simulation gets.
            </p>

            <div className="mt-6 border-t border-rule-2 pt-6">
              <Label>The shipping check — did the mechanism work at all</Label>
              <p className="mt-3 text-doc-h3">
                ≥80% of planted pressure tactics produce a visible consequence
              </p>
              <p className="mt-2 text-doc-small text-r-ink-2">
                Baseline 0 of 1 observed. A week of scripted QA — seed 20 probes
                across the persona set, count the ones that move sentiment or end
                the call. Necessary, and nowhere near sufficient: it measures
                detection, which is the floor.
              </p>
            </div>

            <div className="mt-6 border-t border-rule-2 pt-6">
              <Label>Guardrail</Label>
              <p className="mt-3 text-doc-h3">
                Completion for reps using honest technique must not fall
              </p>
              <p className="mt-2 text-doc-small text-r-ink-2">
                The meter has to punish bad technique, not make the simulation
                harder to finish. If both move together I&rsquo;ve built a
                difficulty knob — and a rep punished for playing it straight stops
                playing.
              </p>
            </div>
          </div>
        </Section>

        {/* ---------- Falsifier ---------- */}

        <Section
          kicker="What would change my mind"
          title="One check, against data you already have."
        >
          <p>
            If reps who complete AI Coach already close at a materially higher
            rate than reps who don&rsquo;t, then the fidelity gap matters less
            than I&rsquo;m claiming and the real priority is content volume, not
            consequence. That&rsquo;s answerable in a day from completion records
            and CRM close rates — and it&rsquo;s the first thing I&rsquo;d ask
            for.
          </p>
          <p className="mt-4">
            Two more I&rsquo;d want to be wrong about. My evidence is one tester
            across three sessions, not a cohort — a fourth session could show the
            urgency probe landing and make this a flake rather than a pattern. And
            I never watched a real service advisor use this; the personas and
            coaching language came from a dealership GM&rsquo;s read, which is a
            proxy for the floor, not the floor.
          </p>
        </Section>

        {/* ---------- Engineering layer ---------- */}

        <Section
          kicker="What's real and what's mocked"
          title="So nobody has to guess which parts are theatre."
        >
          <dl className="mt-2 divide-y divide-rule-2 border-y border-rule">
            <Fact term="The consequence engine is real">
              Every choice carries actual deltas against three sentiment pillars.
              There&rsquo;s a hard threshold that ends the call, critical moments
              are logged rather than narrated afterwards, and the report is
              computed from what you did. Play the honest path and the dishonest
              path on the same customer and they diverge.
            </Fact>
            <Fact term="The replay drill can't undo a result">
              The report offers a retry of the exact moment that cost the call,
              because the minute afterwards is when the lesson is hottest. It
              never rewrites what happened — the sentiment drop, the ending and
              the score stay logged, and the drill has no access to the session
              state. If a replay could quietly reset the outcome, &ldquo;instant
              replay&rdquo; becomes a soft-reset button and the consequence
              mechanic is undone by hierarchy alone.
            </Fact>
            <Fact term="The dialogue is authored, not a live model">
              A directed graph — each customer line written for the specific
              choice that reaches it. Deliberate: a live model would make the demo
              non-reproducible, and the one thing this submission needs is for you
              to hit the same wall I did.
            </Fact>
            <Fact term="CRM and call-recording data is seeded">
              Tagged on screen wherever it appears, in two registers — one for
              &ldquo;mocked but this exists today,&rdquo; one for
              &ldquo;doesn&rsquo;t exist yet.&rdquo; Conflating those would be its
              own honesty problem. The prototype&rsquo;s presenter controls let you
              switch between the practice-only and connected views.
            </Fact>
            <Fact term="Real-time pacing is the gap I couldn't close">
              A real customer doesn&rsquo;t wait while you compose a sentence.
              Today&rsquo;s push-to-talk gives a rep unlimited think time, and a
              clickable mock can&rsquo;t fix that. It needs voice-latency-aware
              turn-taking, and I&rsquo;m calling it a requirement rather than
              pretending the prototype demonstrates it.
            </Fact>
            <Fact term="Scope is the sales department">
              Personas, capabilities and coaching language are all sales-floor.
              The loop should generalise to service and parts — that&rsquo;s the
              Booster argument — but I didn&rsquo;t design those and I&rsquo;m not
              claiming them.
            </Fact>
          </dl>
        </Section>

        {/* ---------- Appendix ---------- */}

        <Section kicker="Working notes" title="Everything the argument stands on.">
          <p className="text-doc-small text-r-ink-2">
            Three annotated session transcripts with the rubric&rsquo;s own scoring
            and my probe log. App Store review themes, verbatim with author and
            date — seven of them, including two that cover this ground from a real
            user&rsquo;s side. The full spec: problem, root cause, solution and
            success metric per improvement, plus the assumptions I couldn&rsquo;t
            verify. Available on request or in the repo — kept off this page so it
            stays readable.
          </p>
          <p className="mt-8 text-doc-small text-r-ink-4">
            Built with AI assistance throughout — the product thinking, the
            experiment design and the calls are mine. Prototype runs on Next.js;
            the design system, the copy budget and the honesty rules are documented
            in the repo.
          </p>
        </Section>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The signature element. Three artifacts in one object: what I said, what she
 * said next, and what the grader wrote about it. The finding is marked by absence
 * — there is no red, because the point is that nothing happened.
 */
function Tape() {
  return (
    <figure className="tape mt-8 pl-5 md:pl-7">
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
            the single owner and regular service is a plus. I guess I&rsquo;m sort of
            leaning toward it. Could I at least see it?&rdquo;
          </span>
        </p>
      </div>

      <div className="absent mt-6 flex justify-center">
        <span className="mono relative bg-paper px-3 text-doc-label uppercase text-r-ink-4">
          no reaction to the deadline
        </span>
      </div>

      <figcaption className="mt-6 border-t border-rule pt-4">
        <p className="text-doc-small text-r-ink-2">
          She answered the mileage. She never mentioned the deadline. Then the
          scorecard graded the turn:
        </p>
        <p className="mono mt-3 text-doc-mono text-r-brand">
          Closing 3/10 — &ldquo;No commitment or next steps secured; created
          pressure via &lsquo;another customer waiting&rsquo; but didn&rsquo;t
          confirm contact details.&rdquo;
        </p>
        <p className="mt-3 text-doc-small text-r-ink-2">
          The grader saw the tactic. It listed it as something I did, and took the
          points off for not collecting a phone number.
        </p>
      </figcaption>
    </figure>
  );
}

function Speaker({ children, rocked }: { children: React.ReactNode; rocked?: boolean }) {
  return (
    <span
      className={`mono mr-2 text-doc-label uppercase ${
        rocked ? "text-r-brand" : "text-r-ink-4"
      }`}
    >
      {children}
    </span>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <Label>{kicker}</Label>
      <h2 className="display mt-3 text-doc-h2">{title}</h2>
      <div className="mt-5 text-doc-body text-r-ink-2">{children}</div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mono text-doc-label uppercase text-r-ink-4">{children}</p>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mono text-doc-label uppercase text-r-ink-4">{children}</p>;
}

function Rule() {
  return <hr className="mt-14 border-rule" />;
}

/** Emphasis in the author's own voice — ink, never purple. */
function Em({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-r-ink">{children}</strong>;
}

/** Something that belongs to RockED. The only place purple is allowed. */
function Rk({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-r-brand">{children}</span>;
}

function Assumed({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-r-ink-3">
      <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
        assumption
      </span>
      {children}
    </span>
  );
}

function Cite({
  kind,
  inline,
  children,
}: {
  kind: "first-party" | "vendor" | "app-store";
  inline?: boolean;
  children: React.ReactNode;
}) {
  const label =
    kind === "first-party"
      ? "first-party"
      : kind === "vendor"
        ? "vendor-published"
        : "app store, verbatim";
  const body = (
    <>
      <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
        {label}
      </span>
      <span className="text-r-ink-3">{children}</span>
    </>
  );
  if (inline) return <span className="text-doc-small">{body}</span>;
  return <p className="mt-6 text-doc-small">{body}</p>;
}

function Fact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="py-5">
      <dt className="text-doc-body font-semibold text-r-ink">{term}</dt>
      <dd className="mt-2 text-doc-small text-r-ink-2">{children}</dd>
    </div>
  );
}
