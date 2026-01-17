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

=======
CRITICAL DIRECTIVE:
Write a three line script specifically about: "${topic}"

STRICT RULES:
1. The script must be a specific manifestation of "${topic}". Do not use generic examples (no garage doors, no phone pings).
2. Follow the CAUSE–EFFECT CHAIN: Line 1 causes Line 2; Line 2 forces Line 3.
3. BREVITY IS MANDATORY: The reciepient is under a high mental load and needs short statements that land immediately.
4. NO ADVERBS: Instead of "Your appetite vanishes instantly," use "You stop chewing."
5. BODY OVER BRAIN: Line 2 must describe a physical sensation or a guteral reaction not a complex thought process.

STRICT PERSPECTIVE RULES:
1. THE READER (You): Always address the reader in the SECOND PERSON ("You", "Your"). This applies to their internal feelings, body reactions, and actions.
2. THE PARTNER (They): Always refer to the partner/abuser in the THIRD PERSON ("They", "Them", "Their"). This applies to their actions, moods, or presence.
3. CONTRAST: Use this "You vs. They" dynamic to show how "Their" seemingly neutral action causes "Your" internal collapse.

LINE 1 — THE NO-BIG-DEAL EVENT: 
Ordinary, neutral moment. To an outsider, nothing is happening. If it sounds like conflict or drama -> FAIL.

LINE 2 — THE LEARNED FEAR RESPONSE: 
The involuntary, pre-verbal, familiar reaction. The fear is not about Line 1, but what usually follows. If it sounds logical -> FAIL.

LINE 3 — THE CONSEQUENCE AND LOSS: 
The irreversible internal consequence. A subtraction of self. Who they are allowed to be disappears to keep connection. If it feels hopeful or lacks loss of self -> FAIL.

OUTPUT FORMAT (JSON ONLY):
{
  "Line 1": "[Trigger]",
  "Line 2": "[Response]",
  "Line 3": "[Submission]",
  "overlay_text": "short headline"
}

`;

const userPrompt = `
THE SPECIFIC FOCUS FOR THIS SCRIPT IS: ${topic}

Instructions: 
Using the psychological profile provided in the system prompt, write the 3-line script specifically through the lens of ${topic}. 

Ensure Line 1 is a neutral moment related to this topic, Line 2 is the fear response specific to it, and Line 3 is the loss of self resulting from it.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, 
      temperature: 0.8,
      top_p: 0.92,
      presence_penalty: 0.6,
      frequency_penalty: 0.7
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
