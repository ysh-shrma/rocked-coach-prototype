# RockED AI Coach — Redesign Prototype

Clickable UI mock for the RockED take-home assignment. No backend, no real
speech, no live AI — every reaction is a scripted, deterministic engine so
the sentiment/consequence mechanic can be demonstrated reliably. Full spec:
`career-ops/interview-prep/rocked/assignment/product-spec.md`.

## Run it

```
npm install
npm run dev
```

Opens on `http://localhost:3012`.

- `/` — the rep's mobile experience (Home → AI Coach Hub → pre-call sheet →
  Live Call → Score Report → back to Hub → Profile). There's a "Manager
  view →" link in the top-right corner of the page (outside the phone frame)
  to jump to the desktop view.
- `/manager` — the BDC Manager / GM desktop view (team ranked list, per-rep
  pillar trends, coverage gaps, flagged critical moments, Assign Training).

## What's real vs. mocked

- **The sentiment mechanic is real**: every dialogue choice has an actual
  effect on Trust/Patience/Interest, a hard call-ending threshold exists,
  and critical moments are logged, not just narrated after the fact. Try
  the honest path vs. the dishonest/pressure path on any persona to see it
  diverge.
- **The dialogue is branching-but-linear**, not a live LLM: each persona is
  a fixed sequence of beats, each with 3 response options the rep picks
  from (tap the mic → pick a line). This is a deliberate build decision —
  see `src/components/Call.tsx`'s top comment for why, and how it differs
  from the AI-suggests-your-line pattern this reuses a UI shape from.
- **All 8 ChallengeBoard personas are fully playable**, each proving one of
  the 8 CapabilityMap capabilities 1:1.
- **CRM/call-recording data (Profile's "real calls" tier, the Manager
  view's practice-vs-floor numbers) is seeded, not live** — tagged on
  screen with a persistent amber "Demo data" mark, never hidden.

## Structure

- `src/data/personas.ts` — the 8 ChallengeBoard personas, their scripted
  beats, and the 8 CapabilityMap capabilities.
- `src/data/vehicles.ts` — seed inventory for the turn-linked ground-truth
  cards (Improvement 2).
- `src/data/reps.ts` — mocked manager-view team data.
- `src/lib/session.ts` — the sentiment/coaching-score engine: applying a
  choice's deltas, checking the call-ending threshold, finalizing a session
  into a report.
- `src/components/` — one file per screen (`Home`, `Hub`, `PreCall`, `Call`,
  `Report`, `Profile`, `Manager`), plus `ui.tsx` for the shared primitives
  (the single reused "demo data" tag, the sentiment bar, ground-truth
  cards).
- `src/app/page.tsx` — the rep-app screen orchestrator (mirrors the
  `agent-test-drive` reference's single-state-machine pattern).
- `src/app/manager/page.tsx` — the manager-view orchestrator.

Visual reference: RockED's real app (`career-ops/interview-prep/rocked/assignment/app-screenshot/`)
for the light/purple mobile skin; `agent-test-drive` (Spyne, internally
reviewed) for the `ChallengeBoard`/`CapabilityMap` and turn-linked evidence
card patterns, and for the manager view's desktop console visual language.
