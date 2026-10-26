import React, { useState } from "react";
import { Sparkles, ArrowUpRight, ExternalLink } from "lucide-react";

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

export default function ProjectsSection({ onJumpToStudio }) {
  const [filter, setFilter] = useState("ALL");

  const projects = [
    {
      id: "memecraft",
      title: "MEMECRAFT // The Neural Mirror",
      category: "FLAGSHIP AI",
      categoryLabel: "COMPUTER VISION & AWS SERVERLESS",
      year: "2026",
      status: "LIVE PRODUCTION",
      accentColor: "blue",
      description:
        "A live serverless computer vision platform built on Amazon Rekognition and AWS Lambda. Bypasses compute bottlenecks via direct S3 presigned PUT ingestion, matches users to 800+ indexed memes in sub-400ms, and enforces zero biometric data debt with 24-hour auto-purging.",
      metrics: [
        { label: "P99 LATENCY", value: "< 350ms" },
        { label: "CONCURRENCY", value: "500+ Users" },
        { label: "CATALOGUE", value: "800+ Memes" },
        { label: "COMPLIANCE", value: "Zero Retention" },
      ],
      tags: ["AWS Rekognition", "AWS Lambda", "S3 Presigned", "CloudFront OAC", "React 19"],
      githubUrl: "https://github.com/tanvir-kanoje/AWS-Memer",
      isFlagship: true,
    },
    {
      id: "northern-times",
      title: "The Northern Times",
      category: "ILLUSTRATION",
      categoryLabel: "EDITORIAL ILLUSTRATION & BRAND IDENTITY",
      year: "2024",
      status: "COMPLETED",
      accentColor: "orange",
      description:
        "Built around clarity and rhythm — reflecting how news moves in real time. Modular layouts, bold typography, and restrained color allow stories to take center stage without distraction.",
      metrics: [
        { label: "PLATFORM", value: "Print & Digital" },
        { label: "SYSTEM", value: "Modular Grid" },
        { label: "TYPE", value: "Averia Serif" },
        { label: "DELIVERABLE", value: "Vector Suite" },
      ],
      tags: ["Art Direction", "Editorial", "Typography", "Vector Illustration"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "nitty-craft",
      title: "Nitty Craft Co.",
      category: "PACKAGING",
      categoryLabel: "TACTILE PACKAGING & BRAND IDENTITY",
      year: "2023",
      status: "COMPLETED",
      accentColor: "yellow",
      description:
        "Approached through tactility — bold forms, raw textures, and playful compositions. The packaging system feels hands-on and expressive, turning everyday products into collectible objects.",
      metrics: [
        { label: "TEXTURE", value: "Raw Kraft Paper" },
        { label: "PALETTE", value: "Warm Ochre" },
        { label: "ITEMS", value: "14 SKUs" },
        { label: "ENGAGEMENT", value: "+45% Repeats" },
      ],
      tags: ["Packaging", "Visual Identity", "Custom Shapes", "Print Specs"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "oxbridge-press",
      title: "Oxbridge Press",
      category: "BRAND IDENTITY",
      categoryLabel: "ACADEMIC PUBLISHING & TYPOGRAPHY",
      year: "2022",
      status: "COMPLETED",
      accentColor: "green",
      description:
        "The concept focused on timelessness and precision. A refined typographic system paired with subtle illustration details creates a balance between academic heritage and contemporary publishing.",
      metrics: [
        { label: "HERITAGE", value: "Academic" },
        { label: "FOUNDRY", value: "Custom Serif" },
        { label: "COVERS", value: "32 Editions" },
        { label: "STYLE", value: "Modern Classical" },
      ],
      tags: ["Brand Identity", "Book Covers", "Typography", "Editorial"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "barcelona-civic",
      title: "Barcelona Civic Office",
      category: "BRAND IDENTITY",
      categoryLabel: "MUNICIPAL IDENTITY & WAYFINDING",
      year: "2021",
      status: "COMPLETED",
      accentColor: "blue",
      description:
        "A flexible identity system designed to unify diverse city initiatives. Bright colors, simple geometric shapes, and clear hierarchy make civic communication accessible across digital and physical spaces.",
      metrics: [
        { label: "SCALE", value: "City-wide" },
        { label: "SIGNAGE", value: "Wayfinding" },
        { label: "ACCESSIBILITY", value: "WCAG AAA" },
        { label: "TOUCHPOINTS", value: "Digital + Print" },
      ],
      tags: ["Public Identity", "Wayfinding", "Graphic Design", "Signage"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "sudstadt-zeitung",
      title: "Südstadt Zeitung",
      category: "ILLUSTRATION",
      categoryLabel: "NEWSPAPER EDITORIAL & CONTRAST",
      year: "2021",
      status: "COMPLETED",
      accentColor: "orange",
      description:
        "Exploring contrast — tradition and modernity coexisting. Clean grids meet expressive editorial accents, creating a visual language that feels familiar and forward-looking.",
      metrics: [
        { label: "FREQUENCY", value: "Daily Edition" },
        { label: "CONTRAST", value: "Modern / Classic" },
        { label: "SPOT ART", value: "40+ Icons" },
        { label: "REACH", value: "120K Readers" },
      ],
      tags: ["Illustration", "Newspaper", "Editorial", "Iconography"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "monochrome-journal",
      title: "Monochrome Journal",
      category: "BRAND IDENTITY",
      categoryLabel: "MINIMALIST ART DIRECTION",
      year: "2020",
      status: "COMPLETED",
      accentColor: "green",
      description:
        "Stripped back to essentials. A minimal palette and sharp typographic rhythm create a calm, focused reading experience where content defines the aesthetic.",
      metrics: [
        { label: "PALETTE", value: "Pure Grayscale" },
        { label: "RHYTHM", value: "Vertical Grid" },
        { label: "LAYOUT", value: "Uncluttered" },
        { label: "NOISE", value: "Zero Distraction" },
      ],
      tags: ["Art Direction", "Minimalism", "Typography", "Editorial"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "economic-review",
      title: "The Economic Review",
      category: "ILLUSTRATION",
      categoryLabel: "DATA VISUALIZATION & ANALYTICAL ART",
      year: "2019",
      status: "COMPLETED",
      accentColor: "yellow",
      description:
        "Centered around structure and data. Precise layouts, subtle motion cues, and analytical visual illustrations reinforce clarity and trust in complex financial information.",
      metrics: [
        { label: "FOCUS", value: "Data Clarity" },
        { label: "INFOGRAPHICS", value: "Vector Sets" },
        { label: "COLOR", value: "Financial Tint" },
        { label: "READABILITY", value: "High Contrast" },
      ],
      tags: ["Illustration", "Data Viz", "Finance", "Vector Infographics"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "the-chronicle",
      title: "The Chronicle",
      category: "BRAND IDENTITY",
      categoryLabel: "NARRATIVE PUBLISHING & ART DIRECTION",
      year: "2019",
      status: "COMPLETED",
      accentColor: "blue",
      description:
        "Built on narrative flow — guiding the reader through layered stories. Warm tones, editorial typography, and soft transitions create a human, immersive news experience.",
      metrics: [
        { label: "FLOW", value: "Narrative" },
        { label: "ATMOSPHERE", value: "Warm Editorial" },
        { label: "CHAPTERS", value: "8 Sections" },
        { label: "PACING", value: "Thoughtful" },
      ],
      tags: ["Art Direction", "Publishing", "Narrative", "Editorial"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
  ];

  const filterTabs = ["ALL", "FLAGSHIP AI", "BRAND IDENTITY", "ILLUSTRATION", "PACKAGING"];

  const filteredProjects =
    filter === "ALL" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="picco-section">
      <div className="picco-section-header">
        <div className="picco-section-tag">
          <span>01 // SELECTED WORKS</span>
        </div>
        <h2 className="picco-section-title">
          Selected <span className="picco-serif-highlight">projects</span>
        </h2>
        <p className="picco-section-subtitle">
          Sneak peek of works across computer vision, brand identity, editorial illustration, and packaging.
        </p>

        {/* Filter Pills */}
        <div className="picco-filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`picco-filter-btn ${filter === tab ? "filter-active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="picco-projects-grid">
        {filteredProjects.map((proj) => (
          <article key={proj.id} className={`picco-project-card card-accent-${proj.accentColor}`}>
            {/* Top Bar: Category & Year */}
            <div className="picco-card-meta">
              <span className="picco-card-category">{proj.categoryLabel}</span>
              <div className="picco-card-badges">
                {proj.isFlagship && (
                  <span className="picco-card-pill-flagship">
                    <Sparkles size={11} /> FLAGSHIP
                  </span>
                )}
                <span className="picco-card-year">{proj.year}</span>
              </div>
            </div>

            {/* Picco Visual Showcase Banner */}
            <div className={`picco-card-visual-wrap visual-bg-${proj.accentColor}`}>
              {proj.id === "memecraft" ? (
                <div className="visual-stage-memecraft">
                  <div className="visual-face-split">
                    <div className="face-half selfie-half">
                      <div className="landmark-points">
                        <span className="dot dot-1"></span>
                        <span className="dot dot-2"></span>
                        <span className="dot dot-3"></span>
                        <span className="dot dot-4"></span>
                      </div>
                      <span className="visual-side-label font-mono">SELFIE</span>
                    </div>
                    <div className="face-divider">
                      <div className="divider-glow-bar"></div>
                    </div>
                    <div className="face-half meme-half">
                      <div className="meme-caricature-icon">🎭</div>
                      <span className="visual-side-label font-mono">MEME</span>
                    </div>
                  </div>
                  <div className="visual-badge-sticker sticker-blue">
                    <span>SUB-350MS</span>
                  </div>
                  <div className="visual-badge-sticker sticker-right sticker-green">
                    <span>800+ MEMES</span>
                  </div>
                </div>
              ) : (
                <div className="visual-stage-editorial">
                  <div className="editorial-cover-card">
                    <span className="editorial-edition font-mono">{proj.year} EDITION</span>
                    <h4 className="editorial-heading">{proj.title}</h4>
                    <span className="editorial-tag">{proj.category}</span>
                  </div>
                  <div className={`visual-badge-sticker sticker-${proj.accentColor}`}>
                    <span>{proj.status}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <h3 className="picco-card-title">{proj.title}</h3>
            <p className="picco-card-desc">{proj.description}</p>

            {/* Metrics Dashboard Inside Card */}
            <div className="picco-card-metrics">
              {proj.metrics.map((m, idx) => (
                <div key={idx} className="picco-metric-item">
                  <span className="picco-metric-label">{m.label}</span>
                  <span className="picco-metric-val">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Tech Tags */}
            <div className="picco-card-tags">
              {proj.tags.map((t, idx) => (
                <span key={idx} className="picco-tag-item">
                  {t}
                </span>
              ))}
            </div>

            {/* Card Actions */}
            <div className="picco-card-actions">
              {proj.isFlagship ? (
                <>
                  <button onClick={onJumpToStudio} className="picco-btn-card-primary">
                    <Sparkles size={16} />
                    <span>Launch Live Interactive Studio</span>
                  </button>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="picco-btn-card-secondary"
                    title="View GitHub Repository"
                  >
                    <GithubIcon size={16} />
                    <span>Code</span>
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="picco-btn-card-secondary"
                  >
                    <GithubIcon size={16} />
                    <span>View Project</span>
                    <ArrowUpRight size={14} />
                  </a>
                  <span className="picco-card-status-badge">
                    <span className="status-indicator-dot"></span>
                    <span>{proj.status}</span>
                  </span>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
