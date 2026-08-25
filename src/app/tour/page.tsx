"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CHANGES } from "@/components/tour/changes";
import { seedSession } from "@/components/tour/seed";
import { PhoneFrame } from "@/components/v3/PhoneFrame";
import { Home } from "@/components/v3/Home";
import { Hub } from "@/components/v3/Hub";
import { Call } from "@/components/v3/Call";
import { Report } from "@/components/v3/Report";
import { Profile } from "@/components/v3/Profile";
import { ManagerShell, RepDetail, TeamList } from "@/components/v3/Manager";
import { personaById, personas } from "@/data/personas";
import { summarizePerformance } from "@/lib/session";
import { currentRep, rankedByGap, reps as seedReps } from "@/data/reps";

/**
 * The guided walkthrough.
 *
 * Phone pinned on one side, annotation opposite, and an explicit stepper rather
 * than scroll-linked animation — scroll-jacking fights a trackpad and a reviewer
 * on a laptop loses patience with it. They control the pace.
 *
 * The phone renders the real v3 screens rather than an iframe of /prototype, so
 * the screen and the annotation advance together. It renders the *screens*
 * directly rather than reusing the prototype's orchestrator, which keeps the
 * submitted prototype untouched by anything this page needs.
 */

/** The persona the tour walks. The recall scenario, because it's the one where
 *  honesty and pressure diverge most visibly. */
const TOUR_PERSONA = "burned-customer";

export default function TourPage() {
  const [i, setI] = useState(0);

  /** Bumped when a call reaches an ending, which remounts the call screen. The
   *  tour has nowhere to send a finished session — /prototype routes onEnd to
   *  the Report, but there's no Report in this column — so recycling the call is
   *  what keeps a lost customer from leaving the phone stuck on "Ending call…".
   *  Delayed so the terminal state is readable first. */
  const [callRun, setCallRun] = useState(0);
  const restartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (restartTimer.current) clearTimeout(restartTimer.current);
    },
    [],
  );

  function handleCallEnd() {
    if (restartTimer.current) clearTimeout(restartTimer.current);
    restartTimer.current = setTimeout(() => setCallRun((n) => n + 1), 1600);
  }

  const change = CHANGES[i];
  const persona = personaById(TOUR_PERSONA) ?? personas[0];

  // A real engine output, reached by a fixed path instead of by clicking.
  const seeded = seedSession(TOUR_PERSONA, "pressure");

  const atStart = i === 0;
  const atEnd = i === CHANGES.length - 1;

  return (
    <div className="doc min-h-screen bg-paper-2">
      {/* --- top bar: always an escape hatch, on every change --- */}
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-rule bg-paper px-6 py-3 md:px-8">
        <Link
          href="/"
          className="mono text-doc-label uppercase text-r-ink-4 transition-colors hover:text-r-ink"
        >
          &larr; Back to the write-up
        </Link>
        <span className="mono ml-auto text-doc-label uppercase text-r-ink-4">
          {i + 1} of {CHANGES.length}
        </span>
        <Link
          href="/prototype"
          className="mono text-doc-label uppercase text-r-brand transition-opacity hover:opacity-70"
        >
          Explore it unguided &rarr;
        </Link>
      </header>

      {/* --- the split. Below 1100px it stacks rather than squeezing: the phone
              is 402px because that's a real device width, and shrinking it would
              defeat the point of showing a mobile product. --- */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-6 py-6 min-[1100px]:flex-row min-[1100px]:gap-14 md:px-8 md:py-8">
        <div className="tour-phone mx-auto shrink-0 min-[1100px]:mx-0 min-[1100px]:sticky min-[1100px]:top-8">
          {/* The frame slot is the phone's height (874, per PhoneFrame) whichever
              device is in it. Change 5 swaps in a desktop console scaled to 336
              tall, and without a reserved slot the stepper below jumped ~540px on
              that one change — the same bug as before, from the other direction. */}
          <div className="flex min-[1100px]:min-h-[874px] min-[1100px]:items-start">
          {change.frame === "desktop" ? (
            <DesktopFrame>
              <ManagerShell>
                <TeamList
                  reps={rankedByGap(seedReps)}
                  selectedId={rankedByGap(seedReps)[0].id}
                  onSelect={() => {}}
                />
                <RepDetail
                  rep={rankedByGap(seedReps)[0]}
                  assigned={rankedByGap(seedReps)[0].assigned}
                  onAssign={() => {}}
                />
              </ManagerShell>
            </DesktopFrame>
          ) : (
            <PhoneFrame dark={change.screen === "call"}>
              {/* key remounts per change so each one opens on a clean state of its
                  screen rather than inheriting the last change's. */}
              <div key={`${change.id}-${callRun}`} className="h-full">
                <Screen
                  change={change}
                  persona={persona}
                  seeded={seeded}
                  onCallEnd={handleCallEnd}
                />
              </div>
            </PhoneFrame>
          )}
          </div>

          {/* The stepper lives with the phone, not under the annotation.
              A reserved-height annotation block can't work: change 1 runs 768px
              at 1500px wide and 847px at 1200px, so any single reservation is
              either short at one width or wasteful at the other, and the buttons
              moved either way. Here they're inside the sticky column — always the
              same screen position, always next to the thing they change. The
              ○● string is gone because the header already carries "N of 5". */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => setI((n) => Math.max(0, n - 1))}
              disabled={atStart}
              className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-[10px] text-[15px] font-semibold text-r-ink-2 transition-colors hover:border-r-ink-4 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-rule"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              Back
            </button>
            {atEnd ? (
              <Link
                href="/prototype"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-r-ink px-5 py-[10px] text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
              >
                Open the prototype
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            ) : (
              <button
                onClick={() => setI((n) => Math.min(CHANGES.length - 1, n + 1))}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-r-ink px-5 py-[10px] text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
              >
                Next
                <ArrowRight size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 pb-16">
          <div>
            <AnimatePresence mode="wait">
            <motion.div
              key={change.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              <p className="mono text-doc-label uppercase text-r-ink-4">
                {i + 1} / {CHANGES.length}
              </p>
              <h1 className="display mt-3 text-doc-h2">{change.title}</h1>

              <div className="mt-7 border-t border-rule pt-5">
                <p className="mono text-doc-label uppercase text-r-brand">
                  RockED today
                </p>
                <p className="mt-3 text-doc-body text-r-ink-2">{change.before}</p>
              </div>

              <div className="mt-6 border-t border-rule pt-5">
                <p className="mono text-doc-label uppercase text-r-ink-4">
                  In the prototype
                </p>
                <p className="mt-3 text-doc-body text-r-ink-2">{change.after}</p>
              </div>

              {/* The consequence, not the feature. The feature is already
                  visible in the phone; this is the argument. */}
              <p className="mt-7 border-l-2 border-r-ink pl-5 text-doc-h3">
                {change.consequence}
              </p>

              {/* The other half of the same change, where there is one. Sits
                  above `also` because it's part of the change rather than a
                  second argument about it. */}
              {change.partTwo && (
                <div className="mt-6 border-t border-rule pt-5">
                  <p className="mono text-doc-label uppercase text-r-ink-4">
                    And part two
                  </p>
                  <p className="mt-3 text-doc-body text-r-ink-2">
                    {change.partTwo}
                  </p>
                </div>
              )}

              {/* A second argument the screen alone doesn't carry. */}
              {change.also && (
                <p className="mt-6 text-doc-body text-r-ink-2">{change.also}</p>
              )}

              {/* Only on changes whose phone is genuinely interactive, so the
                  invitation is never made where it can't be taken up. */}
              {change.tryIt && (
                <p className="mt-7 text-doc-small text-r-ink-2">
                  <span className="mono mr-[6px] text-doc-label uppercase text-r-brand">
                    try it
                  </span>
                  {change.tryIt}
                </p>
              )}

              {change.caveat && (
                <p className="mt-7 text-doc-small text-r-ink-3">
                  <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
                    stated limit
                  </span>
                  {change.caveat}
                </p>
              )}
            </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * A desktop console at real size, scaled to sit in the phone's slot. Rendered at
 * 1180x800 and scaled rather than laid out narrow, so the manager view reflows
 * exactly as it would on a GM's monitor — a squeezed desktop layout would be a
 * different screen, and the point is to show the real one.
 */
function DesktopFrame({ children }: { children: React.ReactNode }) {
  const W = 1180;
  const H = 800;
  const scale = 0.42;
  return (
    <div
      className="overflow-hidden rounded-[10px] border border-rule bg-paper shadow-[0_24px_60px_-30px_rgba(20,19,26,0.4)]"
      style={{ width: W * scale, height: H * scale }}
    >
      <div
        style={{
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** One prototype screen, pinned.
 *
 *  *Navigation* is inert — onExit/onSelect/onBack are noops, so no change can walk
 *  itself to another screen and the stepper stays the only thing that moves.
 *  *Within* a change the screen is the real component and really works: change 1's
 *  call takes turns, moves the meter, and can be lost. (This comment used to
 *  claim all interactions were inert, which sent the next reader past the
 *  interactive path without testing it.) */
function Screen({
  change,
  persona,
  seeded,
  onCallEnd,
}: {
  change: (typeof CHANGES)[number];
  persona: NonNullable<ReturnType<typeof personaById>>;
  seeded: ReturnType<typeof seedSession>;
  onCallEnd: () => void;
}) {
  const noop = () => {};
  const results = seeded ? { [seeded.personaId]: seeded.result } : {};

  switch (change.screen) {
    case "call":
      // Not a noop: the tour has no Report to hand off to, so a finished call
      // has to recycle or the phone freezes on "Ending call…" forever.
      return <Call persona={persona} onEnd={onCallEnd} onExit={noop} />;

    case "report":
      return seeded ? (
        <Report persona={persona} result={seeded.result} onBackToHub={noop} />
      ) : null;

    case "hub":
      return (
        <Hub
          personas={personas}
          results={results}
          nextCapabilityId={persona.capabilityId}
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
          nextCapabilityId={persona.capabilityId}
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
