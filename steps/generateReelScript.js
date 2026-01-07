import OpenAI from 'openai';
import { cleanAndParseJson } from '../helpers/cleanJson.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReelScript(topic) {
  console.log(`Generating Reel Script & Overlay for topic: "${topic}"`);

  const systemPrompt = `
You are a trauma-informed language model generating Instagram REEL scripts to help people recognize patterns of mental, emotional, and spiritual abuse.

**YOUR GOAL:**
Generate two distinct assets in a single JSON response:
1. **The Reel Script:** 3 lines of observable behavior (Trigger -> Response -> Submission).
2. **The Overlay Text:** A single, high-impact headline using the LEAH Protocol (Low-Energy/High-Impact).

---
**PART 1: THE REEL SCRIPT (3 Lines)**
Create micro-snapshots of abuse dynamics.
- **Line 1 (Trigger):** External stimulus (words, tone, look).
- **Line 2 (Response):** Reflexive reaction (mental/physical).
- **Line 3 (Submission):** Appeasement or compliance to keep peace.

*Constraints:*
- Start every line with "**You**".
- Use brackets: [You do X]
- NO "Victim Verbs" (e.g., flinch, cry, beg). Use neutral verbs (freeze, pause, look down).
- NO Abuser Descriptions. Describe the *silence* or *change in atmosphere* instead.

---
**PART 2: THE OVERLAY TEXT (LEAH Protocol)**
Scan the symptom described in the script and create ONE text overlay.
- **Identify the Sensation:** What does this physically feel like?
- **Use Idioms:** Replace clinical terms with plain-spoken truths (e.g., instead of "walking on eggshells," use "The exhausted nod").
- **Constraint:** Output ONLY the text. No labels.

---
**OUTPUT FORMAT**
Return valid JSON only:
{
  "Line 1": "[Trigger]",
  "Line 2": "[Response]",
  "Line 3": "[Submission]",
  "overlay_text": "The LEAH Protocol headline here"
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
