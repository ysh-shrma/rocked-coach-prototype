"use client";

import { ArrowRight } from "lucide-react";
import type { ExploreState } from "./useExplore";

/**
 * The live app's column, and the fix for a problem this route has had since it
 * was built: someone who opens it cold sees a phone and no argument. The
 * walkthrough always explained itself; Explore never did.
 *
 * It also carries the two presenter controls that used to float in fixed
 * corners. The dealership-data toggle in particular is a dealership *account*
 * setting, never something an individual rep is asked, so it can't live inside
 * the phone — but a floating pill gave no clue what it was for either.
 *
 * Ink, not purple, throughout. Purple on these pages means RockED's, and this
 * column is entirely the author's chrome.
 */
export function ExploreAside({
  s,
  onSwitchToGuided,
}: {
  s: ExploreState;
  onSwitchToGuided: () => void;
}) {
  return (
    <div>
      <p className="mono text-doc-label uppercase text-r-ink-4">You&rsquo;re in the live prototype</p>
      <h1 className="display mt-3 text-doc-h2">Nothing here is on rails.</h1>

      <p className="mt-6 text-doc-body text-r-ink-2">
        Eight screens, a working consequence engine, no backend. Open AI Coach
        from the home screen and pick any of the eight customers.
      </p>
      <p className="mt-4 text-doc-body text-r-ink-2">
        The call is the part worth your time. Every line you choose moves her
        trust, patience and interest — and if the total drops past the walk-away
        point she ends the call herself. Play one straight and one badly on the
        same customer and they diverge.
      </p>

      {/* The one thing this layout has to get right: Explore is the default, so
          the walkthrough only gets found if it's offered here as well as in the
          header. */}
      <button
        onClick={onSwitchToGuided}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-r-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-r-ink-2"
      >
        Rather be shown? Take the guided walkthrough
        <ArrowRight size={16} strokeWidth={2} />
      </button>

      <div className="mt-10 border-t border-rule pt-6">
        <p className="mono text-doc-label uppercase text-r-ink-4">Dealership data</p>
        <div className="mt-3 inline-flex rounded-full border border-rule p-1">
          {/* Connected first, because it's both the default and the argument.
              Practice-only sits second as the fallback it is. */}
          {[
            { on: true, label: "CRM + calls connected" },
            { on: false, label: "Practice only" },
          ].map((opt) => {
            const active = s.crmIntegrated === opt.on;
            return (
              <button
                key={opt.label}
                onClick={() => s.selectCrmIntegrated(opt.on)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                  active
                    ? "bg-r-ink text-white"
                    : "text-r-ink-3 hover:text-r-ink"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-doc-small text-r-ink-3">
          Both tiers are real screens. Connected puts the rep&rsquo;s own close
          and upsell numbers beside the pillar he drilled &mdash; seeded and tagged
          as such wherever they appear. Practice-only is what a rooftop gets on
          day one, with nothing to negotiate.
        </p>
      </div>

      <div className="mt-8 border-t border-rule pt-6">
        <a
          href="/prototype/manager"
          className="inline-flex items-center gap-2 text-doc-body font-semibold text-r-ink transition-opacity hover:opacity-70"
        >
          Open the manager view
          <ArrowRight size={16} strokeWidth={2} />
        </a>
        <p className="mt-2 text-doc-small text-r-ink-3">
          The GM console — the team ranked by who needs coaching most. Desktop,
          full screen, because a GM works at a desk with a CRM open.
        </p>
      </div>
    </div>
  );
}
