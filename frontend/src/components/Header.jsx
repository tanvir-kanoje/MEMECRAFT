import React from "react";
import { Sliders, Camera } from "lucide-react";

export default function Header({ onOpenSettings, onScrollToStudio }) {
  return (
    <header className="gallery-header">
      <div className="header-inner">
        {/* Gallery Monogram & Title */}
        <div className="brand-group">
          <a href="#" className="brand-link">
            <span className="brand-title font-serif">MEMECRAFT</span>
            <span className="brand-badge font-mono">THE EXPRESSION ARCHIVE</span>
          </a>
        </div>

        {/* Purposeful Navigation Links */}
        <nav className="header-nav font-mono">
          <a href="#how-it-works" className="nav-link">HOW IT WORKS</a>
          <a href="#archive-section" className="nav-link">ARCHIVE</a>
          <a href="#about-section" className="nav-link">ABOUT</a>
        </nav>

        {/* Right Action & Settings */}
        <div className="header-actions">
          <button
            onClick={onScrollToStudio}
            className="btn-header-cta font-mono"
            title="Start your portrait matching"
          >
            <Camera size={13} />
            <span>FIND MY TWIN</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="btn-settings-icon"
            title="Configure Cloud Ingress"
          >
            <Sliders size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
