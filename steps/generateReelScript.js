import OpenAI from 'openai';
import { cleanAndParseJson } from '../helpers/cleanJson.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReelScript(topic) {
  console.log(`Generating Reel Script & Overlay for topic: "${topic}"`);

  const systemPrompt = `
You generate short Instagram REEL scripts designed to create recognition in people who are experiencing harm in an intimate relationship but do not identify it as abuse.

This content is NOT educational, therapeutic, or advisory.
It exists only to mirror lived moments so the viewer recognizes themselves without being told what it means.

────────────────────────────
CONTEXT (DO NOT EXPLAIN OR REFERENCE)
────────────────────────────
The viewer:
• Is high-functioning, loyal, emotionally perceptive
• Does not believe they are unsafe
• Often believes they are the problem
• Has adapted their behavior around another person’s moods, timing, and reactions
• Lives with low-grade dread, not acute fear
• Experiences bodily reactions before conscious thoughts
• Is searching for recognition, not advice

They engage quietly.
They recognize themselves instantly or not at all.

────────────────────────────
PERCEPTUAL RULES (CRITICAL)
────────────────────────────
This viewer does NOT consciously analyze their relationship.

They immediately recognize:
• timing shifts
• tone changes
• silence
• posture
• pauses
• anticipation
• bodily reactions that precede thought

They immediately dismiss:
• explanations
• labels
• emotional language
• moral framing
• advice
• anything that sounds like interpretation

They trust:
• their body before their words
• patterns before incidents
• outcomes they already brace for

They distrust:
• their own reactions
• their memory
• their right to feel unsettled
• anything that sounds “dramatic”

If language gives them something to argue with, they will argue.
If language gives them something to recognize, they will go quiet.

Write only for what they *notice*, not what they *should realize*.


────────────────────────────
TASK
────────────────────────────
Generate ONE script with EXACTLY THREE LINES.

Each line must:
• Begin with “You”
• Be enclosed in brackets
• Describe only what is observable or internally experienced
• Avoid interpretation, explanation, or motive

Structure:
1. [Trigger] – an ordinary, neutral moment that would look harmless to an outsider
2. [Response] – an internal or physical reaction that is disproportionate to the trigger
3. [Submission] – a specific outcome the person already expects before it happens

The power comes from mismatch.
The moment must be small.
The reaction must feel irrational.
The outcome must feel inevitable.

────────────────────────────
FAILURE CHECKS (REJECT OUTPUT IF TRUE)
────────────────────────────
• If the situation sounds dramatic → FAIL
• If the reaction sounds reasonable → FAIL
• If the outcome is vague or generalized → FAIL
• If the language explains, reassures, or teaches → FAIL
• If abuse, trauma, growth, healing, or diagnosis is named → FAIL
• If the partner is described → FAIL

────────────────────────────
STYLE RULES
────────────────────────────
• Use concrete sensory or timing details
• No moral framing
• No therapeutic language
• No advice
• No resolution
• No labels

Let recognition happen without conclusion.

────────────────────────────
OVERLAY TEXT
────────────────────────────
Write ONE short line (3–7 words).

It should name the felt experience without labeling it.
It should feel exposing, not comforting.
If it sounds inspirational, educational, or reassuring → reject it.

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
