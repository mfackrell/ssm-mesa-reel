// orchestrator.js

import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js";
import { generateFacebookCaption } from "./steps/generateFacebookCaption.js";
import { selectBackgroundMood } from "./steps/selectBackgroundMood.js";
import { selectTextBehavior } from "./steps/selectTextBehavior.js";
import { generateReelScript } from "./steps/generateReelScript.js";
import { generateBackgroundVideo } from "./steps/generateBackgroundVideo.js";
import { overlayVideoText } from "./steps/overlayVideoText.js";
import { cleanCaption } from "./steps/cleanCaption.js";
import { triggerZapier } from "./steps/triggerZapier.js";

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  try {
    const topic = await selectTopic();
    console.log(`Topic Selected: "${topic}"`);

    const [fbText, igText, mood, textBehavior, reelData] = await Promise.all([
      generateFacebookCaption(topic),
      generateInstagramCaption(topic),
      selectBackgroundMood(),
      selectTextBehavior(),
      generateReelScript(topic),
    ]);

    const scriptLines = {
      line1: reelData["Line 1"],
      line2: reelData["Line 2"],
      line3: reelData["Line 3"],
    };

    console.log("Text/Script content generated.");

    console.log("Generating clean background video (SDXL -> FFmpeg)...");

    const backgroundResult = await generateBackgroundVideo(mood);
    console.log("Clean Video Result:", backgroundResult);
           
    const backgroundResult = await generateBackgroundVideo(mood);
    
    return {
      status: "background_video_submitted",
      jobId: backgroundResult.jobId,
      topic,
      mood,
      textBehavior,
      reelScript: scriptLines,
      facebook: { text: fbText },
      instagram: { text: igText },
    };



    const [finalVideoUrl, safeCaption] = await Promise.all([
      overlayVideoText(backgroundResult.videoUrl, scriptLines),
      cleanCaption(igText),
    ]);
    
    await triggerZapier({
      "Safe IG Caption": safeCaption,
      "Video URL": finalVideoUrl,
      "Facebook Title": reelData.overlay_text,
      "Facebook Caption": fbText,
    });
    
    return {
      status: "completed",
      topic: topic,
      mood: mood,
      textBehavior: textBehavior,
      reelScript: scriptLines,
      videoUrl: finalVideoUrl,
      safeCaption: safeCaption,
      facebook: { text: fbText },
      instagram: { text: igText },
    };
  } catch (error) {
    console.error("Orchestrator failed:", error);
    throw error;
  }
}
