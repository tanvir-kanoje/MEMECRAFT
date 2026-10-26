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

// Curated high-res creative demo memes with expressional vibes (instant fallback)
export const DEMO_MEMES = {
  HAPPY: [
    {
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      caption: "When the AWS Lambda deploys with zero errors on the first try",
      score: 0.95,
      emotion: "HAPPY",
      traits: { smiling: true, mouthOpen: false, wearingGlasses: false },
    },
    {
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
      caption: "Vibing in the college auditorium after finishing the presentation",
      score: 0.92,
      emotion: "HAPPY",
      traits: { smiling: true, mouthOpen: true, wearingGlasses: false },
    },
  ],
  SURPRISED: [
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
      caption: "When you check AWS Cost Explorer and your bill is only $0.04",
      score: 0.96,
      emotion: "SURPRISED",
      traits: { smiling: false, mouthOpen: true, wearingGlasses: false },
    },
  ],
  CALM: [
    {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
      caption: "Unbothered. Moisturized. In my serverless lane.",
      score: 0.89,
      emotion: "CALM",
      traits: { smiling: false, mouthOpen: false, wearingGlasses: true },
    },
  ],
  ANGRY: [
    {
      url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80",
      caption: "Who changed the IAM role policy right before the demo?!",
      score: 0.91,
      emotion: "ANGRY",
      traits: { smiling: false, mouthOpen: false, wearingGlasses: false },
    },
  ],
  CONFUSED: [
    {
      url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80",
      caption: "Wait... it worked on localhost, why is CORS blocked?",
      score: 0.88,
      emotion: "CONFUSED",
      traits: { smiling: false, mouthOpen: false, wearingGlasses: false },
    },
  ],
};

/**
 * 3-Step Pipeline:
 * 1. POST /uploads/presign -> get uploadUrl & objectKey
 * 2. PUT blob to uploadUrl (Direct S3 upload)
 * 3. POST /matches -> get matched meme & score
 */
export async function matchSelfieImage(imageBlob) {
  const apiBase = getApiBaseUrl();

  // If no API configured yet, return a dynamic creative mock match
  if (!apiBase) {
    console.warn("No API Base URL configured. Simulating AI Rekognition match.");
    await new Promise((r) => setTimeout(r, 1400)); // Simulate neural scan
    const moods = ["HAPPY", "SURPRISED", "CALM", "CONFUSED"];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const list = DEMO_MEMES[randomMood];
    const picked = list[Math.floor(Math.random() * list.length)];
    return {
      status: "success",
      memeUrl: picked.url,
      score: picked.score,
      detectedEmotion: picked.emotion,
      emotionConfidence: 97.4,
      userTraits: picked.traits,
      explanation: `Matched your ${picked.emotion.toLowerCase()} vibe with high expression affinity!`,
      isMock: true,
    };
  }

  // 1. Get Presigned S3 PUT URL
  const presignRes = await fetch(`${apiBase}/uploads/presign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: "image/jpeg" }),
  });

  if (!presignRes.ok) {
    const errText = await presignRes.text();
    throw new Error(`Failed to obtain upload ticket: ${errText}`);
  }

  const { uploadUrl, objectKey } = await presignRes.json();

  // 2. Upload file directly to S3
  const s3UploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: imageBlob,
  });

  if (!s3UploadRes.ok) {
    throw new Error("Failed to upload image directly to S3 storage.");
  }

  // 3. Request Rekognition Match
  const matchRes = await fetch(`${apiBase}/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objectKey }),
  });

  if (!matchRes.ok) {
    const errText = await matchRes.text();
    throw new Error(`Facial matching service returned an error: ${errText}`);
  }

  const matchData = await matchRes.json();
  return matchData;
}
