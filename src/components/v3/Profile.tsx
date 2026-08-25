"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { capabilityById, type CoachingPillar, type Persona } from "@/data/personas";
import { currentRep } from "@/data/reps";
import { COACHING_PILLAR_LABELS, summarizePerformance, type SessionResult } from "@/lib/session";
import { DemoDataTag, RoadmapTag, TrendChart, cap, rise } from "./ui";

export function Profile({
  personas,
  results,
  nextCapabilityId,
  seedIsProvisional,
  crmIntegrated,
  onBack,
  onPracticeNow,
}: {
  personas: Persona[];
  results: Record<string, SessionResult>;
  nextCapabilityId: string | null;
  /** True when nextCapabilityId came from onboarding and no real session has
   *  overwritten it yet — shown honestly, not presented as earned data. */
  seedIsProvisional: boolean;
  crmIntegrated: boolean;
  onBack: () => void;
  onPracticeNow: () => void;
}) {
  const rep = currentRep();
  // Shared with Home's performance card via summarizePerformance — the same
  // fix that once caught Profile and Manager showing different numbers for
  // the same rep, applied so Home and Profile can't drift apart either.
  const performance = summarizePerformance(results, rep, crmIntegrated);
  const has = performance.state === "practice";
  const avg = performance.avgPillars;
  const lowestPillar = performance.weakestPillar;
  const avoided = personas.filter((p) => !results[p.id]);
  const nextPersona = personas.find((p) => p.capabilityId === nextCapabilityId);
  const nextCap = nextCapabilityId ? capabilityById(nextCapabilityId) : null;
  const topMoment = rep.flaggedMoments[0];

  return (
    <div className="flex h-full flex-col bg-white">
      <motion.div className="flex shrink-0 items-center gap-3 border-b border-r-line px-4 py-3" {...rise(0)}>
        <button onClick={onBack} className="text-r-ink-3">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <p className="text-title-3 text-r-ink">Your profile</p>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <motion.section className="mb-6" {...rise(0.05)}>
          <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
            From your practice
          </p>
          {!has ? (
            <div className="card-lift p-4">
              {nextCap ? (
                <>
                  {seedIsProvisional && <RoadmapTag>Starting point, not earned yet</RoadmapTag>}
                  <p className="mt-2 text-[13.5px] leading-relaxed text-r-ink-2">
                    Based on your setup tag, we're starting you on{" "}
                    <span className="font-semibold text-r-ink">{cap(nextCap)}</span>. This updates the moment
                    you complete a real session.
                  </p>
                </>
              ) : (
                <p className="text-[13px] text-r-ink-3">
                  Run a practice call and this fills in — always available, no CRM connection needed.
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(avg!) as CoachingPillar[]).map((k) => (
                  <div key={k} className="card-lift p-3">
                    <p className="mono text-title-2 text-r-ink">
                      {avg![k]}
                      <span className="text-[12px] font-medium text-r-ink-4">/10</span>
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-r-ink-3">{COACHING_PILLAR_LABELS[k]}</p>
                  </div>
                ))}
              </div>
              {/* One line, not three. This screen's job is to be read between
                  ups on a sales floor, and the paragraph that used to sit here
                  restated what the tiles above already say. Mike's ask — give
                  the rep a reason in floor terms, not just a pillar score —
                  survives as the date, which is the part that stings.

                  The date is real-call data, so it's gated: on a practice-only
                  account there is no real call to point at, and naming one would
                  be the same leak the section below used to have. */}
              {lowestPillar && (
                <div className="rounded-[14px] bg-r-amber-tint p-3">
                  <p className="text-[13px] leading-snug text-r-ink-2">
                    Lowest: <span className="font-semibold">{COACHING_PILLAR_LABELS[lowestPillar]}</span>
                    {crmIntegrated && topMoment && (
                      <> — the same gap cost you a real call on {topMoment.realDate}.</>
                    )}
                  </p>
                </div>
              )}
              {avoided.length > 0 && (
                <p className="text-[12.5px] leading-relaxed text-r-ink-3">
                  Not tried yet:{" "}
                  <span className="font-medium text-r-ink-2">{avoided.map((p) => p.name).join(", ")}</span>
                </p>
              )}
            </div>
          )}

          {/* The forward action — Profile shouldn't be a dead end. */}
          {nextPersona && (
            <button
              onClick={onPracticeNow}
              className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-r-brand-line bg-r-brand-tint p-3.5 text-left"
            >
              <span className="min-w-0 flex-1 text-[13.5px] font-semibold text-r-brand">
                Practice {nextPersona.name} now
              </span>
              <ArrowRight size={16} className="shrink-0 text-r-brand" />
            </button>
          )}
        </motion.section>

        {/* The two tiers, and the reason this is gated rather than always on.
            Base is the whole day-one argument: a rooftop with nothing connected
            still gets a profile. This section used to render whatever the account
            was, so switching to practice-only changed nothing on screen and the
            two-tier split read as a slide rather than a build — which is exactly
            the claim the deck spends a slide buying. */}
        {!crmIntegrated ? (
          <motion.section {...rise(0.15)}>
            <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
              From your real calls
            </p>
            <div className="rounded-[14px] border border-dashed border-r-brand-line bg-r-brand-tint/40 p-3.5">
              <RoadmapTag>Not connected</RoadmapTag>
              <p className="mt-2 text-[12.5px] leading-relaxed text-r-ink-2">
                Connect the dealership&apos;s CRM and phone system and this fills with
                your own close and upsell numbers, next to the pillar you drilled —
                and the recorded call the drill came from.
              </p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-r-ink-3">
                Everything above works without it.
              </p>
            </div>
          </motion.section>
        ) : (
        <motion.section {...rise(0.15)}>
          <div className="mb-2 flex items-center justify-between">
            <p className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
              From your real calls
            </p>
            <DemoDataTag />
          </div>

          {/* Real, per-rep data — the exact same components (and, for this
              rep, the exact same numbers) the Manager view already uses.
              This used to be one hardcoded sentence, identical for every
              rep and every session; that inconsistency was the whole point
              of Fix 5.

              Numbers first, prose second. This section used to open with two
              paragraphs of practiced-then-real narration and bury the close
              rate below them, which meant the one thing a rep is actually
              measured on was the last thing they saw. */}
          <div className="flex flex-col gap-2.5">
            <div className="card-lift p-3.5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["Close", rep.crm.closeRate],
                  ["Upsell", rep.crm.upsellRate],
                  ["Show", rep.crm.showRate],
                ].map(([label, v]) => (
                  <div key={label as string}>
                    <p className="mono text-title-2 text-r-ink">
                      {Math.round((v as number) * 100)}
                      <span className="text-[12px] font-medium text-r-ink-4">%</span>
                    </p>
                    <p className="mt-1 text-[12px] text-r-ink-3">{label as string}</p>
                  </div>
                ))}
              </div>

              {/* A close rate with nothing beside it is a number; next to the
                  real rooftop average it's a coaching conversation. Both lanes
                  are named because they're 15 points apart — benchmarked against
                  digital leads the same figure would read as above average. */}
              <div className="mt-3 border-t border-r-line pt-2.5">
                <p className="text-[12px] leading-snug text-r-ink-3">
                  Showroom average <span className="font-semibold text-r-ink-2">25–30%</span>, digital leads{" "}
                  <span className="font-semibold text-r-ink-2">8–12%</span>. These are showroom ups.
                </p>
                <p className="mono mt-1 text-[10px] uppercase tracking-[0.08em] text-r-ink-4">
                  Cox Automotive / J.D. Power · NADA
                </p>
              </div>

              <p className="mono mb-2 mt-3.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
                6-week trend
              </p>
              <TrendChart data={rep.trend} />
            </div>

            {rep.flaggedMoments.map((m, i) => (
              <div key={i} className="card-lift p-3.5">
                <p className="text-[12.5px] leading-relaxed text-r-ink-2">
                  <span className="font-semibold text-r-ink">Practiced</span>{" "}
                  {(() => { const c = capabilityById(m.capabilityId); return c ? cap(c) : m.personaName; })()}, {m.date}
                  {" → "}
                  <span className="font-semibold text-r-ink">Real call</span>, {m.realDate}: {m.realOutcome}
                </p>
              </div>
            ))}

            <div className="rounded-[14px] border border-dashed border-r-brand-line bg-r-brand-tint/40 p-3">
              <RoadmapTag>Full rollout, not built yet</RoadmapTag>
              <p className="mt-1.5 text-[12.5px] leading-snug text-r-ink-2">
                Connect the whole team&apos;s call recordings and every rep gets this automatically.
              </p>
            </div>
          </div>
        </motion.section>
        )}
      </div>
    </div>
  );
}
