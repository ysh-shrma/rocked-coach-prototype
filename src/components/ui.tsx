"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Lock, Rocket } from "lucide-react";
import type { Vehicle } from "@/data/vehicles";
import { miles, money, vehicleTitle } from "@/data/vehicles";
import type { Trend } from "@/data/reps";
import type { CoachingPillar } from "@/data/personas";

/**
 * The one motion system for this whole app, ported verbatim from
 * agent-test-drive (the same ease-out-expo curve appears in 14+ files
 * there, reused for every discrete entrance). Durations vary by element,
 * chosen by feel in roughly a 0.2s-0.8s range, not this curve.
 */
export const ease = [0.16, 1, 0.3, 1] as const;
export const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "quiet" | "dashed" | "bad";
  size?: "lg" | "md" | "sm";
  className?: string;
  disabled?: boolean;
}) {
  const variants: Record<string, string> = {
    primary: "bg-r-brand text-white border-r-brand hover:bg-r-brand-hover",
    secondary: "bg-white text-r-ink border-r-line hover:border-r-ink-4",
    quiet: "bg-transparent text-r-ink-3 border-transparent hover:bg-r-sunk",
    dashed:
      "bg-transparent text-r-ink-3 border-dashed border-r-ink-4 hover:border-r-brand hover:text-r-brand",
    bad: "bg-r-bad text-white border-r-bad",
  };
  const sizes: Record<string, string> = {
    lg: "px-6 py-[13px] text-[15px]",
    md: "px-[16px] py-[9px] text-[14px]",
    sm: "px-[12px] py-[6px] text-[12.5px]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-[7px] rounded-full border font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mono text-[11px] font-medium uppercase tracking-[0.09em] text-r-ink-4 ${className}`}>
      {children}
    </p>
  );
}

/**
 * The one caveat-tag component, reused identically everywhere this build
 * needs to say "this is seeded/limited, not the real thing" — the
 * real-time-pacing note, the CRM-enhanced tier, the manager correlation
 * view. One visual treatment, not a new badge invented per screen.
 */
export function Mark({
  tone = "brand",
  children,
}: {
  tone?: "brand" | "assumed" | "ok" | "bad";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    brand: "bg-r-brand-tint text-r-brand",
    assumed: "bg-r-amber-tint text-r-amber",
    ok: "bg-r-ok-tint text-r-ok",
    bad: "bg-r-bad-tint text-r-bad",
  };
  return (
    <span
      className={`mono inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function DemoDataTag() {
  return (
    <Mark tone="assumed">
      <AlertTriangle size={11} strokeWidth={2.4} />
      Demo data, not a live integration
    </Mark>
  );
}

/**
 * Deliberately distinct from DemoDataTag, not a reuse of it — the two make
 * different claims. "Demo data" means "mocked, but this capability exists
 * today." This tag means "doesn't exist yet, here's the roadmap" — a
 * forward-looking claim about full call-recording rollout, not a present-
 * tense one. Conflating the two would be its own honesty problem.
 */
export function RoadmapTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono inline-flex items-center gap-[6px] rounded-full bg-r-brand-tint px-[10px] py-[3px] text-[11px] font-semibold text-r-brand">
      <Rocket size={11} strokeWidth={2.4} />
      {children}
    </span>
  );
}

/** Single glanceable bar: used live during the call (Improvement 1) and,
 *  three at once, on the post-call pillar breakdown. */
export function SentimentBar({
  label,
  value,
  showNumber = false,
  threshold,
  dark = false,
  flashKey,
  flashTone,
}: {
  label?: string;
  value: number;
  showNumber?: boolean;
  threshold?: number;
  /** True on the dark Live Call screen; false on the light Score Report. */
  dark?: boolean;
  /** Change this (e.g. an incrementing counter) to trigger a one-shot flash —
   *  makes a delta feel like it landed, not just repainted. */
  flashKey?: number;
  flashTone?: "bad" | "good";
}) {
  const tone = value <= 25 ? "bg-r-bad" : value <= 55 ? "bg-r-amber" : "bg-r-ok";
  const track = dark ? "bg-white/12" : "bg-r-line";
  const labelColor = dark ? "text-d-ink-2" : "text-r-ink-2";
  const numberColor = dark ? "text-d-ink-3" : "text-r-ink-4";
  return (
    <div className="w-full">
      {(label || showNumber) && (
        <div className="mb-[5px] flex items-center justify-between">
          {label && <span className={`text-[12px] font-medium ${labelColor}`}>{label}</span>}
          {showNumber && <span className={`mono text-[11px] ${numberColor}`}>{Math.round(value)}</span>}
        </div>
      )}
      <div className={`relative h-[7px] w-full overflow-hidden rounded-full ${track}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone}`}
          style={{ width: `${Math.max(3, value)}%` }}
        />
        {threshold !== undefined && (
          <span
            className={`absolute top-[-3px] h-[13px] w-[2px] ${dark ? "bg-white/70" : "bg-r-ink-4"}`}
            style={{ left: `${threshold}%` }}
          />
        )}
        <AnimatePresence>
          {flashKey !== undefined && flashKey > 0 && (
            <motion.span
              key={flashKey}
              initial={{ opacity: 0.55 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
              className={`pointer-events-none absolute inset-0 rounded-full ${
                flashTone === "bad" ? "bg-r-bad" : "bg-r-ok"
              }`}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const AVATAR_PALETTE = [
  "#5b3ee6",
  "#c8402a",
  "#1c9a5b",
  "#e8871e",
  "#2b6fd1",
  "#a83e9e",
  "#0f9aa8",
  "#8a5a2b",
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** A stable, color-coded identity for a customer persona — not a photo
 *  (agent-test-drive's avatar is a crop of one specific real photo asset
 *  this app doesn't have), a deliberate lighter-weight substitute that
 *  still gives the customer real visual presence instead of bare text. */
export function PersonaAvatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name
    .replace(/^The\s+/i, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_PALETTE[hashString(name) % AVATAR_PALETTE.length];
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/**
 * A physical-object bottom sheet, ported from agent-test-drive's
 * PhoneDrawer pattern: blurred backdrop fade + the sheet itself entering on
 * a spring rather than an ease curve, specifically because it's meant to
 * feel like something sliding into place, not just appearing.
 */
export function Sheet({
  open,
  onClose,
  children,
  dark = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-20 flex items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full rounded-t-[24px] p-4 ${dark ? "bg-[#141220]" : "bg-white"}`}
            initial={{ y: 80, opacity: 0.4 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0.3 }}
            transition={{ type: "spring", stiffness: 210, damping: 27, mass: 0.9 }}
            style={{ boxShadow: "0 -24px 60px -20px rgba(8,10,18,0.35)" }}
          >
            <span className={`mx-auto mb-3 block h-[4px] w-[38px] rounded-full ${dark ? "bg-white/20" : "bg-r-line"}`} />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Turn-linked ground-truth card (Improvement 2) — same anatomy as an
 *  AI-transparency "proof" timeline node, relabeled: this isn't narrating
 *  what an AI did, it's DMS ground truth in front of a human rep. */
export function GroundTruthVehicle({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-white/12 bg-white/6 p-3">
      <div className="flex h-[40px] w-[56px] shrink-0 items-center justify-center rounded-[8px] bg-white/10 text-[10px] text-d-ink-3">
        {vehicle.make[0]}
        {vehicle.model[0]}
      </div>
      <div className="min-w-0">
        <p className="mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-d-brand">
          In your lot
        </p>
        <p className="mt-[3px] text-[14px] font-semibold leading-tight text-d-ink">
          {vehicleTitle(vehicle)}
        </p>
        <p className="mono mt-[3px] text-[11px] text-d-ink-3">
          {vehicle.stock} &middot; {miles(vehicle.miles)} &middot; {money(vehicle.price)}
        </p>
        {vehicle.recall && (
          <p className="mono mt-[4px] flex items-center gap-[5px] text-[10.5px] text-r-amber">
            <AlertTriangle size={11} strokeWidth={2.4} />
            {vehicle.recall}
          </p>
        )}
        <p className="mono mt-[4px] text-[10px] text-d-ink-3">RockED demo inventory</p>
      </div>
    </div>
  );
}

export function GroundTruthTrade({
  label,
  rangeLow,
  rangeHigh,
}: {
  label: string;
  rangeLow: number;
  rangeHigh: number;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-white/12 bg-white/6 p-3">
      <div className="flex h-[40px] w-[56px] shrink-0 items-center justify-center rounded-[8px] bg-white/10 text-[10px] text-d-ink-3">
        TR
      </div>
      <div className="min-w-0">
        <p className="mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-d-brand">
          Trade estimate
        </p>
        <p className="mt-[3px] text-[14px] font-semibold leading-tight text-d-ink">{label}</p>
        <p className="mono mt-[3px] text-[11px] text-d-ink-3">
          ${rangeLow.toLocaleString()} &ndash; ${rangeHigh.toLocaleString()} typical range
        </p>
        <p className="mono mt-[4px] text-[10px] text-d-ink-3">RockED demo appraisal comps</p>
      </div>
    </div>
  );
}

const PILLAR_ORDER: CoachingPillar[] = ["rapport", "reading", "pressure", "closing"];
const PILLAR_INITIALS: Record<CoachingPillar, string> = {
  rapport: "RA",
  reading: "RE",
  pressure: "PR",
  closing: "CL",
};

/** Compact glance-and-move-on readout for Home's performance card — the
 *  full 2x2 stat-tile treatment lives in Profile; this is the teaser. */
export function PillarBars({ values }: { values: Record<CoachingPillar, number> }) {
  return (
    <div className="flex items-end gap-3">
      {PILLAR_ORDER.map((p) => (
        <div key={p} className="flex flex-col items-center gap-1">
          <div className="relative h-[34px] w-[10px] overflow-hidden rounded-full bg-r-sunk">
            <div
              className="absolute bottom-0 w-full rounded-full bg-r-brand"
              style={{ height: `${Math.max(6, (values[p] / 10) * 100)}%` }}
            />
          </div>
          <span className="mono text-[9.5px] font-semibold text-r-ink-4">{PILLAR_INITIALS[p]}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusDot({ done }: { done: boolean }) {
  return done ? (
    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-r-ok">
      <Check size={11} strokeWidth={3.4} className="text-white" />
    </span>
  ) : (
    <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-r-sunk text-r-ink-4">
      <Lock size={10} strokeWidth={2.6} />
    </span>
  );
}

export function CoverageRing({ done, total, size = 52 }: { done: number; total: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : done / total;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e7e3f2" strokeWidth={4} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#5b3ee6"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

/**
 * Secondary CRM-correlation view (Mike Ferraro's ranking: confirmation over
 * time, below the moment-by-moment pairing). Two hand-drawn polylines — no
 * charting dependency, nothing like this exists in agent-test-drive to
 * copy — practice pillar average (left axis, 0-10) against real close rate
 * (right axis, 0-1), sharing one x-axis of weeks.
 */
export function TrendChart({ data }: { data: Trend[] }) {
  const w = 280;
  const h = 100;
  const pad = 8;
  const x = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const yPractice = (v: number) => h - pad - (v / 10) * (h - pad * 2);
  const yClose = (v: number) => h - pad - v * (h - pad * 2);
  const practicePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${yPractice(d.practiceAvg)}`).join(" ");
  const closePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${yClose(d.closeRate)}`).join(" ");

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        <path d={practicePath} fill="none" stroke="#5b3ee6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d={closePath} fill="none" stroke="#1c9a5b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
        {data.map((d, i) => (
          <circle key={`p${i}`} cx={x(i)} cy={yPractice(d.practiceAvg)} r={2.5} fill="#5b3ee6" />
        ))}
        {data.map((d, i) => (
          <circle key={`c${i}`} cx={x(i)} cy={yClose(d.closeRate)} r={2.5} fill="#1c9a5b" />
        ))}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-r-ink-3">
        <span className="flex items-center gap-[5px]">
          <span className="h-[2px] w-[14px] rounded-full bg-r-brand" /> Practice score
        </span>
        <span className="flex items-center gap-[5px]">
          <span className="h-[2px] w-[14px] rounded-full bg-r-ok" style={{ backgroundImage: "repeating-linear-gradient(90deg,#1c9a5b 0 4px,transparent 4px 7px)" }} />
          Real close rate
        </span>
      </div>
    </div>
  );
}
