"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import type { CoachingPillar, Persona } from "@/data/personas";
import type { SessionResult } from "@/lib/session";
import { Btn, Mark, rise, SentimentBar, line, say } from "./ui";

const COACHING_LABELS: Record<CoachingPillar, string> = {
  rapport: "Rapport & Trust",
  reading: "Reading the Customer",
  pressure: "Handling Pressure Moments",
  closing: "Closing the Next Step",
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
  const outcomeCopy =
    result.outcome === "lost"
      ? { label: "Lost the customer", tone: "bad" as const }
      : result.outcome === "closed"
        ? { label: "Closed — next step locked in", tone: "ok" as const }
        : { label: "Call ended without a firm next step", tone: "brand" as const };

  const weakSignal = result.outcome === "lost" || !result.capabilityProven ? persona.capabilityId : null;

  return (
    <div className="flex h-full flex-col bg-white">
      <motion.div className="shrink-0 border-b border-r-line px-5 py-4" {...rise(0)}>
        <p className="mono text-[11px] font-semibold uppercase tracking-[0.09em] text-r-ink-4">
          {persona.name}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Mark tone={outcomeCopy.tone}>{outcomeCopy.label}</Mark>
        </div>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        {result.criticalMoments.length > 0 && (
          <motion.section className="mb-6" {...rise(0.05)}>
            <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
              Critical moments
            </p>
            <div className="flex flex-col gap-2">
              {result.criticalMoments.map((m, i) => (
                <CriticalMomentCard key={i} moment={m} persona={persona} delay={0.08 + i * 0.05} />
              ))}
            </div>
          </motion.section>
        )}

        <motion.section className="mb-6" {...rise(0.1)}>
          <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
            Customer sentiment
          </p>
          <div className="card-lift flex flex-col gap-3 p-4">
            <SentimentBar label="Trust" value={result.sentiment.trust} showNumber />
            <SentimentBar label="Patience" value={result.sentiment.patience} showNumber />
            <SentimentBar label="Interest" value={result.sentiment.interest} showNumber />
          </div>
        </motion.section>

        <motion.section className="mb-4" {...rise(0.15)}>
          <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
            Coaching score
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(COACHING_LABELS) as CoachingPillar[]).map((k) => (
              <div key={k} className="card-lift p-3">
                <p className="mono text-[20px] font-extrabold text-r-ink">
                  {result.coaching[k]}
                  <span className="text-[12px] font-medium text-r-ink-4">/10</span>
                </p>
                <p className="mt-1 text-[12px] leading-snug text-r-ink-3">{COACHING_LABELS[k]}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="shrink-0 border-t border-r-line p-4">
        <Btn size="lg" className="w-full" onClick={() => onBackToHub(weakSignal)}>
          Back to Hub
        </Btn>
      </div>
    </div>
  );
}

function CriticalMomentCard({
  moment,
  persona,
  delay,
}: {
  moment: SessionResult["criticalMoments"][number];
  persona: Persona;
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  const [drill, setDrill] = useState(false);
  const bad = moment.severity === "lost";

  return (
    <motion.div
      className={`overflow-hidden rounded-[14px] border-l-[4px] bg-white ${bad ? "border-l-r-bad" : "border-l-r-amber"} border border-r-line`}
      {...rise(delay)}
    >
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-start gap-3 p-3.5 text-left">
        <span className={`mt-[2px] text-[13px] font-semibold ${bad ? "text-r-bad" : "text-r-amber"}`}>
          {moment.headline}
        </span>
        <ChevronDown
          size={15}
          className={`ml-auto mt-[3px] shrink-0 text-r-ink-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-r-line-2 px-3.5 pb-3.5 pt-3">
          <p className="text-[13.5px] leading-relaxed text-r-ink-2">{moment.detail}</p>

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
