import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroPicco from "./components/HeroPicco";
import ProjectsSection from "./components/ProjectsSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import FaqSection from "./components/FaqSection";
import FooterPicco from "./components/FooterPicco";
import CameraBooth from "./components/CameraBooth";
import AnalyzingOverlay from "./components/AnalyzingOverlay";
import SplitFaceSlider from "./components/SplitFaceSlider";
import SettingsModal from "./components/SettingsModal";
import { matchSelfieImage, getApiBaseUrl } from "./api/client";
import { Sparkles, AlertTriangle } from "lucide-react";
import "./App.css";

export default function App() {
  const [currentVibe, setCurrentVibe] = useState(null);
  const [userPreview, setUserPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiBaseUrl, setApiBaseUrlState] = useState(getApiBaseUrl());

  // Dynamically update document theme attribute whenever vibe changes
  useEffect(() => {
    if (currentVibe) {
      document.documentElement.setAttribute("data-vibe", currentVibe);
    } else {
      document.documentElement.removeAttribute("data-vibe");
    }
  }, [currentVibe]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle photo capture & triggering match pipeline
  const handleCapture = async (blobOrFile, previewUrl, forceVibe = null) => {
    setUserPreview(previewUrl);
    setErrorMsg(null);
    setIsAnalyzing(true);

    // Scroll to the studio stage to keep user focused
    setTimeout(() => {
      scrollTo("studio");
    }, 100);

    try {
      let result;
      if (blobOrFile) {
        result = await matchSelfieImage(blobOrFile);
      } else {
        // Preset mock fallback for testing
        await new Promise((r) => setTimeout(r, 1200));
        result = {
          status: "success",
          memeUrl: previewUrl,
          score: 0.94,
          detectedEmotion: forceVibe || "HAPPY",
          emotionConfidence: 98.2,
          userTraits: { smiling: true, mouthOpen: false, wearingGlasses: false },
          explanation: `High-fidelity match on ${forceVibe || "HAPPY"} expression!`,
        };
      }

      if (result.status === "no_face") {
        setErrorMsg(result.message || "No face detected. Please ensure bright lighting and look directly at the camera!");
        setIsAnalyzing(false);
        return;
      }

      setMatchResult(result);
      if (result.detectedEmotion) {
        setCurrentVibe(result.detectedEmotion);
      }
    } catch (err) {
      console.error("Match error:", err);
      setErrorMsg(
        err.message || "Could not complete the match. Make sure your API Gateway endpoint is online."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setMatchResult(null);
    setUserPreview(null);
    setCurrentVibe(null);
    setErrorMsg(null);
    scrollTo("studio");
  };

  return (
    <div className="studio-app-root">
      {/* Texture Background Grid */}
      <div className="craft-grid-overlay"></div>

      {/* Picco Floating Pill Navbar */}
      <Navbar
        currentVibe={currentVibe}
        apiBaseUrl={apiBaseUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="main-content">
        {/* Picco Editorial Hero */}
        <HeroPicco
          onScrollToStudio={() => scrollTo("studio")}
          onScrollToProjects={() => scrollTo("projects")}
        />

        {/* Live Studio Showcase Stage (Flagship Experience) */}
        <section id="studio" className="picco-studio-section">
          <div className="picco-studio-header">
            <div className="picco-section-tag">
              <span>✦ FLAGSHIP PROJECT • LIVE AWS WORKSPACE</span>
            </div>
            <h2 className="picco-section-title">
              MEMECRAFT <span className="picco-serif-highlight">// The Live Studio</span>
            </h2>
            <p className="picco-section-subtitle">
              Look directly into the camera or upload a portrait. In under 400ms, our AWS Rekognition engine decomposes your facial micro-expressions into an emotional vector and discovers your meme counterpart.
            </p>
          </div>

          <div className="picco-studio-container">
            {/* Error Notice */}
            {errorMsg && (
              <div className="error-banner craft-card" style={{ marginBottom: "2rem" }}>
                <AlertTriangle className="error-icon" size={24} />
                <div className="error-text">
                  <h4 className="font-display">Detection Notice</h4>
                  <p>{errorMsg}</p>
                </div>
                <button className="btn-craft btn-outline btn-sm" onClick={handleReset}>
                  Try Again
                </button>
              </div>
            )}

            {/* Dynamic Studio Workspace */}
            <div className="studio-workspace">
              {isAnalyzing ? (
                <AnalyzingOverlay userPreview={userPreview} />
              ) : matchResult ? (
                <SplitFaceSlider
                  matchResult={matchResult}
                  userPreview={userPreview}
                  onReset={handleReset}
                />
              ) : (
                <CameraBooth onCapture={handleCapture} isAnalyzing={isAnalyzing} />
              )}
            </div>
          </div>
        </section>

        {/* Picco Selected Projects Section */}
        <ProjectsSection onJumpToStudio={() => scrollTo("studio")} />

        {/* Architectural Disciplines / Capabilities */}
        <ServicesSection />

        {/* The Person Behind the Work */}
        <AboutSection />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Picco Footer & Contact CTA */}
      <FooterPicco />

      {/* Settings Modal (AWS API Configuration) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(url) => setApiBaseUrlState(url)}
      />
    </div>
  );
}
