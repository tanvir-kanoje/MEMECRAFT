import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CameraBooth from "./components/CameraBooth";
import AnalyzingOverlay from "./components/AnalyzingOverlay";
import SplitFaceSlider from "./components/SplitFaceSlider";
import SettingsModal from "./components/SettingsModal";
import { matchSelfieImage, getApiBaseUrl } from "./api/client";
import { Sparkles, Shield, Cpu, Zap, AlertTriangle } from "lucide-react";
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

  // Handle photo capture & triggering match pipeline
  const handleCapture = async (blobOrFile, previewUrl, forceVibe = null) => {
    setUserPreview(previewUrl);
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      let result;
      if (blobOrFile) {
        result = await matchSelfieImage(blobOrFile);
      } else {
        // Preset mock fallback
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
  };

  return (
    <div className="studio-app-root">
      {/* Texture Background Grid */}
      <div className="craft-grid-overlay"></div>

      {/* Navigation Header */}
      <Header
        currentVibe={currentVibe}
        apiBaseUrl={apiBaseUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="main-content">
        {/* Hero Banner (Only when not showing match) */}
        {!matchResult && !isAnalyzing && (
          <section className="hero-section">
            <div className="hero-pill-badge font-mono">
              <Sparkles size={14} /> ZERO-BIOMETRIC RETENTION • 100% EXPRESSION FUN
            </div>
            <h1 className="hero-headline">
              Capture Your Vibe. <br />
              <span className="gradient-text">Meet Your Meme Twin.</span>
            </h1>
            <p className="hero-lead">
              Our serverless AWS engine analyzes your facial micro-expressions in real time, scans 800+ pre-indexed memes, and discovers your expressional counterpart in seconds.
            </p>
          </section>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="error-banner craft-card">
            <AlertTriangle className="error-icon" size={24} />
            <div className="error-text">
              <h4 className="font-display">Notice</h4>
              <p>{errorMsg}</p>
            </div>
            <button className="btn-craft btn-outline btn-sm" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}

        {/* Dynamic Studio Workspace */}
        <section className="studio-workspace">
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
        </section>

        {/* Studio Highlights Bar */}
        {!matchResult && !isAnalyzing && (
          <section className="features-strip">
            <div className="feature-item craft-card">
              <Cpu size={26} className="feature-icon gradient-text" />
              <div>
                <h4 className="font-display">Amazon Rekognition</h4>
                <p className="text-secondary text-sm">
                  Deep multi-attribute analysis detecting 8+ emotional nuances, head yaw, and smile intensity.
                </p>
              </div>
            </div>

            <div className="feature-item craft-card">
              <Zap size={26} className="feature-icon gradient-text" />
              <div>
                <h4 className="font-display">Serverless & Instant</h4>
                <p className="text-secondary text-sm">
                  Powered by AWS Lambda & S3 presigned direct pipelines capable of serving 500+ students concurrently.
                </p>
              </div>
            </div>

            <div className="feature-item craft-card">
              <Shield size={26} className="feature-icon gradient-text" />
              <div>
                <h4 className="font-display">24-Hour Privacy Purge</h4>
                <p className="text-secondary text-sm">
                  Your selfie is never used for identity tracking and is automatically purged via S3 lifecycle rules.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* College Project Footer */}
      <footer className="studio-footer font-mono">
        <div className="footer-inner">
          <p>✦ AWS IMAGE-TO-MEME MATCHING PLATFORM ✦</p>
          <p className="text-muted text-xs">
            Built for college events, presentations & hackathons • Fully compliant with AWS Well-Architected serverless best practices.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(url) => setApiBaseUrlState(url)}
      />
    </div>
  );
}
