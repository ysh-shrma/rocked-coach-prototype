"use client";

import { Home } from "@/components/v3/Home";
import { Hub } from "@/components/v3/Hub";
import { Call } from "@/components/v3/Call";
import { Report } from "@/components/v3/Report";
import { Profile } from "@/components/v3/Profile";
import { summarizePerformance } from "@/lib/session";
import { currentRep } from "@/data/reps";
import { personas } from "@/data/personas";
import type { GuidedState } from "./useGuided";

/**
 * One prototype screen, pinned.
 *
 * *Navigation* is inert — onExit/onSelect/onBack are noops, so no change can walk
 * itself to another screen and the stepper stays the only thing that moves.
 * *Within* a change the screen is the real component and really works: change 1's
 * call takes turns, moves the meter, and can be lost.
 */
export function GuidedScreen({ g }: { g: GuidedState }) {
  const noop = () => {};
  const results = g.seeded ? { [g.seeded.personaId]: g.seeded.result } : {};

  switch (g.change.screen) {
    case "call":
      // Not a noop: this mode has no Report to hand off to, so a finished call
      // has to recycle or the phone freezes on "Ending call…" forever.
      return <Call persona={g.persona} onEnd={g.handleCallEnd} onExit={noop} />;

    case "report":
      return g.seeded ? (
        <Report persona={g.persona} result={g.seeded.result} onBackToHub={noop} />
      ) : null;

    case "hub":
      return (
        <Hub
          personas={personas}
          results={results}
          nextCapabilityId={g.persona.capabilityId}
          nextReason="Based on your last practice call"
          onBack={noop}
          onSelectPersona={noop}
          onCreateCustom={noop}
          onOpenProfile={noop}
        />
      );

    case "profile":
      return (
        <Profile
          personas={personas}
          results={results}
          nextCapabilityId={g.persona.capabilityId}
          seedIsProvisional={false}
          crmIntegrated
          onBack={noop}
          onPracticeNow={noop}
        />
      );

    default:
      return (
        <Home
          nextLabel={null}
          nextReason={null}
          performance={summarizePerformance(results, currentRep(), true)}
          onOpenCoach={noop}
          onOpenProfile={noop}
          showPersonalizing={false}
          onPersonalizingDone={noop}
        />
      );
  }
}
