import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const STEPS = [
  "Awaiting your expression...",
  "Consulting the permanent collection...",
  "Analyzing micro-expression geometry & gaze...",
  "Searching 800+ indexed comedic archetypes...",
  "Synthesizing your unexpected alter ego...",
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
    <div className="analyzing-card gallery-card">
      <div className="analyzing-preview-box">
        {userPreview && (
          <img src={userPreview} alt="Scanning" className="analyzing-img" />
        )}
        <div className="scanning-laser-lime"></div>
        <div className="analyzing-framing">
          <div className="frame-tick frame-tl"></div>
          <div className="frame-tick frame-tr"></div>
          <div className="frame-tick frame-bl"></div>
          <div className="frame-tick frame-br"></div>
        </div>
      </div>

      <div className="analyzing-text-wrap">
        <div className="archive-kicker font-mono">
          <Sparkles size={14} color="var(--electric-lime)" />
          <span>PORTRAIT SYNTHESIS IN PROGRESS</span>
        </div>
        <h3 className="analyzing-title font-serif">Let’s see what your expression has to say.</h3>
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
