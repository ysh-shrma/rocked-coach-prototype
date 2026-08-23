"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Phone, Target } from "lucide-react";
import type { Persona } from "@/data/personas";
import { Btn, PersonaAvatar, blurb, objective, rise } from "./ui";

/**
 * One static sheet, not a swipeable carousel — the spec's "objective +
 * persona blurb" is one card's worth of content. Swiping would imply a
 * second card of content that doesn't exist.
 */
export function PreCall({
  persona,
  onBack,
  onBegin,
}: {
  persona: Persona;
  onBack: () => void;
  onBegin: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <motion.div className="flex shrink-0 items-center gap-3 px-4 py-3" {...rise(0)}>
        <button onClick={onBack} className="text-r-ink-3">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
      </motion.div>
      <div className="flex min-h-0 flex-1 flex-col justify-center px-6 pb-10">
        <motion.div {...rise(0.05)}>
          <PersonaAvatar name={persona.name} size={56} />
        </motion.div>
        <motion.p className="mono mt-5 text-[11px] font-semibold uppercase tracking-[0.09em] text-r-brand" {...rise(0.1)}>
          Up next
        </motion.p>
        <motion.h1 className="mt-2 text-title-1 text-r-ink" {...rise(0.14)}>
          {persona.name}
        </motion.h1>
        <motion.p className="mt-3 text-[15px] leading-relaxed text-r-ink-2" {...rise(0.18)}>
          {blurb(persona)}
        </motion.p>

        <motion.div className="card-lift mt-6 flex items-start gap-3 p-4" {...rise(0.24)}>
          <Target size={18} className="mt-[2px] shrink-0 text-r-brand" strokeWidth={2} />
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.05em] text-r-brand">Objective</p>
            <p className="mt-1 text-[14px] leading-snug text-r-ink-2">{objective(persona)}</p>
          </div>
        </motion.div>

        {/* Was a 33-word paragraph explaining the sentiment mechanic. Two
            problems with that: it made this the most prose-heavy screen in the
            app (88% of its words sat inside full sentences), and the Call screen
            already *shows* the same mechanic live with a named meter and a
            marked walk-away point. Naming the three behaviours as tokens and the
            consequence as one clause carries the same information in 12 words. */}
        <motion.div className="mt-5 flex flex-col gap-2" {...rise(0.3)}>
          <div className="flex items-center gap-2">
            <span className="mono w-[52px] shrink-0 text-caption uppercase text-bad-500">Costs</span>
            <span className="text-footnote text-r-ink-3">
              Dishonesty &middot; Pressure &middot; Dismissiveness
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="mono w-[52px] shrink-0 text-caption uppercase text-ok-500">Earns</span>
            <span className="text-footnote text-r-ink-3">Honesty &middot; Reading her pace</span>
          </div>
          <p className="mt-1 text-footnote font-semibold text-r-ink-2">
            Drop far enough and she walks.
          </p>
        </motion.div>
      </div>
      <motion.div className="shrink-0 border-t border-r-line p-4" {...rise(0.35)}>
        <Btn size="lg" className="w-full" onClick={onBegin}>
          <Phone size={16} strokeWidth={2.3} />
          Begin call
        </Btn>
      </motion.div>
    </div>
  );
}
