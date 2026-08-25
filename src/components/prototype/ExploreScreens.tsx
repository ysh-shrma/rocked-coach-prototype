"use client";

import { Home } from "@/components/v3/Home";
import { Hub } from "@/components/v3/Hub";
import { PreCall } from "@/components/v3/PreCall";
import { Connecting } from "@/components/v3/Connecting";
import { Call } from "@/components/v3/Call";
import { Report } from "@/components/v3/Report";
import { Profile } from "@/components/v3/Profile";
import type { ExploreState } from "./useExplore";

/**
 * The live app's screen router. Lifted verbatim out of /prototype's old `body()`
 * switch — every handler still does exactly what it did.
 *
 * Split from `useExplore` so the hook holds state and this holds rendering: the
 * shell can then keep Explore's state alive while Guided is on screen without
 * also keeping a Call component mounted and running its timers.
 */
export function ExploreScreens({ s }: { s: ExploreState }) {
  switch (s.screen) {
    case "home":
      return (
        <Home
          nextLabel={s.nextLabel}
          nextReason={s.nextReason}
          performance={s.performance}
          onOpenCoach={() => s.setScreen("hub")}
          onOpenProfile={() => s.setScreen("profile")}
          showPersonalizing={s.personalizingPending}
          onPersonalizingDone={() => s.setPersonalizingPending(false)}
        />
      );

    case "hub":
      return (
        <Hub
          personas={s.personas}
          results={s.results}
          nextCapabilityId={s.nextCapabilityId}
          nextReason={s.nextReason}
          onBack={() => s.setScreen("home")}
          onSelectPersona={(id) => {
            s.setActiveId(id);
            s.setScreen("precall");
          }}
          onCreateCustom={s.createCustom}
          onOpenProfile={() => s.setScreen("profile")}
        />
      );

    case "precall":
      return (
        s.active && (
          <PreCall
            persona={s.active}
            onBack={() => s.setScreen("hub")}
            onBegin={() => s.setScreen("connecting")}
          />
        )
      );

    case "connecting":
      return s.active && <Connecting persona={s.active} onDone={() => s.setScreen("call")} />;

    case "call":
      return (
        s.active && (
          <Call
            key={s.active.id}
            persona={s.active}
            onExit={() => s.setScreen("hub")}
            onEnd={(result) => {
              const id = s.active!.id;
              s.setResults((r) => ({ ...r, [id]: result }));
              s.setLastResult(result);
              s.setScreen("report");
            }}
          />
        )
      );

    case "report":
      return (
        s.active &&
        s.lastResult && (
          <Report
            persona={s.active}
            result={s.lastResult}
            onBackToHub={(signal) => {
              s.setLastSessionSignal(signal);
              s.setScreen("hub");
            }}
          />
        )
      );

    case "profile":
      return (
        <Profile
          personas={s.personas}
          results={s.results}
          nextCapabilityId={s.nextCapabilityId}
          seedIsProvisional={!s.hasCompletedAnySession && s.crmIntegrated}
          crmIntegrated={s.crmIntegrated}
          onBack={() => s.setScreen("hub")}
          onPracticeNow={() => s.setScreen("hub")}
        />
      );
  }
}
