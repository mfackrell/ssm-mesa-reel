import { uploadToGCS } from "../helpers/uploadToGCS.js";

export async function generateSoraVideo(mood, textBehavior, scriptLines) {
  console.log("Starting Sora Video Generation...");

  // 1. Construct the Prompt
  const prompt = `Create a short, minimalist vertical video suitable for Instagram Reels.

${mood}

No identifiable faces or characters.
The background must support the text and never compete with it.

Text behavior:
${textBehavior}
Display the text as part of the video itself.
Reveal the text line by line.
Only one line should be visible at a time.
Each new line replaces the previous line completely.
Do not rewrite, summarize, soften, embellish, or interpret the text.
Line 1 Text should appear on the opening image, each text line should last for 2.5 seconds. the text should fill the time frame an not loop.

Text content:
 line 1:${scriptLines.line1}, line 2:${scriptLines.line2}, line 3:${scriptLines.line3}

Text styling:
Text must be large, centered, and highly legible for mobile viewing.
High contrast against the background.

Audio:
No voiceover.
No lyrics.
No sound effects.
subtle neutral ambient tone only.`;

  const apiKey = process.env.OPENAI_API_KEY;

  try {
    // --- STEP A: START GENERATION ---
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
        seconds: "8"
      })
    });

    if (!createResponse.ok) {
      const err = await createResponse.text();
      throw new Error(`Sora Request Failed: ${createResponse.status} - ${err}`);
    }

    const jobData = await createResponse.json();
    const videoId = jobData.id;
    console.log(`Video Job Started. ID: ${videoId}`);

    // --- STEP B: POLL FOR COMPLETION ---
    let status = "queued";
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes (assuming 10s intervals)

    while (["queued", "in_progress", "processing"].includes(status)) {
      if (attempts >= maxAttempts) throw new Error("Video generation timed out.");
      
      await new Promise(r => setTimeout(r, 10000)); // Sleep 10 seconds
      attempts++;

      const checkResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });

      if (!checkResponse.ok) throw new Error("Failed to check video status");
      
      const checkData = await checkResponse.json();
      status = checkData.status;
      console.log(`...Video Status: ${status} (Attempt ${attempts})`);

      if (status === "failed") {
        throw new Error(`Video Generation Failed: ${checkData.error?.message || "Unknown error"}`);
      }
    }

    // --- STEP C: DOWNLOAD VIDEO ---
    // The MP4 content is available at /content endpoint
    console.log("Video complete. Downloading content...");
    const contentResponse = await fetch(`https://api.openai.com/v1/videos/${videoId}/content`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });

    if (!contentResponse.ok) throw new Error("Failed to download video content");

    const arrayBuffer = await contentResponse.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    // --- STEP D: UPLOAD TO YOUR BUCKET ---
    const filename = `reel_video_${Date.now()}.mp4`;
    const publicUrl = await uploadToGCS(videoBuffer, filename, 'video/mp4');

    return publicUrl;

  } catch (error) {
    console.error("Error generating Sora video:", error);
    throw error;
  }
}
