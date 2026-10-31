import React from "react";
import { Sparkles, Sliders } from "lucide-react";

export default function Header({ currentVibe, onOpenSettings, apiBaseUrl }) {
  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Brand Logo & Title */}
        <div className="brand-group">
          <div className="logo-badge">
            <Sparkles className="logo-icon" size={22} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">
                MEME<span className="gradient-text">CRAFT</span>
              </span>
              <span className="craft-badge font-mono">V1.0 STUDIO</span>
            </div>
            <p className="brand-subtitle font-mono">
              AWS REKOGNITION ✦ FACIAL EXPRESSION MATCHER
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="header-actions">
          <div className="status-pill font-mono">
            <span className="status-dot"></span>
            <span>{currentVibe ? `VIBE: ${currentVibe}` : "800+ MEMES INDEXED"}</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="btn-settings font-mono"
            title="Configure AWS API Gateway Endpoint"
          >
            <Sliders size={15} />
            <span className="settings-label">
              {apiBaseUrl ? "API Connected" : "Demo Mode"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
