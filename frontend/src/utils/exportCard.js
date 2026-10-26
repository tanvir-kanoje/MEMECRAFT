// High-Resolution Creative Polaroid & Editorial Split Poster Generator

export async function generateSplitPoster({ userImageSrc, memeImageSrc, emotion, score, sliderPos = 50 }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1600;
  canvas.height = 1000;

  // Background: Left bright gradient to Right deep obsidian
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 0);
  bgGrad.addColorStop(0, "#E2E8F0");
  bgGrad.addColorStop(0.35, "#CBD5E1");
  bgGrad.addColorStop(0.5, "#0F172A");
  bgGrad.addColorStop(1, "#030712");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1000);

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        const dummy = document.createElement("canvas");
        dummy.width = 600;
        dummy.height = 800;
        const dctx = dummy.getContext("2d");
        dctx.fillStyle = "#1E293B";
        dctx.fillRect(0, 0, 600, 800);
        resolve(dummy);
      };
      img.src = src;
    });

  try {
    const [userImg, memeImg] = await Promise.all([
      loadImage(userImageSrc),
      loadImage(memeImageSrc),
    ]);

    // Center Face Position
    const faceW = 700;
    const faceH = 850;
    const faceX = (1600 - faceW) / 2;
    const faceY = 75;

    // 1. Draw Right Meme Face
    ctx.save();
    ctx.drawImage(memeImg, faceX, faceY, faceW, faceH);
    ctx.restore();

    // 2. Draw Left User Face clipped to slider position
    const splitOffset = faceX + (faceW * sliderPos) / 100;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, splitOffset, 1000);
    ctx.clip();
    ctx.drawImage(userImg, faceX, faceY, faceW, faceH);
    ctx.restore();

    // 3. Draw vertical split line
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(splitOffset, faceY - 20);
    ctx.lineTo(splitOffset, faceY + faceH + 20);
    ctx.stroke();

    // Left Editorial Typography
    ctx.fillStyle = "#0F172A";
    ctx.font = "900 64px 'Bebas Neue', sans-serif";
    ctx.fillText("REALITY", 80, 420);

    ctx.font = "700 22px 'Bebas Neue', sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("STUDENT IDENTITY", 80, 460);
    ctx.fillText("FACIAL GEOMETRY DETECTED", 80, 490);
    ctx.fillText(`${emotion.toUpperCase()} EXPRESSION`, 80, 520);

    // Right Editorial Typography
    ctx.fillStyle = "#94A3B8";
    ctx.font = "600 16px monospace";
    ctx.fillText("AWS NEURAL ALCHEMY", 1120, 360);

    ctx.fillStyle = "#F8FAFC";
    ctx.font = "700 52px 'Cinzel', serif";
    ctx.fillText("THE MEME TWIN", 1120, 425);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "18px 'Cinzel', serif";
    ctx.fillText("AN ARTIFICIAL COGNITION EXPERIMENT", 1120, 470);
    ctx.fillText("IN EXPRESSIVE TRANSMUTATION.", 1120, 495);

    ctx.fillStyle = "#00FFA3";
    ctx.font = "900 64px 'Cinzel', serif";
    ctx.fillText(`${Math.round(score * 100)}%`, 1120, 580);
    ctx.fillStyle = "#CBD5E1";
    ctx.font = "16px monospace";
    ctx.fillText("EXPRESSION AFFINITY", 1120, 610);

    // Bottom Watermark
    ctx.fillStyle = "#475569";
    ctx.font = "14px monospace";
    ctx.fillText("AWS IMAGE-TO-MEME PLATFORM • REKOGNITION POWERED • 24H PRIVACY PURGED", 80, 950);

    // Download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `meme-twin-split-poster.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to generate split poster:", err);
  }
}

export async function generateMatchCard({ userImageSrc, memeImageSrc, emotion, score, traits }) {
  return generateSplitPoster({ userImageSrc, memeImageSrc, emotion, score });
}
