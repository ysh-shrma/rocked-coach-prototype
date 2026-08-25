"use client";

import { useEffect, useRef, useState } from "react";
import { CHANGES } from "@/components/tour/changes";
import { seedSession } from "@/components/tour/seed";
import { personaById, personas } from "@/data/personas";

/**
 * The guided walkthrough's state. Lifted out of /tour's page component.
 *
 * Same reasoning as `useExplore`: a hook, so the reader's place in the
 * walkthrough survives a flip to the live app and back.
 */

/** The persona the walkthrough walks. The recall scenario, because it's the one
 *  where honesty and pressure diverge most visibly. */
export const TOUR_PERSONA = "burned-customer";

export function useGuided() {
  const [i, setI] = useState(0);

  /** Bumped when a call reaches an ending, which remounts the call screen. This
   *  mode has nowhere to send a finished session — Explore routes onEnd to the
   *  Report, but there's no Report in this column — so recycling the call is what
   *  keeps a lost customer from leaving the phone stuck on "Ending call…".
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

  return {
    i,
    setI,
    change,
    persona,
    seeded,
    callRun,
    handleCallEnd,
    count: CHANGES.length,
    atStart: i === 0,
    atEnd: i === CHANGES.length - 1,
  };
}

export type GuidedState = ReturnType<typeof useGuided>;
