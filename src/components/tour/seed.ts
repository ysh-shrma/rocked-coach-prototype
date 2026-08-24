import { personaById, type Choice } from "@/data/personas";
import {
  applyCoaching,
  applyDelta,
  checkEnded,
  coachingBaseline,
  finalizeSession,
  initialSentiment,
  type PickRecord,
  type SessionResult,
} from "@/lib/session";

/**
 * Deterministic session seeding for the walkthrough.
 *
 * Two of the five changes sit on screens that only exist after a call has been
 * played — the live call mid-conversation, and the report. The tour can't ask a
 * reviewer to play three turns to reach them, and faking the state would mean
 * the annotation described something the engine didn't actually produce.
 *
 * So this walks the real dialogue graph with the real reducers from
 * `lib/session.ts` — the same `applyDelta` / `applyCoaching` / `finalizeSession`
 * the live Call screen uses. The result on screen during the tour is a genuine
 * engine output, just reached by a fixed path instead of by clicking.
 */

type Strategy = "honest" | "pressure";

/** Same shape the Call screen accumulates, so the report renders identically. */
export type SeededSession = {
  personaId: string;
  picks: PickRecord[];
  result: SessionResult;
};

function choose(choices: Choice[], strategy: Strategy): Choice {
  // "pressure" takes the last option, which is authored as the bad-faith line
  // throughout the graph; "honest" takes the first.
  return strategy === "pressure" ? choices[choices.length - 1] : choices[0];
}

export function seedSession(personaId: string, strategy: Strategy): SeededSession | null {
  const persona = personaById(personaId);
  if (!persona) return null;

  let sentiment = initialSentiment;
  let coaching = coachingBaseline;
  const picks: PickRecord[] = [];

  let nodeId: string = persona.startNode;
  let reachedEnd = false;

  // Bounded rather than while(true): a malformed graph should degrade to a
  // short session, not spin.
  for (let turn = 0; turn < 20; turn++) {
    const node = persona.nodes[nodeId];
    if (!node) break;

    const choice = choose(node.choices, strategy);
    sentiment = applyDelta(sentiment, choice.delta);
    coaching = applyCoaching(coaching, choice.coaching);
    picks.push({ nodeId, choice });

    const moments = picks
      .filter((p) => p.choice.criticalMoment)
      .map((p) => ({ ...p.choice.criticalMoment!, nodeId: p.nodeId }));

    // The hard threshold wins over whatever the choice pointed at — the same
    // precedence the live screen enforces.
    if (checkEnded(sentiment, moments)) break;

    if (choice.next === "end") {
      reachedEnd = true;
      break;
    }
    nodeId = choice.next;
  }

  return {
    personaId,
    picks,
    result: finalizeSession(personaId, picks, sentiment, coaching, reachedEnd),
  };
}
