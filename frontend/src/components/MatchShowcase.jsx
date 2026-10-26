import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Download, RefreshCw, Share2, Sparkles, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { generateMatchCard } from "../utils/exportCard";
import { soundFX } from "../utils/audio";

export default function MatchShowcase({ matchResult, userPreview, onReset }) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Play celebratory chime and trigger confetti
    soundFX.playMatchCelebration();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ["#00FFA3", "#00F0FF", "#B026FF", "#FFD200", "#FF0077"],
    });
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    await generateMatchCard({
      userImageSrc: userPreview,
      memeImageSrc: matchResult.memeUrl,
      emotion: matchResult.detectedEmotion || "HAPPY",
      score: matchResult.score || 0.92,
      traits: matchResult.userTraits,
    });
    setDownloading(false);
  };

  const scorePercent = Math.round((matchResult.score || 0.9) * 100);
  const emotion = matchResult.detectedEmotion || "HAPPY";
  const traits = matchResult.userTraits || { smiling: true, mouthOpen: false, wearingGlasses: false };

  return (
    <div className="match-showcase-container">
      {/* Top Affinity Banner */}
      <div className="affinity-hero-card craft-card">
        <div className="affinity-badge-row">
          <div className="craft-badge font-mono">
            <Sparkles size={14} /> REKOGNITION MATCH VERIFIED
          </div>
          <div className="trust-badge font-mono">
            <ShieldCheck size={14} /> 24H PRIVACY PURGED
          </div>
        </div>

        <h2 className="affinity-title font-display">
          We Found Your <span className="gradient-text">{emotion}</span> Meme Twin!
        </h2>
        <p className="affinity-explanation">
          {matchResult.explanation || `Matched your expression geometry with ${scorePercent}% affinity.`}
        </p>

        {/* Big Score Radial Badge */}
        <div className="score-meter-wrap">
          <div className="score-number font-display gradient-text">{scorePercent}%</div>
          <span className="score-label font-mono">EXPRESSION AFFINITY</span>
        </div>
      </div>

      {/* Side-by-side Polaroid Exhibition Cards */}
      <div className="polaroid-grid">
        {/* User Selfie Card */}
        <div className="polaroid-frame craft-card">
          <div className="polaroid-photo-wrap">
            <img src={userPreview} alt="User Capture" className="polaroid-img" />
            <div className="polaroid-tag font-mono">YOUR SELFIE</div>
          </div>
          <div className="polaroid-meta">
            <div className="meta-headline font-display">Captured Vibe</div>
            <div className="meta-sub font-mono text-secondary">
              EMOTION: <span className="text-white">{emotion}</span> ({matchResult.emotionConfidence || 96}%)
            </div>
          </div>
        </div>

        {/* Matched Meme Card */}
        <div className="polaroid-frame craft-card meme-winner-frame">
          <div className="polaroid-photo-wrap">
            <img src={matchResult.memeUrl} alt="Matched Meme" className="polaroid-img" />
            <div className="polaroid-tag winner-tag font-mono">👑 MEME TWIN</div>
          </div>
          <div className="polaroid-meta">
            <div className="meta-headline font-display">Meme Counterpart</div>
            <div className="meta-sub font-mono text-secondary">
              FROM S3 CATALOGUE (800+ MEMES)
            </div>
          </div>
        </div>
      </div>

      {/* Trait Analysis Breakdown */}
      <div className="traits-card craft-card">
        <h4 className="font-display traits-title">Facial Micro-Expression Breakdown</h4>
        <div className="traits-grid">
          <div className="trait-pill">
            <CheckCircle2 size={18} className="trait-icon" />
            <div>
              <span className="trait-name">Smiling</span>
              <span className="trait-status font-mono">
                {traits.smiling ? "Detected ✓" : "Neutral —"}
              </span>
            </div>
          </div>

          <div className="trait-pill">
            <CheckCircle2 size={18} className="trait-icon" />
            <div>
              <span className="trait-name">Mouth Open</span>
              <span className="trait-status font-mono">
                {traits.mouthOpen ? "Open ✓" : "Closed —"}
              </span>
            </div>
          </div>

          <div className="trait-pill">
            <CheckCircle2 size={18} className="trait-icon" />
            <div>
              <span className="trait-name">Eyewear</span>
              <span className="trait-status font-mono">
                {traits.wearingGlasses ? "Glasses Detected ✓" : "None —"}
              </span>
            </div>
          </div>

          <div className="trait-pill">
            <CheckCircle2 size={18} className="trait-icon" />
            <div>
              <span className="trait-name">Dominant Emotion</span>
              <span className="trait-status font-mono text-white">{emotion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="showcase-actions">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="btn-craft btn-primary btn-large"
        >
          <Download size={20} />
          {downloading ? "Rendering Card..." : "Download Match Polaroid"}
        </button>

        <button onClick={onReset} className="btn-craft btn-outline btn-large">
          <RefreshCw size={20} /> Match Another Selfie
        </button>
      </div>
    </div>
  );
}
