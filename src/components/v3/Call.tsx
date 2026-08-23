"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, PhoneOff, X } from "lucide-react";
import type { Choice, Persona } from "@/data/personas";
import { vehicles } from "@/data/vehicles";
import {
  applyCoaching,
  applyDelta,
  checkEnded,
  coachingBaseline,
  finalizeSession,
  initialSentiment,
  LOST_THRESHOLD,
  overall,
  type PickRecord,
  type SentimentState,
  type SessionResult,
} from "@/lib/session";
import { GroundTruthTrade, GroundTruthVehicle, PersonaAvatar, Sheet, SentimentBar, ease, line, say } from "./ui";

type TranscriptRow = { who: "customer" | "rep"; text: string; nodeId: string };

const deltaSign = (d: Choice["delta"]) => (d.trust ?? 0) + (d.patience ?? 0) + (d.interest ?? 0);
const PACING_CAVEAT_KEY = "rocked-pacing-caveat-seen";

/**
 * A call, not a chat log. The prior build stacked every turn as a growing,
 * scrollable bubble thread — the wrong metaphor entirely: a real caller only
 * ever experiences the current moment, never a scrollback inbox. This screen
 * instead keeps one hero position for the whole call: the customer's current
 * line is always the dominant view, the rep's own line shows as a brief
 * transient confirmation, and the two crossfade turn to turn. Full history
 * still exists, but only behind an explicit "View transcript" tap — never
 * the default view.
 *
 * The push-to-talk gesture is kept for fidelity to the real app, but this is
 * a backend-less mock: there's no ASR, so pressing the mic reveals the
 * candidate lines the rep could say next as an unranked bottom sheet, not a
 * "here's what to say" coaching hint. No line is marked best.
 *
 * Traversal is graph-based (persona.nodes / choice.next) — see personas.ts's
 * file comment for why a flat beat list broke coherence.
 */
export function Call({
  persona,
  onEnd,
  onExit,
}: {
  persona: Persona;
  onEnd: (result: SessionResult) => void;
  onExit: () => void;
}) {
  const [nodeId, setNodeId] = useState(persona.startNode);
  const [sentiment, setSentiment] = useState<SentimentState>(initialSentiment);
  const [coaching, setCoaching] = useState(coachingBaseline);
  const [picks, setPicks] = useState<PickRecord[]>([]);
  const [transcript, setTranscript] = useState<TranscriptRow[]>([
    { who: "customer", text: say(persona.nodes[persona.startNode]), nodeId: persona.startNode },
  ]);
  const [repFlash, setRepFlash] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [showPacingCaveat, setShowPacingCaveat] = useState(false);
  const [ending, setEnding] = useState<"none" | "lost" | "natural">("none");
  const [elapsed, setElapsed] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [flashTone, setFlashTone] = useState<"bad" | "good">("good");
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current);
  }, []);

  const node = persona.nodes[nodeId];
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  function openSheet() {
    if (typeof window !== "undefined" && !window.localStorage.getItem(PACING_CAVEAT_KEY)) {
      setShowPacingCaveat(true);
      window.localStorage.setItem(PACING_CAVEAT_KEY, "1");
      return;
    }
    setSheetOpen(true);
  }

  function pick(choice: Choice) {
    const newSentiment = applyDelta(sentiment, choice.delta);
    const newCoaching = applyCoaching(coaching, choice.coaching);
    const newPicks = [...picks, { nodeId, choice }];
    setSentiment(newSentiment);
    setCoaching(newCoaching);
    setPicks(newPicks);
    setSheetOpen(false);
    setTranscript((t) => [...t, { who: "rep", text: line(choice), nodeId }]);
    setRepFlash(line(choice));
    setFlashTone(deltaSign(choice.delta) < 0 ? "bad" : "good");
    setFlashKey((k) => k + 1);

    const moments = newPicks.filter((p) => p.choice.criticalMoment).map((p) => p.choice.criticalMoment!);
    const lost = checkEnded(newSentiment, moments);

    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setRepFlash(null), 1400);

    if (lost) {
      setTimeout(() => setEnding("lost"), 1300);
      setTimeout(() => {
        onEnd(finalizeSession(persona.id, newPicks, newSentiment, newCoaching, false));
      }, 2600);
      return;
    }

    if (choice.next === "end") {
      setTimeout(() => {
        setEnding("natural");
        setTranscript((t) => [...t, { who: "customer", text: persona.closingLine, nodeId: "end" }]);
      }, 1300);
      setTimeout(() => {
        onEnd(finalizeSession(persona.id, newPicks, newSentiment, newCoaching, true));
      }, 2900);
      return;
    }

    const nextNode = persona.nodes[choice.next];
    setTimeout(() => {
      setNodeId(choice.next);
      setTranscript((t) => [...t, { who: "customer", text: say(nextNode), nodeId: choice.next as string }]);
    }, 1300);
  }

  const gt = node?.groundTruth;
  const ov = overall(sentiment);
  const heroText = repFlash ?? (node ? say(node) : "");
  const heroWho = repFlash ? "rep" : "customer";

  return (
    <div className="coach-dark flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-d-line px-4 py-3">
        <button onClick={onExit} className="text-d-ink-3">
          <X size={18} strokeWidth={2.2} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-d-ink">{persona.name}</p>
          <p className="mono text-[10.5px] text-d-ink-3">{clock}</p>
        </div>
        <button
          onClick={() => setTranscriptOpen(true)}
          className="rounded-full border border-white/15 px-3 py-[6px] text-[11.5px] font-medium text-d-ink-2"
        >
          Transcript
        </button>
      </header>

      {/* One meter, not three — the pillar breakdown belongs on the report,
          per product-spec Improvement 1. But v1 rendered it as an unlabelled
          7px hairline, which reads as a progress bar, not as stakes. The rep
          needs to feel this number moving, so it gets a name, a value at title
          scale, and a marked walk-away point. */}
      <div className="shrink-0 px-5 pb-3">
        <div className="mb-[7px] flex items-baseline justify-between">
          <span className="mono text-caption uppercase text-d-ink-3">How she&rsquo;s feeling</span>
          <span className="flex items-baseline gap-[5px]">
            <span
              className={`text-title-2 tabular-nums ${
                ov <= 25 ? "text-r-bad" : ov <= 55 ? "text-r-amber" : "text-r-ok"
              }`}
            >
              {ov}
            </span>
            <span className="text-[11px] text-d-ink-3">/100</span>
          </span>
        </div>
        <SentimentBar
          value={ov}
          dark
          thick
          threshold={LOST_THRESHOLD}
          flashKey={flashKey}
          flashTone={flashTone}
        />
        <p className="mono mt-[6px] text-[10px] uppercase tracking-[0.07em] text-d-ink-3">
          Below the mark, she walks
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-7">
        {ending === "lost" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="shake-bad rounded-full bg-r-bad/20 px-5 py-3 text-[15px] font-semibold text-red-300"
          >
            She&rsquo;s gone. Lost customer.
          </motion.div>
        ) : (
          <>
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <PersonaAvatar name={persona.name} size={84} />
            </motion.div>
            <p className="mono mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-d-brand">
              {heroWho === "rep" ? "You" : persona.name}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${nodeId}-${heroWho}-${heroText.slice(0, 12)}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease }}
                className="mt-4 max-w-[30ch] text-center text-[clamp(19px,5vw,23px)] font-medium leading-[1.32] text-d-ink"
              >
                {heroText}
              </motion.p>
            </AnimatePresence>
            {gt && ending === "none" && !repFlash && (
              <motion.div
                className="mt-6 w-full max-w-[300px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease }}
              >
                {gt.kind === "vehicle" ? (
                  <GroundTruthVehicle vehicle={vehicles[gt.stock]} />
                ) : (
                  <GroundTruthTrade label={gt.label} rangeLow={gt.rangeLow} rangeHigh={gt.rangeHigh} />
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-d-line p-4">
        {ending === "none" ? (
          <div className="flex items-center justify-center gap-4">
            <motion.button
              onClick={openSheet}
              whileTap={{ scale: 0.94 }}
              className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-d-brand text-white shadow-[0_6px_20px_-6px_rgba(143,116,243,0.7)]"
              aria-label="Respond"
            >
              <Mic size={22} strokeWidth={2.2} />
            </motion.button>
            <button
              onClick={onExit}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10 text-white/80"
              aria-label="End call"
            >
              <PhoneOff size={17} strokeWidth={2.2} />
            </button>
          </div>
        ) : (
          <p className="text-center text-[12.5px] text-d-ink-3">Ending call&hellip;</p>
        )}
      </div>

      <Sheet open={showPacingCaveat} onClose={() => setShowPacingCaveat(false)} dark>
        <p className="text-[15px] font-bold text-d-ink">Heads up, before your first call</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-d-ink-2">
          Real conversations don&rsquo;t wait while you think. This mock can&rsquo;t fully simulate
          that pacing pressure yet — a real (voice-latency-aware) build would need to.
        </p>
        <button
          onClick={() => {
            setShowPacingCaveat(false);
            setSheetOpen(true);
          }}
          className="mt-4 w-full rounded-full bg-d-brand py-3 text-[14px] font-semibold text-white"
        >
          Got it
        </button>
      </Sheet>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} dark>
        {node && (
          <>
            <p className="mono mb-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-d-ink-3">
              What do you say?
            </p>
            <div className="flex flex-col gap-2">
              {node.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => pick(c)}
                  className="rounded-[14px] border border-white/10 bg-white/[0.04] p-3.5 text-left text-[14px] leading-snug text-d-ink transition-colors hover:border-d-brand hover:bg-white/[0.08]"
                >
                  {line(c)}
                </button>
              ))}
            </div>
          </>
        )}
      </Sheet>

      <Sheet open={transcriptOpen} onClose={() => setTranscriptOpen(false)} dark>
        <p className="mono mb-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-d-ink-3">
          Transcript so far
        </p>
        <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto">
          {transcript.map((row, i) => (
            <div key={i} className={row.who === "rep" ? "self-end" : "self-start"}>
              <p className="mono mb-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-d-ink-3">
                {row.who === "rep" ? "You" : "Customer"}
              </p>
              <p
                className={`max-w-[260px] rounded-[14px] px-3.5 py-2 text-[13.5px] leading-snug ${
                  row.who === "rep" ? "rounded-br-[4px] bg-d-brand text-white" : "rounded-bl-[4px] bg-white/8 text-d-ink"
                }`}
              >
                {row.text}
              </p>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
