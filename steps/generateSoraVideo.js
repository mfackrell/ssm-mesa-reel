import { uploadToGCS } from "../helpers/uploadToGCS.js";

export async function generateSoraVideo(mood) {
  console.log("Starting Sora Video Generation (Clean Background)...");

  const prompt = `Create a short, vertical video suitable for Instagram Reels.
9:16 Aspect Ratio.
High resolution, cinematic lighting.
No identifiable faces or characters.
No text, no captions, no overlays.
The background must be clean and uncluttered to allow for text overlay later.

Visual Description:
${mood}

Audio:
Subtle neutral ambient tone only.`;

  console.log("GENERATED PROMPT:", prompt);

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const createResponse = await fetch("https://api.openai.com/v1/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "sora-2", 
        prompt: prompt,
        size: "720x1280",
        seconds: "12" 
      })
    });

    if (!createResponse.ok) {
      const err = await createResponse.text();
      throw new Error(`Sora Request Failed: ${createResponse.status} - ${err}`);
    }

    const jobData = await createResponse.json();
    const videoId = jobData.id;
    console.log(`Video Job Started. ID: ${videoId}`);

    // --- Poll for Completion ---
    let status = "queued";
    let attempts = 0;
    while (["queued", "in_progress", "processing"].includes(status)) {
      if (attempts >= 60) throw new Error("Video generation timed out.");
      await new Promise(r => setTimeout(r, 10000));
      attempts++;

      const checkResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      const checkData = await checkResponse.json();
      status = checkData.status;
      console.log(`...Video Status: ${status}`);
      
      if (status === "failed") throw new Error(`Video Failed: ${checkData.error?.message}`);
    }

    // --- Download & Upload ---
    console.log("Video complete. Downloading...");
    const contentResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const buffer = Buffer.from(await contentResponse.arrayBuffer());
    
    // Save raw clean video
    const filename = `raw_sora_background_${Date.now()}.mp4`;
    return await uploadToGCS(buffer, filename, 'video/mp4');

  } catch (error) {
    console.error("Error generating Sora video:", error);
    throw error;
  }
}
