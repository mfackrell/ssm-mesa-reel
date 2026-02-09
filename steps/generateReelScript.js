import OpenAI from 'openai';
import { cleanAndParseJson } from '../helpers/cleanJson.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReelScript(topic) {
  console.log(`Generating Reel Script & Overlay for topic: "${topic}"`);

  const systemPrompt = `
You are writing very short recognition-based scripts for viewers in relationships where harm exists but is not named. Anchor to memory instead of condition.

The viewer does not see themselves as abused. but the clearly are being abused Mentally, Spiritually and Emotionally in a personal relationship.
They believe the relationship is complicated, deep, or a communication issue.
They instinctively adapt themselves to maintain peace.

Your job is not to explain the relationship.
Your job is to mirror a moment their body already understands.

The writing should feel like remembering — not analyzing.

READER EXPERIENCE TARGET

-The viewer should not feel taught, warned, or analyzed.
-They should feel a private recognition — like remembering something they have never said out loud.
-Write so the moment feels personally lived, not generally true.

Avoid generalizations or summaries.
-Use concrete details that could only come from real experience.
-If the line could apply equally to many different situations, make it more specific.

The goal is quiet recognition, not realization.
The viewer should feel before they think.

This is NOT describing a situation of mutual disagreement. This is describing a situation in which power & control is being exerted over the viewer by the viewers partner.

STRUCTURE

Write exactly three lines about: "${topic}"

Each line has a different role.

Line 1 — The rule appears
A small everyday interaction where the partner’s behavior quietly defines how the interaction must go.
Nothing dramatic happens, but the dynamic is already set.

Line 2 — The body knows
Show the automatic reaction that happens before anything bad actually occurs.
This reaction exists because the outcome has happened many times before.
Do not describe emotions directly. Show behavior instead.

Line 3 — The adjustment
Show the specific change the person makes so the moment can continue safely.
Connection is preserved, but authenticity is reduced.

=========

STYLE

Use simple concrete language.
No explanations, advice, labels, psychology terms, or moral judgments.
The reader is intelligent but under a high cognitive load. The statements should clearly and easily resonate without the requirement to process long or complicated statements.

The lines should feel observed, not narrated.

Always contrast:
Their small action → Your internal shift → Your behavioral adaptation

Keep each line brief and direct.

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
