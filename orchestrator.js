import { selectTopic } from "./steps/selectTopic.js";
import { generateInstagramCaption } from "./steps/generateInstagramCaption.js";
import { generateFacebookCaption } from "./steps/generateFacebookCaption.js"; // Fixed import style



export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started", { timestamp: new Date().toISOString() });

  try {
    // --- STEP 1: Topic Selection ---
    const topic = await selectTopic();
    console.log(`Topic Selected: "${topic}"`);

    // --- STEP 2: Content Generation (Concurrent) ---
    // Note: We pass 'topic' only. The functions handle their own OpenAI instances.
    const [fbText, igText] = await Promise.all([
      generateFacebookCaption(topic),
      generateInstagramCaption(topic)    
    ]);

    console.log("Content generated successfully.");

    return {
      status: "completed",
      topic: topic,
      facebook: {
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
