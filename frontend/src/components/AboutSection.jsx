import React, { useState } from "react";
import { ExternalLink, Code, ChevronDown } from "lucide-react";

export default function AboutSection({ onSelectArchiveSpecimen }) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Curated Exhibition Archive Cards from the MEMECRAFT Collection
  const archiveShowcase = [
    {
      num: "ARCHIVE NO. 014",
      category: "The Overthinker",
      caption: "Processing 47 hypothetical timelines at once.",
      vibe: "CONFUSED",
      img: "/memes/archetype_overthinker.svg",
    },
    {
      num: "ARCHIVE NO. 029",
      category: "The Unbothered",
      caption: "Inner peace through catastrophic acceptance.",
      vibe: "CALM",
      img: "/memes/archetype_unbothered.svg",
    },
    {
      num: "ARCHIVE NO. 052",
      category: "The Plot Twist",
      caption: "When reality writes a script no one asked for.",
      vibe: "SURPRISED",
      img: "/memes/archetype_plottwist.svg",
    },
    {
      num: "ARCHIVE NO. 088",
      category: "The Dramatic Entrance",
      caption: "Arriving with unmatched narrative momentum.",
      vibe: "HAPPY",
      img: "/memes/archetype_dramatic.svg",
    },
  ];

  return (
    <div className="editorial-sections-wrapper">
      {/* ========================================================
          SECTION B: THE MATCHING EXPERIENCE
         ======================================================== */}
      <section className="section-matching-experience" id="how-it-works">
        <div className="section-header-center">
          <span className="archive-kicker">
            <span className="lime-dot"></span>
            HOW IT WORKS
          </span>
          <h2 className="section-heading-large font-serif">
            Two faces. One suspiciously similar energy.
          </h2>
          <p className="section-lead-muted font-serif">
            A restrained three-step journey from authentic human expression to its comedic counterpart.
          </p>
        </div>

        <div className="steps-triad-grid">
          <div className="step-card gallery-card">
            <div className="step-num font-mono">01</div>
            <h3 className="step-title font-serif">Capture your countenance</h3>
            <p className="step-desc">
              Take a live photo via the viewfinder or upload an existing portrait. Zero biometrics are retained.
            </p>
            <div className="step-indicator font-mono">STEP 01 // INGESTION</div>
          </div>

          <div className="step-card gallery-card">
            <div className="step-num font-mono">02</div>
            <h3 className="step-title font-serif">Let expressions meet</h3>
            <p className="step-desc">
              Our neural matching heuristic analyzes facial emotion, smile confidence, and gaze vectors against 800+ indexed portraits.
            </p>
            <div className="step-indicator font-mono">STEP 02 // SYNTHESIS</div>
          </div>

          <div className="step-card gallery-card">
            <div className="step-num font-mono">03</div>
            <h3 className="step-title font-serif">Meet your other self</h3>
            <p className="step-desc">
              Inspect your transformation on a monumental interactive split-portrait slider, then download an exhibition-grade collectible print.
            </p>
            <div className="step-indicator font-mono">STEP 03 // EXHIBITION</div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION C: THE EXPRESSION ARCHIVE
         ======================================================== */}
      <section className="section-expression-archive" id="archive-section">
        <div className="section-header-split">
          <div>
            <span className="archive-kicker">
              <span className="lime-dot"></span>
              THE PERMANENT COLLECTION
            </span>
            <h2 className="section-heading-large font-serif">
              A gallery of expressions we all know.
            </h2>
          </div>
          <p className="section-sub-desc font-serif">
            “Somewhere in the meme universe, there is a portrait that tells the exact same story as your face.”
          </p>
        </div>

        <div className="archive-cards-mosaic">
          {archiveShowcase.map((item) => (
            <div
              key={item.num}
              className="mosaic-card gallery-card"
              role="button"
              tabIndex={0}
              onClick={() => {
                if (onSelectArchiveSpecimen) onSelectArchiveSpecimen(item.img, item.vibe, item);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (onSelectArchiveSpecimen) onSelectArchiveSpecimen(item.img, item.vibe, item);
                }
              }}
              title={`Inspect specimen: ${item.category}`}
            >
              <div className="mosaic-img-wrap">
                <img src={item.img} alt={`Archive specimen ${item.category}`} className="mosaic-img" loading="lazy" />
                <div className="mosaic-overlay-tag font-mono">{item.num}</div>
              </div>
              <div className="mosaic-info">
                <div className="mosaic-category font-serif">{item.category}</div>
                <p className="mosaic-caption font-serif">{item.caption}</p>
                <div className="mosaic-action-hint font-mono">
                  <span>TEST SPECIMEN</span>
                  <span className="arrow-lime">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SECTION E: THE STORY & ARCHITECTURE
         ======================================================== */}
      <section className="section-colophon gallery-card" id="about-section">
        <div className="colophon-inner">
          <div className="colophon-header">
            <div>
              <span className="archive-kicker">ABOUT THE PROJECT & MAKER</span>
              <h3 className="colophon-title font-serif">
                Crafted by Tanvir Kanoje
              </h3>
              <p className="colophon-lead">
                MEMECRAFT was created as an artful exploration in serverless computer vision, human micro-expressions, and internet cultural history.
              </p>
            </div>

            <div className="colophon-links font-mono">
              <a
                href="https://github.com/tanvir-kanoje/AWS-MEMECRAFT"
                target="_blank"
                rel="noreferrer"
                className="colophon-btn"
                aria-label="GitHub Repository (opens in new tab)"
              >
                <Code size={15} />
                <span>GITHUB REPO</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="technical-disclosure-wrap">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="technical-toggle-btn font-mono"
              aria-expanded={showTechnicalDetails}
            >
              <span>{showTechnicalDetails ? "HIDE TECHNICAL DISCLOSURE" : "INSPECT AWS ARCHITECTURE"}</span>
              <ChevronDown
                size={16}
                className={`toggle-chevron ${showTechnicalDetails ? "rotate-180" : ""}`}
              />
            </button>

            {showTechnicalDetails && (
              <div className="technical-content-panel font-mono">
                <div className="tech-item">
                  <span className="tech-label">STORAGE & LIFECYCLE:</span>
                  <span className="tech-desc">
                    Amazon S3 with private prefix containment. Uploads are strictly ephemeral with 24-hour lifecycle expiration.
                  </span>
                </div>
                <div className="tech-item">
                  <span className="tech-label">VISION & ANALYSIS:</span>
                  <span className="tech-desc">
                    Amazon Rekognition DetectFaces API extracts 30+ facial attributes and emotion confidence vectors.
                  </span>
                </div>
                <div className="tech-item">
                  <span className="tech-label">CATALOGUE MATCHING:</span>
                  <span className="tech-desc">
                    Precomputed metadata in S3 cached in warm Lambda memory, evaluated via weighted Euclidean emotion heuristics.
                  </span>
                </div>
                <div className="tech-item">
                  <span className="tech-label">PRIVACY GUARANTEE:</span>
                  <span className="tech-desc">
                    Zero persistent biometric retention. Images are never used for model training or identity profiling.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
