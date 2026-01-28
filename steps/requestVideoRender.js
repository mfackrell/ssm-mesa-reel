export async function requestVideoRender(videoUrl, overlays) {
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

  
  console.log("Preparing Render Payload...");

  if (!videoUrl || typeof videoUrl !== "string") {
    throw new Error("Renderer payload missing required videoUrl");
  }
  
  if (!Array.isArray(overlays) || overlays.length === 0) {
    throw new Error("Renderer payload missing overlays");
  }


  const payload = {
    videoUrl,
    audioUrl,
    overlays
  };

  // Log it so you can verify it matches expected JSON
  console.log("[Render] Sending Payload:", JSON.stringify(payload, null, 2));

  // 4) Send Request
  const response = await fetch("https://ffmpeg-textoverlay-710616455963.us-central1.run.app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Render] Renderer response not OK:", response.status, response.statusText, errorText);
    throw new Error(`Renderer Failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const json = await response.json();
  console.log("[Render] Renderer success response:", json);

  // Return the raw response (e.g. { url: "..." })
  return json;
}
