# Design contract — /v2

The pinned rules for the `/v2` redesign. `/` is frozen and not governed by this
file. Anything on `/v2` that needs a value not listed here is a sign the
hierarchy is wrong, not that the scale is missing a step.

Tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`, and
the `.v2` scope class. Generated art lives in
[`src/components/v2/art.tsx`](src/components/v2/art.tsx); shared primitives in
[`src/components/v2/ui.tsx`](src/components/v2/ui.tsx).

## Why this exists

v1 put ~150 of its ~153 font-size declarations between 9.5px and 15.5px — a
~1.5x effective range. Every screen read as one flat block of text with nothing
to anchor the eye, which is the main reason the build read as a wireframe rather
than a product. RockED's own app runs closer to 4x: screen titles land near 40px
extrabold (`app-screenshot/IMG_1408.PNG`, `IMG_1397.PNG`).

## Type

Faces: **Plus Jakarta Sans** for everything, **IBM Plex Mono** (`.mono`) for
identifiers only. v1 keeps Inter; the two routes are meant to be comparable, so
v1's type must not shift when v2's does.

| Token | Size / leading / weight | Job |
|---|---|---|
| `text-display-xl` | 40 / 0.95 / 800 | One number per screen — the score, the standing |
| `text-display` | 30 / 1.05 / 800 | Screen titles |
| `text-title` | 21 / 1.25 / 700 | Card headings, the hero line, live sentiment value |
| `text-body` | 15 / 1.45 | Prose |
| `text-meta` | 13 / 1.4 | Secondary |
| `text-micro` | 11 / 600 / 0.09em | Labels. Pair with `mono uppercase` |

**One `display-xl` per screen, maximum.** Two competing numbers is the same flat
hierarchy in a larger size.

**Where `.mono` is allowed:** identifiers a rep would read back aloud — stock
number, mileage, price, timestamps, scores — plus `text-micro` labels. Never
prose. v1 had mono carrying a recall sentence and a caveat line, which made a
four-line card look like terminal output.

## Surface

| Token | Use |
|---|---|
| `--shadow-e1` | Grouped or secondary content |
| `--shadow-e2` | Raised, tappable (`.card-lift`) |
| `--shadow-e3` | Sheets |
| Radius | pill / 12 / 20 / 28. No ad-hoc values |

**`.hero-dark`** is the signature surface: near-black base, purple glow off the
top-left, faint grid masked out before the edges. Reproduced from RockED's real
Challenge and Contests cards. Reserved for the one thing a screen exists to get
the rep to do, plus content plates. If two things on a screen use it, neither is
the hero.

## Colour roles

Three accents, and they do not overlap:

- **Purple** (`r-brand`) — RockED, and any action.
- **Gold** (`r-gold`) — points, streaks, rewards. Added in v2 because v1 reached
  for amber here, and amber already means something else.
- **Amber** (`r-amber`) — seeded or assumed data, and only that. `DemoDataTag`
  and the recall flag own it.

Sentiment keeps its own independent ramp: bad ≤25, amber ≤55, ok above.

## Copy budget

Enforced through the optional short-copy fields in
[`src/data/personas.ts`](src/data/personas.ts) — never by editing the long form,
which `/` still renders.

| Field | Budget | Why |
|---|---|---|
| `customerLineShort` | ≤110 chars, target ~80 | A real customer speaks in short bursts |
| `textShort` | ≤110 chars, target ~80 | Three render at once; the rep is picking a stance, and long sentences hide which is which |
| `criticalMoment.headline` | One clause | The glance |
| `criticalMoment.detail` | Unbounded | Sits behind the report's expand, per product-spec Improvement 3 |

v2 reads `x ?? xLong`, so partial coverage is safe. 45 short forms are authored
so far: 33 choice texts (longest was 173 chars) and 12 customer lines.

## Art

No photography ships with this prototype, so imagery is hand-authored SVG. A
drawn silhouette reads as a design decision; a letter in a box reads as a
missing asset.

- `CarSilhouette` / `VehiclePlate` — SUV and sedan side profiles, tinted by the
  vehicle's real paint name. Body style is derived from the model name, because
  this repo's `Vehicle` type has no body field and the data layer is shared.
- `RocketMark` — RockED's motif is a rocket, not a brain. Replace with the real
  glyph when supplied.
- `BrandMark` — full-name wordmark pills. Monograms were tried and dropped.
- **Initials avatars stay.** RockED's own leaderboard uses coloured circles with
  a single initial, so `PersonaAvatar` is matching the real product, not
  substituting for a missing asset.

## Invariants

1. `/` and `/manager` must render identically to their commit at the start of
   this work. Any visual change to v1 is a bug.
2. No behavioural change. The dialogue graph, deltas, coaching values,
   severities and capability flags are single-sourced and shared. v2 may only
   add optional copy fields and change presentation.
3. Every honesty tag survives the redesign. `DemoDataTag` (seeded, but the
   capability exists) and `RoadmapTag` (does not exist yet) make different
   claims and must not be merged.
4. `prefers-reduced-motion` suppresses all animation; meaning always lives in
   the settled state.
5. Motion uses one curve — `ease = [0.16, 1, 0.3, 1]` — with duration varying by
   element.
