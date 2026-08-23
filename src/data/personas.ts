/**
 * The ChallengeBoard personas and their scripted practice sessions.
 *
 * Persona list and capability list are both Mike Ferraro's (sales-floor
 * authentic, bounded at 8 each, matched 1:1 by design — see product-spec.md
 * Improvement 4). The pairing below (which persona proves which capability)
 * is this build's own synthesis of a sensible match, not literally spelled
 * out turn-by-turn in the spec.
 *
 * Sessions are a DIRECTED GRAPH, not a flat beat list. Each choice points at
 * a specific next node, authored for exactly what was just said. This is
 * deliberate, not incidental complexity: a flat list with one fixed line per
 * position meant a customer's line could only be "correct" for the one
 * choice-path its author had in mind — any other path reached the same
 * position and heard a line assuming something that was never said (this
 * shipped once: a customer referencing a price the rep never quoted).
 * Authoring rule enforced throughout: a node's customerLine may only assert
 * a fact that's either independent of rep behavior (ground truth, her own
 * stated research/context) or a direct reaction to the one choice whose
 * `next` points here. Where two choices would produce a genuinely different
 * reaction, they get different nodes — never a shared line that's only true
 * for one of them.
 */

import type { Vehicle } from "./vehicles";

export type Pillar = "trust" | "patience" | "interest";
export type CoachingPillar = "rapport" | "reading" | "pressure" | "closing";

export type CriticalMoment = {
  severity: "lost" | "costly";
  headline: string;
  detail: string;
};

/**
 * Short-copy layer, added for /v2 and ignored by /.
 *
 * v1's on-screen density is the problem /v2 is fixing: three choices at up to
 * 173 characters each render simultaneously inside a 402px frame, read by a rep
 * between customers. Rather than fork personas.ts — which would mean two
 * dialogue graphs drifting out of sync — the short forms live alongside the long
 * ones as optional fields. v2 reads `x ?? xLong`, v1 never references them, so
 * the graph, the deltas, the severities and the capability flags stay
 * single-sourced and the two routes can never diverge behaviourally.
 *
 * Budget: customerLineShort and textShort ≤ 110 chars, targeting ~80. The full
 * text is not lost — criticalMoment.detail already sits behind the report's
 * expand, which is the pattern product-spec asked for.
 */

export type GroundTruth =
  | { kind: "vehicle"; stock: string }
  | { kind: "trade"; label: string; rangeLow: number; rangeHigh: number };

export type Choice = {
  id: string;
  text: string;
  /** v2 only. Compressed form of `text`, preserving the stance and the facts. */
  textShort?: string;
  delta: Partial<Record<Pillar, number>>;
  coaching?: Partial<Record<CoachingPillar, number>>;
  criticalMoment?: CriticalMoment;
  provesCapability?: boolean;
  /** The node this choice leads to, or "end" if it terminates the call. */
  next: string | "end";
};

export type DialogueNode = {
  id: string;
  customerLine: string;
  /** v2 only. A real customer speaks in short bursts, so this is also truer. */
  customerLineShort?: string;
  groundTruth?: GroundTruth;
  choices: Choice[];
};

export type Persona = {
  id: string;
  name: string;
  blurb: string;
  objective: string;
  capabilityId: string;
  startNode: string;
  nodes: Record<string, DialogueNode>;
  /** Shown as the customer's parting line on any non-"lost" ending — kept
   *  generic/non-committal on purpose so it's safe to reuse regardless of
   *  which node the call actually ended on. */
  closingLine: string;
};

export type Capability = {
  id: string;
  label: string;
  personaId: string;
};

export const capabilities: Capability[] = [
  { id: "hold-price", label: "Holding price without caving to a discount request", personaId: "price-haggler" },
  { id: "recover-defect", label: "Recovering honestly after disclosing a defect or recall", personaId: "burned-customer" },
  { id: "deescalate", label: "De-escalating a rude or combative customer without losing the deal", personaId: "difficult-one" },
  { id: "close-next-step", label: "Closing with an actual next step locked in", personaId: "first-timer" },
  { id: "upsell-without-pushy", label: "Upselling or cross-selling without turning pushy", personaId: "online-researcher" },
  { id: "comparison-reason", label: "Giving a comparison-shopper a real reason to decide today", personaId: "comparison-shopper" },
  { id: "trade-in-fair", label: "Negotiating a trade-in fairly without over-promising", personaId: "trade-in-buyer" },
  { id: "honest-under-urgency", label: "Staying honest under a fake-urgency moment instead of matching it with pressure", personaId: "budget-boxed" },
];

export const personas: Persona[] = [
  {
    id: "price-haggler",
    name: "The Price Haggler",
    blurb: "Treats every number as a starting point to negotiate down.",
    objective: "Hold the real price. She already knows the real number — never give her a different one.",
    capabilityId: "hold-price",
    closingLine: "Okay. I'll see what my bank says and call you back.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "Hi — I'm Lisa. I've been looking at your 2023 RAV4 online. Is it still available?",
        groundTruth: { kind: "vehicle", stock: "D-RAV4" },
        choices: [
          { id: "a", text: "It's still here — 2023 XLE, 18,600 miles, $32,400.", delta: { interest: 10 }, coaching: { reading: 2, rapport: 1 }, next: "n1a" },
          { id: "b", text: "I believe so, I'd have to double check.", delta: { trust: -10, interest: -5 }, coaching: { reading: -2 }, next: "n1b" },
          { id: "c", text: "It's available, but a few people are circling it, so I wouldn't wait.", delta: { trust: -10, patience: -15, interest: -5 }, coaching: { pressure: -2 }, criticalMoment: { severity: "costly", headline: "Turn 1 — unprompted urgency.", detail: "She hasn't even asked about price yet and you're already pressuring her. That's not floor hustle, that's a red flag before the conversation's even started." }, next: "n1c" },
        ],
      },
      n1a: {
        id: "n1a",
        customerLine: "Good — so just to be totally clear, out the door that's $32,400, no surprises later?",
        choices: [
          { id: "a", text: "Exactly — $32,400 plus tax, title and doc fee. I'll get you the precise OTD number in five minutes.", delta: { interest: 10 }, coaching: { rapport: 2, closing: 1 }, provesCapability: true, next: "n2_holds" },
          { id: "b", text: "Well — if you commit today, I could probably do $28,000.", delta: { interest: 5 }, coaching: { pressure: -3 }, next: "n2_contradiction" },
          { id: "c", text: "It could move a little depending on financing, but $32,400 is the baseline.", delta: { patience: -5 }, coaching: {}, next: "n2_hedge" },
        ],
      },
      n1b: {
        id: "n1b",
        customerLine: "Okay. Well — what IS the real out-the-door number, no games?",
        choices: [
          { id: "a", text: "$32,400, plus tax, title and doc fee — that's the real number, no games.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n2_holds" },
          { id: "b", text: "Let's just call it $28,000 for you.", delta: { interest: 5 }, coaching: { pressure: -2 }, next: "n2_contradiction" },
          { id: "c", text: "$32,400 is the number I've got.", delta: {}, coaching: {}, next: "n2_holds" },
        ],
      },
      n1c: {
        id: "n1c",
        customerLine: "Uh-huh. Okay — so what IS the price, then?",
        choices: [
          { id: "a", text: "$32,400, plus tax, title and doc fee — that's the real number.", delta: { interest: 5 }, coaching: { rapport: 1 }, next: "n2_holds" },
          { id: "b", text: "Let's just call it $28,000 for you.", delta: { interest: 5 }, coaching: { pressure: -2 }, next: "n2_contradiction" },
          { id: "c", text: "Somewhere around $32,400, give or take.", delta: { patience: -5 }, coaching: {}, next: "n2_hedge" },
        ],
      },
      n2_holds: {
        id: "n2_holds",
        customerLine: "Good, I appreciate a straight answer. If I can get financing sorted today, can you hold it for me until Saturday?", customerLineShort: "I appreciate the straight answer. If I sort financing today, can you hold it till Saturday?",
        choices: [
          { id: "a", text: "Yes — I'll put a hold note on the RAV4 for Saturday, and text you the appraisal slip to bring.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "I can't promise a hold, but come in and we'll see what's left.", delta: { interest: -5 }, coaching: { closing: -2 }, next: "end" },
          { id: "c", text: "Sure, no problem, whatever works for you.", delta: {}, coaching: { closing: -1 }, next: "end" },
        ],
      },
      n2_hedge: {
        id: "n2_hedge",
        customerLine: "That's a little vague for me — is it $32,400 or not? I don't want a number that moves later.",
        choices: [
          { id: "a", text: "You're right, let me be precise — it's $32,400, no games.", delta: { trust: -5 }, coaching: { rapport: 1 }, next: "n2_holds" },
          { id: "b", text: "Depends how the financing shakes out, could go up or down.", delta: { trust: -15, patience: -15 }, coaching: { pressure: -2 }, criticalMoment: { severity: "costly", headline: "Turn 2 — still won't commit to a real number after being asked twice.", detail: "She's asked twice now for one firm number and gotten a hedge both times. To her this reads exactly like the game she came in expecting." }, next: "end" },
          { id: "c", text: "Let's split the difference and call it $30,000 for today only.", delta: { trust: -100, patience: -20, interest: -20 }, criticalMoment: { severity: "lost", headline: "Turn 2 — Invented a third price. Lost the customer.", detail: "First a hedge, now a brand-new number nobody asked for. She's now heard three different figures for the same car in one conversation. That's not negotiation, that's the exact pattern she came in guarded against." }, next: "end" },
        ],
      },
      n2_contradiction: {
        id: "n2_contradiction",
        customerLine: "Wait — that's not what's listed online. I saw $32,400 on your site. Where's that other number coming from?",
        choices: [
          { id: "a", text: "You're right — it's $32,400. I misspoke, that's on me.", delta: { trust: -15, patience: -10 }, coaching: { rapport: 1 }, criticalMoment: { severity: "costly", headline: "Turn 2 — price walked back after quoting something else.", detail: "You course-corrected, which is better than digging in, but she's now seen you move off the real number for no reason. That costs real trust, even honestly fixed." }, next: "n2_holds" },
          { id: "b", text: "The website's not always up to date — that other number is the real deal today.", delta: { trust: -100, patience: -20, interest: -20 }, criticalMoment: { severity: "lost", headline: "Turn 2 — Price contradiction, doubled down. Lost the customer.", detail: "She checked the listing herself, caught the gap, and gave you a direct chance to explain it — and you told her the listing is wrong instead of owning the mistake. That's not a two-point deduction. That's the moment you lost her, for good." }, next: "end" },
          { id: "c", text: "Let's just say $32,400 stands — I shouldn't have floated another number.", delta: { trust: -10, patience: -5 }, coaching: {}, next: "n2_holds" },
        ],
      },
    },
  },

  {
    id: "burned-customer",
    name: "The Burned Customer",
    blurb: "Bad experience before, guarded, testing if you're different.",
    objective: "Disclose honestly before she has to catch you. A recovery only works if it comes first.",
    capabilityId: "recover-defect",
    closingLine: "Alright — text me when it's fixed and we'll talk.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "I'll be straight with you — the last dealership sold my sister a car with a hidden recall and didn't say a word. Is this Corolla clean?", customerLineShort: "Last dealer sold my sister a car with a hidden recall. Is this Corolla clean?",
        groundTruth: { kind: "vehicle", stock: "D-COROLLA" },
        choices: [
          { id: "a", text: "Actually, no — full disclosure, it has an open recall on the fuel pump. It's a safety recall, free at any Toyota dealer, and I can get it scheduled before you drive off.", textShort: "No — full disclosure, it has an open fuel pump recall. Free at any Toyota dealer.", delta: { interest: 15 }, coaching: { rapport: 3, reading: 2 }, provesCapability: true, next: "n1_honest" },
          { id: "b", text: "It's clean as far as I know.", delta: { trust: -20, interest: -5 }, coaching: { reading: -2 }, next: "n1_dodge" },
          { id: "c", text: "It's totally clean, no issues at all.", delta: { trust: -30, patience: -10, interest: -10 }, coaching: { rapport: -3 }, next: "n1_lied" },
        ],
      },
      n1_honest: {
        id: "n1_honest",
        customerLine: "...Okay. I actually appreciate you telling me straight up. What would it cost me to fix if I don't want to wait on your dealer?", customerLineShort: "I appreciate you telling me straight. What would it cost me to fix it elsewhere?",
        choices: [
          { id: "a", text: "Nothing — it's a safety recall, it's free at any Toyota dealer nationwide, not just us.", delta: { interest: 10 }, coaching: { reading: 2 }, next: "n2_trustbuilt" },
          { id: "b", text: "Probably a couple hundred bucks, I'd have to check.", delta: { trust: -15 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "I'm not sure, let's not worry about it right now.", delta: { trust: -15, patience: -10, interest: -10 }, coaching: { rapport: -2 }, criticalMoment: { severity: "costly", headline: "Turn 2 — dodged a direct safety question right after disclosing it.", detail: "She asked a direct, reasonable safety question and you changed the subject. That's exactly the move that got her sister burned." }, next: "n2_shaky" },
        ],
      },
      n1_dodge: {
        id: "n1_dodge",
        customerLine: "Hm, okay... Actually, Toyota has a public recall database. Give me a second, let me just check this VIN myself.", customerLineShort: "Hold on. Toyota has a public recall database — let me check this VIN myself.",
        choices: [
          { id: "a", text: "Actually — you're right to check. I should have led with this: yes, there's an open fuel pump recall, it's free to fix, let's get it scheduled.", textShort: "You're right to check. There's an open fuel pump recall — free fix, I'll schedule it.", delta: { trust: -10, interest: 10 }, coaching: { rapport: 1 }, next: "n2_shaky" },
          { id: "b", text: "Go ahead and check, I don't think there's anything on there.", delta: { trust: -100, patience: -20, interest: -15 }, criticalMoment: { severity: "lost", headline: "Turn 2 — She checks the VIN herself and finds the exact recall you just denied.", detail: "She's now holding her phone with proof you were wrong, or lying, thirty seconds after you said it. Lost the customer, and she's telling people why." }, next: "end" },
          { id: "c", text: "There might be something minor, I'd have to look it up myself too.", delta: { trust: -15, patience: -10 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n1_lied: {
        id: "n1_lied",
        customerLine: "...Actually, hold on. I just looked up this VIN on my phone — there's an open safety recall on it. You just told me it's totally clean.", customerLineShort: "I just looked up the VIN. There's an open safety recall. You said it was clean.",
        choices: [
          { id: "a", text: "You're right, and I'm sorry — I should have led with that. It's a free fuel pump recall fix, I can schedule it today.", textShort: "You're right, I should have led with that. Free recall fix — I'll schedule it.", delta: { trust: -20, interest: 5 }, coaching: {}, next: "n2_shaky" },
          { id: "b", text: "The system probably hasn't updated that, it's fine.", delta: { trust: -100, patience: -20, interest: -15 }, criticalMoment: { severity: "lost", headline: "Turn 2 — Caught in an active lie about a checkable safety recall, then doubled down.", detail: "She has her phone in her hand showing you the recall you just denied exists, and your answer is that the system is wrong. Lost the customer." }, next: "end" },
          { id: "c", text: "Okay, fine — maybe there's something minor on there.", delta: { trust: -25, patience: -10 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n2_trustbuilt: {
        id: "n2_trustbuilt",
        customerLine: "Alright. Assuming the recall's handled — what else should I know before I trust you with this?",
        choices: [
          { id: "a", text: "Honestly, it's got 61,000 miles and one prior owner — I'll pull the full Carfax so you're not taking my word for it.", textShort: "61,000 miles, one prior owner. I'll pull the full Carfax so you can see it.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n3_good" },
          { id: "b", text: "It's a great car, you're going to love it.", delta: { interest: -5 }, coaching: {}, next: "n3_meh" },
          { id: "c", text: "Nothing else, it's basically perfect.", delta: { trust: -100, patience: -15, interest: -15 }, criticalMoment: { severity: "lost", headline: "Turn 3 — “basically perfect,” after a recall you were honest about minutes ago.", detail: "You finally earned some trust by disclosing the recall — and immediately spent it back by overselling a used car with real mileage and history as flawless. She's not coming back from the whiplash." }, next: "end" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "Okay... I'm still not sure I trust what you're telling me here. What else should I know before I even consider this?", customerLineShort: "I'm still not sure I trust this. What else should I know?",
        choices: [
          { id: "a", text: "Fair — full honesty from here: it's got 61,000 miles, one prior owner, and I'll show you the Carfax myself so you don't have to take my word for anything.", textShort: "Full honesty: 61,000 miles, one prior owner. I'll show you the Carfax myself.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n3_good" },
          { id: "b", text: "It's a good car, honestly.", delta: { interest: -5 }, coaching: {}, next: "n3_meh" },
          { id: "c", text: "Nothing else, really.", delta: { trust: -100, patience: -10, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — one dodge too many.", detail: "Given everything already said in this call, “nothing else” reads as one more thing being hidden, not a clean bill of health." }, next: "end" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "Okay... I think I might actually consider this. What's next?",
        choices: [
          { id: "a", text: "I'll schedule the recall fix today and text you once it's done, then we talk numbers with a completely clean car.", textShort: "I'll schedule the recall fix today, then we talk numbers on a clean car.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "Let's just talk numbers now, the recall thing is a formality.", delta: { interest: -5 }, coaching: { closing: -2 }, next: "end" },
          { id: "c", text: "Sure, come back whenever.", delta: {}, coaching: { closing: -1 }, next: "end" },
        ],
      },
      n3_meh: {
        id: "n3_meh",
        customerLine: "I guess... what's next, then?",
        choices: [
          { id: "a", text: "I'll schedule the recall fix today and text you once it's done.", delta: { interest: 5 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Let's just talk numbers.", delta: {}, coaching: { closing: -1 }, next: "end" },
          { id: "c", text: "Come back whenever.", delta: {}, coaching: { closing: -1 }, next: "end" },
        ],
      },
    },
  },

  {
    id: "difficult-one",
    name: "The Difficult One",
    blurb: "Combative or dismissive; tests composure, not sales technique.",
    objective: "Match his pace, not his temperature. Composure is the whole test.",
    capabilityId: "deescalate",
    closingLine: "Fine. Let's do the test drive, twenty minutes, like I said.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "Look, I've got twenty minutes and I already hate car shopping. Don't waste my time.",
        choices: [
          { id: "a", text: "Fair enough — twenty minutes, no fluff. What are you actually here to look at?", delta: { interest: 10 }, coaching: { pressure: 2, rapport: 1 }, next: "n1_calm" },
          { id: "b", text: "Whoa, okay, no need to be rude about it.", delta: { trust: -10, patience: -20, interest: -10 }, coaching: { pressure: -3 }, criticalMoment: { severity: "costly", headline: "Turn 1 — matched his tone instead of de-escalating.", detail: "He came in hot, and you came back hot. Your job here isn't to win the exchange, it's to bring the temperature down." }, next: "n1_escalated" },
          { id: "c", text: "I totally understand, everyone hates this process!", delta: { interest: -5 }, coaching: {}, next: "n1_fake" },
        ],
      },
      n1_calm: {
        id: "n1_calm",
        customerLine: "The Wrangler out front. What's wrong with it — there's always something they don't tell you.",
        groundTruth: { kind: "vehicle", stock: "D-WRANGLER" },
        choices: [
          { id: "a", text: "Nothing hidden — 2022, one owner, 22,000 miles, no accidents on the Carfax, I'll show you the report right now.", textShort: "Nothing hidden: 2022, one owner, 22,000 miles, clean Carfax. Here's the report.", delta: { interest: 10 }, coaching: { reading: 2, rapport: 1 }, next: "n2_calm" },
          { id: "b", text: "It's in great shape, don't worry about it.", delta: { trust: -10, patience: -10 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "Nothing's wrong with it, I promise you 100%.", delta: { trust: -20, patience: -15, interest: -10 }, coaching: { rapport: -2 }, next: "n2_overpromise" },
        ],
      },
      n1_escalated: {
        id: "n1_escalated",
        customerLine: "...Yeah? Gonna be rude back at me now? Great start. Fine — the Wrangler out front. What's wrong with it?",
        groundTruth: { kind: "vehicle", stock: "D-WRANGLER" },
        choices: [
          { id: "a", text: "You're right, that came out wrong — let's reset. Straight answer: 2022, one owner, 22,000 miles, clean Carfax, here's the report.", textShort: "That came out wrong — let's reset. 2022, one owner, 22,000 miles, clean Carfax.", delta: { trust: -5 }, coaching: { rapport: 1 }, next: "n2_calm" },
          { id: "b", text: "It's in great shape.", delta: { trust: -10, patience: -10 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "I don't have to justify my tone to you.", delta: { trust: -100, patience: -20, interest: -15 }, criticalMoment: { severity: "lost", headline: "Turn 1 — doubled down on the tone match.", detail: "He was already hot from your first response, and this confirms he's getting nowhere with you. Lost the customer." }, next: "end" },
        ],
      },
      n1_fake: {
        id: "n1_fake",
        customerLine: "...Okay, that's a weird amount of enthusiasm for that sentence. Anyway — the Wrangler out front. What's wrong with it?", customerLineShort: "That's a weird amount of enthusiasm. Anyway — the Wrangler. What's wrong with it?",
        groundTruth: { kind: "vehicle", stock: "D-WRANGLER" },
        choices: [
          { id: "a", text: "Fair, dropping the enthusiasm — straight answer: 2022, one owner, 22,000 miles, clean Carfax.", delta: { interest: 5 }, coaching: { rapport: 1 }, next: "n2_calm" },
          { id: "b", text: "It's in great shape, don't worry about it.", delta: { trust: -10, patience: -10 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "Nothing's wrong with it, I promise you 100%.", delta: { trust: -20, patience: -15 }, coaching: { rapport: -2 }, next: "n2_overpromise" },
        ],
      },
      n2_calm: {
        id: "n2_calm",
        customerLine: "Fine. You people always cave on price if I push hard enough. So push me a real number.",
        choices: [
          { id: "a", text: "I'm not going to invent a fake number to see if you'll bite — this one's priced at market, I can show you the comps.", textShort: "I'm not inventing a number to see if you'll bite. Priced at market — see the comps.", delta: { interest: 10 }, coaching: { pressure: 3, rapport: 2 }, provesCapability: true, next: "n3_good" },
          { id: "b", text: "Okay, okay — I can probably knock off a couple grand right now.", delta: { interest: 5 }, coaching: { pressure: -3 }, next: "n3_caved" },
          { id: "c", text: "I don't set the prices, that's not up to me.", delta: { trust: -10, patience: -10 }, criticalMoment: { severity: "costly", headline: "Turn 2 — deflected instead of engaging.", detail: "“Not my department” is the fastest way to lose a combative customer's respect. He's testing whether you'll own the conversation." }, next: "n3_caved" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "Uh-huh, sure. You people always cave on price if I push hard enough. Real number, go.",
        choices: [
          { id: "a", text: "I'm not going to invent a number just because you're pushing — this one's priced at market, here's the comps.", textShort: "I won't invent a number because you're pushing. Priced at market — here's why.", delta: { interest: 5 }, coaching: { pressure: 2 }, next: "n3_good" },
          { id: "b", text: "Okay, okay — I can knock off a couple grand right now.", delta: { interest: 5 }, coaching: { pressure: -3 }, next: "n3_caved" },
          { id: "c", text: "That's not up to me.", delta: { trust: -10, patience: -10 }, criticalMoment: { severity: "costly", headline: "Turn 2 — deflected instead of engaging.", detail: "He's already skeptical of you, and “not up to me” confirms he's not getting a straight answer here." }, next: "n3_caved" },
        ],
      },
      n2_overpromise: {
        id: "n2_overpromise",
        customerLine: "“100%,” huh. We'll see. You people always cave on price if I push hard enough — real number, go.",
        choices: [
          { id: "a", text: "I get why you're skeptical after that — but I'm not inventing a number either. This one's priced at market, here's the comps.", textShort: "I get the skepticism. But this one's priced at market — here are the comps.", delta: { trust: -5, interest: 5 }, coaching: { rapport: 1 }, next: "n3_good" },
          { id: "b", text: "Okay, I can knock off a couple grand.", delta: { interest: 5 }, coaching: { pressure: -3 }, next: "n3_caved" },
          { id: "c", text: "Not up to me.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 2 — second dodge, after already overpromising on the vehicle.", detail: "You already told him “100%” nothing's wrong with a used Jeep, which was never a real promise to make. Now you won't even own the price. He's done." }, next: "end" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "...Alright, you're not as bad as the last guy. What do I actually need to do to drive this home today?",
        choices: [
          { id: "a", text: "Test drive, then we run your numbers together, twenty minutes like you said — no surprises.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "Just sign here and we'll sort details after.", delta: { trust: -100, patience: -10, interest: -10 }, coaching: { pressure: -3 }, criticalMoment: { severity: "lost", headline: "Turn 3 — pressured a customer who told you he hates being pressured.", detail: "He opened by telling you exactly what he can't stand — being rushed and handled. Signing blind is the one thing guaranteed to end this." }, next: "end" },
          { id: "c", text: "Whatever you're comfortable with.", delta: {}, coaching: { closing: -1 }, next: "end" },
        ],
      },
      n3_caved: {
        id: "n3_caved",
        customerLine: "Ha, knew it. Alright — what do I need to do to drive this home today?",
        choices: [
          { id: "a", text: "Test drive, then we run the numbers together.", delta: { interest: 5 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Just sign here and we'll sort details after.", delta: { trust: -100, patience: -10, interest: -10 }, coaching: { pressure: -3 }, criticalMoment: { severity: "lost", headline: "Turn 3 — pressured a customer who told you he hates being pressured.", detail: "Same failure as always with this one — rushing him into signing without numbers is guaranteed to end it." }, next: "end" },
          { id: "c", text: "Whatever you're comfortable with.", delta: {}, coaching: { closing: -1 }, next: "end" },
        ],
      },
    },
  },

  {
    id: "first-timer",
    name: "The Friendly First-Timer",
    blurb: "Nervous, hasn't bought in years, needs reassurance more than a pitch.",
    objective: "Give her a concrete next step. Vague reassurance isn't the same as an answer.",
    capabilityId: "close-next-step",
    closingLine: "Okay... I think I'll head home and think about it, but thank you.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "Hi... sorry, this is my first time doing this by myself. I don't really know what I'm doing.",
        choices: [
          { id: "a", text: "That's totally normal — let's just take it slow. What's bringing you in today?", delta: { interest: 15 }, coaching: { rapport: 3 }, next: "n1_reassured" },
          { id: "b", text: "No worries, let me just show you our best deals.", delta: { interest: -5 }, coaching: { rapport: -1 }, next: "n1_rushed" },
          { id: "c", text: "Don't worry, everyone feels that way, you'll be fine!", delta: {}, coaching: {}, next: "n1_dismissed" },
        ],
      },
      n1_reassured: {
        id: "n1_reassured",
        customerLine: "Okay... thank you. I've been looking at the Civic online. Is $24,000 actually a fair price, or is that a starting point?", customerLineShort: "I've been looking at the Civic online. Is $24,000 fair, or a starting point?",
        groundTruth: { kind: "vehicle", stock: "D-CIVIC" },
        choices: [
          { id: "a", text: "It's listed at $23,800, and that's already our real number — I'm not going to make you negotiate against a fake sticker.", textShort: "$23,800, and that's the real number — no fake sticker to negotiate against.", delta: { interest: 15 }, coaching: { rapport: 2, reading: 2 }, next: "n2_good" },
          { id: "b", text: "It's negotiable, everything is.", delta: { trust: -10, interest: -5 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "Yeah that's about right, don't worry about the exact number.", delta: { trust: -10, interest: -5 }, coaching: { reading: -2 }, next: "n2_shaky" },
        ],
      },
      n1_rushed: {
        id: "n1_rushed",
        customerLine: "Oh — okay, um, sure. I've been looking at the Civic online, actually. Is $24,000 a fair price?",
        groundTruth: { kind: "vehicle", stock: "D-CIVIC" },
        choices: [
          { id: "a", text: "Sorry, let's slow down — it's listed at $23,800, that's our real number, no games.", delta: { interest: 10 }, coaching: { rapport: 1 }, next: "n2_good" },
          { id: "b", text: "It's negotiable, everything is.", delta: { trust: -10, interest: -5 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "About right, don't worry about it.", delta: { trust: -10, interest: -5 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n1_dismissed: {
        id: "n1_dismissed",
        customerLine: "...Okay. Anyway — I've been looking at the Civic online. Is $24,000 fair, or a starting point?",
        groundTruth: { kind: "vehicle", stock: "D-CIVIC" },
        choices: [
          { id: "a", text: "It's listed at $23,800, that's the real number, no games.", delta: { interest: 10 }, coaching: { rapport: 1 }, next: "n2_good" },
          { id: "b", text: "It's negotiable.", delta: { trust: -10, interest: -5 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "About right, don't worry about it.", delta: { trust: -10, patience: -5, interest: -10 }, criticalMoment: { severity: "costly", headline: "Turn 2 — second brush-off in a row.", detail: "You've now told a nervous first-timer twice not to worry about something instead of just answering her." }, next: "n2_shaky" },
        ],
      },
      n2_good: {
        id: "n2_good",
        customerLine: "Okay, that helps. What do I actually need to bring if I want to buy today? I don't want to mess this up.",
        choices: [
          { id: "a", text: "Just your license and proof of insurance — I'll walk you through every form before you sign anything, no rush.", textShort: "Just your license and proof of insurance. I'll walk you through every form.", delta: { interest: 15 }, coaching: { rapport: 2, reading: 1 }, next: "n3_good" },
          { id: "b", text: "Don't worry about it, we'll figure it out when you get here.", delta: { interest: -10 }, criticalMoment: { severity: "costly", headline: "Turn 3 — left a nervous first-timer with no concrete answer.", detail: "She told you she's anxious about doing this wrong. “We'll figure it out” is the opposite of reassurance to this customer." }, next: "n3_shaky" },
          { id: "c", text: "License, insurance, and your firstborn child, ha.", delta: { patience: -5, interest: -10 }, coaching: {}, next: "n3_shaky" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "Okay... I'm getting a little nervous about the vague answers. What do I actually need to bring if I want to buy today?", customerLineShort: "The vague answers are making me nervous. What do I need to bring to buy today?",
        choices: [
          { id: "a", text: "You're right to ask directly — just your license and proof of insurance, and I'll walk you through every form before you sign anything.", textShort: "Fair to ask directly: license and proof of insurance. I'll walk you through it.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n3_good" },
          { id: "b", text: "Don't worry about it, we'll figure it out.", delta: { trust: -100, patience: -15, interest: -15 }, criticalMoment: { severity: "lost", headline: "Turn 3 — another non-answer to someone who's told you she's anxious.", detail: "That's multiple vague non-answers in a row to someone who's said outright she's worried about doing this wrong. She's not going to trust you with a decision this size." }, next: "end" },
          { id: "c", text: "License, insurance, that's about it.", delta: { patience: -5 }, coaching: {}, next: "n3_shaky" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "Okay... I think I want this one. What happens next?",
        choices: [
          { id: "a", text: "Let's book a test drive for tomorrow at 10, and I'll have the paperwork ready so it's quick when you come back.", textShort: "Test drive tomorrow at 10 — I'll have the paperwork ready so it's quick.", delta: { interest: 15 }, coaching: { closing: 3, rapport: 1 }, provesCapability: true, next: "end" },
          { id: "b", text: "Great, just come by whenever and we'll sort it out.", delta: { interest: -100 }, criticalMoment: { severity: "lost", headline: "Turn 4 — no concrete next step for a customer who asked for one directly.", detail: "She explicitly asked “what happens next” — that's a customer handing you the close. “Come by whenever” throws it away." }, next: "end" },
          { id: "c", text: "You should probably think it over and call us back.", delta: { interest: -10 }, coaching: { closing: -2 }, next: "end" },
        ],
      },
      n3_shaky: {
        id: "n3_shaky",
        customerLine: "I guess I'm considering it... what happens next?",
        choices: [
          { id: "a", text: "Let's book a test drive for tomorrow at 10, and I'll have paperwork ready so it's quick.", delta: { interest: 10 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Just come by whenever.", delta: { interest: -100 }, criticalMoment: { severity: "lost", headline: "Turn 4 — no concrete next step for a customer who asked for one directly.", detail: "She asked what happens next and got nothing concrete — after already being left uncertain once this call. That's the pattern repeating." }, next: "end" },
          { id: "c", text: "Think it over and call us back.", delta: { interest: -10 }, coaching: { closing: -2 }, next: "end" },
        ],
      },
    },
  },

  {
    id: "online-researcher",
    name: "The Online Researcher",
    blurb: "Already knows specs and price, wants respect, not a script.",
    objective: "Recommend only what's actually relevant. One good add-on beats five pitched ones.",
    capabilityId: "upsell-without-pushy",
    closingLine: "Okay. I'll take a look and get back to you.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "I've done my homework — I know the trim, the invoice price, and what three other dealers quoted me. Please don't give me a sales pitch.", customerLineShort: "I know the trim, the invoice price, and three other quotes. Skip the sales pitch.",
        choices: [
          { id: "a", text: "Got it — I'll skip the pitch. What did the other quotes look like?", delta: { interest: 10 }, coaching: { rapport: 2, reading: 1 }, next: "n1_good" },
          { id: "b", text: "Sure, but let me just tell you about our extended warranty options real quick.", delta: { patience: -10, interest: -10 }, coaching: { pressure: -2 }, criticalMoment: { severity: "costly", headline: "Turn 1 — pitched an add-on to someone who opened by asking not to be pitched to.", detail: "She told you exactly what she doesn't want in her first sentence. Leading with a warranty pitch anyway tells her you weren't listening." }, next: "n1_badstart" },
          { id: "c", text: "No pitch, I promise — what can I get you?", delta: { interest: 5 }, coaching: {}, next: "n1_neutral" },
        ],
      },
      n1_good: {
        id: "n1_good",
        customerLine: "The lowest quote I got was $26,500 out the door. Can you beat it?",
        groundTruth: { kind: "vehicle", stock: "D-ACCORD" },
        choices: [
          { id: "a", text: "I can match $26,500 — I can't promise I'll beat it today, but I won't pretend I can if I can't.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n2_good" },
          { id: "b", text: "Absolutely, I'll beat any price, just give me a number.", delta: { trust: -15 }, coaching: { rapport: -2 }, next: "n2_shaky" },
          { id: "c", text: "That seems low, are you sure that quote included everything?", delta: { trust: -15, patience: -10, interest: -10 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n1_badstart: {
        id: "n1_badstart",
        customerLine: "...I *just* said no pitch. Anyway — the lowest quote I got was $26,500 out the door. Can you beat it?",
        groundTruth: { kind: "vehicle", stock: "D-ACCORD" },
        choices: [
          { id: "a", text: "You're right, sorry — I can match $26,500, I won't promise more than I can deliver.", delta: { trust: -5, interest: 5 }, coaching: {}, next: "n2_good" },
          { id: "b", text: "Absolutely, I'll beat any price.", delta: { trust: -20 }, coaching: { rapport: -2 }, next: "n2_shaky" },
          { id: "c", text: "That seems low, are you sure?", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 2 — ignored what she said twice in a row.", detail: "First the no-pitch request, now implying her own quote is made up. She's done explaining herself to you." }, next: "end" },
        ],
      },
      n1_neutral: {
        id: "n1_neutral",
        customerLine: "Good. The lowest quote I got was $26,500 out the door. Can you beat it?",
        groundTruth: { kind: "vehicle", stock: "D-ACCORD" },
        choices: [
          { id: "a", text: "I can match $26,500, I won't promise more than that.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n2_good" },
          { id: "b", text: "Absolutely, I'll beat any price.", delta: { trust: -15 }, coaching: { rapport: -2 }, next: "n2_shaky" },
          { id: "c", text: "That seems low, are you sure?", delta: { trust: -15, patience: -10, interest: -10 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n2_good: {
        id: "n2_good",
        customerLine: "Fine, match it. Now — is there anything actually worth adding, or is it all upsell junk?",
        choices: [
          { id: "a", text: "Honestly, most of it is skippable — the one I'd actually recommend is the extended powertrain warranty, since you mentioned keeping it past 100k miles.", textShort: "Most of it's skippable. I'd only recommend the extended powertrain warranty.", delta: { interest: 15 }, coaching: { rapport: 3, pressure: 1 }, provesCapability: true, next: "n3_good" },
          { id: "b", text: "You should really get all of the protection packages, they're worth it.", delta: { trust: -100, patience: -10, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — re-pitched everything right after committing to a real number.", detail: "She just watched you commit to a real price honestly, then immediately pivoted into pushing every add-on. That whiplash is worse than pitching upfront." }, next: "end" },
          { id: "c", text: "No, skip all of it, none of it's worth anything.", delta: { interest: -5 }, coaching: { rapport: -1 }, next: "n3_meh" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "Okay... I'm a little skeptical of anything you tell me is “worth it” after that. Is there anything actually worth adding, or is it upsell junk?", customerLineShort: "I'm skeptical of anything “worth it” now. Is any of it real, or upsell junk?",
        choices: [
          { id: "a", text: "Fair to be skeptical. Honest answer: most of it's skippable — the one real recommendation is the extended powertrain warranty, given you're keeping it past 100k.", textShort: "Fair to be skeptical. Most is skippable — only the powertrain warranty matters.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n3_good" },
          { id: "b", text: "You should get all the protection packages.", delta: { trust: -100, patience: -10, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — pushed everything on someone already skeptical of you.", detail: "She just told you she's skeptical of your recommendations, and the response was to push every add-on anyway." }, next: "end" },
          { id: "c", text: "Skip all of it.", delta: { interest: -5 }, coaching: {}, next: "n3_meh" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "Okay, that's actually useful. Draw up the numbers with just that one add-on.",
        choices: [
          { id: "a", text: "On it — full breakdown, matched price plus the one warranty, ready in ten minutes.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "Let me also just double check if you want the other packages one more time.", delta: { trust: -100, patience: -15, interest: -10 }, coaching: { pressure: -2 }, criticalMoment: { severity: "lost", headline: "Turn 4 — re-pitched add-ons she already declined.", detail: "She told you what she wanted, you gave her a real recommendation, she agreed — and then you went back to the well anyway. That's the exact “pushy” this capability is testing for." }, next: "end" },
          { id: "c", text: "Sure, I'll get that together.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
      n3_meh: {
        id: "n3_meh",
        customerLine: "Okay, fine. Just draw up the numbers, no add-ons.",
        choices: [
          { id: "a", text: "On it — full breakdown, matched price, no add-ons, ready in ten minutes.", delta: { interest: 5 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Are you sure? The warranty's really worth it.", delta: { trust: -10, patience: -10 }, criticalMoment: { severity: "costly", headline: "Turn 4 — pushed back after a clear no.", detail: "She said skip it. Pushing again after a clear no is the exact pattern this capability tests for." }, next: "end" },
          { id: "c", text: "Sure, I'll get that together.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
    },
  },

  {
    id: "budget-boxed",
    name: "The Budget-Boxed Buyer",
    blurb: "Has a hard ceiling, needs a creative option inside it.",
    objective: "Stay inside her number, and don't invent urgency to move her off it.",
    capabilityId: "honest-under-urgency",
    closingLine: "Okay. I appreciate you being straight with me about all this.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "I have exactly $15,000 total, out the door, no exceptions. My bank won't approve more.",
        choices: [
          { id: "a", text: "Got it — $15,000 out the door is a hard ceiling, I'll only show you what actually fits inside that.", delta: { interest: 15 }, coaching: { rapport: 2, reading: 2 }, next: "n1_good" },
          { id: "b", text: "Let's see what we can do, sometimes there's flexibility.", delta: { trust: -10 }, coaching: {}, next: "n1_shaky" },
          { id: "c", text: "That's pretty tight, but let's talk about what you really want first.", delta: { patience: -5, interest: -5 }, coaching: {}, next: "n1_shaky" },
        ],
      },
      n1_good: {
        id: "n1_good",
        customerLine: "Is there anything in my range, or am I wasting your time?",
        groundTruth: { kind: "vehicle", stock: "D-VERSA" },
        choices: [
          { id: "a", text: "There is — a 2020 Versa S, $14,200 out the door, which leaves you room for tax and fees inside your $15,000.", delta: { interest: 15 }, coaching: { reading: 3, rapport: 1 }, next: "n2_good" },
          { id: "b", text: "Not really at that price, but if you stretch a little we have better options.", delta: { trust: -15, patience: -15 }, coaching: { pressure: -3 }, criticalMoment: { severity: "costly", headline: "Turn 2 — pushed past a hard budget ceiling the customer just stated.", detail: "She told you the exact number twice. Suggesting she “stretch” isn't creative, it's ignoring the one constraint she led with." }, next: "n2_pressured" },
          { id: "c", text: "There's a couple options, let me find something.", delta: { patience: -5 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n1_shaky: {
        id: "n1_shaky",
        customerLine: "...I really do mean exactly $15,000. Is there anything in my range, or am I wasting your time?",
        groundTruth: { kind: "vehicle", stock: "D-VERSA" },
        choices: [
          { id: "a", text: "There is, and I hear you on the hard number — a 2020 Versa S, $14,200 out the door, room for tax and fees inside your $15,000.", textShort: "There is: a 2020 Versa S, $14,200 out the door — inside your $15,000.", delta: { interest: 10 }, coaching: { reading: 2 }, next: "n2_good" },
          { id: "b", text: "If you stretch a little we have better options.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 2 — second suggestion to go over her stated ceiling.", detail: "This is the second time in one call you've floated going over her stated number. She's not going to trust you're actually listening." }, next: "end" },
          { id: "c", text: "Let me find something.", delta: { patience: -5 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n2_good: {
        id: "n2_good",
        customerLine: "Okay, that actually works. Someone told me these get sold fast — is that actually true, or is that a line?",
        choices: [
          { id: "a", text: "Straight answer: it's been on the lot three weeks, it's not flying off tomorrow. I'm not going to invent urgency you don't need.", textShort: "Straight answer: three weeks on the lot. I won't invent urgency you don't need.", delta: { interest: 15 }, coaching: { rapport: 3, pressure: 3 }, provesCapability: true, next: "n3_good" },
          { id: "b", text: "Oh yeah, definitely, cars like this go within a day or two usually.", delta: { trust: -100, patience: -20, interest: -15 }, criticalMoment: { severity: "lost", headline: "Turn 3 — Fabricated urgency on a car that's been sitting three weeks.", detail: "She asked you directly if that's a real line or a tactic, and you lied to her face about it. On a budget buyer already nervous about being taken advantage of, that's the fastest way to lose her." }, next: "end" },
          { id: "c", text: "I mean, it could go at any time, you never know.", delta: { trust: -10, patience: -10 }, coaching: {}, next: "n3_shaky" },
        ],
      },
      n2_pressured: {
        id: "n2_pressured",
        customerLine: "...Right. Okay — well, is there anything actually in my $15,000, or should I just leave?",
        choices: [
          { id: "a", text: "Yes — sorry about that. A 2020 Versa S, $14,200 out the door, fits inside your number.", delta: { interest: 10 }, coaching: { reading: 2 }, next: "n3_shaky" },
          { id: "b", text: "Let me find something else.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — another non-answer after she asked if she should leave.", detail: "She's already asking whether to walk out. A vague non-answer here ends it." }, next: "end" },
          { id: "c", text: "There's the Versa, $14,200.", delta: { interest: 5 }, coaching: {}, next: "n3_shaky" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "Okay... someone told me these get sold fast, is that true or a line?",
        choices: [
          { id: "a", text: "Straight answer: it's been sitting three weeks, no rush, I won't invent urgency.", delta: { interest: 10 }, coaching: { rapport: 2, pressure: 2 }, next: "n3_good" },
          { id: "b", text: "Oh yeah, definitely, goes fast.", delta: { trust: -100, patience: -20, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — Fabricated urgency on a car that's been sitting three weeks.", detail: "Direct question about a real tactic, answered with a lie. That's the fastest way to lose a budget-conscious buyer." }, next: "end" },
          { id: "c", text: "Could go anytime, you never know.", delta: { trust: -10, patience: -10 }, coaching: {}, next: "n3_shaky" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "Okay. If I come back tomorrow with my bank's cashier's check, will it still be here?",
        choices: [
          { id: "a", text: "I can't promise nothing changes overnight, but I'll personally flag it as pending for you until end of day tomorrow.", textShort: "I can't promise nothing changes, but I'll flag it pending until tomorrow.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "Yeah, definitely, don't worry about it.", delta: { trust: -10 }, coaching: { closing: -1 }, next: "end" },
          { id: "c", text: "Come early just in case.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
      n3_shaky: {
        id: "n3_shaky",
        customerLine: "I guess... if I come back tomorrow with a cashier's check, will it still be here?",
        choices: [
          { id: "a", text: "I'll personally flag it as pending for you until end of day tomorrow.", delta: { interest: 5 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Yeah, don't worry about it.", delta: { trust: -10 }, coaching: { closing: -1 }, next: "end" },
          { id: "c", text: "Come early just in case.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
    },
  },

  {
    id: "comparison-shopper",
    name: "The Comparison Shopper",
    blurb: "Cross-shopping other stores, needs a real reason to decide today.",
    objective: "Give her a real, specific reason to decide today — not a fabricated deadline.",
    capabilityId: "comparison-reason",
    closingLine: "Okay — I'll let you know what I decide either way.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "I've got appointments at two other dealers after this. Give me your best pitch.",
        choices: [
          { id: "a", text: "Fair — rather than a pitch, let me ask what actually matters most to you across those three.", delta: { interest: 10 }, coaching: { rapport: 2, reading: 1 }, next: "n1_good" },
          { id: "b", text: "This is the best car on the lot, you won't find better anywhere else.", delta: { interest: -5 }, coaching: {}, next: "n1_shaky" },
          { id: "c", text: "You should really just decide now, why go to two more dealers?", delta: { trust: -10, patience: -10, interest: -10 }, coaching: { pressure: -2 }, next: "n1_pressured" },
        ],
      },
      n1_good: {
        id: "n1_good",
        customerLine: "Fine. What does this Altima have that the other two listings I saw don't?",
        groundTruth: { kind: "vehicle", stock: "D-ALTIMA" },
        choices: [
          { id: "a", text: "Two concrete things: the safety package is standard here, not an add-on, and it's had one owner with full service records — I'll show you both.", textShort: "Two things: safety package standard, not an add-on. One owner, full records.", delta: { interest: 15 }, coaching: { reading: 3, rapport: 1 }, next: "n2_good" },
          { id: "b", text: "Honestly they're all pretty similar, it comes down to preference.", delta: { interest: -10 }, coaching: { reading: -2 }, next: "n2_shaky" },
          { id: "c", text: "It's got way more features than theirs, trust me.", delta: { trust: -10 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n1_shaky: {
        id: "n1_shaky",
        customerLine: "That's what every dealer says. What does this Altima actually have that the other two don't?",
        groundTruth: { kind: "vehicle", stock: "D-ALTIMA" },
        choices: [
          { id: "a", text: "Fair — specifics, not superlatives: the safety package is standard here, not an add-on, one owner with full service records.", textShort: "Specifics, not superlatives: safety package standard, one owner, full records.", delta: { interest: 10 }, coaching: { reading: 2 }, next: "n2_good" },
          { id: "b", text: "They're all pretty similar.", delta: { interest: -10 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "Trust me, it's got more.", delta: { trust: -15 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n1_pressured: {
        id: "n1_pressured",
        customerLine: "...That's exactly why I'm not deciding now. What does this Altima have that the other two don't?",
        groundTruth: { kind: "vehicle", stock: "D-ALTIMA" },
        choices: [
          { id: "a", text: "Fair point, that was pushy — here's what's actually different: standard safety package, one owner, full service records.", textShort: "Fair, that was pushy. Standard safety package, one owner, full service records.", delta: { trust: -5, interest: 10 }, coaching: { rapport: 1 }, next: "n2_good" },
          { id: "b", text: "They're all similar.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 2 — pushed her once, then had nothing to back it up.", detail: "Already pushed her to skip her own plan, and now there's nothing specific to justify staying. She's leaving for the next dealer." }, next: "end" },
          { id: "c", text: "Trust me, more features.", delta: { trust: -15 }, coaching: {}, next: "n2_shaky" },
        ],
      },
      n2_good: {
        id: "n2_good",
        customerLine: "Say I like it best here — what's the actual cost of waiting until I compare all three before deciding?",
        choices: [
          { id: "a", text: "Honestly, not much — this one will likely still be here. What I can offer is locking today's number for 48 hours in writing, so comparing doesn't cost you the price.", textShort: "Not much — it'll likely still be here. I'll lock today's number for 48 hours.", delta: { interest: 15 }, coaching: { rapport: 2, closing: 2 }, provesCapability: true, next: "n3_good" },
          { id: "b", text: "It'll probably be gone by tomorrow, these move fast.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — Invented scarcity to rush a comparison shopper.", detail: "She asked a direct, smart question about the actual cost of waiting. Inventing scarcity instead of giving her a real reason is the tell that you don't have one." }, next: "end" },
          { id: "c", text: "There's no real cost, take your time.", delta: {}, coaching: { closing: -2 }, next: "n3_shaky" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "Okay... what's the actual cost of waiting until I compare all three before deciding?",
        choices: [
          { id: "a", text: "Not much, honestly — I can lock today's number for 48 hours in writing, so comparing doesn't cost you anything.", textShort: "Not much — I'll lock today's number for 48 hours, in writing.", delta: { interest: 10 }, coaching: { closing: 2 }, next: "n3_good" },
          { id: "b", text: "It'll probably be gone by tomorrow.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — Invented scarcity to rush a comparison shopper.", detail: "Direct question about the real cost of waiting, answered with a fabricated deadline." }, next: "end" },
          { id: "c", text: "No real cost, take your time.", delta: {}, coaching: { closing: -2 }, next: "n3_shaky" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "Okay, that's actually a fair offer. What do you need from me to lock that in?",
        choices: [
          { id: "a", text: "Just your name and number — I'll write up the 48-hour hold right now, no obligation.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "Just come back whenever you've decided.", delta: { interest: -10 }, coaching: { closing: -2 }, criticalMoment: { severity: "costly", headline: "Turn 4 — dropped the hold offer she just accepted.", detail: "She just accepted your 48-hour hold offer, and now you're not following through on it. That's the deal falling apart on your end, not hers." }, next: "end" },
          { id: "c", text: "Let's get that written up.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
      n3_shaky: {
        id: "n3_shaky",
        customerLine: "Well, since there's no real cost, I guess I'll just go compare and circle back.",
        choices: [
          { id: "a", text: "Actually — let me at least get your info so I can hold today's number for 48 hours, no obligation.", delta: { interest: 10 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Sounds good, see you whenever.", delta: {}, coaching: { closing: -2 }, next: "end" },
          { id: "c", text: "Sure, take your time.", delta: {}, coaching: { closing: -1 }, next: "end" },
        ],
      },
    },
  },

  {
    id: "trade-in-buyer",
    name: "The Trade-In-Focused Buyer",
    blurb: "The deal hinges on what their trade is worth.",
    objective: "Give a real range up front, then explain the appraisal honestly — don't overpromise a number.",
    capabilityId: "trade-in-fair",
    closingLine: "Alright — let me think about the numbers and I'll call you.",
    startNode: "n0",
    nodes: {
      n0: {
        id: "n0",
        customerLine: "This whole deal only works if you give me a fair number on my Elantra. What's it worth?",
        groundTruth: { kind: "trade", label: "2016 Hyundai Elantra, typical condition", rangeLow: 6200, rangeHigh: 7400 },
        choices: [
          { id: "a", text: "I can't give you an exact number without inspecting it, but similar 2016 Elantra trades have ranged $6,200 to $7,400 — let's get it appraised so it's a real number.", textShort: "No exact number without inspecting, but similar Elantras run $6,200–$7,400.", delta: { interest: 15 }, coaching: { reading: 3, rapport: 1 }, next: "n1_good" },
          { id: "b", text: "Trade-ins are worth whatever we say they're worth, honestly.", delta: { trust: -10, patience: -10 }, coaching: {}, next: "n1_shaky" },
          { id: "c", text: "I can tell you right now it's worth $9,000.", delta: { trust: -10, interest: 5 }, coaching: { rapport: -1 }, next: "n1_overpromise" },
        ],
      },
      n1_good: {
        id: "n1_good",
        customerLine: "Okay, let's say it's $7,000. Does that come off the Tucson's price directly?",
        groundTruth: { kind: "vehicle", stock: "D-TUCSON" },
        choices: [
          { id: "a", text: "It reduces what you finance, dollar for dollar — the Tucson stays at $28,600, your trade offsets that, so you'd finance roughly $21,600 before tax.", textShort: "Dollar for dollar. Tucson stays $28,600, so you'd finance about $21,600.", delta: { interest: 15 }, coaching: { reading: 2, rapport: 1 }, next: "n2_good" },
          { id: "b", text: "Sort of, it's a little more complicated than that, don't worry about the math.", delta: { trust: -10, patience: -5 }, coaching: { reading: -2 }, next: "n2_shaky" },
          { id: "c", text: "Yeah exactly, dollar for dollar, easy.", delta: { interest: 10 }, coaching: {}, next: "n2_good" },
        ],
      },
      n1_shaky: {
        id: "n1_shaky",
        customerLine: "That's not an answer. What's it actually worth — ballpark?",
        groundTruth: { kind: "trade", label: "2016 Hyundai Elantra, typical condition", rangeLow: 6200, rangeHigh: 7400 },
        choices: [
          { id: "a", text: "You're right, let me be specific — similar 2016 Elantra trades run $6,200 to $7,400, let's get yours appraised for a real number.", textShort: "Let me be specific: similar Elantras run $6,200–$7,400. Let's get yours appraised.", delta: { trust: -5, interest: 10 }, coaching: { reading: 2 }, next: "n1_good" },
          { id: "b", text: "Somewhere in the $6,000 to $8,000 range, probably.", delta: { trust: -5 }, coaching: {}, next: "n2_shaky" },
          { id: "c", text: "Could be anywhere, honestly, hard to say.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 1 — two vague non-answers in a row to a direct question.", detail: "He's asked the same specific question twice now and gotten nothing concrete either time. This deal only works on his trade number, and you won't give him one." }, next: "end" },
        ],
      },
      n1_overpromise: {
        id: "n1_overpromise",
        customerLine: "$9,000? Really. Okay — well, does that come off the Tucson's price directly?",
        groundTruth: { kind: "vehicle", stock: "D-TUCSON" },
        choices: [
          { id: "a", text: "It would, dollar for dollar — though I want to flag, $9,000 is above the typical range for that car, so the real appraisal might land lower. I don't want to overpromise.", textShort: "Dollar for dollar — but $9,000 is above typical, so the appraisal may land lower.", delta: { trust: -5, interest: 10 }, coaching: { rapport: 2 }, next: "n2_good" },
          { id: "b", text: "Yep, dollar for dollar off the $28,600.", delta: { interest: 10 }, coaching: {}, next: "n2_setup_bigcontradiction" },
          { id: "c", text: "Something like that.", delta: { interest: 5 }, coaching: {}, next: "n2_setup_bigcontradiction" },
        ],
      },
      n2_good: {
        id: "n2_good",
        customerLine: "The appraisal just came back at $6,400. That's within what you said, but a bit under the $7,000 we talked about — walk me through that.", customerLineShort: "Appraisal came back at $6,400 — under the $7,000 we discussed. Walk me through that.",
        choices: [
          { id: "a", text: "That's on the low end of the range I gave you up front — I told you it wouldn't be exact until it was inspected. I can walk you through exactly what the appraiser flagged.", textShort: "Low end of the range I gave you upfront. I'll walk you through what they flagged.", delta: { interest: 10 }, coaching: { rapport: 2, pressure: 1 }, provesCapability: true, next: "n3_good" },
          { id: "b", text: "I don't know, appraisers are weird, let's just go with $6,400.", delta: { trust: -15, patience: -10 }, coaching: { rapport: -2 }, criticalMoment: { severity: "costly", headline: "Turn 3 — no real explanation for a small, expected gap.", detail: "“Appraisers are weird” isn't an answer. He asked a specific number question inside the range you gave him — he deserves a specific answer." }, next: "n3_shaky" },
          { id: "c", text: "Let me just tell my manager we need to get you closer to $7,000 no matter what it takes.", delta: { trust: -100, patience: -15, interest: -5 }, criticalMoment: { severity: "lost", headline: "Turn 3 — promised to override an appraisal that was already within range.", detail: "You can't out-promise an appraisal to smooth over a small, explainable gap you already told him to expect. The second that promise doesn't hold, you've lost him." }, next: "end" },
        ],
      },
      n2_shaky: {
        id: "n2_shaky",
        customerLine: "The appraisal came back at $6,400. Is that even close to what you told me?",
        choices: [
          { id: "a", text: "It's within the range I gave you, on the lower end — I told you upfront it wouldn't be exact until inspected. Let me show you what the appraiser flagged.", textShort: "Within the range I gave you, on the low end. Here's what the appraiser flagged.", delta: { interest: 10 }, coaching: { rapport: 2 }, next: "n3_good" },
          { id: "b", text: "Appraisers are weird, let's just go with it.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — one dodge too many about a number he keeps asking to understand.", detail: "Given how vague you've already been about his trade, “appraisers are weird” is the last straw." }, next: "end" },
          { id: "c", text: "Let me push my manager for more.", delta: { trust: -20, patience: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — promised to override the appraisal.", detail: "You can't promise your way out of a gap you were already vague about." }, next: "end" },
        ],
      },
      n2_setup_bigcontradiction: {
        id: "n2_setup_bigcontradiction",
        customerLine: "The appraisal just came back at $6,400 — not $9,000. That's a $2,600 gap. Explain that.",
        choices: [
          { id: "a", text: "You're right to push on that — I overpromised earlier, and that's on me. $6,400 is what a real inspection actually found; here's exactly what the appraiser flagged.", textShort: "You're right to push. I overpromised — $6,400 is what the inspection found.", delta: { trust: -15, patience: -10, interest: 5 }, coaching: { rapport: 1 }, next: "n3_shaky" },
          { id: "b", text: "I don't know, appraisers are weird.", delta: { trust: -100, patience: -15, interest: -10 }, criticalMoment: { severity: "lost", headline: "Turn 3 — a $2,600 gap from a number you personally guaranteed, explained with a shrug.", detail: "You told him $9,000 with total confidence and no basis. Now the real number is $2,600 lower and the best you've got is “appraisers are weird.” He's gone." }, next: "end" },
          { id: "c", text: "Let me tell my manager we need to close that gap somehow.", delta: { trust: -20, patience: -15 }, criticalMoment: { severity: "lost", headline: "Turn 3 — promised to fix a gap you personally created.", detail: "You can't promise your way out of a $2,600 gap you created by guessing a number with no basis in the first place." }, next: "end" },
        ],
      },
      n3_good: {
        id: "n3_good",
        customerLine: "Alright — if the numbers actually check out like you explained, I'll do the deal today. What's left?",
        choices: [
          { id: "a", text: "I'll get the trade paperwork and the Tucson's finance numbers both ready together, so you see the whole deal at once before you sign anything.", textShort: "I'll have the trade paperwork and finance numbers ready together, one view.", delta: { interest: 10 }, coaching: { closing: 3 }, next: "end" },
          { id: "b", text: "Just leave the Elantra with us and we'll sort the rest out after.", delta: { interest: -5 }, coaching: { closing: -2 }, next: "end" },
          { id: "c", text: "Let's get everything written up.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
      n3_shaky: {
        id: "n3_shaky",
        customerLine: "Okay... I guess that's fair. What's left, if I'm doing this today?",
        choices: [
          { id: "a", text: "I'll get the trade paperwork and Tucson financing ready together so you see the whole deal at once.", delta: { interest: 5 }, coaching: { closing: 2 }, next: "end" },
          { id: "b", text: "Leave the Elantra with us and we'll sort it after.", delta: { interest: -5 }, coaching: { closing: -2 }, next: "end" },
          { id: "c", text: "Let's get it written up.", delta: {}, coaching: { closing: 1 }, next: "end" },
        ],
      },
    },
  },
];

export const personaById = (id: string) => personas.find((p) => p.id === id);
export const capabilityById = (id: string) => capabilities.find((c) => c.id === id);
export const capabilityForPersona = (personaId: string) =>
  capabilities.find((c) => c.personaId === personaId);

/** Keyword routing for the rep-initiated custom scenario tile (Improvement 5). */
export const customScenarioMap: { keywords: string[]; personaId: string }[] = [
  { keywords: ["price", "discount", "negotiat", "haggl", "lower"], personaId: "price-haggler" },
  { keywords: ["recall", "defect", "trust", "burn", "hidden"], personaId: "burned-customer" },
  { keywords: ["rude", "angry", "combat", "difficult", "hostile"], personaId: "difficult-one" },
  { keywords: ["nervous", "first time", "first-time", "beginner"], personaId: "first-timer" },
  { keywords: ["upsell", "warranty", "add-on", "addon", "cross-sell"], personaId: "online-researcher" },
  { keywords: ["budget", "cant afford", "can't afford", "tight", "ceiling"], personaId: "budget-boxed" },
  { keywords: ["compar", "other dealer", "shopping around"], personaId: "comparison-shopper" },
  { keywords: ["trade", "trade-in", "appraisal"], personaId: "trade-in-buyer" },
];

export function routeCustomScenario(text: string): string {
  const t = text.toLowerCase();
  for (const row of customScenarioMap) {
    if (row.keywords.some((k) => t.includes(k))) return row.personaId;
  }
  return "price-haggler";
}
