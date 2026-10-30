import React, { useState } from "react";
import Header from "./components/Header";
import CameraBooth from "./components/CameraBooth";
import AnalyzingOverlay from "./components/AnalyzingOverlay";
import SplitFaceSlider from "./components/SplitFaceSlider";
import SettingsModal from "./components/SettingsModal";
import AboutSection from "./components/AboutSection";
import { matchSelfieImage } from "./api/client";
import { Camera, ArrowDown, AlertTriangle } from "lucide-react";
import heroSampleImg from "./assets/hero.png";
import "./App.css";

export default function App() {
  const [userPreview, setUserPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const scrollToStudio = () => {
    const el = document.getElementById("portrait-studio");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Handle photo capture & triggering match pipeline
  const handleCapture = async (blobOrFile, previewUrl, forceVibe = null, presetMeta = null) => {
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      let result;
      if (blobOrFile) {
        setUserPreview(previewUrl);
        result = await matchSelfieImage(blobOrFile);
      } else {
        // Preset specimen demonstration
        setUserPreview(heroSampleImg);
        await new Promise((r) => setTimeout(r, 900));
        result = {
          status: "success",
          memeUrl: previewUrl,
          archiveId: presetMeta?.num || "ARCHIVE SPECIMEN",
          archetypeName: presetMeta?.name || presetMeta?.category || "Archetype Specimen",
          caption: presetMeta?.caption || `A classic expression of ${forceVibe || "HUMAN"} energy.`,
          score: 0.94,
          detectedEmotion: forceVibe || "HAPPY",
          emotionConfidence: 96.5,
          userTraits: {
            smiling: forceVibe === "HAPPY",
            mouthOpen: forceVibe === "SURPRISED",
            wearingGlasses: forceVibe === "CONFUSED",
          },
          explanation: `Simulated comparison against ${presetMeta?.num || "archetype"}. Connect AWS API Gateway for live Amazon Rekognition matches.`,
          isMock: true,
        };
      }

      // Handle "No Face Detected" API state gracefully
      if (result.status === "no_face") {
        setErrorMsg(
          result.message ||
            "No human face was detected in this photograph. Please position your face toward the camera under even lighting and try again."
        );
        setIsAnalyzing(false);
        return;
      }

      setMatchResult(result);
    } catch (err) {
      console.error("Match error:", err);
      setErrorMsg(
        err.message ||
          "Could not complete the facial match. Please verify your network connection or API Gateway configuration in Settings."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setUserPreview(null);
    setErrorMsg(null);
    scrollToStudio();
  };

  return (
    <div className="editorial-app-root">
      {/* Subtle Archival Texture */}
      <div className="gallery-grain-overlay" aria-hidden="true"></div>

      {/* Navigation Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToStudio={scrollToStudio}
      />

      <main className="main-gallery-flow">
        {/* ========================================================
            FIRST VIEWPORT: ASYMMETRIC ART-DIRECTED STAGE
           ======================================================== */}
        {!matchResult && !isAnalyzing && (
          <section className="first-viewport-stage">
            {/* Left Column: Literary Narrative & Actions */}
            <div className="hero-column-narrative">
              <div className="archive-kicker font-mono">
                <span className="lime-dot" aria-hidden="true"></span>
                AN EXPERIMENT IN SELF-PORTRAITURE
              </div>

              <h1 className="hero-monumental-headline font-serif">
                Your face has a second life.
              </h1>

              <p className="hero-subheadline font-serif">
                Meet the meme that captures your expression a little too well.
              </p>

              <div className="hero-actions-container">
                <div className="hero-btn-row">
                  <button
                    onClick={scrollToStudio}
                    className="btn-lime hero-main-cta font-mono"
                    aria-label="Find my meme twin - scroll to camera booth"
                  >
                    <Camera size={18} />
                    <span>FIND MY MEME TWIN</span>
                  </button>
                </div>

                <p className="hero-reassurance-note font-mono">
                  Your selfie. An unexpected counterpart. Private upload · Ephemeral processing.
                </p>
              </div>

              <div className="hero-footer-status font-mono">
                <div className="status-item">
                  <span className="status-label">PERMANENT ARCHIVE</span>
                  <span className="status-val text-lime">800+ INDEXED PORTRAITS</span>
                </div>
                <a href="#how-it-works" className="scroll-indicator font-mono" aria-label="Scroll down to discover how it works">
                  <span>SCROLL TO DISCOVER</span>
                  <ArrowDown size={14} className="arrow-pulse" />
                </a>
              </div>
            </div>

            {/* Right Column: Immediate Interactive Product Studio */}
            <div className="hero-column-studio" id="portrait-studio">
              <CameraBooth onCapture={handleCapture} isAnalyzing={isAnalyzing} />
            </div>
          </section>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="error-banner font-mono" role="alert">
            <AlertTriangle className="error-icon" size={20} color="var(--electric-lime)" />
            <div className="error-text">
              <h4 className="font-serif">Notice from the Archive</h4>
              <p>{errorMsg}</p>
            </div>
            <button className="btn-archive-outline" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}

        {/* Analyzing Scan Overlay OR Exhibition Match Result */}
        {(isAnalyzing || matchResult) && (
          <section className="active-result-workspace">
            {isAnalyzing ? (
              <AnalyzingOverlay userPreview={userPreview} />
            ) : (
              <SplitFaceSlider
                matchResult={matchResult}
                userPreview={userPreview}
                onReset={handleReset}
              />
            )}
          </section>
        )}

        {/* Narrative & Educational Deep Dive */}
        {!matchResult && !isAnalyzing && (
          <AboutSection onSelectArchiveSpecimen={(url, vibe, meta) => handleCapture(null, url, vibe, meta)} />
        )}
      </main>

      {/* Cloud Ingress Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => {}}
      />
    </div>
  );
}
