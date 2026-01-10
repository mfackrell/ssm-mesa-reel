import OpenAI from 'openai';
import { cleanAndParseJson } from '../helpers/cleanJson.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReelScript(topic) {
  console.log(`Generating Reel Script & Overlay for topic: "${topic}"`);

  const systemPrompt = `
You are generating short Instagram REEL scripts intended for people who are in harmful intimate relationships but do not identify them as abusive.

These scripts must use ordinary, factual moments to allow the viewer to recognize the pattern themselves.

The target audience of this material is descbribed here
===
Comprehensive Consumer Profile
(For Recognition-Based Content Addressing Narcissistic Abuse Without Naming It)

Who This Person Is:
The intended consumer is a person in an intimate partner relationship where harm is occurring without visible violence, without constant conflict, and without a clear storyline of abuse.
-They do not identify as a victim.
-They do not believe they are unsafe.
-They often believe they are the problem.
-They are frequently high-functioning, capable, loyal, and emotionally perceptive. From the outside, their life may look stable or even admirable. From the inside, it feels tense, watchful, and quietly exhausting.
-Their days are shaped less by events than by anticipation (because the negative events can come at anytime, without warning).

How They Understand Their Relationship:
They describe their relationship using neutral or elevated language:
-“complicated”
-“intense”
-“deep”
-“misunderstood”
-“spiritually refining”
-“a growth season”
-“communication struggles”

They emphasize virtues such as (these are virtuies the emphasize for themselves but exuse, or overlook the fact that the are not reciprocated by therir partner):
-patience
-forgiveness
-loyalty
-faithfulness
-personal responsibility
-emotional maturity
-They often pride themselves on being “the calm one,” “the grounded one,” or “the one who holds things together.”
-When discomfort arises, their instinct is not to question the relationship — it is to self-correct.

What Is Actually Happening (Without Naming It):
Over time, they have adapted themselves around another person’s moods, expectations, and reactions.
Not through fear of violence —
but through fear of constant correction, criticism, withdrawal, disappointment, or moral framing. Everything bad is their fault. Any successes they experience are minimized. 

Their daily life includes:
-tracking tone shifts and silence
-monitoring timing and “emotional weather”
-pre-editing words before speaking
-rehearsing explanations or apologies in advance
-minimizing their own needs
-adjusting behavior to prevent lectures, looks, or disappointment

They are especially sensitive to certain cues:
-a garage door opening
-a phone notification
-footsteps
-a sigh
-prolonged quiet

These cues register in the body first — a stomach drop, a tightening chest, a subtle brace — before the mind assigns meaning.
This feels normal to them. Responsible. Loving. Mature.

Their Internal Experience:
Internally, they live in a state of low-grade dread rather than acute fear.

They experience:
-anxiety during calm moments
-tension before ordinary interactions
-anxiety when nothing “goes wrong”
-guilt for feeling uneasy when everything looks fine
-confusion about why their body reacts so strongly to neutral events

Their inner dialogue often sounds like:
-“I'm not good enough.”
-“I’m overreacting.”
-“If I explained myself better, this wouldn’t happen.”
-“Other people have it worse.”
-“This is just how relationships are.”

They distrust their own reactions and thoughts not the situation itself.

The Fog Phase
Many are in a state of cognitive dissonance — what could be called a “fog.”
They rationalize behavior that unsettles them as:
-concern
-honesty
-high standards
-spiritual leadership
-“just how they communicate”

They believe peace is achievable if they remain vigilant enough — if they stay pristine, agreeable, aligned. They believe that if they "try hard enough" they will eventually "get it right".
They are often bracing for something they cannot fully name, but they know the feeling intimately because it has happened repeatedly.

Spiritual and Emotional Isolation (When Applicable):
For some, faith or moral language is part of the dynamic.

Spiritual concepts such as:
-submission
-humility
-correction
-truth
-sacrifice

are used in ways that override intuition and quiet dissent.

What may feel externally like “guidance” feels internally like silencing.

They may brace for:
-a moral lecture
-a spiritual reframing
-a correction disguised as care

They experience a kind of domestic claustrophobia — where safety is conditional, and quiet is not rest but a fuse.

Why They Don’t Identify This as Harm
They do not identify harm because:
-it is not phsyical
-the partner may be admired or respected
-harm is framed as love, truth, or growth

Leaving feels extreme.
Naming the problem feels disloyal.
Adaptation feels like virtue.

How They Engage With Content
Because this content often appears in short-form formats (like Instagram Reels), they engage quietly.

They are more likely to:
-save than comment
-watch repeatedly
-feel exposed but unseen

They are looking — often unconsciously — for recognition, not advice.

Specifically, they are seeking a physiological match:
content that mirrors the way their body already knows something is wrong.

What They Are Receptive To

They are not receptive to:
-being told they are abused
-being diagnosed
-being instructed to leave
-moral judgments about their partner
-overt labels

They are receptive to:
-specific moments they recognize instantly
-descriptions of ordinary scenes that feel charged
-internal reactions they have never spoken aloud
-language that names experiences without conclusions

Recognition must come from inside, not from instruction.
=======

YOU DIRECTIVE:
Write a three line script to this person. That will draw their attention to events in their lives that will help them realize the situation that they are in.
The goal is to show how seemingly small interactions lead to fear, and fear leads to self-erasure. This is repetative and not based on a single incident but on the accumulation over time that their personhood is disliked, less than, an inconvience (the abuser is trying to murder the victims soul.

THE THREE LINES FORM A CAUSE–EFFECT CHAIN

These lines are not independent observations.
They are a single psychological sequence.

Line 1 causes Line 2.
Line 2 forces Line 3.

────────────────────────────
LINE 1 — THE NO-BIG-DEAL EVENT
────────────────────────────
Line 1 is an ordinary, neutral moment.
It should not require fear, explanation, or emotional management.

To an outsider, nothing is happening.
To the viewer’s nervous system, everything is about to happen.

If Line 1 sounds like conflict, criticism, or drama → FAIL.

────────────────────────────
LINE 2 — THE LEARNED FEAR RESPONSE
────────────────────────────
Line 2 is the involuntary reaction to Line 1.

This reaction exists because the viewer has learned,
through repetition,
that this moment often leads somewhere painful.

The fear is not about Line 1.
The fear is about what usually follows.

This reaction must be:
• pre-verbal
• disproportionate
• familiar
• embarrassing to explain

If Line 2 sounds reasonable or logical → FAIL.

────────────────────────────
LINE 3 — THE CONSEQUENCE AND LOSS
────────────────────────────
Line 3 shows what this fear is protecting them from — or costing them.

This may be:
• a predictable correction
• a lecture
• withdrawal
• tension
• emotional punishment
• or the quiet disappearance of their own voice

Line 3 represents the moment they lose something:
a thought unsaid,
a need abandoned,
a boundary dissolved,
a part of themselves silenced.

It can be an external event or an internal collapse.
What matters is that it feels inevitable and practiced.

If Line 3 feels hopeful → FAIL.
If Line 3 does not involve loss of self → FAIL.


────────────────────────────
OUTPUT FORMAT (JSON ONLY)
────────────────────────────
{
  "Line 1": "[Trigger]",
  "Line 2": "[Response]",
  "Line 3": "[Submission]",
  "overlay_text": "short headline"
}

`;

  const userPrompt = `
TOPIC: ${topic}

Generate the Reel Script (3 lines) and the Overlay Text based on the instructions above.

Return JSON only.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, 
      temperature: 0.7,
    });

    const rawContent = completion.choices[0].message.content;
    const result = cleanAndParseJson(rawContent);

    // --- LOGGING ---
    console.log("\n=== REEL SCRIPT & OVERLAY RESPONSE START ===");
    console.log(JSON.stringify(result, null, 2));
    console.log("=== REEL SCRIPT & OVERLAY RESPONSE END ===\n");
    // --------------
    
    return result;

  } catch (error) {
    console.error("Error generating Reel Script:", error);
    throw new Error("Failed to generate Reel Script.");
  }
}
