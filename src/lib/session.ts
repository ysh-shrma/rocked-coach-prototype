import { capabilityById, type Choice, type CoachingPillar, type CriticalMoment, type Pillar } from "@/data/personas";
import type { Rep } from "@/data/reps";

export type SentimentState = { trust: number; patience: number; interest: number };

/** Trust and patience only ever hold or fall; interest is the one pillar that can rise. */
export const initialSentiment: SentimentState = { trust: 70, patience: 70, interest: 50 };

export const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export const overall = (s: SentimentState) =>
  Math.round(s.trust * 0.5 + s.patience * 0.3 + s.interest * 0.2);

/** The call-ending threshold: below this, the customer is a lost customer, full stop. */
export const LOST_THRESHOLD = 15;

export function applyDelta(s: SentimentState, delta: Partial<Record<Pillar, number>>): SentimentState {
  return {
    trust: clamp(s.trust + (delta.trust ?? 0)),
    patience: clamp(s.patience + (delta.patience ?? 0)),
    interest: clamp(s.interest + (delta.interest ?? 0)),
  };
}

export const coachingBaseline: Record<CoachingPillar, number> = {
  rapport: 5,
  reading: 5,
  pressure: 5,
  closing: 5,
};

export function applyCoaching(
  c: Record<CoachingPillar, number>,
  delta?: Partial<Record<CoachingPillar, number>>,
): Record<CoachingPillar, number> {
  if (!delta) return c;
  return {
    rapport: clamp(c.rapport + (delta.rapport ?? 0), 0, 10),
    reading: clamp(c.reading + (delta.reading ?? 0), 0, 10),
    pressure: clamp(c.pressure + (delta.pressure ?? 0), 0, 10),
    closing: clamp(c.closing + (delta.closing ?? 0), 0, 10),
  };
}

/** A hard mechanic, not a soft timeout: any of these ends the call immediately,
 *  overriding whatever node the picked choice would otherwise have advanced to. */
export function checkEnded(sentiment: SentimentState, moments: CriticalMoment[]) {
  if (moments.some((m) => m.severity === "lost")) return true;
  if (sentiment.trust <= 0) return true;
  if (overall(sentiment) <= LOST_THRESHOLD) return true;
  return false;
}

/** One step in the dialogue graph actually taken during a session. */
export type PickRecord = { nodeId: string; choice: Choice };

export type Outcome = "lost" | "closed" | "ended-neutral";

export type SessionResult = {
  personaId: string;
  outcome: Outcome;
  sentiment: SentimentState;
  overall: number;
  coaching: Record<CoachingPillar, number>;
  criticalMoments: (CriticalMoment & { nodeId: string })[];
  picks: PickRecord[];
  capabilityProven: boolean;
};

export function finalizeSession(
  personaId: string,
  picks: PickRecord[],
  sentiment: SentimentState,
  coaching: Record<CoachingPillar, number>,
  /** True when the traversal ended because a choice's `next` was "end",
   *  as opposed to being cut short mid-graph by the lost threshold. */
  reachedEnd: boolean,
): SessionResult {
  const criticalMoments = picks
    .filter((p) => p.choice.criticalMoment)
    .map((p) => ({ ...(p.choice.criticalMoment as CriticalMoment), nodeId: p.nodeId }));

  const lost = checkEnded(sentiment, criticalMoments);
  const ov = overall(sentiment);

  let outcome: Outcome;
  if (lost) outcome = "lost";
  else if (reachedEnd && coaching.closing >= 7 && ov >= 50) outcome = "closed";
  else outcome = "ended-neutral";

  const capabilityProven = outcome !== "lost" && picks.some((p) => p.choice.provesCapability);

  return {
    personaId,
    outcome,
    sentiment,
    overall: ov,
    coaching,
    criticalMoments,
    picks,
    capabilityProven,
  };
}

export const COACHING_PILLAR_LABELS: Record<CoachingPillar, string> = {
  rapport: "Rapport & Trust",
  reading: "Reading the Customer",
  pressure: "Handling Pressure Moments",
  closing: "Closing the Next Step",
};

export type PerformanceState = "empty" | "practice" | "crm-seeded";

export type PerformanceSummary = {
  state: PerformanceState;
  avgPillars: Record<CoachingPillar, number> | null;
  weakestPillar: CoachingPillar | null;
  headlineLabel: string | null;
  headlineValue: string | null;
  gapLabel: string | null;
};

/**
 * One calculation, shared by Home's performance card and Profile's full
 * readout — Fix 5 already found this pair drifting apart once (Profile's
 * hardcoded sentence vs. Manager's real per-rep data); this keeps "what
 * counts as the weakest pillar" from ever forking into two answers again.
 */
export function summarizePerformance(
  results: Record<string, SessionResult>,
  rep: Rep,
  crmIntegrated: boolean,
): PerformanceSummary {
  const sessions = Object.values(results);
  const hasSessions = sessions.length > 0;

  let avgPillars: Record<CoachingPillar, number> | null = null;
  let weakestPillar: CoachingPillar | null = null;

  if (hasSessions) {
    const sums: Record<CoachingPillar, number> = { rapport: 0, reading: 0, pressure: 0, closing: 0 };
    sessions.forEach((r) => {
      (Object.keys(sums) as CoachingPillar[]).forEach((k) => {
        sums[k] += r.coaching[k];
      });
    });
    avgPillars = {
      rapport: Math.round(sums.rapport / sessions.length),
      reading: Math.round(sums.reading / sessions.length),
      pressure: Math.round(sums.pressure / sessions.length),
      closing: Math.round(sums.closing / sessions.length),
    };
    weakestPillar = (Object.keys(avgPillars) as CoachingPillar[]).sort(
      (a, b) => avgPillars![a] - avgPillars![b],
    )[0];
  }

  if (hasSessions && weakestPillar && avgPillars) {
    const composite = (avgPillars.rapport + avgPillars.reading + avgPillars.pressure + avgPillars.closing) / 4;
    return {
      state: "practice",
      avgPillars,
      weakestPillar,
      headlineLabel: crmIntegrated ? "Real close rate" : "Practice score",
      headlineValue: crmIntegrated ? `${Math.round(rep.crm.closeRate * 100)}%` : `${composite.toFixed(1)}/10`,
      gapLabel: `Your biggest gap: ${COACHING_PILLAR_LABELS[weakestPillar]}`,
    };
  }

  if (crmIntegrated) {
    const seedMoment = rep.flaggedMoments[0];
    const gapCapabilityLabel = seedMoment ? capabilityById(seedMoment.capabilityId)?.label : undefined;
    return {
      state: "crm-seeded",
      avgPillars: null,
      weakestPillar: null,
      headlineLabel: "Real close rate",
      headlineValue: `${Math.round(rep.crm.closeRate * 100)}%`,
      gapLabel: gapCapabilityLabel ? `Real calls flagged: ${gapCapabilityLabel}` : null,
    };
  }

  return {
    state: "empty",
    avgPillars: null,
    weakestPillar: null,
    headlineLabel: null,
    headlineValue: null,
    gapLabel: null,
  };
}
