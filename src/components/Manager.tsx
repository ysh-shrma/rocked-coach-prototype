"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Check,
  LayoutGrid,
  Minus,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { capabilityById, type CoachingPillar } from "@/data/personas";
import { needsCoachingScore, repCoverage, repGaps, type AssignedTraining, type Rep } from "@/data/reps";
import { CoverageRing, DemoDataTag, Mark, rise, TrendChart } from "./ui";

const COACHING_LABELS: Record<CoachingPillar, string> = {
  rapport: "Rapport & Trust",
  reading: "Reading the Customer",
  pressure: "Handling Pressure Moments",
  closing: "Closing the Next Step",
};

const NAV = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Team", icon: Users, active: true },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

/** A real console shell, ported from agent-test-drive's Shell.tsx chrome
 *  density (logo badge, org line, a left nav rail) and recolored to
 *  RockED purple — this audience (a desk-bound GM with a CRM open) is the
 *  one case in this build where leaning into the reference's own visual
 *  language, not just its techniques, is the intentional call. */
export function ManagerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-r-canvas text-r-ink">
      <header className="flex h-[56px] shrink-0 items-center gap-3 border-b border-r-line bg-white px-5">
        <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-r-brand text-[13px] font-bold text-white">
          R
        </span>
        <span>
          <span className="block text-[14px] font-bold leading-none tracking-[-0.01em]">RockED — Sales Coaching</span>
          <span className="mono block text-[10px] leading-none text-r-ink-4">manager view</span>
        </span>
        <a href="/v1" className="ml-auto text-[13px] font-medium text-r-brand hover:underline">
          ← Rep app
        </a>
        <span className="mx-1 h-[20px] w-px bg-r-line" />
        <span className="flex items-center gap-2 text-[13px] font-medium text-r-ink-2">
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-r-brand-tint text-[11px] font-bold text-r-brand">
            MF
          </span>
          Mike Ferraro, GM
        </span>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[176px] shrink-0 flex-col border-r border-r-line bg-white py-3 md:flex">
          <p className="mono mb-2 px-4 text-[10px] font-medium uppercase tracking-[0.12em] text-r-ink-5">
            AI Coach
          </p>
          <nav className="flex flex-col gap-[2px] px-2">
            {NAV.map(({ label, icon: Icon, active }) => (
              <span
                key={label}
                className={`flex items-center gap-[10px] rounded-[9px] px-[10px] py-[8px] text-[13.5px] ${
                  active ? "bg-r-brand-tint font-semibold text-r-brand" : "font-medium text-r-ink-3"
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </span>
            ))}
          </nav>
        </aside>
        {children}
      </div>
    </div>
  );
}

export function TeamList({
  reps,
  selectedId,
  onSelect,
}: {
  reps: Rep[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="w-[300px] shrink-0 overflow-y-auto border-r border-r-line bg-white">
      <p className="mono px-4 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
        Team, ranked by who needs coaching most
      </p>
      {reps.map((r, i) => {
        const cov = repCoverage(r);
        const urgent = needsCoachingScore(r) >= 25;
        return (
          <motion.button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className={`flex w-full items-center gap-3 border-b border-r-line-2 px-4 py-3 text-left transition-colors ${
              selectedId === r.id ? "bg-r-brand-tint" : "hover:bg-r-sunk"
            }`}
            {...rise(i * 0.04)}
          >
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-r-brand-tint text-[12px] font-bold text-r-brand">
              {r.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold text-r-ink">{r.name}</span>
              <span className="mono block text-[11px] text-r-ink-4">
                {cov.done}/{cov.total} covered &middot; {r.flaggedMoments.length} flagged
              </span>
            </span>
            {urgent && (
              <span className="mono shrink-0 rounded-full bg-r-bad-tint px-2 py-[3px] text-[10.5px] font-bold text-r-bad">
                Needs coaching
              </span>
            )}
          </motion.button>
        );
      })}
    </aside>
  );
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <ArrowUpRight size={13} className="text-r-ok" />;
  if (trend === "down") return <ArrowDownRight size={13} className="text-r-bad" />;
  return <Minus size={13} className="text-r-ink-4" />;
}

export function RepDetail({
  rep,
  assigned,
  onAssign,
}: {
  rep: Rep;
  assigned: AssignedTraining[];
  onAssign: (t: AssignedTraining) => void;
}) {
  const cov = repCoverage(rep);
  const gaps = repGaps(rep);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-6">
      <motion.div className="mb-6 flex items-center gap-4" {...rise(0)}>
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-r-brand-tint text-[16px] font-bold text-r-brand">
          {rep.initials}
        </span>
        <div>
          <p className="text-[19px] font-extrabold tracking-[-0.01em] text-r-ink">{rep.name}</p>
          <p className="mono text-[12px] text-r-ink-4">
            Practice avg {rep.practiceScore}/10 &middot; CRM close rate {Math.round(rep.crm.closeRate * 100)}%
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CoverageRing done={cov.done} total={cov.total} size={40} />
          <span className="mono text-[12px] text-r-ink-3">
            {cov.done}/{cov.total}
          </span>
        </div>
      </motion.div>

      <motion.section className="mb-6" {...rise(0.05)}>
        <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
          Trend per pillar
        </p>
        <div className="grid grid-cols-4 gap-3">
          {(Object.keys(COACHING_LABELS) as CoachingPillar[]).map((k) => (
            <div key={k} className="card-lift p-3">
              <div className="flex items-center gap-1">
                <span className="mono text-[20px] font-extrabold text-r-ink">{rep.coaching[k].current}</span>
                <TrendIcon trend={rep.coaching[k].trend} />
              </div>
              <p className="mt-1 text-[11.5px] leading-snug text-r-ink-3">{COACHING_LABELS[k]}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section className="mb-6" {...rise(0.1)}>
        <div className="mb-2 flex items-center justify-between">
          <p className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
            Practice vs. real floor performance
          </p>
          <DemoDataTag />
        </div>

        {/* Primary, per Mike Ferraro's ranked answer: the specific pairing he'd
            actually act on in a one-on-one, sharing the exact same capability
            taxonomy as practice — "or you're comparing apples to a used-car
            flyer." The trend chart below is confirmation over time, secondary. */}
        {rep.flaggedMoments.length === 0 ? (
          <p className="mb-3 text-[13px] text-r-ink-3">No concerning pairs — practice and floor performance haven't diverged.</p>
        ) : (
          <div className="mb-3 flex flex-col gap-2">
            {rep.flaggedMoments.map((m, i) => (
              <div key={i} className="card-lift p-3">
                <p className="text-[12.5px] leading-snug text-r-ink-2">
                  <span className="font-semibold text-r-ink">Practiced</span> {capabilityById(m.capabilityId)?.label ?? m.personaName}, {m.date}
                  {" → "}
                  <span className="font-semibold text-r-ink">Real call</span>, {m.realDate}: {m.realOutcome}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="card-lift p-3">
          <p className="mono mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
            6-week trend — the number this should move is closing ratio
          </p>
          <TrendChart data={rep.trend} />
        </div>
      </motion.section>

      <motion.section className="mb-6" {...rise(0.15)}>
        <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
          Coverage gaps
        </p>
        {gaps.length === 0 ? (
          <p className="text-[13px] text-r-ink-3">Every capability proven. Nothing to assign here.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {gaps.map((g) => {
              const already = assigned.some((a) => a.label.includes(g.label));
              return (
                <div key={g.id} className="flex items-center gap-3 rounded-[12px] border border-dashed border-r-line p-3">
                  <span className="min-w-0 flex-1 text-[13px] text-r-ink-2">{g.label}</span>
                  {already ? (
                    <Mark tone="ok">
                      <Check size={11} /> Assigned
                    </Mark>
                  ) : (
                    <AssignButton
                      label={g.label}
                      context={`Assigned by Mike, from your coverage gaps on ${rep.name.split(" ")[0]}'s board today.`}
                      onAssign={onAssign}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.section {...rise(0.2)}>
        <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
          Flagged critical moments
        </p>
        {rep.flaggedMoments.length === 0 ? (
          <p className="text-[13px] text-r-ink-3">No lost-customer moments logged.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {rep.flaggedMoments.map((m, i) => {
              const already = assigned.some((a) => a.label.includes(m.personaName));
              return (
                <div key={i} className="rounded-[12px] border border-r-bad/30 bg-r-bad-tint/40 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="mt-[2px] shrink-0 text-r-bad" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-r-ink">{m.headline}</p>
                      <p className="mt-1 text-[12.5px] leading-snug text-r-ink-2">{m.detail}</p>
                      <p className="mono mt-1 text-[10.5px] text-r-ink-4">
                        {m.personaName} &middot; {m.date}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pl-6">
                    {already ? (
                      <Mark tone="ok">
                        <Check size={11} /> Training assigned
                      </Mark>
                    ) : (
                      <AssignButton
                        label={`${m.personaName} — practice this scenario again`}
                        context={`Assigned by Mike, after your call with ${m.personaName.toLowerCase()} on ${m.date}.`}
                        onAssign={onAssign}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>
    </div>
  );
}

/**
 * Inline expand, not a modal — a GM with fifteen minutes doesn't want a
 * context-switch for a two-field action. The context line is auto-generated
 * from the triggering gap/moment, never a bare "Complete: X Challenge."
 */
function AssignButton({
  label,
  context,
  onAssign,
}: {
  label: string;
  context: string;
  onAssign: (t: AssignedTraining) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-r-brand-line bg-r-brand-tint px-3 py-[5px] text-[12px] font-semibold text-r-brand transition-colors hover:bg-r-brand hover:text-white"
      >
        Assign training
      </button>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 rounded-[10px] border border-r-line bg-white p-2.5"
    >
      <p className="text-[12px] italic text-r-ink-3">&ldquo;{context}&rdquo;</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() =>
            onAssign({ label, context, assignedOn: "Today", completed: false })
          }
          className="flex items-center gap-[5px] rounded-full bg-r-brand px-3 py-[5px] text-[12px] font-semibold text-white"
        >
          <Send size={11} /> Send
        </button>
        <button onClick={() => setOpen(false)} className="text-[12px] text-r-ink-4">
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
