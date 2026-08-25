"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PhoneFrame } from "@/components/v3/PhoneFrame";
import { ManagerShell, RepDetail, TeamList } from "@/components/v3/Manager";
import { rankedByGap, reps as seedReps } from "@/data/reps";
import { DesktopFrame } from "./DesktopFrame";
import { ExploreAside } from "./ExploreAside";
import { ExploreScreens } from "./ExploreScreens";
import { GuidedAside } from "./GuidedAside";
import { GuidedScreen } from "./GuidedScreen";
import { ModeSwitch, type Mode } from "./ModeSwitch";
import { useExplore } from "./useExplore";
import { useGuided } from "./useGuided";

/**
 * One screen, two modes. `/prototype` opens on Explore, `/tour` on Guided, and
 * the switch in the header flips between them without going anywhere.
 *
 * THE PHONE DOES NOT MOVE. That is the whole design of this component and the
 * reason both modes share one layout rather than each keeping the one it had.
 * Explore used to be a full-bleed centred phone and Guided a two-column split;
 * flipping between those would have been a page transition wearing a toggle's
 * clothes. Here the device sits in the same slot in both modes and only the
 * column beside it changes, so the switch reads as what it is.
 *
 * Both modes' state lives here, via hooks rather than child components. A child
 * unmounts when the other mode shows, which would reset a half-played call every
 * time someone glanced at the walkthrough. Hooks always run, so Explore keeps its
 * place and Guided keeps its step.
 *
 * Scope nesting matters and is easy to undo by accident: `.doc` on the root for
 * the annotation's type and paper tokens, `.v3` on the phone slot for Jakarta,
 * the product's real typeface. Before this component existed the two routes
 * disagreed about that — /prototype set `.v3` and /tour didn't, so the same
 * screens rendered in a different font depending on which page you opened.
 */
export function PrototypeShell({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const explore = useExplore();
  const guided = useGuided();

  /**
   * Keep the address bar honest without involving the router. `useSearchParams`
   * would need a Suspense boundary under static export and a navigation would
   * remount the tree, which is exactly the state loss the hooks above exist to
   * prevent. This is a URL rewrite and nothing else.
   */
  function switchTo(next: Mode) {
    if (next === mode) return;
    setMode(next);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", next === "guided" ? "/tour" : "/prototype");
    }
  }

  const isGuided = mode === "guided";
  const desktopChange = isGuided && guided.change.frame === "desktop";
  const dark = isGuided ? guided.change.screen === "call" : explore.screen === "call";

  return (
    <div className="doc min-h-screen bg-paper-2">
      <header className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-rule bg-paper px-6 py-3 md:px-8">
        <Link
          href="/"
          className="mono text-doc-label uppercase text-r-ink-4 transition-colors hover:text-r-ink"
        >
          &larr; Back to the write-up
        </Link>
        <div className="ml-auto">
          <ModeSwitch mode={mode} onChange={switchTo} />
        </div>
        <a
          href="/prototype/manager"
          className="mono text-doc-label uppercase text-r-ink-4 transition-colors hover:text-r-ink"
        >
          Manager view &rarr;
        </a>
      </header>

      {/* Below 1100px the columns stack rather than squeezing: the phone is
          402px because that's a real device width, and shrinking it would
          defeat the point of showing a mobile product. */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-6 py-6 min-[1100px]:flex-row min-[1100px]:gap-14 md:px-8 md:py-8">
        <div className="proto-phone mx-auto shrink-0 min-[1100px]:mx-0 min-[1100px]:sticky min-[1100px]:top-8">
          {/* The frame slot is the phone's height (874, per PhoneFrame) whichever
              device is in it. Guided's change 5 swaps in a desktop console scaled
              to 336 tall, and without a reserved slot the stepper below jumped
              ~540px on that one change. */}
          <div className="v3 flex min-[1100px]:min-h-[874px] min-[1100px]:items-start">
            {desktopChange ? (
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
            ) : null}

            {/* BOTH trees stay mounted; the inactive one is hidden rather than
                unrendered. `Call` owns the entire conversation internally —
                nodeId, sentiment, picks, transcript, the elapsed timer — so
                unmounting it restarts the call. Keeping Explore's state in a hook
                preserves *which* screen you were on but not what you'd said on
                it, and a reviewer who glances at the walkthrough mid-call and
                comes back to turn one has been punished for looking.

                Cost is two 1s intervals when both modes happen to hold a live
                call. Worth it. */}
            <div className={desktopChange ? "hidden" : undefined}>
              <PhoneFrame dark={dark}>
                {/* key remounts per change so each one opens on a clean state of
                    its screen rather than inheriting the last change's. */}
                <div
                  key={`${guided.change.id}-${guided.callRun}`}
                  data-mode-tree="guided"
                  className={isGuided ? "h-full" : "hidden"}
                >
                  <GuidedScreen g={guided} />
                </div>

                <div data-mode-tree="explore" className={isGuided ? "hidden" : "h-full"}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={explore.screen}
                      className="h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      <ExploreScreens s={explore} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </PhoneFrame>
            </div>
          </div>

          {/* The stepper lives with the phone, not under the annotation. A
              reserved-height annotation block can't work: change 1 runs 768px at
              1500px wide and 847px at 1200px, so any single reservation is either
              short at one width or wasteful at the other, and the buttons moved
              either way. Here they're inside the sticky column — always the same
              screen position, always next to the thing they change. */}
          {isGuided && (
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => guided.setI((n) => Math.max(0, n - 1))}
                disabled={guided.atStart}
                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-[10px] text-[15px] font-semibold text-r-ink-2 transition-colors hover:border-r-ink-4 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-rule"
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back
              </button>
              {guided.atEnd ? (
                <button
                  onClick={() => switchTo("explore")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-r-ink px-5 py-[10px] text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
                >
                  Now explore it yourself
                  <ArrowRight size={16} strokeWidth={2} />
                </button>
              ) : (
                <button
                  onClick={() => guided.setI((n) => Math.min(guided.count - 1, n + 1))}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-r-ink px-5 py-[10px] text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
                >
                  Next
                  <ArrowRight size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pb-16">
          {isGuided ? (
            <GuidedAside g={guided} />
          ) : (
            <ExploreAside s={explore} onSwitchToGuided={() => switchTo("guided")} />
          )}
        </div>
      </div>
    </div>
  );
}
