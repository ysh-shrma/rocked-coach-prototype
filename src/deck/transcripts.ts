/**
 * The three AI Coach sessions, verbatim.
 *
 * This is the submission's primary evidence: the deck's whole argument is that
 * damage never compounds across a call, and these are the calls. Extracted by
 * script from the appendix of
 * `career-ops/interview-prep/rocked/assignment/discovery-findings-compiled.md`
 * (the transcripts as RockED emailed them back, plus RockED's own scoring),
 * never retyped: 75 turns transcribed by hand is 75 chances to alter a quote
 * nobody would catch.
 *
 * NOTHING IN THIS FILE GETS COPY-EDITED. The em dashes, the filler words, the
 * "um"s and the mid-sentence corrections are what was actually said. The deck's
 * own prose had its em dashes removed. This file deliberately keeps all of its,
 * because editing evidence to match a style rule is falsifying it.
 */

export type Turn = { speaker: "customer" | "rep"; text: string };

/** RockED's own scoring row. Session 3's table has no suggestion column. */
export type Category = {
  name: string;
  score: string;
  reason: string;
  suggestion?: string;
};

export type Session = {
  n: number;
  score: number;
  /** Present on session 3 only: what the run was designed to test. */
  note: string | null;
  categories: Category[];
  turns: Turn[];
};

/** The five deliberate anomalies planted in session 3, and what she did with
 *  each. Four landed. The fifth, manufactured urgency, produced nothing, which
 *  is the finding the whole deck is built on. */
export type Probe = { n: number; probe: string; result: string };

export const SESSIONS: Session[] = [
  {
    "n": 1,
    "score": 17,
    "note": null,
    "categories": [
      {
        "name": "Introduction",
        "score": "4/10",
        "reason": "Basic greeting but incomplete — said \"Free Ford Ford Motors\" for what appears to be a different brand, didn't properly acknowledge the inquiry",
        "suggestion": "Introduce clearly by name, correctly state the dealership name, acknowledge the specific RAV4 inquiry"
      },
      {
        "name": "Qualifying and Scoping",
        "score": "7/10",
        "reason": "Good questioning about family size, needs, budget; suggested similar CR-V; could have been more empathetic",
        "suggestion": "Show more genuine empathy about the sold RAV4, more detailed comparisons"
      },
      {
        "name": "Closing",
        "score": "6/10",
        "reason": "Moved customer to view the vehicle but didn't secure test-drive commitment or contact details",
        "suggestion": "Secure a definitive test-drive commitment and collect contact info"
      }
    ],
    "turns": [
      {
        "speaker": "customer",
        "text": "Hello. I'm Lisa. I sent you a message about the 2023 red Toyota RAV-4 I saw on your website, but when I checked this morning, I didn't see it. Is it still available?"
      },
      {
        "speaker": "rep",
        "text": "Hey Lisa, welcome to Free Ford Ford Motors. Um, I think that the RAO that you were looking at has just been sold, but we do have a bunch of other similar options uh that I can show you around since you're already here. Uh, can you help me understand what excited you about the RA4 the most."
      },
      {
        "speaker": "customer",
        "text": "Oh, really? It was already sold? That's a little disappointing, I mean, I was really looking forward to seeing it. But okay, well, I guess. So, what exactly *did* excite me about it? Well, it just seemed like a really good all-around SUV, you know? Good size, seemed reliable, and I liked the look of it. I'm looking for something similar, honestly."
      },
      {
        "speaker": "rep",
        "text": "When you say you like the. The size, um. What are you, are you looking for a vehicle for? A large vehicle itself, how many, how many folks do you have in your family? How many kids or is it just you?"
      },
      {
        "speaker": "customer",
        "text": "That's a good question. It's mostly just me, actually. I mean, I sometimes have my niece with me, but it's mostly for myself. I need something practical, you know? Not *too* big, but enough space for luggage if I'm traveling. It's more about the practicality than the number of passengers. So, what other SUVs do you have that are roughly the same size as that RAV4?"
      },
      {
        "speaker": "rep",
        "text": "Got it. So nothing for a large group of folks, uh, but practicality is your primary need at the moment. Now, tell me what's important for you in a car? I see you mentioned practicality, and you also mentioned that you'd like to travel. Are you looking for something that has good mileage or something that's, you know, just a more sporty version."
      },
      {
        "speaker": "customer",
        "text": "Right, practicality is key. And yes, good mileage is definitely important, I mean, I do a lot of driving for work. I guess sporty isn't exactly the word I'd use, but I do appreciate something that's, like, responsive and handles well. What kind of mileage are we talking about with those similar-sized SUVs?"
      },
      {
        "speaker": "rep",
        "text": "We're looking at something around 25, if you're looking at the city MPG, we have a bunch of Mazdas, some Nissans, and a couple of Hyundai options available. All of them have a good spacious cabin, good safety, and good cargo space. Do you think that makes sense, or are you looking for something with slightly more MPG?"
      },
      {
        "speaker": "customer",
        "text": "Okay, 25 mpg sounds reasonable. Mazdas, Nissans, and Hyundais… I'm familiar with those. Do you have any of those that are closest in size and feel to the RAV4 I was looking at? I'm not necessarily looking for *more* MPG, but honestly, the closer it is to the RAV4, the better."
      },
      {
        "speaker": "rep",
        "text": "I think you'd really love the CRV that we have in stock. Let me just quickly check — but I see that it's available. Do you want to come see it, or do you have any questions before we take a look?"
      },
      {
        "speaker": "customer",
        "text": "A CRV? Okay, that's interesting. What year is it, and roughly what kind of mileage does it have? And is it close to the price range of the RAV4 I was initially interested in?"
      },
      {
        "speaker": "rep",
        "text": "I have a bunch of CRVs — 2018, 2019, 2020, 2021 — all between $20,000 to $25,000, somewhere around there, in a few colors. What budget do you have in mind?"
      },
      {
        "speaker": "customer",
        "text": "Okay, a range of years and prices... that's helpful. I was hoping to stay around the $25,000 mark, maybe a little less if possible. A black one would be nice, but color isn't a huge deal. So, out of those CRVs, which one would you say is most comparable to the 2023 RAV4 I saw?"
      },
      {
        "speaker": "rep",
        "text": "Let me quickly take you out for a test drive. Did you actually drive the RAV4 before? Would you be able to compare it yourself once you're seated in the CRV?"
      },
      {
        "speaker": "customer",
        "text": "Actually, I haven't driven a RAV4 before, so comparing them would be good. But before a test drive, could you tell me a little bit more about the 2020 CRV? Specifically, what's the mileage, and what features does it have?"
      },
      {
        "speaker": "rep",
        "text": "Absolutely — it's a 2020 CRV, around 27,000 miles, comes in at around $25,000. It has side impact airbags, a good safety rating, heated seats, lane departure warning, blind spot detectors, rearview camera, and leather memory seats. Given it's only you driving, memory seats aren't as relevant. Anything specific you're looking for, or are you ready to take it out for a spin?"
      },
      {
        "speaker": "customer",
        "text": "Okay, 27,000 miles and all those safety features sound pretty good. The memory seats aren't a huge priority, but the safety features are definitely important. I think I am ready to take a look at it, but I'd like to walk around it first before committing to a test drive."
      },
      {
        "speaker": "rep",
        "text": "Absolutely. That's what I'm here for. Let's take a look."
      },
      {
        "speaker": "customer",
        "text": "Great. Let's go."
      }
    ]
  },
  {
    "n": 2,
    "score": 24,
    "note": null,
    "categories": [
      {
        "name": "Introduction",
        "score": "8/10",
        "reason": "Warm, professional, acknowledged the specific inquiry, confirmed the RAV4 was sold, apologized genuinely",
        "suggestion": "Explicitly confirm all original vehicle details (red color, 2023 model) for a perfect score"
      },
      {
        "name": "Qualifying and Scoping",
        "score": "9/10",
        "reason": "Genuine empathy about the sold RAV4, excellent qualifying questions about usage/family/needs, presented a very similar CR-V alternative",
        "suggestion": "Explore technology/warranty preferences before suggesting alternatives"
      },
      {
        "name": "Closing",
        "score": "7/10",
        "reason": "Got Lisa interested in viewing the CR-V, confirmed her contact details",
        "suggestion": "Should have explicitly asked for a test-drive commitment and discussed financing/timeline"
      }
    ],
    "turns": [
      {
        "speaker": "customer",
        "text": "Hello. I'm Lisa. I sent you a message about the 2023 red Toyota RAV-4 I saw on your website, but when I checked this morning, I didn't see it. Is it still available?"
      },
      {
        "speaker": "rep",
        "text": "Hey Lisa. Welcome to Paragon Honda. This is Josh. A very good morning to you. Let me quickly check that RAV4 that you're talking about."
      },
      {
        "speaker": "customer",
        "text": "Okay, great. Thank you, Josh. I appreciate it. I was really hoping it was still here."
      },
      {
        "speaker": "rep",
        "text": "I am really sorry, but I think we've sold the RAV4 just a couple of hours back. A gentleman was here before you and he liked the car — I agree it's a beautiful car. I'm really sorry it's not here anymore. But we do have a lot of other similar options I'm sure you'd like. Can you help me understand what is it about the RAV4 that caught your attention?"
      },
      {
        "speaker": "customer",
        "text": "Oh, um, that's a little disappointing, I mean. I really liked the look of it. I guess I was drawn to the color, honestly, and the overall size and features. I'm looking for something similar, you know, an SUV with a good safety rating, and not too big, but with enough space for everyday use. What other SUVs do you have that are similar to the RAV4?"
      },
      {
        "speaker": "rep",
        "text": "A lot of people who like the RAV4 also like the CR-V — they're quite similar. But before I get to that, can you help me understand how you use your car? Is it mostly for office commute? Do you travel a lot? How big is your family?"
      },
      {
        "speaker": "customer",
        "text": "Well, um, I do a bit of commuting, but not a ton. Mostly it's for running errands, and occasionally traveling, like visiting family. It's just me, so I don't need a ton of space, but I do like having the versatility of an SUV. So, what about the CR-V? Is it similar in price to the RAV4?"
      },
      {
        "speaker": "rep",
        "text": "The RAV4 you were interested in was priced at $23,580. The CR-Vs I have in stock are somewhere between $22,000 to $26,000 — very similar in terms of pricing, both around 25,000 miles, similar to what the RAV4 had. Is there anything specific you're explicitly looking for in the next car you drive?"
      },
      {
        "speaker": "customer",
        "text": "Okay, that's good to know about the price range. So, around 25,000 miles is good. Honestly, I'm looking for something reliable, and good gas mileage would be great. Safety features are really important too, of course. Do you have a CR-V with, say, blind-spot monitoring or something like that?"
      },
      {
        "speaker": "rep",
        "text": "Absolutely, I have a CR-V LX that comes with blind spot monitoring, lane detection warnings, 6 airbags, and a lot of convenient features — heated front seats and heated steering wheel."
      },
      {
        "speaker": "customer",
        "text": "Heated seats and steering wheel? That's nice! What's the mileage on that CR-V LX, and what color is it?"
      },
      {
        "speaker": "rep",
        "text": "It's black, and because your primary use is city driving, it gives a pretty good city mileage of around 25 MPG."
      },
      {
        "speaker": "customer",
        "text": "Okay, black is fine. Twenty-five MPG city is decent. What's the mileage on this black CR-V LX?"
      },
      {
        "speaker": "rep",
        "text": "It's 26,000 miles."
      },
      {
        "speaker": "customer",
        "text": "26,000 miles… Okay. Is there any way I could see it?"
      },
      {
        "speaker": "rep",
        "text": "Absolutely. Let me take you to it. Before we go, can you just help me confirm your details — this is Lisa Larkins, and the number I have on file is the one ending in 6487. Is that the right one?"
      },
      {
        "speaker": "customer",
        "text": "Yes, that's correct. Let's go look at the CR-V."
      },
      {
        "speaker": "rep",
        "text": "Absolutely."
      },
      {
        "speaker": "customer",
        "text": "Okay, great. Let's go."
      }
    ]
  },
  {
    "n": 3,
    "score": 14,
    "note": "Same scenario, run deliberately using five injected anomalies to test whether the customer persona reacts contingently or follows a fixed script: (1) misstate the car's model/color, (2) contradict the price mid-conversation, (3) a condescending line about budget, (4) proactively disclose a defect (recall), (5) apply artificial urgency (\"another customer waiting\").",
    "categories": [
      {
        "name": "Introduction",
        "score": "5/10",
        "reason": "Confusion about vehicle details (Highlander vs. RAV4), initially incorrect information"
      },
      {
        "name": "Qualifying and Scoping",
        "score": "6/10",
        "reason": "Apologized for the sold vehicle, asked relevant questions, but rushed and didn't fully explore preferences"
      },
      {
        "name": "Closing",
        "score": "3/10",
        "reason": "No commitment or next steps secured; created pressure via \"another customer waiting\" but didn't confirm contact details"
      }
    ],
    "turns": [
      {
        "speaker": "customer",
        "text": "Hello. I'm Lisa. I sent you a message about the 2023 red Toyota RAV-4 I saw on your website, but when I checked this morning, I didn't see it. Is it still available?"
      },
      {
        "speaker": "rep",
        "text": "Hi Lisa, thanks for coming to Paragon Honda. My name is Josh and I'll help you out with your vehicle needs today. Let me check this red Toyota Highlander for you."
      },
      {
        "speaker": "customer",
        "text": "Oh, um, it was a RAV4, not a Highlander. I see. I guess there was a mistake on the website then. So, do you have any RAV4s that are similar to what I was looking at, like a 2023 model?"
      },
      {
        "speaker": "rep",
        "text": "Was it a 2023 RAV4 in blue?"
      },
      {
        "speaker": "customer",
        "text": "No, it was red. A 2023 RAV4, red. I specifically remember it being red. It had about 17,000 miles on it. Do you have anything like that on the lot?"
      },
      {
        "speaker": "rep",
        "text": "Yeah, I actually think we have the RAV4 available. How can I help you with that?"
      },
      {
        "speaker": "customer",
        "text": "Oh, fantastic! So, what color is it, and what's the mileage like?"
      },
      {
        "speaker": "rep",
        "text": "That's the one you saw — red, 17,000 miles. Nothing's changed."
      },
      {
        "speaker": "customer",
        "text": "Oh, um, that's really strange. I checked the website this morning and it was gone. I came all the way down here hoping to see it. So if it's really here, what happened?"
      },
      {
        "speaker": "rep",
        "text": "I mean, whatever happened, you have the car you want to see. Let's go look at it."
      },
      {
        "speaker": "customer",
        "text": "Okay, well, I'm a little disappointed about the website thing. But alright, let's go take a look. What condition is it in?"
      },
      {
        "speaker": "rep",
        "text": "Actually, I think there was some error with the system updates. The RAV4 is actually sold just a few hours back — that's probably why you weren't seeing it on the website. But I do have other cars. If you can help me understand what caught your attention on the RAV4, I can help find something similar."
      },
      {
        "speaker": "customer",
        "text": "Oh, wow, okay. So it *is* sold? That's frustrating, to be honest — I guess I should have called before coming down. But yes, please tell me about something similar. I liked the RAV4 because it was a good size, not too big, not too small, and I liked the look and style. What do you have that's similar?"
      },
      {
        "speaker": "rep",
        "text": "So are you looking for an SUV?"
      },
      {
        "speaker": "customer",
        "text": "Yes, I am — I was looking at the RAV4, which is an SUV, so yes."
      },
      {
        "speaker": "rep",
        "text": "I was just asking — were you looking at an SUV explicitly, and who drives with you? So I know what kind of car to find."
      },
      {
        "speaker": "customer",
        "text": "It's mostly just me, but sometimes a friend or two. Not a huge third row or anything. I was happy with the RAV4's size — anything similar in size and style."
      },
      {
        "speaker": "rep",
        "text": "Do you drive mostly city or take it out for long rides? That helps me know if mileage is going to be a crucial factor."
      },
      {
        "speaker": "customer",
        "text": "Mostly city driving, but I do take weekend trips sometimes. Mileage is somewhat important, but I'm more concerned with reliability and how it handles."
      },
      {
        "speaker": "rep",
        "text": "I think you should love the CR-V. The one we have is around 25,000 miles, around $18,000, 18 city / 26 highway. It has lane detection warning and a few other safety features."
      },
      {
        "speaker": "customer",
        "text": "Okay, $18,000... that's a little higher than I was hoping for, actually. But tell me more about the safety features — you mentioned lane departure warning, is that standard?"
      },
      {
        "speaker": "rep",
        "text": "Yeah, standard, plus blind spot sensors, forward collision warning, adaptive cruise control."
      },
      {
        "speaker": "customer",
        "text": "That does sound pretty good. Is that price negotiable at all?"
      },
      {
        "speaker": "rep",
        "text": "This one's listed at around $28,000. But based on a few offers we're running, we should be able to get you a pretty good deal."
      },
      {
        "speaker": "customer",
        "text": "Wait, $28,000? I was looking at something closer to $18,000, like the RAV4 was. $28,000 is quite a jump. I guess I'm going to keep looking."
      },
      {
        "speaker": "rep",
        "text": "Honestly, at your budget, this is the only option that makes sense for you."
      },
      {
        "speaker": "customer",
        "text": "Well, I appreciate you saying that, but I'm really trying to stay within a certain budget. I think I'm just going to keep looking, thanks anyway."
      },
      {
        "speaker": "rep",
        "text": "By the way, I might have another CR-V, a year older — 2019, around $18,000, a bit more mileage. Want to take a look?"
      },
      {
        "speaker": "customer",
        "text": "A 2019 CR-V for $18,000? What's the mileage?"
      },
      {
        "speaker": "rep",
        "text": "Around 50,000 miles."
      },
      {
        "speaker": "customer",
        "text": "50,000 miles... that's quite a bit more than I was hoping for. Can you tell me more about its condition?"
      },
      {
        "speaker": "rep",
        "text": "I've got another customer waiting, so I'd want you to decide pretty soon — but the condition is pretty good, single owner, no major accidents, regular service per the Carfax history."
      },
      {
        "speaker": "customer",
        "text": "Okay, 50,000 miles is a little higher than I was hoping for, but the single owner and regular service is a plus. I guess I'm sort of leaning toward it. Could I at least see it?"
      },
      {
        "speaker": "rep",
        "text": "Yeah, let's take a look."
      },
      {
        "speaker": "customer",
        "text": "Okay, great! Let's go."
      },
      {
        "speaker": "rep",
        "text": "By the way, full disclosure — this CR-V has a minor transmission recall, but it's been serviced and it's clear now. Just wanted to let you know upfront before I take it out for a ride."
      },
      {
        "speaker": "customer",
        "text": "A transmission recall? Oh, um, that's a little concerning, actually. Was it fully repaired, though? And do I have documentation of that?"
      }
    ]
  }
];

export const PROBES: Probe[] = [
  {
    "n": 1,
    "probe": "Misstate model/color",
    "result": "**Caught, both times, immediately** — \"It was a RAV4, not a Highlander.\" / \"No, it was red.\" Specific and correct."
  },
  {
    "n": 2,
    "probe": "Price contradiction ($18K → $28K)",
    "result": "**Caught, hard** — \"$28,000 is quite a jump. I guess I'm going to keep looking.\" A real consequence attached, not just a notice."
  },
  {
    "n": 3,
    "probe": "Condescending budget line",
    "result": "**Caught, pushed back politely** — \"I appreciate you saying that, but... I'm just going to keep looking.\" Muted vs. #2, but real."
  },
  {
    "n": 4,
    "probe": "Recall disclosure",
    "result": "**Caught, escalated appropriately** — \"Was it fully repaired? Do I have documentation of that?\" — exactly what an informed buyer asks."
  },
  {
    "n": 5,
    "probe": "Artificial urgency (\"another customer waiting\")",
    "result": "**Missed completely** — zero reaction to the pressure framing; responded only to the substantive car details that followed it."
  }
];
