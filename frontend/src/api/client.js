// API Client for AWS API Gateway + S3 Direct Uploads

const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export function getApiBaseUrl() {
  return localStorage.getItem("meme_api_base_url") || DEFAULT_API_BASE;
}

export function setApiBaseUrl(url) {
  if (url) {
    localStorage.setItem("meme_api_base_url", url.trim().replace(/\/+$/, ""));
  } else {
    localStorage.removeItem("meme_api_base_url");
  }
}

export function isBackendConfigured() {
  return Boolean(getApiBaseUrl());
}

// Curated Expression Archetypes from the MEMECRAFT Historic Archive (Self-contained vector assets)
export const DEMO_MEMES = {
  HAPPY: [
    {
      url: "/memes/archetype_dramatic.svg",
      archiveId: "ARCHIVE NO. 088",
      name: "The Dramatic Entrance",
      caption: "Arriving with unmatched narrative momentum when the pipeline passes.",
      score: 0.94,
      emotion: "HAPPY",
      traits: { smiling: true, mouthOpen: false, wearingGlasses: false },
    },
  ],
  SURPRISED: [
    {
      url: "/memes/archetype_plottwist.svg",
      archiveId: "ARCHIVE NO. 052",
      name: "The Plot Twist",
      caption: "When you inspect AWS Cost Explorer and the bill is strictly $0.04.",
      score: 0.96,
      emotion: "SURPRISED",
      traits: { smiling: false, mouthOpen: true, wearingGlasses: false },
    },
  ],
  CALM: [
    {
      url: "/memes/archetype_unbothered.svg",
      archiveId: "ARCHIVE NO. 029",
      name: "The Unbothered",
      caption: "Serene inner calm through absolute acceptance of serverless logs.",
      score: 0.91,
      emotion: "CALM",
      traits: { smiling: true, mouthOpen: false, wearingGlasses: false },
    },
  ],
  CONFUSED: [
    {
      url: "/memes/archetype_overthinker.svg",
      archiveId: "ARCHIVE NO. 014",
      name: "The Overthinker",
      caption: "Processing 47 hypothetical deployment timelines at once.",
      score: 0.89,
      emotion: "CONFUSED",
      traits: { smiling: false, mouthOpen: false, wearingGlasses: true },
    },
  ],
};

/**
 * 3-Step Serverless Pipeline:
 * 1. POST /uploads/presign -> get uploadUrl & objectKey
 * 2. PUT blob to uploadUrl (Direct client-to-S3 upload)
 * 3. POST /matches -> Rekognition inference + vector catalog matching
 */
export async function matchSelfieImage(imageBlob) {
  const apiBase = getApiBaseUrl();

  // If no backend endpoint configured, execute an explicit offline archetype simulation
  if (!apiBase) {
    console.info("MEMECRAFT: Operating in offline archetype simulation mode.");
    await new Promise((r) => setTimeout(r, 1200)); // Simulate neural inference time

    const moods = ["HAPPY", "SURPRISED", "CALM", "CONFUSED"];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const list = DEMO_MEMES[randomMood];
    const picked = list[0];

    return {
      status: "success",
      memeUrl: picked.url,
      archiveId: picked.archiveId,
      archetypeName: picked.name,
      caption: picked.caption,
      score: picked.score,
      detectedEmotion: picked.emotion,
      emotionConfidence: 96.8,
      userTraits: picked.traits,
      explanation: `Simulated match against curated specimen ${picked.archiveId} (${picked.name}). Connect your AWS API Gateway to run live Amazon Rekognition searches.`,
      isMock: true,
    };
  }

  const contentType = imageBlob.type || "image/jpeg";
  const contentLength = imageBlob.size;

  // 1. Get Presigned S3 PUT URL
  const presignRes = await fetch(`${apiBase}/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, contentLength }),
  });

  if (!presignRes.ok) {
    let errMessage = "Failed to obtain upload ticket from API Gateway";
    try {
      const errJson = await presignRes.json();
      errMessage = errJson.error || errMessage;
    } catch {
      errMessage = await presignRes.text();
    }
    throw new Error(errMessage);
  }

  const { uploadUrl, objectKey } = await presignRes.json();

  // 2. Upload file directly to S3
  const s3UploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: imageBlob,
  });

  if (!s3UploadRes.ok) {
    throw new Error("Direct S3 upload failed. Please verify bucket CORS configuration.");
  }

  // 3. Request Rekognition Match
  const matchRes = await fetch(`${apiBase}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objectKey }),
  });

  if (!matchRes.ok) {
    let errMessage = "Facial matching service returned an error";
    try {
      const errJson = await matchRes.json();
      errMessage = errJson.error || errMessage;
    } catch {
      errMessage = await matchRes.text();
    }
    throw new Error(errMessage);
  }

  const matchData = await matchRes.json();
  matchData.isMock = false;
  return matchData;
}
