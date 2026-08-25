"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GuidedState } from "./useGuided";

/**
 * The walkthrough's annotation column. Lifted out of /tour unchanged.
 *
 * Order is deliberate: what RockED does today, what the prototype does instead,
 * then the consequence — which is the argument, and is why it gets the ink rule
 * rather than another heading. `partTwo` sits above `also` because it's part of
 * the change rather than a second argument about it.
 */
export function GuidedAside({ g }: { g: GuidedState }) {
  const { change, i, count } = g;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={change.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22 }}
      >
        <p className="mono text-doc-label uppercase text-r-ink-4">
          {i + 1} / {count}
        </p>
        <h1 className="display mt-3 text-doc-h2">{change.title}</h1>

        <div className="mt-7 border-t border-rule pt-5">
          <p className="mono text-doc-label uppercase text-r-brand">RockED today</p>
          <p className="mt-3 text-doc-body text-r-ink-2">{change.before}</p>
        </div>

        <div className="mt-6 border-t border-rule pt-5">
          <p className="mono text-doc-label uppercase text-r-ink-4">In the prototype</p>
          <p className="mt-3 text-doc-body text-r-ink-2">{change.after}</p>
        </div>

        {/* The consequence, not the feature. The feature is already visible in
            the phone; this is the argument. */}
        <p className="mt-7 border-l-2 border-r-ink pl-5 text-doc-h3">{change.consequence}</p>

        {change.partTwo && (
          <div className="mt-6 border-t border-rule pt-5">
            <p className="mono text-doc-label uppercase text-r-ink-4">And part two</p>
            <p className="mt-3 text-doc-body text-r-ink-2">{change.partTwo}</p>
          </div>
        )}

        {change.also && <p className="mt-6 text-doc-body text-r-ink-2">{change.also}</p>}

        {/* Only on changes whose phone is genuinely interactive, so the
            invitation is never made where it can't be taken up. */}
        {change.tryIt && (
          <p className="mt-7 text-doc-small text-r-ink-2">
            <span className="mono mr-[6px] text-doc-label uppercase text-r-brand">try it</span>
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
  );
}
