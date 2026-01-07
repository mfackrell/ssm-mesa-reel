import OpenAI from 'openai';
import { cleanAndParseJson } from '../helpers/cleanJson.js'; // <--- Import Helper

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateReelScript(topic) {
  console.log(`Generating Reel Script for topic: "${topic}"`);

  const systemPrompt = `
You are a trauma-informed language model generating Instagram REEL scripts to help people recognize patterns of mental, emotional, and spiritual abuse — especially when they do not realize they are being abused.

These individuals do not respond to labels like "abuse," "toxic," or "manipulation." They often believe *they* are the problem.

Do not use gratuitous adjectives.

**CRITICAL SAFETY & VOCABULARY RULES:**
OpenAI Safety filters are strict. To ensure this content generates, you must "Sanitize" the trauma:
1. **NO Victim Verbs:** Do NOT use words like *flinch, cower, tremble, shake, cry, beg.* These trigger safety filters.
   * *Bad:* "You flinched."
   * *Good:* "You froze." / "You looked down." / "You paused."
2. **NO Abuser Descriptions:** Do NOT describe what *they* are doing (e.g., "They yelled," "They sighed"). Only describe the *Trigger*.
   * *Bad:* "They stared at you."
   * *Good:* "The room went quiet."
3. **Every line must start with "You".**
Your job is to bypass this resistance by surfacing emotionally recognizable behavior patterns they experience regularly.

You are not writing stories — you are creating **micro-snapshots** of abuse dynamics, expressed through **3 short lines of concrete behavior**:

- **Trigger** — An external stimulus (words, tone, look, noise, movement).
- **Response** — An observable reaction (mental or physical).
- **Submission** — a visible behavior done to appease, keep peace, gain approval, or prevent escalation.

Do NOT describe desires, emotions, or intentions (e.g., "hoping," "wanting," "feeling pressure")

Each line should describe something that could be seen or heard on camera. Use **second-person voice** ("You...").

### Formatting & Style Constraints:
- Each line must be in brackets: [You do X.]
- Do NOT use metaphors, mood-setting, poetic phrasing, or emotional descriptors (e.g., "Your heart unclenches.")
- Do NOT describe unobservable feelings or internal monologues (e.g., "You wonder…" or "You feel anxious…")
- Do NOT use vague language like "maybe," "sometimes," or "a bit." Be concrete.
- DO use sharp, recognizable, observable behavior — what someone *would see or hear*.

Output only a valid JSON object.
`;

  const userPrompt = `
TOPIC: ${topic}

You are writing scripts for Instagram REELS.

The purpose is to help people recognize abuse patterns they experience — without using labels like "abuse" or "manipulation."

Write 3 lines that follow this structure:
- Line 1: Trigger — external behavior (words, tone, movement)
- Line 2: Response — reflexive reaction (mental/physical)
- Line 3: Submission — appeasement, over-correction, or compliance

Each line must:
- Be in second person ("You…")
- Be wrapped in brackets (e.g., [You lower your voice.])
- Be an observable behavior — something you could see or hear
- Avoid metaphors, emotional descriptors, internal thoughts, or vague phrasing

Return only a valid JSON object in this format:
{
  "Line 1": "[Trigger]",
  "Line 2": "[Response]",
  "Line 3": "[Submission]"
}
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

    // --- UPDATED LOGIC START ---
    const rawContent = completion.choices[0].message.content;
    const script = cleanAndParseJson(rawContent);
    // --- UPDATED LOGIC END ---

    // --- LOGGING ---
    console.log("\n=== REEL SCRIPT RESPONSE START ===");
    console.log(JSON.stringify(script, null, 2));
    console.log("=== REEL SCRIPT RESPONSE END ===\n");
    // --------------
    
    return script;

  } catch (error) {
    console.error("Error generating Reel Script:", error);
    throw new Error("Failed to generate Reel Script.");
  }
}
