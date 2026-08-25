"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Comparison } from "@/components/deck/Comparison";
import type { GuidedState } from "./useGuided";

/**
 * The walkthrough's annotation column.
 *
 * Built to one rule: a step has to be comprehensible in about five seconds. The
 * previous version was five paragraphs — before, after, consequence, and up to
 * three more — and a reviewer read all of them before working out that the first
 * two described the same screen twice. Now it's a claim, the comparison, the
 * payoff, and at most two subordinate lines.
 *
 * Nothing here is a paragraph. `limit`, `note` and `tryIt` are single lines and
 * sit below the consequence on purpose: they're the part a reader can skip and
 * still have got the step.
 */
export function GuidedAside({ g }: { g: GuidedState }) {
  const { change, i, count } = g;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={change.id}
        data-aside="guided"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
      >
        <p className="mono text-doc-label uppercase text-r-ink-4">
          {i + 1} / {count}
        </p>
        <h1 className="display mt-3 text-doc-h2">{change.title}</h1>

        <div className="mt-8">
          {/* The manager step hands most of the width to the desktop console,
              so its comparison stacks rather than squeezing two cards into
              ~430px. */}
          <Comparison
            today={change.today}
            build={change.build}
            stack={change.frame === "desktop"}
          />
        </div>

        {/* The payoff. Bold behind an ink rule, so it reads as the conclusion
            rather than a fourth bullet. */}
        <p className="mt-8 border-l-2 border-r-ink pl-5 text-doc-h3">
          {change.consequence}
        </p>

        {(change.limit || change.note || change.tryIt) && (
          <div className="mt-7 space-y-3 border-t border-rule pt-5">
            {change.note && (
              <p className="text-doc-small text-r-ink-2">{change.note}</p>
            )}
            {change.limit && (
              <p className="text-doc-small text-r-ink-3">
                <span className="mono mr-[6px] text-doc-label uppercase text-r-ink-4">
                  stated limit
                </span>
                {change.limit}
              </p>
            )}
            {/* Only where the phone is genuinely interactive, so the invitation
                is never made where it can't be taken up. */}
            {change.tryIt && (
              <p className="text-doc-small text-r-ink-2">
                <span className="mono mr-[6px] text-doc-label uppercase text-r-ink">
                  try it
                </span>
                {change.tryIt}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
