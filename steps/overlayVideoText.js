export async function overlayVideoText(videoUrl, scriptLines) {
  console.log("Preparing Text Overlay Payload...");

  // Define timing for 3 lines (2.5s each)
  const overlays = [
    { text: scriptLines.line1, start: 0, end: 3. },
    { text: scriptLines.line2, start: 3.0, end: 7.0 },
    { text: scriptLines.line3, start: 7.0, end: 11.5 }
  ];

  const payload = {
    videoUrl: videoUrl,
    overlays: overlays
  };

  console.log("[Overlay] Sending Payload:", JSON.stringify(payload, null, 2));

  // The URL of your NEW service
  const serviceUrl = "https://ffmpeg-textoverlay-710616455963.us-central1.run.app";

  const response = await fetch(serviceUrl, { 
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

  return json.url; 
}
