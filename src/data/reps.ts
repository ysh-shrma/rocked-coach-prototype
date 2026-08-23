/**
 * Mocked manager-view data (Improvement 7). Seeded fake CRM/call-recording
 * numbers stand in for a real integration RockED doesn't have yet — flagged
 * here and on-screen with a persistent "demo data" tag, never hidden.
 */

import { capabilities, type CoachingPillar } from "./personas";

export type PillarTrend = { current: number; trend: "up" | "down" | "flat" };

export type FlaggedMoment = {
  headline: string;
  detail: string;
  personaName: string;
  date: string;
  /** Shares the exact same taxonomy as practice capabilities — Mike Ferraro's
   *  non-negotiable condition for the real-CRM pairing below to mean anything
   *  ("or you're comparing apples to a used-car flyer"). */
  capabilityId: string;
  /** The real, paired floor moment — same failure pattern, a real deal. */
  realDate: string;
  realOutcome: string;
};

/** ~6 weekly points pairing practice pillar average against real CRM close
 *  rate — the secondary, confirmation-over-time view Mike ranked below the
 *  moment-by-moment pairing. */
export type Trend = { week: string; practiceAvg: number; closeRate: number };

export type AssignedTraining = {
  label: string;
  context: string;
  assignedOn: string;
  completed: boolean;
};

export type Rep = {
  id: string;
  name: string;
  initials: string;
  coaching: Record<CoachingPillar, PillarTrend>;
  /** Capability ids this rep has proven — the real, specific gap list, not a bare count. */
  doneCapabilityIds: string[];
  crm: { closeRate: number; showRate: number; upsellRate: number };
  practiceScore: number;
  flaggedMoments: FlaggedMoment[];
  assigned: AssignedTraining[];
  trend: Trend[];
};

export const reps: Rep[] = [
  {
    id: "amber-ruiz",
    name: "Amber Ruiz",
    initials: "AR",
    coaching: {
      rapport: { current: 8, trend: "up" },
      reading: { current: 7, trend: "flat" },
      pressure: { current: 4, trend: "down" },
      closing: { current: 7, trend: "up" },
    },
    doneCapabilityIds: ["hold-price", "recover-defect", "close-next-step", "upsell-without-pushy", "comparison-reason"],
    crm: { closeRate: 0.31, showRate: 0.62, upsellRate: 0.18 },
    practiceScore: 6.8,
    flaggedMoments: [
      {
        headline: "Turn 3 — Fabricated urgency on a car that's been sitting three weeks.",
        detail: "Told a budget-boxed buyer the car would “go within a day or two” when it had been on the lot three weeks. Lost the customer.",
        personaName: "The Budget-Boxed Buyer",
        date: "Aug 19",
        capabilityId: "honest-under-urgency",
        realDate: "Aug 21",
        realOutcome: "Told a real walk-in the same “won't last the week” line on a car that had been on the lot five weeks. Buyer left without deciding.",
      },
    ],
    assigned: [],
    trend: [
      { week: "Jul 21", practiceAvg: 7.2, closeRate: 0.34 },
      { week: "Jul 28", practiceAvg: 7.0, closeRate: 0.33 },
      { week: "Aug 4", practiceAvg: 6.5, closeRate: 0.30 },
      { week: "Aug 11", practiceAvg: 6.2, closeRate: 0.28 },
      { week: "Aug 18", practiceAvg: 6.5, closeRate: 0.29 },
      { week: "Aug 25", practiceAvg: 6.8, closeRate: 0.31 },
    ],
  },
  {
    id: "derek-sano",
    name: "Derek Sano",
    initials: "DS",
    coaching: {
      rapport: { current: 6, trend: "flat" },
      reading: { current: 5, trend: "down" },
      pressure: { current: 8, trend: "up" },
      closing: { current: 4, trend: "down" },
    },
    doneCapabilityIds: ["deescalate", "upsell-without-pushy", "comparison-reason"],
    crm: { closeRate: 0.19, showRate: 0.71, upsellRate: 0.09 },
    practiceScore: 5.1,
    flaggedMoments: [
      {
        headline: "Turn 4 — No concrete next step for a customer who asked for one directly.",
        detail: "A nervous first-time buyer asked “what happens next” and Derek said “come by whenever.” No appointment, no paperwork, no next step.",
        personaName: "The Friendly First-Timer",
        date: "Aug 21",
        capabilityId: "close-next-step",
        realDate: "Aug 22",
        realOutcome: "Ended a real up with “follow up next week” — no appointment set, nothing logged in the CRM either.",
      },
      {
        headline: "Turn 3 — Price contradiction.",
        detail: "Quoted $32,400, then $28,000, for the same RAV4, with nothing to justify the gap. Lost the customer on the spot.",
        personaName: "The Price Haggler",
        date: "Aug 18",
        capabilityId: "hold-price",
        realDate: "Aug 19",
        realOutcome: "Quoted $24,900 by text, then $22,500 by phone an hour later for the same used Civic. Customer called the desk to ask which number was real.",
      },
    ],
    assigned: [
      {
        label: "The Friendly First-Timer — Closing with an actual next step locked in",
        context: "Assigned by Mike, after your session ended without a next step on Aug 21.",
        assignedOn: "Aug 21",
        completed: false,
      },
    ],
    trend: [
      { week: "Jul 21", practiceAvg: 6.4, closeRate: 0.24 },
      { week: "Jul 28", practiceAvg: 6.0, closeRate: 0.23 },
      { week: "Aug 4", practiceAvg: 5.6, closeRate: 0.21 },
      { week: "Aug 11", practiceAvg: 5.3, closeRate: 0.20 },
      { week: "Aug 18", practiceAvg: 5.2, closeRate: 0.19 },
      { week: "Aug 25", practiceAvg: 5.1, closeRate: 0.19 },
    ],
  },
  {
    id: "priya-anand",
    name: "Priya Anand",
    initials: "PA",
    coaching: {
      rapport: { current: 9, trend: "up" },
      reading: { current: 8, trend: "up" },
      pressure: { current: 8, trend: "flat" },
      closing: { current: 8, trend: "up" },
    },
    doneCapabilityIds: capabilities.map((c) => c.id),
    crm: { closeRate: 0.38, showRate: 0.69, upsellRate: 0.24 },
    practiceScore: 8.4,
    flaggedMoments: [],
    assigned: [],
    trend: [
      { week: "Jul 21", practiceAvg: 7.5, closeRate: 0.32 },
      { week: "Jul 28", practiceAvg: 7.8, closeRate: 0.33 },
      { week: "Aug 4", practiceAvg: 8.0, closeRate: 0.35 },
      { week: "Aug 11", practiceAvg: 8.1, closeRate: 0.36 },
      { week: "Aug 18", practiceAvg: 8.3, closeRate: 0.37 },
      { week: "Aug 25", practiceAvg: 8.4, closeRate: 0.38 },
    ],
  },
  {
    id: "tyler-brooks",
    name: "Tyler Brooks",
    initials: "TB",
    coaching: {
      rapport: { current: 4, trend: "down" },
      reading: { current: 6, trend: "flat" },
      pressure: { current: 3, trend: "down" },
      closing: { current: 6, trend: "flat" },
    },
    doneCapabilityIds: ["close-next-step", "trade-in-fair"],
    crm: { closeRate: 0.22, showRate: 0.58, upsellRate: 0.11 },
    practiceScore: 4.6,
    flaggedMoments: [
      {
        headline: "Turn 4 — Pressured a customer who told you he hates being pressured.",
        detail: "“Just sign here and we'll sort details after,” to a combative customer who opened by saying not to waste his time. Lost the customer.",
        personaName: "The Difficult One",
        date: "Aug 20",
        capabilityId: "deescalate",
        realDate: "Aug 21",
        realOutcome: "Raised his voice back at a heated walk-in during a trade-appraisal dispute — the GM had to step in and close it himself.",
      },
      {
        headline: "Turn 1 — Matched his tone instead of de-escalating.",
        detail: "Responded to a hostile opener with “no need to be rude,” raising the temperature instead of lowering it.",
        personaName: "The Difficult One",
        date: "Aug 17",
        capabilityId: "deescalate",
        realDate: "Aug 18",
        realOutcome: "Same pattern on an inbound call — caller hung up mid-sentence after Tyler talked over them twice.",
      },
    ],
    assigned: [
      {
        label: "The Difficult One — De-escalating a rude or combative customer",
        context: "Assigned by Mike, after your call with a combative customer on Aug 20.",
        assignedOn: "Aug 20",
        completed: false,
      },
    ],
    trend: [
      { week: "Jul 21", practiceAvg: 5.8, closeRate: 0.26 },
      { week: "Jul 28", practiceAvg: 5.4, closeRate: 0.25 },
      { week: "Aug 4", practiceAvg: 5.0, closeRate: 0.24 },
      { week: "Aug 11", practiceAvg: 4.8, closeRate: 0.23 },
      { week: "Aug 18", practiceAvg: 4.7, closeRate: 0.22 },
      { week: "Aug 25", practiceAvg: 4.6, closeRate: 0.22 },
    ],
  },
  {
    id: "monique-fields",
    name: "Monique Fields",
    initials: "MF",
    coaching: {
      rapport: { current: 7, trend: "up" },
      reading: { current: 7, trend: "up" },
      pressure: { current: 6, trend: "flat" },
      closing: { current: 5, trend: "down" },
    },
    doneCapabilityIds: ["hold-price", "recover-defect", "deescalate", "close-next-step", "upsell-without-pushy", "honest-under-urgency"],
    crm: { closeRate: 0.27, showRate: 0.64, upsellRate: 0.15 },
    practiceScore: 6.2,
    flaggedMoments: [
      {
        headline: "Turn 3 — No real explanation for a $600 trade-in gap.",
        detail: "“Appraisers are weird, let's just go with $6,400” — no explanation for a gap the customer had every right to ask about.",
        personaName: "The Trade-In-Focused Buyer",
        date: "Aug 22",
        capabilityId: "trade-in-fair",
        realDate: "Aug 23",
        realOutcome: "Couldn't explain a $900 appraisal gap to a real trade-in customer on the floor — they took the trade to CarMax instead.",
      },
    ],
    assigned: [],
    trend: [
      { week: "Jul 21", practiceAvg: 5.8, closeRate: 0.25 },
      { week: "Jul 28", practiceAvg: 6.0, closeRate: 0.26 },
      { week: "Aug 4", practiceAvg: 6.1, closeRate: 0.28 },
      { week: "Aug 11", practiceAvg: 6.3, closeRate: 0.29 },
      { week: "Aug 18", practiceAvg: 6.2, closeRate: 0.28 },
      { week: "Aug 25", practiceAvg: 6.2, closeRate: 0.27 },
    ],
  },
];

export const repById = (id: string) => reps.find((r) => r.id === id);

/**
 * The rep-facing app (Home/Hub/Profile) has no "this is you" record of its
 * own — until now every mocked rep in this file represented someone else,
 * for a manager to review. Designating one of Mike's existing team members
 * as the logged-in player closes that gap for free: Profile's "from your
 * real calls" section can reuse the exact same data (and the exact same
 * `TrendChart`/paired-moment components) already built and proven for the
 * Manager view, and the numbers on both sides are then independently
 * cross-checkable — the actual proof this is one product, not two apps
 * sharing a data file. Derek Sano, specifically: he already has two real
 * flagged moments and a declining trend, which makes the "we listened to
 * your actual calls" mechanic (Fix 6) immediately concrete instead of a
 * clean, uneventful profile with nothing to point at.
 */
export const CURRENT_REP_ID = "derek-sano";
export const currentRep = () => repById(CURRENT_REP_ID)!;

export const repCoverage = (r: Rep) => ({ done: r.doneCapabilityIds.length, total: capabilities.length });

/** The capabilities this rep hasn't proven yet — the pool Assign Training picks from. */
export const repGaps = (r: Rep) => capabilities.filter((c) => !r.doneCapabilityIds.includes(c.id));

/**
 * Ranked by who most needs coaching this week — the view a GM with fifteen
 * minutes actually wants, per Mike Ferraro's read.
 *
 * A practice score (0-10) and a CRM close rate (0-1) are different units;
 * subtracting them doesn't produce a real "gap," it just re-ranks by
 * whoever's practice score happens to be numerically larger. This instead
 * weighs the three concrete coaching signals Mike named directly: unresolved
 * flagged moments, open coverage gaps, and low practice scores.
 */
export function needsCoachingScore(r: Rep) {
  const gaps = capabilities.length - r.doneCapabilityIds.length;
  return r.flaggedMoments.length * 10 + gaps * 3 + (10 - r.practiceScore) * 2;
}

export function rankedByGap(list: Rep[]) {
  return [...list].sort((a, b) => needsCoachingScore(b) - needsCoachingScore(a));
}
