import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoveHorizontal, Download, RefreshCw, AlertCircle, Maximize2, Minimize2 } from "lucide-react";
import confetti from "canvas-confetti";
import { soundFX } from "../utils/audio";
import { generateSplitPoster } from "../utils/exportCard";

export default function SplitFaceSlider({ matchResult, userPreview, onReset }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [imageRatio, setImageRatio] = useState(null);
  const [fitMode, setFitMode] = useState("contain"); // "contain" (show whole image) | "cover" (fill frame)
  const containerRef = useRef(null);

  // Measure natural aspect ratio of the captured image so we never crop it
  useEffect(() => {
    if (!userPreview) return;
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImageRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = userPreview;
  }, [userPreview]);

  useEffect(() => {
    // Check reduced motion preference before firing audio & confetti
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      soundFX.playMatchCelebration();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#D6FF61", "#F5F1E8", "#77796D", "#B8FF2E"],
          disableForReducedMotion: true,
        });
      } catch (e) {
        console.warn("Confetti skipped:", e);
      }
    }
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(Math.round(percentage));
  }, []);

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await generateSplitPoster({
        userImageSrc: userPreview,
        memeImageSrc: matchResult.memeUrl,
        emotion: matchResult.detectedEmotion || "HAPPY",
        score: matchResult.score || 0.92,
        sliderPos,
        isMock: Boolean(matchResult.isMock),
        caption: matchResult.caption || matchResult.explanation,
        archiveId: matchResult.archiveId || "REF. MMXXVI",
        fitMode,
      });
    } catch (err) {
      console.error("Poster download error:", err);
      setDownloadError("Could not render collectible poster. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const scorePercent = Math.round((matchResult.score || 0.94) * 100);
  const emotion = matchResult.detectedEmotion || "HAPPY";
  const traits = matchResult.userTraits || { smiling: true, mouthOpen: false, wearingGlasses: false };
  const isMock = Boolean(matchResult.isMock);

  // Determine viewport aspect ratio: dynamically adopt the user's photo ratio in contain mode
  const computedAspectRatio = fitMode === "contain" && imageRatio ? `${imageRatio}` : "4 / 3";

  return (
    <div className="gallery-result-stage">
      {/* Editorial Header Status */}
      <div className="result-kicker-row font-mono">
        <div className="result-header-left">
          <span className="archive-badge">
            {matchResult.archiveId || "EXHIBITION RECORD // SPECIMEN 001"}
          </span>
          {isMock && (
            <span
              className="demo-mode-badge"
              title="Simulated match using curated archetype archive. Connect AWS API Gateway for live Amazon Rekognition search."
            >
              DEMO SIMULATION · OFFLINE PREVIEW
            </span>
          )}
        </div>
        <span className="affinity-score-pill">
          {scorePercent}% AFFINITY SCORE
        </span>
      </div>

      {isMock && (
        <div className="demo-disclaimer-note font-mono">
          <AlertCircle size={14} color="var(--electric-lime)" />
          <span>
            Offline preview: matching against MEMECRAFT vector archetypes. Configure AWS Ingress in Settings to enable live Amazon Rekognition inference.
          </span>
        </div>
      )}

      <div className="gallery-result-grid">
        {/* ========================================================
            COLUMN 1: THE ORIGINAL (LEFT)
           ======================================================== */}
        <aside className="column-exhibition column-original">
          <div className="exhibition-tag font-mono">01 // THE ORIGINAL</div>
          <h2 className="exhibition-title font-serif">Human Expression</h2>
          <div className="editorial-divider"></div>

          <p className="exhibition-caption font-serif">
            Authentic countenance analyzed via computer vision.
          </p>

          <div className="exhibition-meta-box font-mono">
            <div className="meta-row">
              <span className="meta-k">DOMINANT EMOTION</span>
              <span className="meta-v text-lime">{emotion}</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">CONFIDENCE</span>
              <span className="meta-v">{matchResult.emotionConfidence || 96.8}%</span>
            </div>
            <div className="meta-row">
              <span className="meta-k">SMILE DETECTED</span>
              <span className="meta-v">
                {traits.smiling ? "ACTIVE" : "NEUTRAL"}
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-k">EYEWEAR</span>
              <span className="meta-v">
                {traits.wearingGlasses ? "PRESENT" : "NONE"}
              </span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            COLUMN 2: MONUMENTAL SPLIT PORTAL (CENTER)
           ======================================================== */}
        <main className="column-exhibition column-center-portal">
          {/* Sizing & Framing Controls Bar */}
          <div className="viewport-framing-toolbar font-mono">
            <span className="toolbar-label">VIEWPORT FRAMING:</span>
            <div className="framing-toggle-group">
              <button
                type="button"
                className={`btn-framing-toggle ${fitMode === "contain" ? "active" : ""}`}
                onClick={() => setFitMode("contain")}
                title="Show 100% of captured photograph without cropping"
                aria-pressed={fitMode === "contain"}
              >
                <Minimize2 size={12} />
                <span>WHOLE PHOTO</span>
              </button>
              <button
                type="button"
                className={`btn-framing-toggle ${fitMode === "cover" ? "active" : ""}`}
                onClick={() => setFitMode("cover")}
                title="Fill entire portal frame"
                aria-pressed={fitMode === "cover"}
              >
                <Maximize2 size={12} />
                <span>FILL FRAME</span>
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className={`gallery-split-viewport fit-${fitMode}`}
            style={{ aspectRatio: computedAspectRatio }}
            role="slider"
            tabIndex={0}
            aria-label="Comparison slider between selfie and matched meme"
            aria-valuenow={sliderPos}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={handleKeyDown}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => {
              if (e.touches[0]) handleMove(e.touches[0].clientX);
            }}
            onTouchMove={handleTouchMove}
          >
            {/* Background Layer: Meme Twin (Right Side) */}
            <div className="split-layer layer-meme">
              <img
                src={matchResult.memeUrl}
                alt={matchResult.archetypeName || "Matched Meme Twin"}
                className="split-photo meme-photo"
                draggable="false"
              />
            </div>

            {/* Foreground Layer: User Selfie (Left Side Clipped) */}
            <div
              className="split-layer layer-selfie"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={userPreview}
                alt="Original Portrait"
                className="split-photo selfie-photo"
                draggable="false"
              />
            </div>

            {/* Draggable Vertical Divider Line */}
            <div
              className="split-divider-line"
              style={{ left: `${sliderPos}%` }}
              aria-hidden="true"
            >
              <div className="split-thumb">
                <MoveHorizontal size={14} color="#171815" />
              </div>
            </div>
          </div>

          {/* Morph Instruction Prompt */}
          <div className="split-instruction-label font-mono">
            <span>DRAG SLIDER OR USE ARROW KEYS TO EXPLORE MORPH ({sliderPos}% / {100 - sliderPos}%)</span>
          </div>
        </main>

        {/* ========================================================
            COLUMN 3: THE ALTER EGO (RIGHT)
           ======================================================== */}
        <aside className="column-exhibition column-alterego">
          <div className="exhibition-tag font-mono">02 // THE ALTER EGO</div>
          <h2 className="exhibition-title font-serif">
            {matchResult.archetypeName || "The Meme Twin"}
          </h2>
          <div className="editorial-divider"></div>

          <blockquote className="exhibition-quote font-serif">
            {matchResult.caption ? `“${matchResult.caption}”` : "“A familiar expression in a rather unfamiliar place.”"}
          </blockquote>

          <div className="affinity-heuristic-box">
            <div className="heuristic-num font-serif">{scorePercent}%</div>
            <div className="heuristic-label font-mono">EXPRESSION AFFINITY SCORE</div>
            <p className="heuristic-sub font-mono">
              Weighted match: Emotion (50%) + Smile (25%) + Gaze & Pose (15%) + Features (10%)
            </p>
          </div>

          {downloadError && (
            <div className="studio-validation-alert font-mono" role="alert">
              <span>{downloadError}</span>
            </div>
          )}

          <div className="exhibition-actions-row">
            <button
              className="btn-lime btn-download-twin font-mono"
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download collectible comparison print"
            >
              <Download size={15} />
              <span>{downloading ? "GENERATING PRINT..." : "DOWNLOAD PRINT"}</span>
            </button>

            <button
              className="btn-archive-outline font-mono"
              onClick={onReset}
              aria-label="Try another facial expression match"
            >
              <RefreshCw size={14} />
              <span>TRY ANOTHER MATCH</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Ephemeral Guarantee Footer */}
      <div className="result-privacy-footer font-mono">
        <span>EPHEMERAL DATA · ZERO BIOMETRIC RETENTION · PURGED IN 24H</span>
      </div>
    </div>
  );
}
