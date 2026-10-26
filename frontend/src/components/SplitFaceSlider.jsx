import React, { useState, useRef, useEffect } from "react";
import { MoveHorizontal, Download, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
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
      particleCount: 110,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#2563EB", "#00D2FF", "#FF007F", "#FF9900", "#10B981"],
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
      score: matchResult.score || 0.92,
      sliderPos,
    });
    setDownloading(false);
  };

  const scorePercent = Math.round((matchResult.score || 0.92) * 100);
  const emotion = matchResult.detectedEmotion || "HAPPY";
  const traits = matchResult.userTraits || { smiling: true, mouthOpen: false, wearingGlasses: false };

  return (
    <div className="editorial-stage">
      {/* 3-Column Exhibition Canvas Grid */}
      <div className="cinematic-canvas-grid">
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
            <div className="metric-row">
              <span className="metric-label font-mono">DETECTED EMOTION</span>
              <span className="metric-value font-mono text-blue">{emotion}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label font-mono">CONFIDENCE</span>
              <span className="metric-value font-mono">{matchResult.emotionConfidence || 97}%</span>
            </div>
            <div className="metric-row">
              <span className="metric-label font-mono">SMILE DETECTED</span>
              <span className="metric-value font-mono">
                {traits.smiling ? "YES (ACTIVE)" : "NEUTRAL"}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label font-mono">EYEWEAR</span>
              <span className="metric-value font-mono">
                {traits.wearingGlasses ? "GLASSES DETECTED" : "NONE"}
              </span>
            </div>
          </div>
        </aside>

        {/* ========================================================
            COLUMN 2: MONUMENTAL SPLIT FACE PORTAL (CENTER)
           ======================================================== */}
        <main className="column-face-stage">
          <div
            ref={containerRef}
            className="split-face-viewport"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* Background Layer: Meme Twin (Right Side - 100% clean and unobstructed) */}
            <div className="split-layer layer-meme">
              <img
                src={matchResult.memeUrl}
                alt="Meme Twin"
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
                alt="Selfie"
                className="split-photo selfie-photo"
                draggable="false"
              />
            </div>

            {/* Draggable Vertical Divider Line */}
            <div
              className="split-divider-line"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="split-orb-thumb">
                <div className="orb-pip orb-left"></div>
                <MoveHorizontal size={16} className="orb-icon" />
                <div className="orb-pip orb-right"></div>
              </div>
            </div>
          </div>

          {/* Morph Instruction Badge - Placed OUTSIDE and BELOW the image so nothing covers the meme */}
          <div className="morph-instruction-under font-mono">
            <Sparkles size={13} className="text-blue" />
            <span>DRAG SLIDER TO MORPH REALITY & MEME</span>
          </div>
        </main>

        {/* ========================================================
            COLUMN 3: THE MEME TWIN (RIGHT)
           ======================================================== */}
        <aside className="column-alterego">
          <div className="editorial-kicker font-mono text-cyan">02 // NEURAL SYNTHESIS</div>
          <h2 className="editorial-headline-serif font-serif">THE MEME TWIN</h2>
          <div className="editorial-rule-cyan"></div>

          <p className="editorial-lead-text text-light">
            An artificial cognition experiment in expressive transmutation from 800+ catalogue memes.
          </p>

          <div className="affinity-hero-box">
            <div className="affinity-score-giant font-serif">{scorePercent}%</div>
            <div className="affinity-caption font-mono">EXPRESSION AFFINITY SCORE</div>
          </div>

          <div className="editorial-action-row font-serif">
            <button
              className="btn-editorial-primary"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download size={16} />
              <span>{downloading ? "PRINTING..." : "EXPORT POSTER"}</span>
            </button>

            <button className="btn-editorial-ghost" onClick={onReset}>
              <RefreshCw size={15} />
              <span>RE-MATCH</span>
            </button>
          </div>
        </aside>
      </div>

      {/* ========================================================
          CINEMATIC HUD CONTROL BAR (BOTTOM)
         ======================================================== */}
      <footer className="cinematic-hud-bar font-mono">
        <div className="hud-telemetry">
          <span className="telemetry-pill">
            <span className="live-dot"></span> PIPELINE: SYNCHRONIZED
          </span>
          <span className="telemetry-pill">CATALOGUE: 800+ MEMES</span>
          <span className="telemetry-pill">REVISION: AWS S3 + REKOGNITION</span>
        </div>

        <div className="hud-scrubber-wrap">
          <span className="scrubber-label">REALITY</span>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="hud-slider"
          />
          <span className="scrubber-label">ALTER-EGO</span>
        </div>

        <div className="hud-buttons">
          <button onClick={handleDownload} className="hud-action-btn" title="Download split poster">
            <Download size={14} /> POSTER
          </button>
          <button onClick={onReset} className="hud-action-btn" title="Take another selfie">
            <RefreshCw size={14} /> NEW SELFIE
          </button>
        </div>
      </footer>
    </div>
  );
}
