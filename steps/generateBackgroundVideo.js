// ssm-mesa-reel steps/generateBackgroundVideo.js

import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET = "ssm-video-engine-output";

const SDXL_URL = "https://sdxl-manager-710616455963.us-central1.run.app";
const SVD_MANAGER_URL = "https://svd-video-manager-710616455963.us-central1.run.app";

async function readSvdJob(rootId) {
  const file = storage.bucket(BUCKET).file(`jobs/${rootId}.json`);
  const [contents] = await file.download();
  return JSON.parse(contents.toString());
}

async function startOrPollSDXL(mood, jobId) {
const prompt = `
  high-resolution image of
  ${mood}
  `;

  // ✅ ADD THIS LOG — DO NOT CHANGE ANYTHING ELSE
  console.log("[SDXL REQUEST]", JSON.stringify({
    url: SDXL_URL,
    payload: {
      prompt,
      jobId
    }
  }, null, 2));

  const res = await fetch(SDXL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, jobId }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`SDXL Manager HTTP Error: ${res.status} - ${err}`);
  }

  const json = await res.json();
  
  // Normalize SDXL manager response to existing contract
  if (json?.status === "pending" && typeof json?.jobId === "string") {
    return { state: "PENDING", jobId: json.jobId };
  }
  
  if (json?.status === "success" && typeof json?.public_url === "string") {
    return { state: "COMPLETE", imageUrl: json.public_url };
  }
  
  throw new Error(`Unexpected SDXL response: ${JSON.stringify(json)}`);
}

async function startSVD(imageUrl) {
  console.log("SVD payload:", JSON.stringify({ image_url: imageUrl }));

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

  if (data?.state === "PENDING" && typeof data?.jobId === "string") {
    return data.jobId;
  }

  throw new Error(`Unexpected SVD start response: ${JSON.stringify(data)}`);
}

export async function generateBackgroundVideo(mood, existingJobId) {
  // We use a single string jobId with a prefix so the orchestrator can keep passing one value.
  // sdxl:<runpodJobId>  -> polling SDXL manager
  // svd:<rootId>        -> polling GCS job state written by SVD manager

  if (!existingJobId) {
    const sdxl = await startOrPollSDXL(mood, null);

    if (sdxl?.state === "PENDING" && typeof sdxl?.jobId === "string") {
      return { state: "SDXL_PENDING", jobId: `sdxl:${sdxl.jobId}` };
    }

    if (sdxl?.state === "COMPLETE" && typeof sdxl?.imageUrl === "string") {
      const rootId = await startSVD(sdxl.imageUrl);
      return { state: "SVD_LOOPING", jobId: `svd:${rootId}` };
    }

    throw new Error(`Unexpected SDXL response: ${JSON.stringify(sdxl)}`);
  }

  if (existingJobId.startsWith("sdxl:")) {
    const sdxlJobId = existingJobId.slice("sdxl:".length);
    const sdxl = await startOrPollSDXL(mood, sdxlJobId);

    if (sdxl?.state === "PENDING" && typeof sdxl?.jobId === "string") {
      return { state: "SDXL_PENDING", jobId: `sdxl:${sdxl.jobId}` };
    }

    if (sdxl?.state === "COMPLETE" && typeof sdxl?.imageUrl === "string") {
      const rootId = await startSVD(sdxl.imageUrl);
      return { state: "SVD_LOOPING", jobId: `svd:${rootId}` };
    }

    throw new Error(`Unexpected SDXL poll response: ${JSON.stringify(sdxl)}`);
  }

  if (existingJobId.startsWith("svd:")) {
    const rootId = existingJobId.slice("svd:".length);

    try {
      const job = await readSvdJob(rootId);

    // HARD BLOCK: never allow COMPLETE until looping + stitching are truly finished
    if (job?.status === "FINALIZING") {
      return { state: "SVD_LOOPING", jobId: existingJobId };
    }

    const TOTAL_LOOPS = 3;

    if (
      job?.status === "COMPLETE" &&
      typeof job?.final_video_url === "string"
    ) {

      return {
        state: "COMPLETE",
        jobId: existingJobId,
        videoUrl: job.final_video_url
      };
    }

      return { state: "SVD_LOOPING", jobId: existingJobId };
    } catch (err) {
      throw new Error(`Failed reading SVD job state for ${rootId}: ${err?.message || err}`);
    }
  }

  throw new Error(`Unknown jobId format: ${existingJobId}`);
}
