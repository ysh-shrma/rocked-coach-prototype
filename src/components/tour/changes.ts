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
  /** The claim. A full sentence the step is arguing, not a feature name. */
  title: string;
  /** Which prototype screen sits in the frame for this change. */
  screen: TourScreen;
  /**
   * The manager view is a desktop console, not a phone screen — a GM works at a
   * desk with a CRM open. Change 5 therefore swaps the device frame rather than
   * showing a phone and talking about a desktop, which read as a mismatch.
   */
  frame?: "phone" | "desktop";
  /**
   * The comparison, as bullets rather than prose — the two halves of one thing,
   * before and after.
   *
   * This replaced ten prose fields (before/after and their Short variants, also,
   * alsoShort, partTwo, caveat, forTheRep, forTheRepShort). Two stacked
   * paragraphs under two labels is not a comparison, it's a document: a reader
   * got to the end of both before realising the second described the same screen
   * as the first. Bullets in two cards say "these are the same thing, twice" at a
   * glance, which is the entire job.
   *
   * Keep each item under about eight words. An item that needs a comma splice is
   * two items, or it belongs in `limit` / `note`.
   */
  today: string[];
  build: string[];
  /**
   * One line, and it has to be a consequence rather than a feature. "Now the
   * call can be lost" beats "added a sentiment meter" — the feature is visible
   * in the phone already, the consequence is the argument.
   */
  consequence: string;
  /** The before/after screenshot pair the deck shows. Absent on the last two
   *  changes: RockED has no rep profile and no manager view, and the empty frame
   *  is the finding. */
  beforeShot?: string;
  afterShot?: string;
  /** One line. A limit stated rather than hidden. */
  limit?: string;
  /** One line. A second argument the screens don't carry on their own. */
  note?: string;
  /**
   * Only on changes whose phone is genuinely interactive — change 1 today. Says
   * so out loud, because a live screen and a pinned one look identical, and a
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
    today: [
      "Push-to-talk, unlimited think time",
      "She never walks away, whatever you do",
      "\u201cIs it in stock? What\u2019s it cost?\u201d \u2014 answered from memory",
    ],
    build: [
      "One sentiment read, always on screen",
      "Walk-away line marked \u2014 cross it and she\u2019s gone",
      "Her question answered from live inventory",
    ],
    consequence: "A pressure tactic now costs you the call.",
    limit:
      "Real-time turn-taking is specified, not built. A clickable mock can\u2019t demonstrate pacing.",
    tryIt: "This phone is live. Tap the mic and pick a line.",
  },
  {
    id: "verdict",
    title: "The report names what cost you",
    screen: "report",
    beforeShot: "/before/report.png",
    afterShot: "/after/report.png",
    today: [
      "Introduction / Qualifying / Closing",
      "I lied about price and faked a deadline",
      "14/30 \u2014 reads as partway there",
    ],
    build: [
      "The outcome first, in a manager\u2019s words",
      "The one moment that cost the call, named",
      "A drill on that exact moment",
    ],
    consequence: "A rep can\u2019t leave a failed call thinking he did fine.",
    note:
      "The drill can\u2019t rewrite the logged result. Otherwise replay is just a reset button.",
  },
  {
    id: "coverage",
    title: "Practice becomes deliberate",
    screen: "hub",
    beforeShot: "/before/scenarios.png",
    afterShot: "/after/hub.png",
    today: ["Two fixed scenarios", "Repeat them and you look practised"],
    build: [
      "Eight customer personas, one named capability each",
      "Coverage visible at a glance",
      "Next gap chosen from your last call",
    ],
    consequence: "Progress stops meaning repetition and starts meaning range.",
  },
  {
    id: "floor",
    title: "Practice connects to the floor",
    screen: "profile",
    afterShot: "/after/profile.png",
    today: ["No rep profile at all", "Practice and floor performance never meet"],
    // Four against two, deliberately. The sparse left column is the point on this
    // step: there is no RockED screen to show either, which is why the deck
    // renders an empty frame rather than a screenshot.
    build: [
      "Base \u2014 practice data alone, works day one",
      "Enhanced \u2014 reads VinSolutions, DealerSocket or Elead",
      "Close rate and upsell per RO, beside the pillar he drilled",
      "His recorded calls \u2014 how he loses them, drilled",
    ],
    consequence: "This would prove or kill the published upsell-lift number.",
    limit:
      "Real-call data is seeded, tagged on screen. The shape of validation, not validation.",
  },
  {
    id: "manager",
    title: "Someone can act on it",
    screen: "manager",
    afterShot: "/after/manager.png",
    frame: "desktop",
    today: ["A GM sees nothing", "Each score is visible only to that rep"],
    build: [
      "Team ranked by who needs coaching most",
      "Each rep\u2019s gaps named",
      "One action: assign the scenario",
    ],
    consequence:
      "Nobody at a dealership owns whether training works. This is where someone could.",
    note:
      "Assignments name the call that triggered them, and land on the desk\u2019s list, not an inbox.",
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
