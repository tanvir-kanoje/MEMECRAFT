import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const STEPS = [
  "Uploading selfie to private S3 container...",
  "Invoking AWS Rekognition DetectFaces...",
  "Analyzing facial landmarks & emotion geometry...",
  "Evaluating 800+ pre-indexed memes in Lambda...",
  "Stitching best expression affinity match...",
];

export default function AnalyzingOverlay({ userPreview }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="analyzing-card craft-card">
      <div className="analyzing-preview-box">
        {userPreview && (
          <img src={userPreview} alt="Scanning" className="analyzing-img" />
        )}
        <div className="laser-line"></div>
        <div className="reticle-box">
          <div className="reticle-corner corner-tl"></div>
          <div className="reticle-corner corner-tr"></div>
          <div className="reticle-corner corner-bl"></div>
          <div className="reticle-corner corner-br"></div>
        </div>
      </div>

      <div className="analyzing-text-wrap">
        <div className="analyzing-badge font-mono">
          <Sparkles size={16} className="spin-icon" /> NEURAL SCAN IN PROGRESS
        </div>
        <h3 className="font-display analyzing-title">Decoding Your Vibe</h3>
        <p className="analyzing-step font-mono">{STEPS[stepIndex]}</p>

        {/* Progress Dots */}
        <div className="progress-dots">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`dot ${i <= stepIndex ? "dot-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
