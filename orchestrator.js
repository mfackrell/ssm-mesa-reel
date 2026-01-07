import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js";
import { generateFacebookCaption } from "./steps/generateFacebookCaption.js"; // Fixed import style
import { selectBackgroundMood } from "./steps/selectBackgroundMood.js"; // <--- New Import
import { selectTextBehavior } from "./steps/selectTextBehavior.js"; // <--- New Import
import { generateReelScript } from "./steps/generateReelScript.js";
import { generateSoraVideo } from "./steps/generateSoraVideo.js"; // <--- New Import

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  try {
    // --- STEP 1: Topic Selection ---
    const topic = await selectTopic();
    console.log(`Topic Selected: "${topic}"`);

    // --- STEP 2: Content Generation (Concurrent) ---
    // Note: We pass 'topic' only. The functions handle their own OpenAI instances.
    const [fbText, igText, mood, textBehavior, reelData] = await Promise.all([
      generateFacebookCaption(topic),
      generateInstagramCaption(topic),
      selectBackgroundMood(),
      selectTextBehavior(),
      generateReelScript(topic)
    ]);

    console.log("Content generated successfully.");

    // Extract script lines for clarity
    const scriptLines = {
        line1: reelData["Line 1"],
        line2: reelData["Line 2"],
        line3: reelData["Line 3"]
    };

    console.log("Text/Script content generated. Starting Video Generation...");

    // --- STEP 3: Video Generation (Sequential) ---
    // Must run here because it relies on mood, behavior, and scriptLines
    const publicVideoUrl = await generateSoraVideo(mood, textBehavior, scriptLines);

    console.log("Video Generation Complete: ", publicVideoUrl);
    
    return {
      status: "completed",
      topic: topic,
      mood: mood,
      textBehavior: textBehavior, 
      reelScript: {
              line1: reelData["Line 1"],
              line2: reelData["Line 2"],
              line3: reelData["Line 3"]
            },
      videoUrl: publicVideoUrl,      facebook: {
        text: fbText
      },
      instagram: {
        text: igText
      }
    };

  } catch (error) {
    console.error("Orchestrator failed:", error);
    throw error;
  }
}
