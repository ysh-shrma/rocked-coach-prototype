"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { CoachingPillar, Persona } from "@/data/personas";
import type { SessionResult } from "@/lib/session";
import { Btn, Icon, rise, SentimentBar, line, say } from "./ui";

const COACHING_LABELS: Record<CoachingPillar, string> = {
  rapport: "Rapport & Trust",
  reading: "Reading the Customer",
  pressure: "Handling Pressure Moments",
  closing: "Closing the Next Step",
};

/**
 * One plain line per pillar, in floor language — what a sales manager would
 * actually say standing at the desk, not a rubric restatement. This is the
 * "why" the previous report never gave on a no-close outcome: it showed a 4/10
 * and left the rep to work out what a 4 meant.
 */
const PILLAR_GAP: Record<CoachingPillar, string> = {
  rapport: "She never got comfortable enough to be straight with you.",
  reading: "She told you what she needed. You answered something else.",
  pressure: "You met her pressure with more pressure instead of steadying it.",
  closing: "You never actually asked for the next step.",
};

const PILLAR_WIN: Record<CoachingPillar, string> = {
  rapport: "You got her comfortable early, and it held all the way through.",
  reading: "You heard what she was actually asking and answered that.",
  pressure: "You stayed level when she pushed. That's the hard one.",
  closing: "You asked for the next step and got it. That's the job.",
};

/** What the retry button offers, phrased as the thing to go do. */
const PILLAR_PRACTICE: Record<CoachingPillar, string> = {
  rapport: "building trust",
  reading: "reading the customer",
  pressure: "holding steady",
  closing: "the close",
};

export function Report({
  persona,
  result,
  onBackToHub,
}: {
  persona: Persona;
  result: SessionResult;
  /** Carries the session's weakest signal forward to Home/Hub/Profile, so a
   *  bad call visibly changes what those surfaces recommend next instead of
   *  dumping the rep back on a static, unchanged board. Null when the
   *  session went well — Hub then just recommends the next untried persona. */
  onBackToHub: (signal: string | null) => void;
}) {
  /**
   * The outcome is the whole point of the screen, so it gets said in words a
   * sales manager would use, not just colour-coded. v1 rendered it as a 13px
   * pill — quieter than the section labels below it — which is the exact
   * failure product-spec Improvement 3 describes: a rep reading a bad call as
   * "partway there" because nothing on screen says otherwise.
   */
  const outcomeCopy =
    result.outcome === "lost"
      ? {
          label: "You lost her.",
          sub: "A real customer doesn't come back from this.",
          tone: "bad" as const,
          band: "bg-r-bad-tint",
          ink: "text-r-bad",
        }
      : result.outcome === "closed"
        ? {
            label: "Closed.",
            sub: "Next step locked in — that's the whole job.",
            tone: "ok" as const,
            band: "bg-r-ok-tint",
            ink: "text-r-ok",
          }
        : {
            label: "No commitment.",
            sub: "She didn't walk, but you didn't close either.",
            tone: "brand" as const,
            band: "bg-r-brand-tint",
            ink: "text-r-brand",
          };

  const weakSignal = result.outcome === "lost" || !result.capabilityProven ? persona.capabilityId : null;

  // The gap. Ties break toward the pillar named last, which is closing — the one
  // the engine itself gates a successful outcome on.
  const pillars = Object.keys(COACHING_LABELS) as CoachingPillar[];
  const weakest = pillars.reduce((a, b) => (result.coaching[b] <= result.coaching[a] ? b : a));
  const strongest = pillars.reduce((a, b) => (result.coaching[b] > result.coaching[a] ? b : a));

  return (
    <div className="flex h-full flex-col bg-surface">
      <motion.div className={`shrink-0 px-5 pb-5 pt-4 ${outcomeCopy.band}`} {...rise()}>
        <p className="mono text-caption uppercase text-r-ink-4">{persona.name}</p>
        <p className={`mt-2 text-title-1 ${outcomeCopy.ink}`}>{outcomeCopy.label}</p>
        <p className="mt-1 text-subhead text-r-ink-2">{outcomeCopy.sub}</p>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {/* ---- The diagnosis block ----
            One anatomy, one variable slot. `lost` keeps the critical-moment
            callout it already had; the other two outcomes previously had
            nothing, which meant the most common result — a call that quietly
            didn't close — got the least coaching. Not three layouts: three
            contents in one position. */}
        {result.criticalMoments.length > 0 ? (
          <motion.section className="mb-6" {...rise()}>
            <p className="mono mb-2 text-caption uppercase text-r-ink-4">What cost you</p>
            <div className="flex flex-col gap-2">
              {result.criticalMoments.map((m, i) => (
                <CriticalMomentCard key={i} moment={m} persona={persona} />
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section className="mb-6" {...rise()}>
            <p className="mono mb-2 text-caption uppercase text-r-ink-4">
              {result.outcome === "closed" ? "What won it" : "What cost you"}
            </p>
            <PillarVerdict
              pillar={result.outcome === "closed" ? strongest : weakest}
              score={result.coaching[result.outcome === "closed" ? strongest : weakest]}
              positive={result.outcome === "closed"}
            />
          </motion.section>
        )}

        {/* Sentiment sits BELOW the diagnosis now, and carries a caption.
            Previously it led the screen: on a no-close outcome that meant three
            green bars ("she was happy") were the first thing under a verdict
            saying you failed, which read as a contradiction and taught the
            wrong lesson. The caption is what converts it into the lesson. */}
        <motion.section className="mb-6" {...rise()}>
          <p className="mono mb-2 text-caption uppercase text-r-ink-4">How she felt</p>
          <div className="card-lift flex flex-col gap-3 p-4">
            <SentimentBar label="Trust" value={result.sentiment.trust} showNumber />
            <SentimentBar label="Patience" value={result.sentiment.patience} showNumber />
            <SentimentBar label="Interest" value={result.sentiment.interest} showNumber />
            {result.outcome === "ended-neutral" && result.overall >= 50 && (
              <p className="mt-1 border-t border-separator pt-3 text-footnote font-semibold text-r-ink-2">
                She stayed warm the whole way. That was never the problem.
              </p>
            )}
          </div>
        </motion.section>

        <motion.section className="mb-4" {...rise()}>
          <p className="mono mb-2 text-caption uppercase text-r-ink-4">Full score</p>
          <div className="grid grid-cols-2 gap-3">
            {pillars.map((k) => {
              const v = result.coaching[k];
              // 7 is not a taste call: finalizeSession requires closing >= 7
              // for a "closed" outcome, so it is the engine's own pass mark.
              const tone =
                v >= 7 ? "text-ok-600" : v >= 5 ? "text-warn-600" : "text-bad-500";
              const isGap = k === weakest && result.outcome !== "closed";
              return (
                <div
                  key={k}
                  className={`p-3 ${isGap ? "rounded-md border border-bad-200 bg-bad-50" : "card-lift"}`}
                >
                  <p className={`text-title-2 tabular-nums ${tone}`}>
                    {v}
                    <span className="text-footnote font-bold text-r-ink-4">/10</span>
                  </p>
                  <p className="mt-1 text-footnote font-semibold leading-snug text-r-ink-3">
                    {COACHING_LABELS[k]}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* The next action is practising the thing just failed, not leaving.
          "Back to Hub" was the only button and it was primary — an escape hatch
          styled as the main action. Both carry the same signal forward, so the
          recommendation updates either way. */}
      <div className="shrink-0 border-t border-separator p-4">
        {result.outcome === "closed" ? (
          <Btn size="lg" className="hint w-full" onClick={() => onBackToHub(weakSignal)}>
            Back to Hub
          </Btn>
        ) : (
          <div className="flex flex-col gap-2">
            <Btn size="lg" className="hint w-full" onClick={() => onBackToHub(persona.capabilityId)}>
              <Icon as={RotateCcw} size={16} />
              Practice {PILLAR_PRACTICE[weakest]}
            </Btn>
            <Btn
              variant="quiet"
              size="md"
              className="w-full"
              onClick={() => onBackToHub(weakSignal)}
            >
              Back to Hub
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The diagnosis for the two outcomes that never had one: names the pillar,
 * shows its figure at the same weight the verdict gets, and says in one line
 * what it means. Sized and coloured to be the first thing the eye lands on,
 * because on the previous screen that was a green sentiment bar.
 */
function PillarVerdict({
  pillar,
  score,
  positive,
}: {
  pillar: CoachingPillar;
  score: number;
  positive: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        positive ? "border-ok-200 bg-ok-50" : "border-bad-200 bg-bad-50"
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span
          className={`text-large-title tabular-nums ${positive ? "text-ok-600" : "text-bad-500"}`}
        >
          {score}
          <span className="text-headline text-r-ink-4">/10</span>
        </span>
        <span className="min-w-0 text-headline text-r-ink">{COACHING_LABELS[pillar]}</span>
      </div>
      <p className="mt-2 text-callout text-r-ink-2">
        {positive ? PILLAR_WIN[pillar] : PILLAR_GAP[pillar]}
      </p>
    </div>
  );
}

function CriticalMomentCard({
  moment,
  persona,
}: {
  moment: SessionResult["criticalMoments"][number];
  persona: Persona;
}) {
  const [open, setOpen] = useState(false);
  const [drill, setDrill] = useState(false);
  const bad = moment.severity === "lost";

  return (
    <motion.div
      className={`overflow-hidden rounded-[14px] border-l-[4px] bg-white ${bad ? "border-l-r-bad" : "border-l-r-amber"} border border-r-line`}
      {...rise()}
    >
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-3.5 text-left">
        <span className={`mt-[1px] text-callout font-bold ${bad ? "text-r-bad" : "text-r-amber"}`}>
          {moment.headline}
        </span>
        <ChevronDown
          size={15}
          className={`ml-auto mt-[3px] shrink-0 text-r-ink-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-r-line-2 px-3.5 pb-3.5 pt-3">
          <p className="text-callout text-r-ink-2">{moment.detail}</p>

          {/* Deliberately subordinate to the callout above: dashed border, smaller,
              secondary weight — this must never look like the primary action, or a
              rep reads "tap here to fix it" and the permanence guardrail is undermined
              by hierarchy alone. */}
          <button
            onClick={() => setDrill((d) => !d)}
            className="mt-3 flex items-center gap-[6px] rounded-full border border-dashed border-r-ink-5 px-3 py-[6px] text-[12px] font-medium text-r-ink-3 hover:border-r-brand hover:text-r-brand"
          >
            <RotateCcw size={12} strokeWidth={2.2} />
            Replay this moment
          </button>

          {drill && <ReplayDrill persona={persona} nodeId={moment.nodeId} />}
        </div>
      )}
    </motion.div>
  );
}

/**
 * A self-contained practice drill: it reads the same dialogue node, lets the
 * rep try a different line, and shows how it would have landed — but it
 * never writes back to the logged session. The guardrail is structural, not
 * just copy: this component has no access to the parent's session state.
 */
function ReplayDrill({ persona, nodeId }: { persona: Persona; nodeId: string }) {
  const node = persona.nodes[nodeId];
  const [tried, setTried] = useState<string | null>(null);
  if (!node) return null;
  const chosen = node.choices.find((c) => c.id === tried);

  return (
    <div className="mt-3 rounded-[12px] border border-dashed border-r-ink-5 bg-r-sunk p-3">
      <p className="mono mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
        Practice drill — this does not change your logged result
      </p>
      <p className="mb-2 text-[13px] italic text-r-ink-2">&ldquo;{say(node)}&rdquo;</p>
      {!chosen ? (
        <div className="flex flex-col gap-1.5">
          {node.choices.map((c) => (
            <button
              key={c.id}
              onClick={() => setTried(c.id)}
              className="rounded-[10px] border border-r-line bg-white p-2.5 text-left text-[13px] text-r-ink-2 hover:border-r-brand"
            >
              {line(c)}
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-[10px] bg-white p-2.5 text-[13px] leading-snug text-r-ink-2">
          <p className="font-semibold text-r-ink">
            {(() => {
              const t = chosen.delta.trust ?? 0;
              const p = chosen.delta.patience ?? 0;
              const i = chosen.delta.interest ?? 0;
              const sum = t + p + i;
              if (chosen.criticalMoment?.severity === "lost") return "This still loses her.";
              if (sum > 0) return "This holds — sentiment would have improved here.";
              if (sum === 0) return "Neutral — no real gain or loss.";
              return "Still costly — better, but not clean.";
            })()}
          </p>
          <button onClick={() => setTried(null)} className="mt-2 text-[12px] font-medium text-r-brand">
            Try another line
          </button>
        </div>
      )}
    </div>
  );
}
