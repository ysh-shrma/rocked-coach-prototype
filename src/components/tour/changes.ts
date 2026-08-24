/**
 * The submission's content, as data rather than markup.
 *
 * Both the landing page and the walkthrough read from here, so a change's wording
 * can't drift between the two. Kept as data on purpose: this walkthrough pattern
 * gets reused for the next take-home, and the only thing that should change is
 * this file.
 */

/** A rep-app screen the tour can pin. Mirrors the orchestrator's screen union. */
export type TourScreen =
  | "home"
  | "hub"
  | "precall"
  | "call"
  | "report"
  | "profile"
  | "manager";

export type Change = {
  id: string;
  /** What the annotation column leads with. */
  title: string;
  /** Which prototype screen sits in the frame for this change. */
  screen: TourScreen;
  /**
   * The manager view is a desktop console, not a phone screen — a GM works at a
   * desk with a CRM open. Change 5 therefore swaps the device frame rather than
   * showing a phone and talking about a desktop, which is what it did first and
   * read as a mismatch.
   */
  frame?: "phone" | "desktop";
  /** RockED as it is today — the thing this change is arguing against. */
  before: string;
  /** What the prototype does instead. */
  after: string;
  /**
   * One line, and it has to be a consequence rather than a feature. "Now the
   * call can be lost" changes "added a sentiment meter" — the feature is visible
   * in the phone already, the consequence is the argument.
   */
  consequence: string;
  /**
   * The before/after pair the deck shows instead of paragraphs.
   *
   * `beforeShot` is deliberately absent on the last two changes: RockED has no
   * rep profile and no manager view, so there is no screen to put there. The
   * deck renders that absence as an empty frame rather than skipping the slot,
   * because the missing screen *is* the finding on those two.
   */
  beforeShot?: string;
  afterShot?: string;
  /**
   * A second argument this change carries that the screen alone doesn't explain.
   * Used sparingly — two of the five. Kept distinct from `consequence`, which is
   * the one-line payoff, and from `caveat`, which is a stated limit.
   */
  also?: string;
  /**
   * The same argument at one line, for the deck.
   *
   * These two carry improvements 2 and 3 of the seven, so dropping them on the
   * deck would quietly reduce the submission to five. A slide has no room for
   * `also`'s full paragraph and the walkthrough does, so the argument is kept
   * and the words are not.
   */
  alsoShort?: string;
  /** Optional caveat stated rather than hidden. */
  caveat?: string;
  /**
   * Only on changes whose phone is genuinely interactive — change 1 today. Says so
   * out loud, because a live screen and a pinned one look identical, and a
   * reviewer who assumes the frame is a picture never takes a turn.
   */
  tryIt?: string;
};

export const CHANGES: Change[] = [
  {
    id: "stakes",
    title: "The call can be lost",
    screen: "call",
    beforeShot: "/before/call.png",
    afterShot: "/after/call.png",
    before:
      "Push-to-talk, unlimited think time, and the call only ends when the rep decides to end it. Across three sessions the customer's willingness to proceed barely moved no matter what I did.",
    after:
      "One sentiment read the rep can see moving, with the walk-away point marked. Drop below it and she leaves — presented as a lost customer, not a timeout.",
    also:
      "The card under her question is the other half. Today a rep answers \u201cis it in stock, what does it cost\u201d from memory \u2014 a real rep has an inventory screen open. Guessing rewards sounding confident over being right, and a rep who guesses wrong on price is lying to the customer even when he didn\u2019t mean to. Same trust mechanic, arrived at by accident instead of on purpose.",
    alsoShort:
      "The vehicle card under her question is a second change on the same screen. Today a rep answers \u201cis it in stock, what does it cost\u201d from memory, which rewards sounding confident over being right.",
    consequence:
      "A pressure tactic now costs something, so practising one teaches the opposite of what it teaches today.",
    tryIt:
      "The phone is live on this change — tap the mic and pick a line. Every choice moves the meter.",
    caveat:
      "A real conversation gives you no time to compose. This mock can't demonstrate that pacing pressure — real-time turn-taking is a requirement for the real build, not something I've solved here.",
  },
  {
    id: "verdict",
    title: "The report names what cost you",
    screen: "report",
    beforeShot: "/before/report.png",
    afterShot: "/after/report.png",
    before:
      "Three categories — Introduction, Qualifying, Closing — each out of ten. I scored 14/30 after lying about a price and leaning on a fake deadline, which reads as partway there rather than as a failure.",
    after:
      "The outcome in words a sales manager would use, then the one pillar that cost the call, then the full score. The gap is the biggest thing on the screen.",
    also:
      "The report offers a drill on the exact moment that cost the call, because the minute after a bad call is when the lesson is hottest. The drill never rewrites what happened \u2014 the sentiment drop, the ending and the score stay logged. If a replay could quietly undo the result, \u201creplay\u201d becomes a reset button and the consequence mechanic is gone.",
    alsoShort:
      "It also offers a drill on the exact moment that cost the call, and the drill can\u2019t rewrite the logged result \u2014 otherwise \u201creplay\u201d is just a reset button.",
    consequence:
      "A rep can't leave a failed call thinking they did fine, which is exactly what today's scorecard allows.",
  },
  {
    id: "coverage",
    title: "Practice becomes deliberate",
    screen: "hub",
    beforeShot: "/before/scenarios.png",
    afterShot: "/after/hub.png",
    before:
      "Two fixed sales scenarios. Run them enough times and you look practised without ever meeting a difficult customer.",
    after:
      "Eight customers, each proving one named capability, with coverage visible at a glance and the next gap recommended from your last call.",
    consequence:
      "Progress stops meaning repetition and starts meaning range.",
  },
  {
    id: "floor",
    title: "Practice connects to the floor",
    screen: "profile",
    afterShot: "/after/profile.png",
    before:
      "No rep profile at all. Nothing links what a rep practised to what happened on a real call, so practice and performance are two unconnected facts about the same person.",
    after:
      "Two independent layers, not a fallback. Base works for any dealership on day one, built from in-app practice alone. Enhanced adds the CRM and the calling system \u2014 the rep's real close and upsell numbers, mapped to their actual recorded calls, feeding the same profile.",
    consequence:
      "This is the mechanism that would prove or kill the published upsell-lift number. Right now nothing in the product can.",
    caveat:
      "The real-call side is seeded data, tagged as such on screen. It shows the shape of the validation, not a validation.",
  },
  {
    id: "manager",
    title: "Someone can act on it",
    screen: "manager",
    afterShot: "/after/manager.png",
    frame: "desktop",
    before:
      "A GM sees nothing. Each rep's score is visible only to that rep, so no one is accountable for whether practice is working.",
    after:
      "The team ranked by who needs coaching most, each rep's gaps named, and one action: assign the specific scenario, with the context that triggered it attached.",
    consequence:
      "Nobody at a dealership is paid to own whether training works. This is the surface that would let someone try.",
  },
];

/**
 * The five planted anomalies from session 3, and what the simulated customer did
 * with each. `caught` is the finding: four of five landed.
 */
export type Probe = {
  id: string;
  probe: string;
  result: string;
  caught: boolean;
};

export const PROBES: Probe[] = [
  {
    id: "model",
    probe: "Called her car the wrong model, twice",
    result: "Corrected me immediately and specifically — “It was a RAV4, not a Highlander.”",
    caught: true,
  },
  {
    id: "price",
    probe: "Quoted $18,000, then $28,000 for the same car",
    result:
      "Caught it hard, with a consequence attached — “$28,000 is quite a jump. I guess I’m going to keep looking.”",
    caught: true,
  },
  {
    id: "condescend",
    probe: "Made a condescending remark about her budget",
    result: "Pushed back politely and disengaged. Muted next to the price catch, but real.",
    caught: true,
  },
  {
    id: "recall",
    probe: "Disclosed an open recall mid-conversation",
    result:
      "Escalated exactly like an informed buyer — “Was it fully repaired? Do I have documentation of that?”",
    caught: true,
  },
  {
    id: "urgency",
    probe: "Invented a deadline: another customer is waiting",
    result:
      "Nothing. She answered the mileage question in the same turn and never mentioned the pressure. The scorecard logged it and docked the turn for not collecting contact details.",
    caught: false,
  },
];
