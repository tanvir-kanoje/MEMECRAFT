import React from "react";
import { Sparkles, Sliders, ShieldCheck, Zap } from "lucide-react";

export default function Header({ currentVibe, onOpenSettings, apiBaseUrl }) {
  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Brand Logo & Title */}
        <div className="brand-group">
          <div className="logo-badge">
            <Sparkles className="logo-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <span className="brand-title">MEME<span className="gradient-text">CRAFT</span></span>
              <span className="craft-badge font-mono">v1.0 STUDIO</span>
            </div>
            <p className="brand-subtitle">AWS REKOGNITION ✦ FACIAL EXPRESSION MATCHER</p>
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
            className="btn-settings"
            title="Configure AWS API Gateway Endpoint"
          >
            <Sliders size={18} />
            <span className="settings-label">
              {apiBaseUrl ? "API Connected" : "Demo Mode"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
