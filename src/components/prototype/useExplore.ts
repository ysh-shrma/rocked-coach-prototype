"use client";

import { useState } from "react";
import {
  capabilityById,
  personaById,
  personas as basePersonas,
  routeCustomScenario,
  type Persona,
} from "@/data/personas";
import { currentRep } from "@/data/reps";
import { summarizePerformance, type SessionResult } from "@/lib/session";

/**
 * The live prototype's state machine — everything that used to live in
 * /prototype's page component, lifted out unchanged.
 *
 * A hook rather than a component, and that's the whole point of this file. The
 * shell shows one mode at a time, so as a component this would unmount whenever
 * the guided walkthrough was on screen and a half-played call would reset. A
 * hook always runs, so Explore keeps its place while Guided is showing and the
 * flip back lands exactly where the reader left off.
 *
 * It returns state and callbacks, never JSX — rendering stays in
 * ExploreScreens.tsx, so this file has no reason to import a screen.
 */

export type Screen =
  | "home"
  | "hub"
  | "precall"
  | "connecting"
  | "call"
  | "report"
  | "profile";

export function useExplore() {
  const [screen, setScreen] = useState<Screen>("home");
  const [personas, setPersonas] = useState<Persona[]>(basePersonas);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, SessionResult>>({});
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  // CRM-integration state is a dealership-account config, not something an
  // individual rep is ever asked inside their own app — so its control lives in
  // the presenter chrome outside the phone, never in the simulated experience.
  //
  // Defaults to connected, which is the argument the submission is making: the
  // loop only proves itself once practice sits next to real numbers. Landing on
  // practice-only showed the degraded tier first and made the connected one look
  // like an extra, which is backwards. Switching to practice-only is still one
  // click away and shows what a rooftop gets on day one with nothing negotiated.
  const [crmIntegrated, setCrmIntegrated] = useState(true);
  const [personalizingPending, setPersonalizingPending] = useState(false);

  // The single shared "what's next" source of truth — Home, Hub, and Profile all
  // read from this so the app reads as connected, not three segments
  // independently guessing. Before any real session, an integrated account seeds
  // from the rep's own real-call history; a non-integrated account gets an honest
  // empty state instead of asking the rep to self-report their own gaps. After a
  // real session, it's always driven by that session's actual outcome.
  const [lastSessionSignal, setLastSessionSignal] = useState<string | null>(null);

  const rep = currentRep();
  const seedMoment = rep.flaggedMoments[0];

  const active = personas.find((p) => p.id === activeId) ?? null;
  const hasCompletedAnySession = Object.keys(results).length > 0;
  const firstUndone = personas.find((p) => !results[p.id]);
  const nextCapabilityId = !hasCompletedAnySession
    ? crmIntegrated
      ? (seedMoment?.capabilityId ?? null)
      : null
    : (lastSessionSignal ?? firstUndone?.capabilityId ?? null);
  const nextPersona = personas.find((p) => p.capabilityId === nextCapabilityId);
  const nextCapability = nextCapabilityId ? capabilityById(nextCapabilityId) : null;
  const nextLabel =
    nextPersona && nextCapability ? `${nextPersona.name} — ${nextCapability.label}` : null;

  // The "why" behind the recommendation, cited from real data already on hand
  // rather than a generic pitch — a quoted real-call moment when the account is
  // CRM-integrated, a practice-session reference otherwise.
  const matchedMoment =
    crmIntegrated && nextCapabilityId
      ? rep.flaggedMoments.find((m) => m.capabilityId === nextCapabilityId)
      : undefined;
  const nextReason = matchedMoment
    ? `Based on your calls — "${matchedMoment.realOutcome}" (${matchedMoment.realDate})`
    : hasCompletedAnySession
      ? "Based on your last practice call"
      : null;

  // The rep's actual standing — computed once here, shared by Home's performance
  // card and Profile's full readout via the same summarizePerformance helper, so
  // the two screens can't drift apart.
  const performance = summarizePerformance(results, rep, crmIntegrated);

  /**
   * Takes the target state rather than flipping, because the control is two
   * visible options rather than one toggle. Switching *on* with no session yet
   * shows the brief "personalizing from your dealership's data" pass, since
   * that's the moment the account would actually pull it — which now only
   * happens on the way back from practice-only, since connected is the state
   * this opens in. Re-selecting the option you're already on is a no-op.
   */
  function selectCrmIntegrated(next: boolean) {
    if (next === crmIntegrated) return;
    if (next && !hasCompletedAnySession) setPersonalizingPending(true);
    setCrmIntegrated(next);
  }

  function createCustom(text: string) {
    const baseId = routeCustomScenario(text);
    const base = personaById(baseId);
    if (!base) return;
    const custom: Persona = {
      ...base,
      id: `custom-${Date.now()}`,
      name: "Your scenario",
      blurb: text,
    };
    setPersonas((p) => [...p, custom]);
    setActiveId(custom.id);
    setScreen("precall");
  }

  return {
    screen,
    setScreen,
    personas,
    active,
    results,
    lastResult,
    performance,
    nextCapabilityId,
    nextLabel,
    nextReason,
    hasCompletedAnySession,
    crmIntegrated,
    selectCrmIntegrated,
    personalizingPending,
    setPersonalizingPending,
    setLastSessionSignal,
    setResults,
    setLastResult,
    setActiveId,
    createCustom,
  };
}

export type ExploreState = ReturnType<typeof useExplore>;
