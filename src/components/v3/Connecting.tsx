"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Persona } from "@/data/personas";
import { PersonaAvatar, ease } from "./ui";

const LINES = (name: string) => [
  "Reading the scenario…",
  `Bringing ${name} on the line…`,
  "Practice call — no real speech, no real latency yet",
];

/**
 * Ported from agent-test-drive's Assembling.tsx technique: a short,
 * scheduled-timeline loading beat over three blurred, drifting radial
 * gradients, recolored from indigo to RockED lavender/purple/amber. Fills
 * what used to be a jarring instant cut from "Begin call" to the live call
 * screen, and gives the real-time-pacing caveat a natural home instead of
 * cluttering the in-call header.
 */
export function Connecting({ persona, onDone }: { persona: Persona; onDone: () => void }) {
  const lines = LINES(persona.name);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const timers = lines.map((_, i) => setTimeout(() => setShown(i + 1), 300 + i * 700));
    const done = setTimeout(onDone, 300 + lines.length * 700 + 700);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="coach-dark relative flex h-full flex-col items-center justify-center overflow-hidden px-8">
      <div
        className="blob-a absolute -left-20 top-10 h-[220px] w-[220px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, #b6a2f7 0%, transparent 68%)" }}
      />
      <div
        className="blob-b absolute -right-16 top-1/3 h-[200px] w-[200px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, #f2c98c 0%, transparent 68%)" }}
      />
      <div
        className="blob-c absolute bottom-10 left-1/4 h-[180px] w-[180px] rounded-full blur-[70px]"
        style={{ background: "radial-gradient(circle, #9fb6ff 0%, transparent 68%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10"
      >
        <PersonaAvatar name={persona.name} size={72} />
      </motion.div>

      <div className="relative z-10 mt-8 flex flex-col items-center gap-3">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: i < shown ? (i === shown - 1 ? 1 : 0.4) : 0, x: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-center text-[14px] text-d-ink-2"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
