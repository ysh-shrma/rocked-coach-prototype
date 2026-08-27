"use client";

import { ArrowRight } from "lucide-react";
import type { ExploreState } from "./useExplore";

/**
 * The live app's column: one orienting line and the two controls, nothing else.
 *
 * This used to carry a heading and two paragraphs explaining the sentiment
 * mechanic. All of it went. Guided is the default now, so anyone reading this
 * chose the live prototype over being walked through it, and explaining the
 * mechanic in prose to someone who just asked to press things themselves is the
 * wrong instinct twice over: they'll find it faster by playing a call, and the
 * walkthrough already says it properly one click away.
 *
 * The dealership-data toggle stays because it isn't documentation, it's a
 * control: it switches between the two tiers and genuinely changes what Profile
 * and the manager view show. It's a dealership account setting, never something
 * an individual rep is asked, which is why it lives out here rather than in the
 * phone.
 *
 * Ink, not purple. Purple on these pages means RockED's.
 */
export function ExploreAside({ s }: { s: ExploreState }) {
  return (
    <div>
      <p className="mono text-doc-label uppercase text-r-ink-4">The live prototype</p>
      <p className="mt-4 text-doc-body text-r-ink-2">
        Eight screens, nothing on rails. Open AI Coach, pick a customer, and take
        the call: every line you choose moves her, and she can leave.
      </p>

      <div className="mt-9 border-t border-rule pt-6">
        <p className="mono text-doc-label uppercase text-r-ink-4">Dealership data</p>
        <div className="mt-3 inline-flex rounded-full border border-rule p-1">
          {[
            { on: true, label: "CRM + Call data" },
            { on: false, label: "Practice Only" },
          ].map((opt) => {
            const active = s.crmIntegrated === opt.on;
            return (
              <button
                key={opt.label}
                onClick={() => s.selectCrmIntegrated(opt.on)}
                aria-pressed={active}
                className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                  active ? "bg-r-ink text-white" : "text-r-ink-3 hover:text-r-ink"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 border-t border-rule pt-6">
        <a
          href="/prototype/manager"
          className="inline-flex items-center gap-2 text-doc-body font-semibold text-r-ink transition-opacity hover:opacity-70"
        >
          Open the manager view
          <ArrowRight size={16} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}
