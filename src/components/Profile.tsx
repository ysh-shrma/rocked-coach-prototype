"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { capabilityById, type CoachingPillar, type Persona } from "@/data/personas";
import { currentRep } from "@/data/reps";
import { COACHING_PILLAR_LABELS, summarizePerformance, type SessionResult } from "@/lib/session";
import { DemoDataTag, RoadmapTag, TrendChart, rise } from "./ui";

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
        <p className="text-[15px] font-bold tracking-[-0.01em] text-r-ink">Your profile</p>
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
                    <span className="font-semibold text-r-ink">{nextCap.label}</span>. This updates the moment
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
                    <p className="mono text-[20px] font-extrabold text-r-ink">
                      {avg![k]}
                      <span className="text-[12px] font-medium text-r-ink-4">/10</span>
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-r-ink-3">{COACHING_PILLAR_LABELS[k]}</p>
                  </div>
                ))}
              </div>
              {lowestPillar && (
                <div className="rounded-[14px] bg-r-amber-tint p-3">
                  <p className="text-[13px] leading-snug text-r-ink-2">
                    Your lowest average is <span className="font-semibold">{COACHING_PILLAR_LABELS[lowestPillar]}</span> —
                    worth a custom scenario built around it.
                  </p>
                  {/* Mike's ask: give the rep a reason of their own, in money, not just a
                      pillar score — reusing the real pairing already on hand below, not a
                      new invented statistic. */}
                  {topMoment && (
                    <p className="mt-2 border-t border-black/10 pt-2 text-[12.5px] leading-snug text-r-ink-2">
                      That same gap cost real ground on {topMoment.realDate} — closing it in practice is the
                      fastest way to stop it happening again on the floor, on your numbers, not just your score.
                    </p>
                  )}
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
              of Fix 5. */}
          <div className="flex flex-col gap-2.5">
            {rep.flaggedMoments.map((m, i) => (
              <div key={i} className="card-lift p-3.5">
                <p className="text-[12.5px] leading-relaxed text-r-ink-2">
                  <span className="font-semibold text-r-ink">Practiced</span>{" "}
                  {capabilityById(m.capabilityId)?.label ?? m.personaName}, {m.date}
                  {" → "}
                  <span className="font-semibold text-r-ink">Real call</span>, {m.realDate}: {m.realOutcome}
                </p>
              </div>
            ))}

            <div className="card-lift p-3.5">
              <div className="mb-2 flex items-center justify-between text-[13.5px]">
                <span className="text-r-ink-2">Close rate</span>
                <span className="font-semibold text-r-ink">{Math.round(rep.crm.closeRate * 100)}%</span>
              </div>
              <div className="mb-3 flex items-center justify-between text-[13.5px]">
                <span className="text-r-ink-2">Upsell rate</span>
                <span className="font-semibold text-r-ink">{Math.round(rep.crm.upsellRate * 100)}%</span>
              </div>
              <p className="mono mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
                6-week trend
              </p>
              <TrendChart data={rep.trend} />
            </div>

            <div className="rounded-[14px] border border-dashed border-r-brand-line bg-r-brand-tint/40 p-3.5">
              <RoadmapTag>Full rollout, not built yet</RoadmapTag>
              <p className="mt-2 text-[12.5px] leading-relaxed text-r-ink-2">
                Once call recordings are connected for your whole team, every rep gets this same
                personalization automatically — no setup, no self-reporting.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
