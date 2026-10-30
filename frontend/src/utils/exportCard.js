// High-Resolution Creative Gallery Exhibition Poster Generator (1600 x 1000)

function drawFittedImage(ctx, img, x, y, w, h, mode = "contain") {
  const naturalW = img.naturalWidth || img.width || w;
  const naturalH = img.naturalHeight || img.height || h;
  const imgRatio = naturalW / naturalH;
  const boxRatio = w / h;

  let dw = w;
  let dh = h;
  let dx = x;
  let dy = y;

  if (mode === "contain") {
    if (imgRatio > boxRatio) {
      dw = w;
      dh = w / imgRatio;
      dy = y + (h - dh) / 2;
    } else {
      dh = h;
      dw = h * imgRatio;
      dx = x + (w - dw) / 2;
    }
  } else {
    // cover
    if (imgRatio > boxRatio) {
      dh = h;
      dw = h * imgRatio;
      dx = x + (w - dw) / 2;
    } else {
      dw = w;
      dh = w / imgRatio;
      dy = y + (h - dh) / 2;
    }
  }

  ctx.drawImage(img, dx, dy, dw, dh);
}

export async function generateSplitPoster({
  userImageSrc,
  memeImageSrc,
  emotion = "HAPPY",
  score = 0.94,
  sliderPos = 50,
  isMock = false,
  caption = "",
  archiveId = "REF. MMXXVI",
  fitMode = "contain",
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 1600;
  canvas.height = 1000;

  // Background: Deep Gallery Black (#171815)
  ctx.fillStyle = "#171815";
  ctx.fillRect(0, 0, 1600, 1000);

  // Delicate Outer Border: Archival Warm Paper Tint
  ctx.strokeStyle = "rgba(245, 241, 232, 0.16)";
  ctx.lineWidth = 1;
  ctx.strokeRect(36, 36, 1528, 928);

  const loadImage = (src) =>
    new Promise((resolve) => {
      if (!src) {
        const dummy = createFallbackCanvas();
        return resolve(dummy);
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        resolve(createFallbackCanvas());
      };
      img.src = src;
    });

  const createFallbackCanvas = () => {
    const dummy = document.createElement("canvas");
    dummy.width = 600;
    dummy.height = 800;
    const dctx = dummy.getContext("2d");
    dctx.fillStyle = "#1E201B";
    dctx.fillRect(0, 0, 600, 800);
    return dummy;
  };

  try {
    const [userImg, memeImg] = await Promise.all([
      loadImage(userImageSrc),
      loadImage(memeImageSrc),
    ]);

    // Center Portrait Display
    const faceW = 760;
    const faceH = 820;
    const faceX = (1600 - faceW) / 2;
    const faceY = 90;

    // Draw Right Meme Face
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(faceX, faceY, faceW, faceH, 16);
    ctx.clip();
    drawFittedImage(ctx, memeImg, faceX, faceY, faceW, faceH, fitMode);
    ctx.restore();

    // Draw Left User Face clipped to slider position
    const splitOffset = faceX + (faceW * sliderPos) / 100;
    ctx.save();
    ctx.beginPath();
    ctx.rect(faceX, faceY, Math.max(0, splitOffset - faceX), faceH);
    ctx.clip();
    drawFittedImage(ctx, userImg, faceX, faceY, faceW, faceH, fitMode);
    ctx.restore();

    // Draw vertical split line in Electric Lime
    ctx.strokeStyle = "#D6FF61";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(splitOffset, faceY - 8);
    ctx.lineTo(splitOffset, faceY + faceH + 8);
    ctx.stroke();

    // Inner subtle photo frame
    ctx.strokeStyle = "rgba(245, 241, 232, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(faceX, faceY, faceW, faceH);

    // Left Column: Editorial Monogram & Metadata
    ctx.fillStyle = "#D6FF61";
    ctx.font = "600 13px 'JetBrains Mono', monospace";
    ctx.fillText("01 // THE ORIGINAL", 70, 160);

    ctx.fillStyle = "#F5F1E8";
    ctx.font = "italic 400 46px 'Instrument Serif', Georgia, serif";
    ctx.fillText("Human Countenance", 70, 220);

    ctx.fillStyle = "#77796D";
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillText("FACIAL ANALYSIS", 70, 270);
    ctx.fillText(`EMOTION: ${emotion.toUpperCase()}`, 70, 295);

    // Caption Quote on Left
    ctx.fillStyle = "rgba(245, 241, 232, 0.7)";
    ctx.font = "italic 400 20px 'Instrument Serif', Georgia, serif";
    if (caption) {
      // Split into 2 lines if long
      const words = caption.split(" ");
      const mid = Math.ceil(words.length / 2);
      ctx.fillText(`“${words.slice(0, mid).join(" ")}`, 70, 480);
      ctx.fillText(`${words.slice(mid).join(" ")}”`, 70, 510);
    } else {
      ctx.fillText("“A familiar expression in a", 70, 480);
      ctx.fillText("rather unfamiliar place.”", 70, 510);
    }

    // Right Column: Alter Ego & Heuristic
    ctx.fillStyle = "#D6FF61";
    ctx.font = "600 13px 'JetBrains Mono', monospace";
    ctx.fillText("02 // THE ALTER EGO", 1230, 160);

    ctx.fillStyle = "#F5F1E8";
    ctx.font = "italic 400 46px 'Instrument Serif', Georgia, serif";
    ctx.fillText("The Meme Twin", 1230, 220);

    ctx.fillStyle = "#77796D";
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillText(isMock ? "CATALOGUE: CURATED ARCHIVE" : "CATALOGUE: AWS S3 INDEX", 1230, 270);
    ctx.fillText(archiveId.toUpperCase(), 1230, 295);

    // Score Callout
    ctx.fillStyle = "#D6FF61";
    ctx.font = "italic 400 68px 'Instrument Serif', Georgia, serif";
    ctx.fillText(`${Math.round(score * 100)}%`, 1230, 480);

    ctx.fillStyle = "#77796D";
    ctx.font = "600 12px 'JetBrains Mono', monospace";
    ctx.fillText("EXPRESSION AFFINITY SCORE", 1230, 515);

    // Bottom Running Footers
    ctx.fillStyle = "#F5F1E8";
    ctx.font = "700 15px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("MEMECRAFT", 70, 930);

    ctx.fillStyle = "#77796D";
    ctx.font = "400 12px 'JetBrains Mono', monospace";
    ctx.fillText(
      isMock
        ? "THE ART OF YOUR OTHER SELF · ARCHIVE SIMULATION · EPHEMERAL"
        : "THE ART OF YOUR OTHER SELF · AWS REKOGNITION · ZERO RETENTION",
      190,
      930
    );

    ctx.fillStyle = "#D6FF61";
    ctx.fillText("ARCHIVE MMXXVI", 1370, 930);

    // Download to disk
    const link = document.createElement("a");
    link.download = `MEMECRAFT_${emotion}_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Poster generation failed:", err);
    throw err;
  }
}
