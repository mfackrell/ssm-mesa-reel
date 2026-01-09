export async function overlayVideoText(videoUrl, scriptLines) {
  console.log("Preparing Text Overlay Payload...");

  // Define standard timing for 3 lines (2.5s each, matching your logic)
  const overlays = [
    { text: scriptLines.line1, start: 0, end: 2.5 },
    { text: scriptLines.line2, start: 2.5, end: 5.0 },
    { text: scriptLines.line3, start: 5.0, end: 7.5 }
  ];

  const payload = {
    type: "video_text_overlay", // Differentiates this from the slideshow render
    videoUrl: videoUrl,
    overlays: overlays
  };

  console.log("[Overlay] Sending Payload:", JSON.stringify(payload, null, 2));

  // NOTE: You must update your FFmpeg service URL if it's different
  const response = await fetch("https://ffmpeg-test-710616455963.us-central1.run.app/overlay", { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Overlay Failed: ${response.status} - ${errorText}`);
  }

  const json = await response.json();
  console.log("[Overlay] Success:", json);

  return json.url; // Expecting { url: "https://storage.googleapis.com/..." }
}
