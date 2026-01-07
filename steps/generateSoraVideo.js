import OpenAI from 'openai';

// We use direct fetch here because sora-2 model support might not be 
// fully typed in the current SDK version you are using.
export async function generateSoraVideo(mood, textBehavior, scriptLines) {
  console.log("Starting Sora Video Generation...");

  // 1. Construct the dynamic prompt
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
Line 1 Text should appear on the opening image, each text line should last for 2.5 seconds. the text should fill the time frame an not loop
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

  // 2. Construct the Payload
  const payload = {
    model: "sora-2",
    prompt: prompt,
    size: "720x1280",
    seconds: 8
  };

  try {
    // Note: Verify the endpoint URL for sora-2 access. 
    // Using standard OpenAI video endpoint structure.
    const response = await fetch("https://api.openai.com/v1/videos/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sora API Request Failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Sora Video request successful.");
    
    // Log the result for debugging
    console.log(JSON.stringify(data, null, 2));

    return data; 

  } catch (error) {
    console.error("Error generating Sora video:", error);
    throw error;
  }
}
