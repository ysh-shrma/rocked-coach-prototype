"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus, Sparkles } from "lucide-react";
import { capabilityForPersona, type Persona } from "@/data/personas";
import type { SessionResult } from "@/lib/session";
import { Btn, PersonaAvatar, blurb, cap, rise, Sheet } from "./ui";

export function Hub({
  personas,
  results,
  nextCapabilityId,
  nextReason,
  onBack,
  onSelectPersona,
  onCreateCustom,
  onOpenProfile,
}: {
  personas: Persona[];
  results: Record<string, SessionResult>;
  /** The one thing to do next — shared with Home and Profile, so all three
   *  surfaces always agree instead of reading as disconnected segments. */
  nextCapabilityId: string | null;
  /** Fix 6: why this is the recommendation — a quoted real-call moment, a
   *  practice-session reference, or null when there's nothing to cite yet. */
  nextReason: string | null;
  onBack: () => void;
  onSelectPersona: (id: string) => void;
  onCreateCustom: (text: string) => void;
  onOpenProfile: () => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const doneCount = personas.filter((p) => results[p.id]).length;
  const nextPersona =
    personas.find((p) => p.capabilityId === nextCapabilityId) ?? personas.find((p) => !results[p.id]) ?? null;

  return (
    <div className="flex h-full flex-col bg-white">
      <motion.div className="flex shrink-0 items-center gap-3 border-b border-r-line px-4 py-3" {...rise(0)}>
        <button onClick={onBack} className="text-r-ink-3">
          <ArrowLeft size={20} strokeWidth={2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-title-3 text-r-ink">AI Coach — Sales</p>
          {/* "actually" dropped: at footnote size the longer line wrapped to two
              rows and pushed the header taller. Shorter copy is the fix rather
              than a smaller size, since the header now sets the screen's
              hierarchy. */}
          <p className="text-footnote text-r-ink-4">Practice conversations that react to you</p>
        </div>
        <button
          onClick={onOpenProfile}
          className="rounded-full bg-r-sunk px-3 py-[6px] text-[12px] font-semibold text-r-ink-2 transition-colors hover:bg-r-line-2"
        >
          Profile
        </button>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {/* The one answer, not a grid to scan. */}
        <motion.div className="mb-6" {...rise(0.03)}>
          <p className="mono mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-brand">Up next</p>
          {nextPersona ? (
            <button
              onClick={() => onSelectPersona(nextPersona.id)}
              className="hint card-lift flex w-full items-center gap-3.5 border-r-brand-line p-4 text-left"
              style={{ borderWidth: 1.5 }}
            >
              <PersonaAvatar name={nextPersona.name} size={48} />
              <span className="min-w-0 flex-1">
                <span className="block text-title-2 text-r-ink">{nextPersona.name}</span>
                <span className="mt-[2px] block text-[12.5px] leading-snug text-r-ink-3">{blurb(nextPersona)}</span>
                {nextReason && (
                  <span className="mt-[6px] block text-[11.5px] leading-snug text-r-ink-4">{nextReason}</span>
                )}
              </span>
              <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-r-brand text-white">
                <ArrowRight size={16} strokeWidth={2.4} />
              </span>
            </button>
          ) : (
            <div className="card-lift p-4 text-[13.5px] text-r-ink-2">
              Every scenario tested. Try a custom one, or revisit a persona to sharpen a pillar further.
            </div>
          )}
        </motion.div>

        {/* The full path — order and progress visible, nothing hard-locked. */}
        <motion.div className="mb-2 flex items-center justify-between" {...rise(0.08)}>
          <p className="mono text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">Your path</p>
          <p className="mono text-[11px] text-r-ink-4">
            {doneCount} of {personas.length}
          </p>
        </motion.div>

        <div className="relative pb-2 pl-[19px]">
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-r-line" />
          <div className="flex flex-col gap-1">
            {personas.map((p, i) => {
              const r = results[p.id];
              const capability = capabilityForPersona(p.id);
              const isCurrent = !r && p.id === nextPersona?.id;
              return (
                <JourneyNode
                  key={p.id}
                  persona={p}
                  capability={capability}
                  done={!!r}
                  proven={!!r?.capabilityProven}
                  current={isCurrent}
                  outcome={r?.outcome}
                  delay={0.12 + i * 0.03}
                  onClick={() => onSelectPersona(p.id)}
                />
              );
            })}

            <motion.button
              onClick={() => setShowCustom(true)}
              whileTap={{ scale: 0.98 }}
              className="relative ml-[2px] mt-2 flex items-center gap-3 rounded-[14px] border border-dashed border-r-ink-5 p-3 pl-4 text-left text-r-ink-3 transition-colors hover:border-r-brand hover:bg-r-brand-tint/40 hover:text-r-brand"
              {...rise(0.12 + personas.length * 0.03)}
            >
              <span className="absolute -left-[19px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white">
                <Plus size={11} strokeWidth={2.6} />
              </span>
              <span className="text-[13.5px] font-semibold">Create your own scenario</span>
            </motion.button>
          </div>
        </div>
      </div>

      <Sheet open={showCustom} onClose={() => setShowCustom(false)}>
        <CustomScenarioForm
          onSubmit={(text) => {
            onCreateCustom(text);
            setShowCustom(false);
          }}
        />
      </Sheet>
    </div>
  );
}

function JourneyNode({
  persona,
  capability,
  done,
  proven,
  current,
  outcome,
  delay,
  onClick,
}: {
  persona: Persona;
  capability?: { label: string };
  done: boolean;
  proven: boolean;
  current: boolean;
  outcome?: SessionResult["outcome"];
  delay: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`relative flex items-start gap-3.5 rounded-[14px] p-3 pl-4 text-left transition-colors ${
        current ? "bg-r-brand-tint" : "hover:bg-r-sunk"
      }`}
      {...rise(delay)}
    >
      <span
        className={`absolute -left-[19px] top-[14px] flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full ${
          done ? "bg-r-ok" : current ? "bg-r-brand" : "border-2 border-r-line bg-white"
        }`}
      >
        {done && <Check size={10} strokeWidth={3.4} className="text-white" />}
      </span>
      <span className={`min-w-0 flex-1 ${done || current ? "opacity-100" : "opacity-60"}`}>
        <span className={`block text-[14px] font-semibold ${current ? "text-r-brand" : "text-r-ink"}`}>
          {persona.name}
        </span>
        {capability && (
          <span className="mt-[2px] block text-[12px] leading-snug text-r-ink-3">{cap(capability)}</span>
        )}
        {done && (
          <span
            className={`mono mt-[4px] inline-block text-[10.5px] font-semibold ${
              outcome === "lost" ? "text-r-bad" : outcome === "closed" ? "text-r-ok" : "text-r-ink-4"
            }`}
          >
            {outcome === "lost" ? "Lost the customer" : outcome === "closed" ? "Closed" : "No commitment yet"}
            {proven && " · Capability proven"}
          </span>
        )}
      </span>
    </motion.button>
  );
}

const PRESETS = [
  "I always fumble when a customer pushes back on price",
  "I panic when someone's rude to me",
  "I don't know what to say to a nervous first-timer",
  "I never know how to close without sounding pushy",
];

function CustomScenarioForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div>
      <p className="flex items-center gap-[7px] text-[15px] font-bold text-r-ink">
        <Sparkles size={16} className="text-r-brand" />
        What are you stuck on?
      </p>
      <p className="mt-1 text-[12.5px] text-r-ink-3">
        Describe it in your own words, or pick one below — we'll build a practice session around it.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. I always fumble when a customer pushes back on price"
        rows={3}
        className="mt-4 w-full resize-none rounded-[14px] border border-r-line bg-r-sunk p-3 text-[14px] outline-none focus:border-r-brand"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setText(p)}
            className="rounded-full border border-r-line px-3 py-[6px] text-[12px] text-r-ink-2 hover:border-r-brand hover:text-r-brand"
          >
            {p}
          </button>
        ))}
      </div>
      <Btn className="mt-4 w-full" size="lg" disabled={!text.trim()} onClick={() => onSubmit(text.trim())}>
        Build my scenario
      </Btn>
    </div>
  );
}
