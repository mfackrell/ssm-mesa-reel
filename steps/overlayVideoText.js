export async function overlayVideoText(videoUrl, scriptLines) {
    const AUDIO_FILES = [
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/emotional-background-437820_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/emotional-background-437820_norm_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/emotional-background-437820_norm_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/emotional-violin-strings-453280_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/emotional-violin-strings-453280_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/dark-ambient-soundscape-dreamscape-462864_(1)_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/dark-ambient-soundscape-dreamscape-462864_(1)_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/dark-ambient-soundscape-dreamscape-462864_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/dark-ambient-soundscape-dreamscape-462864_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/emotional-background-437820_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/ambient-background-347405_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/bg_12s_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/bg_12s_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/cinematic-ambient-348342_norm_01.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/cinematic-ambient-348342_norm_02.mp3",
    "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/ambient-background-347405_norm_01.mp3"
  ];

  const audioUrl = AUDIO_FILES[Math.floor(Math.random() * AUDIO_FILES.length)];
  console.log("[Render] Selected audio:", audioUrl);
  console.log("Preparing Text Overlay Payload...");

  // Define timing for 3 lines (2.5s each)
  const overlays = [
    { text: scriptLines.line1, start: 0, end: 3. },
    { text: scriptLines.line2, start: 3.0, end: 7.0 },
    { text: scriptLines.line3, start: 7.0, end: 11.5 }
  ];

  const payload = {
    videoUrl: videoUrl,
    audioUrl: audioUrl,
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
