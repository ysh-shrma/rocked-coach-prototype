"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home } from "@/components/v3/Home";
import { Hub } from "@/components/v3/Hub";
import { PreCall } from "@/components/v3/PreCall";
import { Connecting } from "@/components/v3/Connecting";
import { Call } from "@/components/v3/Call";
import { Report } from "@/components/v3/Report";
import { Profile } from "@/components/v3/Profile";
import { PhoneFrame } from "@/components/v3/PhoneFrame";
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

  /**
   * Takes the target state rather than flipping, because the control is now two
   * visible options instead of one toggle. Keeps the original behaviour:
   * switching *on* with no session yet shows the brief "personalizing from your
   * dealership's data" pass, since that's the moment the account would actually
   * pull it. Re-selecting the option you're already on is a no-op.
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
    <div className="v3 flex h-screen w-full items-center justify-center bg-[#e9e6f4]">
      {/* Presenter layer, outside the phone. CRM connection is a dealership
          account setting, never something an individual rep is asked — so it
          can't live inside the simulated app.

          Was a single pill that flipped its own label on click, which meant a
          reviewer couldn't tell two flows existed until they happened to press
          it. Both options are now visible at rest, so the control doubles as
          signage for the two-tier architecture: the product works on practice
          data alone, and gets better when the dealer's systems are connected. */}
      <div className="fixed left-5 top-5 z-30 flex flex-col gap-2">
        {/* Both other routes, not just the way back. Someone who lands here
            first — from a forwarded link, or by clicking past the deck — has no
            way of knowing the guided walkthrough exists otherwise, and the
            walkthrough is the version that explains what they're looking at. */}
        <div className="flex w-fit gap-2">
          <a
            href="/"
            className="rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-r-ink-2 shadow-lg transition-colors hover:text-r-ink"
          >
            ← The write-up
          </a>
          <a
            href="/tour"
            className="rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-r-brand shadow-lg transition-opacity hover:opacity-70"
          >
            Guided walkthrough
          </a>
        </div>

        <div className="w-fit rounded-[14px] bg-white p-2 shadow-lg">
          <p className="mono px-1 pb-[6px] text-[10px] font-semibold uppercase tracking-[0.09em] text-r-ink-4">
            Dealership data
          </p>
          <div className="flex gap-1">
            {[
              { on: false, label: "Practice only" },
              { on: true, label: "CRM + calls connected" },
            ].map((opt) => {
              const active = crmIntegrated === opt.on;
              return (
                <button
                  key={opt.label}
                  onClick={() => selectCrmIntegrated(opt.on)}
                  aria-pressed={active}
                  className={`rounded-[10px] px-3 py-[7px] text-[12px] font-semibold transition-colors ${
                    active
                      ? "bg-r-brand text-white"
                      : "text-r-ink-3 hover:bg-r-sunk hover:text-r-ink"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <a
        href="/prototype/manager"
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
