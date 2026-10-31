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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      soundFX.playMatchCelebration();
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#2563EB", "#00D2FF", "#FF007F", "#FF9900", "#10B981"],
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

  const computedAspectRatio = fitMode === "contain" && imageRatio ? `${imageRatio}` : "4 / 3";

  return (
    <div className="editorial-stage">
      {/* 3-Column Exhibition Canvas Grid */}
      <div className="cinematic-canvas-grid craft-card">
        {/* ========================================================
            COLUMN 1: REALITY (LEFT)
           ======================================================== */}
        <aside className="column-reality">
          <div className="editorial-kicker font-mono">01 // HUMAN INPUT</div>
          <h2 className="editorial-headline-condensed font-condensed">REALITY</h2>
          <div className="editorial-rule-blue"></div>

          <p className="editorial-lead-text">
            High-resolution facial landmark telemetry scanned via Amazon Rekognition.
          </p>

          <div className="reality-metric-card">
            <div className="metric-row font-mono">
              <span className="metric-label">DETECTED EMOTION</span>
              <span className="metric-value text-blue">{emotion}</span>
            </div>
            <div className="metric-row font-mono">
              <span className="metric-label">CONFIDENCE</span>
              <span className="metric-value">{matchResult.emotionConfidence || 97}%</span>
            </div>
            <div className="metric-row font-mono">
              <span className="metric-label">SMILE DETECTED</span>
              <span className="metric-value">
                {traits.smiling ? "YES (ACTIVE)" : "NEUTRAL"}
              </span>
            </div>
            <div className="metric-row font-mono">
              <span className="metric-label">EYEWEAR</span>
              <span className="metric-value">
                {traits.wearingGlasses ? "GLASSES DETECTED" : "NONE"}
              </span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            COLUMN 2: MONUMENTAL SPLIT FACE PORTAL (CENTER)
           ======================================================== */}
        <main className="column-face-stage">
          {/* Framing mode toggle */}
          <div className="viewport-framing-toolbar font-mono">
            <span className="toolbar-label">FRAMING:</span>
            <div className="framing-toggle-group">
              <button
                type="button"
                className={`btn-framing-toggle ${fitMode === "contain" ? "active" : ""}`}
                onClick={() => setFitMode("contain")}
                title="Show 100% of photograph without cropping"
              >
                <Minimize2 size={12} />
                <span>WHOLE PHOTO</span>
              </button>
              <button
                type="button"
                className={`btn-framing-toggle ${fitMode === "cover" ? "active" : ""}`}
                onClick={() => setFitMode("cover")}
                title="Fill portal frame"
              >
                <Maximize2 size={12} />
                <span>FILL FRAME</span>
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className={`split-face-viewport fit-${fitMode}`}
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
                <MoveHorizontal size={14} color="#0F172A" />
              </div>
            </div>
          </div>

          <div className="split-hint-label font-mono">
            <span>DRAG SLIDER TO MORPH REALITY & MEME ({sliderPos}% / {100 - sliderPos}%)</span>
          </div>
        </main>

        {/* ========================================================
            COLUMN 3: THE MEME TWIN (RIGHT)
           ======================================================== */}
        <aside className="column-meme">
          <div className="editorial-kicker font-mono text-cyan">02 // NEURAL SYNTHESIS</div>
          <h2 className="editorial-headline-italic font-display">THE MEME TWIN</h2>
          <div className="editorial-rule-cyan"></div>

          <p className="editorial-lead-text text-light">
            {matchResult.caption || "An artificial cognition experiment in expressive transmutation from 800+ catalogue memes."}
          </p>

          <div className="affinity-score-box">
            <div className="score-number font-display">{scorePercent}%</div>
            <div className="score-label font-mono">EXPRESSION AFFINITY SCORE</div>
            <p className="score-sub font-mono">
              Geometric match across 800+ catalogue portraits
            </p>
          </div>

          {downloadError && (
            <div className="studio-validation-alert font-mono" role="alert">
              <span>{downloadError}</span>
            </div>
          )}

          <div className="result-action-buttons">
            <button
              className="btn-craft btn-primary btn-download font-mono"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={16} />
              <span>{downloading ? "GENERATING..." : "EXPORT POSTER"}</span>
            </button>

            <button
              className="btn-craft btn-outline btn-rematch font-mono"
              onClick={onReset}
            >
              <RefreshCw size={15} />
              <span>NEW SELFIE</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Ephemeral Guarantee Footer */}
      <div className="stage-privacy-note font-mono">
        <AlertCircle size={14} color="#2563EB" />
        <span>
          {isMock
            ? "DEMO ARCHETYPE MODE · ZERO BIOMETRIC RETENTION · PURGED IN 24H"
            : "AMAZON REKOGNITION POWERED · DIRECT S3 UPLOAD · ZERO BIOMETRIC RETENTION"}
        </span>
      </div>
    </div>
  );
}
