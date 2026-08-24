# RockED /v3 — design system + "show, don't explain"

## Context

The RockED take-home needs a clickable prototype that reads like a disciplined
native app. Two lanes are now frozen: `/` (the original build) and `/v2` (the
visual-impact pass — dark hero surface, generated vehicle art, a 6-token type
scale, short dialogue copy). **This work ships as `/v3`.** Same isolation pattern
as before, one more lane.

Two things drive it:

1. **The design system was never built.** The `/v2` pass was visual-impact-first
   by design: it fixed what a reviewer sees on three screens without building the
   layer underneath. Audit below.
2. **The screens explain in prose where they should show.** Measured on the
   rendered app, not the source — this is the more interesting finding of the two.

Governing question, per the ask: **does it make the flow better?** Both of the
above are sequenced by that, not by list order.

Out of scope: `/` and `/v2` (both frozen), the sentiment engine, the dialogue
graph, scoring logic, hosting. Asset-budget items are out of reach by definition:
custom illustration, a bespoke icon set, real persona photography.

**Presenter chrome stays as-is and is not touched.** The demo integrated/not
toggle and the Manager-view link are needed, and the whitespace outside the phone
is annotation space for the walkthrough. Everything in this plan is inside the
phone screen. The device-bezel idea from the previous plan is dropped.

## Audit 1 — the system

Measured across `src/components/v2/` and `src/app/v2/`, which `/v3` inherits.

| # | Item | State |
|---|---|---|
| 1 | Type scale (~9 HIG styles) | **Partial draft.** 6 tokens, not 9, not HIG-named. **142 ad hoc `text-[Npx]` vs 25 token uses — ~15% adoption.** |
| 2 | Colour 50–900 + surface elevation | **Not started.** 0 numeric ramp steps; 17 flat names. No primary/grouped/grouped-2 hierarchy. |
| 3 | 4pt spacing grid | **Not started.** 72 arbitrary px values, **65 off-grid** (1, 2, 3, 5, 6, 7, 9px…). |
| 4 | 3 elevation tokens | **Defined and dead.** `--shadow-e1/e2/e3` referenced **zero** times; `.card-lift` hardcodes its own. |
| 5 | Motion restraint | **Not started.** 32 `rise()` sites across 16 distinct delays. |
| 6 | Component states | **Weak.** hover 21, active 5, `whileTap` 5, disabled 2, focus 1, loading 1 — whole tree. |
| 7 | Materials | **Barely.** 2 `backdrop-blur`, and **zero sticky or scroll-aware headers anywhere.** |
| 8 | Icon system | **Partial.** lucide throughout ✓, but 12 distinct sizes (10–84), 10 stroke widths (0–4). |

Plus **8 distinct radii**, no token.

## Audit 2 — the text load

Rendered word count inside the phone frame, and how much of it sits in full
sentences (≥6 words) rather than labels or numbers:

| Screen | Words | Sentences | % of words in sentences |
|---|---|---|---|
| PreCall | 65 | 3 | **88%** |
| Hub | 129 | 10 | **65%** |
| Call | 62 | 2 | 44% |
| Home | 64 | 2 | 28% |
| Report | 54 | 2 | 28% |
| Manager | — | 17 | ~64% (raw figure polluted by Next's script payload; treat the sentence count as the signal) |

**The cause is specific: prose is doing the job of labels.** In shared
`src/data/personas.ts` —

- 8 **capability** strings average **8.4 words**, used as list-item labels on Hub.
  Longest: *"Staying honest under a fake-urgency moment instead of matching it
  with pressure."*
- 8 **persona blurbs** average **9.5 words**, set under each name.
- **objectives** average **14.5 words across two sentences**, and are PreCall's
  main content.

Hub therefore renders up to sixteen competing sentences. That is the "reading a
long sentence to infer something that should be apparent" problem, exactly.

Note the pattern: Home, Report and Call — the three screens the v2 pass touched —
are the lowest three. This is the same debt, on the screens that were skipped.

## Audit 3 — the Report contradicts its own verdict

Found by inspecting the `ended-neutral` state (rep didn't close). This is a
distinct problem from the two audits above and arguably the most damaging,
because it teaches the wrong lesson rather than merely teaching slowly.

The screen says "you didn't close," then presents:

- **Three green sentiment bars** (Trust 70 / Patience 70 / Interest 65) as the
  first content block. Accurate — she never got upset — but the rep failed at
  *closing*, not rapport. The block answers a question nobody asked, and its
  green reads as "you did fine."
- **`Closing the Next Step 4/10` styled identically to `Rapport & Trust 8/10`** —
  same 21px neutral ink, and positioned last in the 2×2 grid. That number *is*
  the diagnosis: `finalizeSession` withholds a "closed" outcome precisely on
  `coaching.closing < 7`. Reading order surfaces the best score first and the
  failure last.
- **No diagnosis at all.** No `criticalMoment` fires on this path, so that
  section is absent. The rare, dramatic "lost" outcome gets a rich callout plus a
  replay drill; the common "quietly didn't close" outcome gets nothing.
- **Brand purple for the verdict**, the same colour as every CTA and link, which
  reads neutral-positive.
- **~40% empty below the grid**, which after a failure reads as "nothing more to
  say."

### The fix — one anatomy, one variable slot

Answer three questions in order and nothing else: what happened, what cost you,
what do I do about it. Today the screen answers the first, buries the second and
never answers the third.

- **Lead with the gap, not the grid.** One block: weakest pillar named, its
  figure, in the failure colour, one plain line of why. The other three pillars
  collapse to a quiet row or sit behind "see full score."
- **Colour the pillar figures against a threshold** — and **reuse the ramp
  `SentimentBar` already uses** (`≤25` / `≤55` / else) rather than inventing a
  second one. Threshold values need a real sales manager's input; "under 5 is
  failing" is a guess.
- **Demote sentiment below the gap and caption it** — e.g. "She stayed warm — you
  just never asked." Highest-leverage copy change on the screen: it converts the
  contradiction into the lesson.
- **Put a retry in the empty space.** The replay drill currently only exists
  inside a critical-moment card, so this path has none. Reuse the coverage-map
  loop from product-spec Improvement 4.
- **Demote "Back to Hub" to secondary.** The primary action is practising the
  thing just failed.

**Platform-scale decision, taken deliberately:** do *not* build a bespoke
no-close layout. Three outcomes × three layouts is three screens that drift, and
it worsens when RockED extends to service and parts. Keep one anatomy with a
single variable **diagnosis block**: lost → the critical moment (exists today),
neutral → the weakest pillar, closed → what they did right so the win is legible
too. A pattern, not a one-off.

## The flow argument

**Tier A — felt on every screen.**

1. **The Report's outcome anatomy (Audit 3).** Highest stakes of the three, because
   it isn't slow comprehension — it's the wrong conclusion. A rep currently
   finishes a failed call, sees three green bars and an 8/10, and leaves thinking
   they did fine. Everything else on this list makes the app read better; this one
   makes it teach correctly.
2. **Show, don't explain (Audit 2).** The biggest broad win, because it
   attacks comprehension time directly rather than aesthetics. Short labels,
   numbers and state where a sentence currently sits; the sentence demoted behind
   a tap or cut.
3. **Type scale (item 1).** There is a concrete seam: Home's hero is 30px and the
   Call's customer line 28px, but **Hub — directly between them on the main
   path — tops out at 15.5px.** The flow reads 30 → 15.5 → 28. Inconsistency is
   worse than flatness, because it reads as a mistake.
4. **Component states (item 6).** On a touch prototype tap feedback is the most
   native-feeling thing there is. Five `whileTap` and one focus style across eight
   screens means most taps acknowledge nothing.
5. **Materials + sticky headers (item 7).** Zero scroll-aware headers today. A
   header that materialises on scroll is the strongest "this is iOS" cue
   available in code, and it's cheap.

**Tier B — felt as pace and depth.**

6. **Motion restraint (item 5).** 32 staggered entrances over 16 delays means
   every screen plays a ~0.5s cascade before settling; a reviewer clicking
   quickly fights it. Cutting stagger ~80% makes the flow feel *faster* — a flow
   win, not hygiene. Keep the one `ease` curve; keep motion only for state changes
   that matter (sentiment drop, sheet, call ending).
7. **Colour depth + surface elevation (item 2).** Everything is white on white
   separated by one border colour, so nothing signals grouped vs raised vs
   tappable.

**Tier C — hygiene that stops the system decaying.** Cheap, done alongside:
spacing grid (item 3), wiring the three existing elevation tokens (item 4), icon
sizes and stroke widths (item 8), radius tokens.

**Loading states stay as narrative, per your call.** Connecting's ~3.8s sequence
sells "a customer is being assembled for you"; Personalizing sells the
CRM-integration tier. Recording it as a deliberate override of the Superhuman
reference rather than an oversight — I'll only make sure neither blocks
back-navigation.

## The one real complication: token collision

`/v2` is frozen but its 25 type-token call sites read the same **global**
`@theme` tokens this plan expands. Renaming the 6 into 9 HIG-named styles would
silently restyle `/v2`.

So: **the 6 existing tokens stay, untouched, and the 9 HIG styles are added
alongside.** `globals.css` carries both sets, with a comment saying the 6 are
v2-only and can be deleted when v2 is retired. Same rule for surfaces and
shadows: `.hero-dark` is currently `.v2`-scoped, so v3 gets its own scope rather
than a shared selector.

Shared data stays shared and additive — the existing `customerLineShort` /
`textShort` fields are reused by v3, and the new short-label fields below are
optional, so `/` and `/v2` ignore them.

## Approach

Commit per phase.

### Phase 1 — v3 lane

Copy `components/v2/*` → `components/v3/*`, add `app/v3/page.tsx` and
`app/v3/manager/page.tsx`, swap the scope class to `.v3`, point the presenter
links at `/v3`. Verify `/v3` renders identically to `/v2` before changing a
style — the checkpoint that proves isolation, same as last time.

### Phase 2 — Token foundation + lint

Nine HIG-named styles (`large-title`, `title-1/2/3`, `headline`, `body`,
`callout`, `subhead`, `footnote`, `caption`), added alongside the v2 six. Full
50–900 ramps for brand/ok/warn/bad plus gold. Surface tokens (`surface`,
`surface-grouped`, `surface-grouped-2`). Named spacing and radius scales. Wire
`--shadow-e1/e2/e3` into `.card`, `.card-lift` and `Sheet`.

Ship `scripts/lint-design.mjs` in the same phase so every later phase is measured
rather than asserted: fail on `text-[`, `p*-[`, `gap-[`, `shadow-[`, `rounded-[`
inside `components/v3/`, and on any v3 file importing a v2-only token. Without
enforcement a system decays within a day, and another thread is active in this
repo.

### Phase 3 — Short-label layer in shared data

Optional fields alongside the long forms, never replacing them:
`Capability.labelShort` (2–4 words), `Persona.blurbShort` (3–5 words),
`objectiveShort` (one clause). v3 reads `x ?? xLong` via the existing `say()` /
`line()` convention in `ui.tsx`. Extend `DESIGN.md`'s copy-budget table.

### Phase 4 — Primitives in `components/v3/ui.tsx`

`Btn` gains real `pressed` / `disabled` / `loading` variants. Add `ScreenHeader`
with scroll-aware translucency, an `Icon` wrapper pinning size and stroke, and
`PressableCard` so tap feedback is inherited rather than re-implemented. Reduce
`rise()` to two forms — one entrance, one state-change — and delete the
per-element delay ladder.

### Phase 5 — Report outcome anatomy

Its own phase, before the sweep, because it is a structural change rather than
token substitution: one anatomy with a variable diagnosis block, per Audit 3.
Covers all three outcomes — the `lost` path keeps the critical-moment callout it
already has, `ended-neutral` gains the weakest-pillar block plus a close-practice
action, `closed` gains a legible win. Threshold colouring reuses `SentimentBar`'s
existing ramp.

Doing this before the sweep also means the sweep applies tokens to the *final*
structure rather than restyling markup that's about to be replaced.

### Phase 6 — Apply, worst-first along the flow

**Hub → PreCall → Home → Call → Report → Connecting → Profile → Manager.**

Hub and PreCall lead: they are the two prose-heaviest screens *and* Hub is the
type seam on the main path. Both need composition work, not token substitution —
Hub's coverage list becomes short labels plus a proven count so the number does
the inferring; PreCall becomes portrait, name, a 3–4 word stance and the one
thing to hold, with the full objective on tap. Report is quick here since Phase 5
already rebuilt it. Manager last: desktop, off the mobile path, most debt (36 ad
hoc values).

### Phase 7 — Audits

Tap targets ≥44×44pt measured in-browser, focus visible on every interactive
element, contrast checked on every new ramp step carrying text.

## Verification

1. `npm run build` clean, gating every phase.
2. `npm run lint:design` near-zero. Targets: ad hoc `text-[` 142 → <10 in v3;
   off-grid spacing 65 → 0; icon sizes 12 distinct → 2; stroke widths 10 → 1–2.
3. **Text-load re-measurement** with the same script that produced Audit 2:
   PreCall 88% → under 40%, Hub 65% → under 40%, no screen above 45%.
4. **The Report four-second test, on all three outcomes.** Screenshot each of
   `lost` / `ended-neutral` / `closed`, then check that the first thing the eye
   lands on is the thing that cost the rep — not a green bar and not their best
   score. Specifically for `ended-neutral`: `Closing the Next Step 4/10` must be
   visually dominant over `Rapport & Trust 8/10`, and no green may appear above
   the diagnosis block. This is the check the current screen fails.
5. **Two frozen lanes now.** `/`, `/manager`, `/v2` and `/v2/manager` must all be
   unchanged — v1 carries no v2/v3 token classes and keeps Inter; v2 keeps its own
   six tokens and its current rendering. More important than last time, because
   Phase 2 edits shared `globals.css`.
6. **Behavioural parity across all three lanes:** the dishonest path must still
   give trust 0 / patience 40 / interest 30 / coaching 2-5-5-5 and the same Turn 3
   critical moment on `/`, `/v2` and `/v3`.
7. Screenshot all 8 screens before and after each phase — compare for
   consistency, not just for change.
8. `prefers-reduced-motion` still suppresses everything.
9. Walk the full flow at speed after Phase 6. Whether it feels faster with the
   stagger gone is the one thing only a real click-through answers.
