"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "@/components/Home";
import { Hub } from "@/components/Hub";
import { PreCall } from "@/components/PreCall";
import { Connecting } from "@/components/Connecting";
import { Call } from "@/components/Call";
import { Report } from "@/components/Report";
import { Profile } from "@/components/Profile";
import { PhoneFrame } from "@/components/PhoneFrame";
import { capabilityById, personaById, personas as basePersonas, routeCustomScenario, type Persona } from "@/data/personas";
import { currentRep } from "@/data/reps";
import { summarizePerformance, type SessionResult } from "@/lib/session";

type Screen = "home" | "hub" | "precall" | "connecting" | "call" | "report" | "profile";

export default function RepApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [personas, setPersonas] = useState<Persona[]>(basePersonas);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, SessionResult>>({});
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  // Fix 4: CRM-integration state is a dealership-account config, not
  // something an individual rep is ever asked inside their own app — so it
  // lives in the presenter-only demo chrome outside PhoneFrame entirely,
  // the same layer as the existing "Manager view →" link, never inside the
  // simulated rep experience.
  const [crmIntegrated, setCrmIntegrated] = useState(false);
  const [personalizingPending, setPersonalizingPending] = useState(false);

  // The single shared "what's next" source of truth — Home, Hub, and
  // Profile all read from this so the app reads as connected, not three
  // segments independently guessing. Before any real session, an integrated
  // account seeds from the rep's own real-call history; a non-integrated
  // account gets an honest empty state instead of asking the rep to
  // self-report their own gaps. After a real session, it's always driven by
  // that session's actual outcome.
  const [lastSessionSignal, setLastSessionSignal] = useState<string | null>(null);

  const rep = currentRep();
  const seedMoment = rep.flaggedMoments[0];

  const active = personas.find((p) => p.id === activeId) ?? null;
  const hasCompletedAnySession = Object.keys(results).length > 0;
  const firstUndone = personas.find((p) => !results[p.id]);
  const nextCapabilityId = !hasCompletedAnySession
    ? (crmIntegrated ? (seedMoment?.capabilityId ?? null) : null)
    : (lastSessionSignal ?? firstUndone?.capabilityId ?? null);
  const nextPersona = personas.find((p) => p.capabilityId === nextCapabilityId);
  const nextCapability = nextCapabilityId ? capabilityById(nextCapabilityId) : null;
  const nextLabel = nextPersona && nextCapability ? `${nextPersona.name} — ${nextCapability.label}` : null;

  // Fix 6: the "why" behind the recommendation, cited from real data already
  // on hand rather than a generic pitch — a quoted real-call moment when the
  // account is CRM-integrated, a practice-session reference otherwise.
  const matchedMoment = crmIntegrated && nextCapabilityId
    ? rep.flaggedMoments.find((m) => m.capabilityId === nextCapabilityId)
    : undefined;
  const nextReason = matchedMoment
    ? `Based on your calls — "${matchedMoment.realOutcome}" (${matchedMoment.realDate})`
    : hasCompletedAnySession
      ? "Based on your last practice call"
      : null;

  // The rep's actual standing (Fix A) — computed once here, shared by
  // Home's performance card and Profile's full readout via the same
  // summarizePerformance helper, so the two screens can't drift apart.
  const performance = summarizePerformance(results, rep, crmIntegrated);

  function toggleCrmIntegrated() {
    setCrmIntegrated((prev) => {
      const next = !prev;
      if (next && !hasCompletedAnySession) setPersonalizingPending(true);
      return next;
    });
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

  function body() {
    switch (screen) {
      case "home":
        return (
          <Home
            nextLabel={nextLabel}
            nextReason={nextReason}
            performance={performance}
            onOpenCoach={() => setScreen("hub")}
            onOpenProfile={() => setScreen("profile")}
            showPersonalizing={personalizingPending}
            onPersonalizingDone={() => setPersonalizingPending(false)}
          />
        );

      case "hub":
        return (
          <Hub
            personas={personas}
            results={results}
            nextCapabilityId={nextCapabilityId}
            nextReason={nextReason}
            onBack={() => setScreen("home")}
            onSelectPersona={(id) => {
              setActiveId(id);
              setScreen("precall");
            }}
            onCreateCustom={createCustom}
            onOpenProfile={() => setScreen("profile")}
          />
        );

      case "precall":
        return active && <PreCall persona={active} onBack={() => setScreen("hub")} onBegin={() => setScreen("connecting")} />;

      case "connecting":
        return active && <Connecting persona={active} onDone={() => setScreen("call")} />;

      case "call":
        return (
          active && (
            <Call
              key={active.id}
              persona={active}
              onExit={() => setScreen("hub")}
              onEnd={(result) => {
                setResults((r) => ({ ...r, [active.id]: result }));
                setLastResult(result);
                setScreen("report");
              }}
            />
          )
        );

      case "report":
        return (
          active &&
          lastResult && (
            <Report
              persona={active}
              result={lastResult}
              onBackToHub={(signal) => {
                setLastSessionSignal(signal);
                setScreen("hub");
              }}
            />
          )
        );

      case "profile":
        return (
          <Profile
            personas={personas}
            results={results}
            nextCapabilityId={nextCapabilityId}
            seedIsProvisional={!hasCompletedAnySession && crmIntegrated}
            crmIntegrated={crmIntegrated}
            onBack={() => setScreen("hub")}
            onPracticeNow={() => setScreen("hub")}
          />
        );
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#e9e6f4]">
      <button
        onClick={toggleCrmIntegrated}
        className="fixed left-5 top-5 z-30 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-r-ink shadow-lg"
      >
        <span className={`h-[8px] w-[8px] rounded-full ${crmIntegrated ? "bg-emerald-500" : "bg-r-ink-4"}`} />
        Demo: {crmIntegrated ? "CRM integrated" : "Not integrated"}
      </button>
      <a
        href="/manager"
        className="fixed right-5 top-5 z-30 rounded-full bg-r-ink px-4 py-2 text-[12.5px] font-semibold text-white shadow-lg"
      >
        Manager view →
      </a>
      <PhoneFrame dark={screen === "call"}>
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {body()}
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>
    </div>
  );
}
