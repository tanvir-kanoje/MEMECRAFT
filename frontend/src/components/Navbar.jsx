import React from "react";
import { Sparkles, Sliders, ExternalLink, Activity } from "lucide-react";

export default function Navbar({ currentVibe, onOpenSettings, apiBaseUrl }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="picco-nav-container">
      <div className="picco-nav-pill">
        {/* Brand / Logo */}
        <a href="#hero" className="picco-nav-brand">
          <div className="picco-avatar-badge">
            <span className="picco-avatar-emoji">🎭</span>
          </div>
          <div className="picco-brand-text">
            <span className="picco-brand-name">Tanvir Kanoje</span>
            <span className="picco-brand-dot">•</span>
            <span className="picco-brand-tag">Projects</span>
          </div>
        </a>

        {/* Center Links */}
        <div className="picco-nav-links">
          <button onClick={() => scrollTo("projects")} className="picco-nav-link">
            Projects
          </button>
          <button onClick={() => scrollTo("studio")} className="picco-nav-link picco-nav-link-highlight">
            <Sparkles size={13} className="inline-icon" /> Live AI Studio
          </button>
          <button onClick={() => scrollTo("services")} className="picco-nav-link">
            Capabilities
          </button>
          <button onClick={() => scrollTo("about")} className="picco-nav-link">
            About
          </button>
          <button onClick={() => scrollTo("faq")} className="picco-nav-link">
            FAQ
          </button>
        </div>

        {/* Right Status & Actions */}
        <div className="picco-nav-actions">
          <div className="picco-status-pill" title="AWS System Health">
            <span className="picco-status-dot pulse-animation"></span>
            <span className="picco-status-text">
              {currentVibe ? `VIBE: ${currentVibe}` : "800+ MEMES READY"}
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            className="picco-nav-icon-btn"
            title="Configure AWS API Gateway Endpoint"
          >
            <Sliders size={16} />
          </button>

          <button onClick={() => scrollTo("contact")} className="picco-btn-contact">
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
}
