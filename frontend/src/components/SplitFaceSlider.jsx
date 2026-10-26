import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MoveHorizontal, Download, RefreshCw, ShieldCheck, Share2 } from "lucide-react";
import confetti from "canvas-confetti";
import { soundFX } from "../utils/audio";
import { generateSplitPoster } from "../utils/exportCard";

export default function SplitFaceSlider({ matchResult, userPreview, onReset }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    soundFX.playMatchCelebration();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00FFA3", "#00F0FF", "#FF3B69", "#FFD200", "#FFFFFF"],
    });
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

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

  const handleDownload = async () => {
    setDownloading(true);
    await generateSplitPoster({
      userImageSrc: userPreview,
      memeImageSrc: matchResult.memeUrl,
      emotion: matchResult.detectedEmotion || "HAPPY",
      score: matchResult.score || 0.94,
      sliderPos,
    });
    setDownloading(false);
  };

  const scorePercent = Math.round((matchResult.score || 0.94) * 100);
  const emotion = matchResult.detectedEmotion || "HAPPY";
  const traits = matchResult.userTraits || { smiling: true, mouthOpen: false, wearingGlasses: false };

  return (
    <div className="editorial-stage">
      {/* Cinematic Split Canvas */}
      <div className="cinematic-canvas-wrap">
        {/* Left Editorial Text: REALITY */}
        <div className="editorial-text-left">
          <div className="editorial-label-condensed font-condensed">REALITY</div>
          <div className="editorial-sub-list font-condensed">
            <span>SELFIE INPUT</span>
            <span>REKOGNITION GEOMETRY</span>
            <span>{emotion} EXPRESSION</span>
            <span>{traits.smiling ? "SMILING ACTIVE" : "NEUTRAL FOCUS"}</span>
          </div>
        </div>

        {/* Central Split Face Stage */}
        <div
          ref={containerRef}
          className="split-face-container"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Layer 2: Right Image (Meme Twin Alter-Ego) */}
          <div className="split-layer layer-meme">
            <img
              src={matchResult.memeUrl}
              alt="Meme Twin"
              className="split-img meme-img"
              draggable="false"
            />
            <div className="dark-atmospheric-overlay"></div>
          </div>

          {/* Layer 1: Left Image (Student Selfie) Clipped */}
          <div
            className="split-layer layer-selfie"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img
              src={userPreview}
              alt="Selfie"
              className="split-img selfie-img"
              draggable="false"
            />
            <div className="light-atmospheric-overlay"></div>
          </div>

          {/* Vertical Draggable Divider Line & Handle */}
          <div
            className="split-divider-line"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="split-handle-orb">
              <div className="handle-dot left-dot"></div>
              <div className="handle-dot right-dot"></div>
              <MoveHorizontal size={18} className="handle-icon" />
            </div>
          </div>

          {/* Interactive Hint */}
          <div className="slider-hint font-mono">
            <span>◀ DRAG TO MORPH REALITY & MEME ▶</span>
          </div>
        </div>

        {/* Right Editorial Text: ALTER-EGO */}
        <div className="editorial-text-right">
          <div className="editorial-meta-tag font-mono">AWS NEURAL ALCHEMY</div>
          <h2 className="editorial-title-serif font-serif">THE MEME TWIN</h2>
          <p className="editorial-lead-serif">
            AN ARTIFICIAL COGNITION EXPERIMENT IN EXPRESSIVE TRANSMUTATION.
          </p>
          <div className="editorial-stats font-mono">
            <span className="stat-highlight font-serif">{scorePercent}%</span>
            <span>AFFINITY RATING</span>
          </div>
          <div className="editorial-links font-serif">
            <button className="editorial-link-btn" onClick={handleDownload} disabled={downloading}>
              {downloading ? "PRINTING POSTER..." : "DOWNLOAD POSTER"}
            </button>
            <span className="bullet">•</span>
            <button className="editorial-link-btn" onClick={onReset}>
              RE-MATCH
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic HUD Bottom Bar */}
      <div className="cinematic-hud-bar font-mono">
        <div className="hud-left">
          <span className="hud-pill">STATUS: SYNCHRONIZED</span>
          <span className="hud-pill">EMOTION: {emotion}</span>
          <span className="hud-pill">CONFIDENCE: {matchResult.emotionConfidence || 98}%</span>
        </div>
        <div className="hud-center">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="split-range-slider"
          />
        </div>
        <div className="hud-right">
          <button onClick={handleDownload} className="hud-btn" title="Download Split Morph Poster">
            <Download size={14} /> EXPORT ART
          </button>
          <button onClick={onReset} className="hud-btn" title="Snap another photo">
            <RefreshCw size={14} /> RETAKE
          </button>
        </div>
      </div>
    </div>
  );
}
