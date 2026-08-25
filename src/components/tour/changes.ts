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
   * The same two at one line each, for the deck — same contract as `alsoShort`.
   *
   * The walkthrough has a column and a reader who chose to be there; a slide has
   * neither. The deck reads `beforeShort ?? before`, so a change that doesn't
   * need a short form simply omits it and nothing drifts out of sync.
   */
  beforeShort?: string;
  afterShort?: string;
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
  /**
   * The commercial answer, where the change has one: what this does for the rep's
   * own numbers or for the manager's ability to enforce. Mike's objection to the
   * first draft was that it said what the rep learns and never what's in it for
   * him \u2014 floor staff are coin-operated.
   */
  forTheRep?: string;
  /** The same at one line, for the deck. */
  forTheRepShort?: string;
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
    beforeShort:
      "Push-to-talk, unlimited think time, and her willingness to proceed barely moved whatever I did.",
    afterShort:
      "One sentiment read the rep can watch move, with the walk-away point marked.",
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
    beforeShort:
      "14/30 after lying about a price and inventing a deadline — which reads as partway there.",
    afterShort:
      "The outcome in a sales manager’s words, then the one pillar that cost the call.",
    also:
      "The report offers a drill on the exact moment that cost the call, because the minute after a bad call is when the lesson is hottest. The drill never rewrites what happened \u2014 the sentiment drop, the ending and the score stay logged. If a replay could quietly undo the result, \u201creplay\u201d becomes a reset button and the consequence mechanic is gone.",
    alsoShort:
      "It also offers a drill on the exact moment that cost the call, and the drill can\u2019t rewrite the logged result \u2014 otherwise \u201creplay\u201d is just a reset button.",
    consequence:
      "A rep can't leave a failed call thinking they did fine, which is exactly what today's scorecard allows.",
    forTheRep:
      "And the drill is the point, not the grade. Floor staff are paid on units \u2014 nobody opens a training app to feel informed. This one hands back the exact thing that cost the deal and lets him run it again in ninety seconds.",
    forTheRepShort:
      "It hands back the exact moment that cost the deal, runnable again in ninety seconds.",
  },
  {
    id: "coverage",
    title: "Practice becomes deliberate",
    screen: "hub",
    beforeShot: "/before/scenarios.png",
    afterShot: "/after/hub.png",
    before:
      "Two fixed sales scenarios. Run them enough times and you look practised without ever meeting a difficult customer.",
    beforeShort:
      "Two fixed sales scenarios. Repeat them and you look practised.",
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
    beforeShort:
      "No rep profile at all. Practice and performance stay two unconnected facts about one person.",
    afterShort:
      "Two layers. Base works day one; Enhanced maps his real close numbers onto the same profile.",
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
    beforeShort:
      "A GM sees nothing. No one is accountable for whether practice works.",
    after:
      "The team ranked by who needs coaching most, each rep's gaps named, and one action: assign the specific scenario, with the context that triggered it attached.",
    afterShort:
      "The team ranked by who needs coaching most, and one action: assign the scenario.",
    consequence:
      "Nobody at a dealership is paid to own whether training works. This is the surface that would let someone try.",
    forTheRep:
      "Assignments carry the moment that triggered them \u2014 \u201cafter your call with a price-haggler on Tuesday\u201d, never a bare course name. And they surface on the desk's own list rather than waiting in an inbox, because \u201cthe manager will remember\u201d is how training dies.",
    forTheRepShort:
      "Assignments name the call that triggered them, and land on the desk’s list, not an inbox.",
  },
];

/**
 * Everything that went wrong in one call, in the order it happened.
 *
 * This replaced a scored probe table marked caught/missed, and the reason is the
 * whole argument. Scoring the simulation on detection concedes that it mostly
 * works — four of five anomalies did produce a reaction. But she reacts to
 * individual facts and never to the accumulation: she said "I'm going to keep
 * looking" twice, the conversation carried on both times, and her last line was
 * "I guess I'm sort of leaning toward it."
 *
 * A real customer is gone by item four. So the finding isn't detection, it's that
 * trust never compounds downward — which is the architecture point, and the
 * reason the fix is a cumulative model rather than a smarter customer.
 *
 * Verbatim from session 3, 22 August 2026.
 */
export type Mistake = {
  id: string;
  /** What the rep (me) did. */
  did: string;
  /** What she said back, verbatim where it's short enough to quote. */
  said?: string;
};

export const MISTAKES: Mistake[] = [
  { id: "dealership", did: "Greeted her at the wrong dealership — “thanks for coming to Paragon Honda”, for a Toyota" },
  { id: "model", did: "Called her car a Highlander", said: "“It was a RAV4, not a Highlander.”" },
  { id: "colour", did: "Asked if it was blue, after she'd said red twice", said: "“No, it was red. I specifically remember it being red.”" },
  { id: "lie", did: "Told her the car was still there — “that's the one you saw, nothing's changed”" },
  { id: "dismiss", did: "Brushed off her question about the listing", said: "“I'm a little disappointed about the website thing.”" },
  { id: "reverse", did: "Reversed it two turns later — the car had sold hours ago", said: "“So it *is* sold? That's frustrating, to be honest.”" },
  { id: "restate", did: "Asked whether she wanted an SUV, after she'd named the RAV4 twice", said: "“I was looking at the RAV4, which is an SUV, so yes.”" },
  { id: "price", did: "Quoted $18,000, then $28,000, for the same car", said: "“$28,000 is quite a jump. I guess I'm going to keep looking.”" },
  { id: "condescend", did: "Told her what her budget could afford — “at your budget, this is the only option that makes sense for you”", said: "“I think I'm just going to keep looking, thanks anyway.”" },
  { id: "urgency", did: "Invented a deadline — “I've got another customer waiting”", said: "“I guess I'm sort of leaning toward it. Could I at least see it?”" },
  { id: "recall", did: "Disclosed an open transmission recall after she'd agreed to see the car" },
];

/** What RockED's own report said about that call. Its screen, not my summary. */
export const THEIR_VERDICT = {
  score: "14 / 30",
  bars: [
    { label: "Introduction", score: "5/10", tone: "green" },
    { label: "Qualifying and Scoping", score: "6/10", tone: "blue" },
    { label: "Closing", score: "3/10", tone: "amber" },
  ],
  reason:
    "Josh failed to secure any commitment or next steps. He mentioned another customer waiting, creating pressure, but didn't confirm Lisa's contact details or schedule follow-up.",
  suggestion:
    "Focus on building excitement about available options, secure contact information for future inventory updates, and offer clear next steps like test drives.",
} as const;
