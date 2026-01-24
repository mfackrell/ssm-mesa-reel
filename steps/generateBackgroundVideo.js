// steps/generateBackgroundVideo.js

const SDXL_URL = "https://sdxl-manager-710616455963.us-central1.run.app";
const RUNPOD_ENDPOINT_ID_FFMPEG = "ujp39pddbnrfeg";

const AUDIO_BUCKET_BASE =
  "https://storage.googleapis.com/ssm-renders-8822/ssm-mesa-audio/";

const AUDIO_FILES = [
  "emotional-background-437820_norm_01.mp3",
  "emotional-background-437820_norm_02.mp3",
  "emotional-background-437820_norm_norm_01.mp3",
  "emotional-background-437820_norm_norm_02.mp3",
  "emotional-violin-strings-453280_norm_01.mp3",
  "emotional-violin-strings-453280_norm_02.mp3",
  "dark-ambient-soundscape-dreamscape-462864 (1)_norm_01.mp3",
  "dark-ambient-soundscape-dreamscape-462864 (1)_norm_02.mp3",
  "dark-ambient-soundscape-dreamscape-462864_norm_01.mp3",
  "dark-ambient-soundscape-dreamscape-462864_norm_02.mp3",
  "emotional-background-437820_norm_01.mp3",
  "ambient-background-347405_norm_02.mp3",
  "bg_12s_norm_01.mp3",
  "bg_12s_norm_02.mp3",
  "cinematic-ambient-348342_norm_01.mp3",
  "cinematic-ambient-348342_norm_02.mp3",
  "ambient-background-347405_norm_01.mp3",
];

function pickRandomAudioUrl() {
  const idx = Math.floor(Math.random() * AUDIO_FILES.length);
  const filename = AUDIO_FILES[idx];
  return AUDIO_BUCKET_BASE + encodeURIComponent(filename);
}

async function generateSDXLImage(mood) {
  const prompt = `Create a high-quality vertical 9:16 cinematic background image suitable for Instagram Reels.
No identifiable faces or characters.
No text, no captions, no overlays.
Clean and uncluttered composition designed for later text overlay.
Cinematic lighting, high resolution, sharp details.

Visual Description:
${mood}`;

  const res = await fetch(SDXL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SDXL Request Failed: ${res.status} - ${err}`);
  }

  const json = await res.json();

  if (json?.status !== "success" || typeof json?.public_url !== "string") {
    throw new Error(`SDXL Response Missing public_url: ${JSON.stringify(json)}`);
  }

  return json.public_url;
}

async function submitFfmpegJob({ images, audioUrl }) {
  const apiKey = process.env.RUNPOD_API_KEY;
  if (!apiKey) throw new Error("Missing env var: RUNPOD_API_KEY");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const payload = {
    input: {
      images,
      audio: audioUrl,
      render: {
        duration: 12,
        fps: 30,
        width: 1080,
        height: 1920,
        transition: "cut",
      },
    },
  };

  const res = await fetch(
    `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID_FFMPEG}/run`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FFmpeg RunPod submit failed: ${res.status} - ${err}`);
  }

  const json = await res.json();
  const jobId = json?.id;

  if (!jobId) throw new Error(`FFmpeg RunPod submit missing id: ${JSON.stringify(json)}`);

  return jobId;
}

async function pollFfmpegJob(jobId) {
  const apiKey = process.env.RUNPOD_API_KEY;
  if (!apiKey) throw new Error("Missing env var: RUNPOD_API_KEY");

  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  const maxWaitMs = 5 * 60 * 1000;
  const pollEveryMs = 10 * 1000;

  const started = Date.now();

  while (true) {
    if (Date.now() - started > maxWaitMs) {
      throw new Error(`FFmpeg RunPod timed out after 5 minutes. jobId=${jobId}`);
    }

    const res = await fetch(
      `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID_FFMPEG}/status/${jobId}`,
      { headers }
    );

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`FFmpeg RunPod status failed: ${res.status} - ${err}`);
    }

    const json = await res.json();
    const status = json?.status;

    if (status === "COMPLETED") {
      const url = json?.output?.url;
      if (typeof url !== "string" || !url.length) {
        throw new Error(`FFmpeg COMPLETED but missing output.url: ${JSON.stringify(json)}`);
      }
      return url;
    }

    if (status === "FAILED") {
      throw new Error(`FFmpeg RunPod FAILED: ${JSON.stringify(json)}`);
    }

    await new Promise((r) => setTimeout(r, pollEveryMs));
  }
}

export async function generateBackgroundVideo(mood) {
  const baseImageUrl = await generateSDXLImage(mood);

  const audioUrl = pickRandomAudioUrl();

  const jobId = await submitFfmpegJob({
    images: [baseImageUrl],
    audioUrl,
  });

  const videoUrl = await pollFfmpegJob(jobId);

  return videoUrl;
}
