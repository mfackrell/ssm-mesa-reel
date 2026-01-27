// ssm-mesa-reel steps/generateBackgroundVideo.js

import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET = "ssm-video-engine-output";

async function getJobState(jobId) {
  const file = storage.bucket(BUCKET).file(`jobs/${jobId}.json`);

  try {
    const [contents] = await file.download();
    return JSON.parse(contents.toString());
  } catch (err) {
    if (err.code === 404) return null;
    throw err;
  }
}


const SDXL_URL = "https://sdxl-manager-710616455963.us-central1.run.app";
const SVD_MANAGER_URL = "https://svd-video-manager-710616455963.us-central1.run.app";

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

async function generateSVDVideo(imageUrl) {
  const res = await fetch(SVD_MANAGER_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ image_url: imageUrl }),
});

if (!(res.status === 202 || res.status === 200)) {
  const err = await res.text();
  throw new Error(`SVD Manager HTTP Error: ${res.status} - ${err}`);
}

const data = await res.json();
if (res.status === 202 && data.status === "submitted") {
  // SUCCESS: job is running asynchronously
  return {
    state: "PROCESSING",
    jobId: data.job_id
  };
}

if (res.status === 200 && data.status === "complete") {
  return {
    state: "COMPLETE",
    videoUrl: data.gcs_url
  };
}

throw new Error(`Unexpected SVD response: ${JSON.stringify(data)}`);
}

export async function generateBackgroundVideo(mood, existingJobId) {
  // 1. Check GCS first to see if the SVD job finished
  if (existingJobId) {
    const res = await fetch(`https://storage.googleapis.com/ssm-video-engine-output/jobs/${existingJobId}.json`);
    if (res.ok) {
        const job = await res.json();
        if (job.status === "COMPLETE") {
            return { state: "COMPLETE", videoUrl: job.chunks[0] }; // You'll want to stitch these later
        }
        return { state: "SVD_LOOPING", jobId: existingJobId };
    }
  }

  // 2. Call SDXL Manager
  const sdxlRes = await fetch("https://sdxl-manager-url...", {
    method: "POST",
    body: JSON.stringify({ prompt: mood, jobId: existingJobId })
  });
  const sdxlData = await sdxlRes.json();

  if (sdxlData.state === "COMPLETE") {
    // 3. SDXL is done! Now trigger SVD for the first time
    const svdRes = await fetch("https://svd-video-manager-url...", {
        method: "POST",
        body: JSON.stringify({ image_url: sdxlData.imageUrl })
    });
    const svdData = await svdRes.json();
    return { state: "SVD_STARTED", jobId: svdData.jobId };
  }

  return { state: "SDXL_PENDING", jobId: sdxlData.jobId };
}



