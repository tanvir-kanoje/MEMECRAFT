import React from "react";
import { Sparkles, ArrowDownRight, ArrowRight, ShieldCheck, Cpu, Zap } from "lucide-react";

export default function HeroPicco({ onScrollToStudio, onScrollToProjects }) {
  const marqueeItems = [
    "AWS SERVERLESS",
    "AMAZON REKOGNITION",
    "SUB-400MS INFERENCE",
    "DIRECT S3 PRESIGNED PUT",
    "REACT 19 + VITE",
    "ZERO BIOMETRIC DEBT",
    "800+ MEMES INDEXED",
    "CLOUDFRONT OAC",
    "EVENT-DRIVEN ARCHITECTURE",
    "WARM IN-MEMORY CACHE"
  ];

  return (
    <section id="hero" className="picco-hero">
      <div className="picco-hero-container">
        {/* Greeting Pill */}
        <div className="picco-greeting-pill">
          <span className="picco-greeting-avatar">👋</span>
          <span className="picco-greeting-text">Hi There! I'm Tanvir Kanoje</span>
          <span className="picco-pill-separator">•</span>
          <span className="picco-greeting-role">Cloud & AI Systems Architect</span>
        </div>

        {/* Big Editorial Headline */}
        <h1 className="picco-hero-title">
          I build{" "}
          <span className="picco-highlight-wrap">
            <span className="picco-serif-highlight">event-driven</span>
            <svg className="picco-scribble-svg" viewBox="0 0 140 18" fill="none" preserveAspectRatio="none">
              <path d="M 4 12 Q 35 4 70 11 T 136 9" stroke="var(--picco-orange)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>{" "}
          computer vision platforms, serverless cloud architectures, and delightful{" "}
          <span className="picco-highlight-wrap">
            <span className="picco-serif-highlight-blue">interactive web</span>
            <svg className="picco-scribble-svg" viewBox="0 0 150 18" fill="none" preserveAspectRatio="none">
              <path d="M 4 13 Q 40 5 75 12 T 146 10" stroke="var(--picco-blue)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>{" "}
          experiences.
        </h1>

        {/* Narrative Subhead */}
        <p className="picco-hero-subhead">
          Engineering production-grade AWS infrastructure capable of serving 500+ concurrent users with sub-400ms latency, zero-compute ingestion bottlenecks, and strict biometric data privacy.
        </p>

        {/* Action Buttons */}
        <div className="picco-hero-actions">
          <button onClick={onScrollToStudio} className="picco-btn-primary">
            <Sparkles size={18} />
            <span>Launch Live AI Studio</span>
            <ArrowRight size={16} />
          </button>
          
          <button onClick={onScrollToProjects} className="picco-btn-secondary">
            <span>Explore Selected Projects</span>
            <ArrowDownRight size={16} />
          </button>
        </div>

        {/* Trust & Spec Chips */}
        <div className="picco-hero-specs">
          <div className="picco-spec-chip">
            <Zap size={14} className="chip-icon-blue" />
            <span>Sub-400ms P99 Latency</span>
          </div>
          <div className="picco-spec-chip">
            <ShieldCheck size={14} className="chip-icon-green" />
            <span>24h S3 Auto-Purge (Zero Retention)</span>
          </div>
          <div className="picco-spec-chip">
            <Cpu size={14} className="chip-icon-orange" />
            <span>Amazon Rekognition Vision Engine</span>
          </div>
        </div>
      </div>

      {/* Infinite Marquee Ribbon */}
      <div className="picco-marquee-wrap">
        <div className="picco-marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="picco-marquee-item">
              <span className="picco-marquee-star">✦</span>
              <span className="picco-marquee-label">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
