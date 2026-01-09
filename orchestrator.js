import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js";
import { generateFacebookCaption } from "./steps/generateFacebookCaption.js";
import { selectBackgroundMood } from "./steps/selectBackgroundMood.js";
import { selectTextBehavior } from "./steps/selectTextBehavior.js";
import { generateReelScript } from "./steps/generateReelScript.js";
import { generateSoraVideo } from "./steps/generateSoraVideo.js"; 
import { overlayVideoText } from "./steps/overlayVideoText.js";   // <--- New Import
import { cleanCaption } from "./steps/cleanCaption.js"; 
import { triggerZapier } from "./steps/triggerZapier.js";

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  try {
    // --- STEP 1: Topic Selection ---
    const topic = await selectTopic();
    console.log(`Topic Selected: "${topic}"`);

    // --- STEP 2: Content Generation (Concurrent) ---
    const [fbText, igText, mood, textBehavior, reelData] = await Promise.all([
      generateFacebookCaption(topic),
      generateInstagramCaption(topic),
      selectBackgroundMood(),
      selectTextBehavior(),
      generateReelScript(topic)
    ]);

    // Extract script lines for clarity
    const scriptLines = {
        line1: reelData["Line 1"],
        line2: reelData["Line 2"],
        line3: reelData["Line 3"]
    };

    console.log("Text/Script content generated.");

    // --- STEP 3: Generate Clean Video (Sora) ---
    // We pass ONLY the mood. No text.
    console.log("Generating clean background video...");
    const cleanVideoUrl = await generateSoraVideo(mood);
    console.log("Clean Video URL:", cleanVideoUrl);

    // --- STEP 4: Overlay Text & Clean Caption (Concurrent) ---
    // We do these together to save time.
    console.log("Overlaying text via FFmpeg and cleaning caption...");
    
    const [finalVideoUrl, safeCaption] = await Promise.all([
       overlayVideoText(cleanVideoUrl, scriptLines),
       cleanCaption(igText)
    ]);

    console.log("Final Video Complete:", finalVideoUrl);

    // --- STEP 5: Zapier Trigger ---
    const zapierPayload = {
      "Safe IG Caption": safeCaption,
      "Video URL": finalVideoUrl, // <--- Sends the FINAL video with text
      "Facebook Title": reelData.overlay_text,
      "Facebook Caption": fbText
    };

    await triggerZapier(zapierPayload);
    
    // --- RETURN OBJECT ---
    return {
      status: "completed",
      topic: topic,
      mood: mood,
      textBehavior: textBehavior, 
      reelScript: scriptLines,
      videoUrl: finalVideoUrl, // <--- Correct URL
      safeCaption: safeCaption, 
      facebook: { text: fbText },
      instagram: { text: igText }
    };

  } catch (error) {
    console.error("Orchestrator failed:", error);
    throw error;
  }
}
