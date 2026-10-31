import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CameraBooth from "./components/CameraBooth";
import AnalyzingOverlay from "./components/AnalyzingOverlay";
import SplitFaceSlider from "./components/SplitFaceSlider";
import SettingsModal from "./components/SettingsModal";
import { matchSelfieImage, getApiBaseUrl } from "./api/client";
import { Sparkles, Cpu, Shield, Zap, AlertTriangle } from "lucide-react";
import heroSampleImg from "./assets/hero.png";
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
  const handleCapture = async (blobOrFile, previewUrl, forceVibe = null, presetMeta = null) => {
    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      let result;
      if (blobOrFile) {
        setUserPreview(previewUrl);
        result = await matchSelfieImage(blobOrFile);
      } else {
        // Preset archetype fallback
        setUserPreview(heroSampleImg);
        await new Promise((r) => setTimeout(r, 900));
        result = {
          status: "success",
          memeUrl: previewUrl,
          archiveId: presetMeta?.num || "ARCHIVE SPECIMEN",
          archetypeName: presetMeta?.name || "Meme Archetype",
          caption: presetMeta?.caption || `A classic expression of ${forceVibe || "HUMAN"} energy.`,
          score: 0.95,
          detectedEmotion: forceVibe || "HAPPY",
          emotionConfidence: 97.4,
          userTraits: {
            smiling: forceVibe === "HAPPY",
            mouthOpen: forceVibe === "SURPRISED",
            wearingGlasses: forceVibe === "CONFUSED",
          },
          explanation: `Simulated comparison against ${presetMeta?.name || "archetype"}. Connect AWS API Gateway for live Amazon Rekognition matches.`,
          isMock: true,
        };
      }

      if (result.status === "no_face") {
        setErrorMsg(
          result.message ||
            "No face detected in the image. Please position your face toward the camera under good lighting."
        );
        setIsAnalyzing(false);
        return;
      }

      if (result.detectedEmotion) {
        setCurrentVibe(result.detectedEmotion);
      }

      setMatchResult(result);
    } catch (err) {
      console.error("Match error:", err);
      setErrorMsg(
        err.message ||
          "Could not complete the match. Make sure your API Gateway endpoint is online or use Demo Mode."
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
      {/* Texture Background Grid Overlay */}
      <div className="craft-grid-overlay" aria-hidden="true"></div>

      {/* Navigation Header */}
      <Header
        currentVibe={currentVibe}
        apiBaseUrl={apiBaseUrl}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="main-content">
        {/* Centered Hero Banner (Only when not showing match) */}
        {!matchResult && !isAnalyzing && (
          <section className="hero-section">
            <div className="hero-pill-badge font-mono">
              <Sparkles size={14} /> ZERO-BIOMETRIC RETENTION • 100% EXPRESSION FUN
            </div>
            <h1 className="hero-headline font-display">
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
          <div className="error-banner craft-card" role="alert">
            <AlertTriangle className="error-icon" size={24} />
            <div className="error-text">
              <h4 className="font-display">Notice</h4>
              <p>{errorMsg}</p>
            </div>
            <button className="btn-craft btn-outline btn-sm font-mono" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}

        {/* Dynamic Studio Workspace (Centered Big Screen Viewfinder) */}
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

        {/* Studio Highlights Bar (Front Page Centered) */}
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
                <h4 className="font-display">Serverless S3 Ingress</h4>
                <p className="text-secondary text-sm">
                  Direct client-to-bucket pre-signed S3 streaming. Zero server storage bottleneck.
                </p>
              </div>
            </div>

            <div className="feature-item craft-card">
              <Shield size={26} className="feature-icon gradient-text" />
              <div>
                <h4 className="font-display">Ephemeral Privacy</h4>
                <p className="text-secondary text-sm">
                  Zero persistent biometric profiling. Uploads are strictly ephemeral and purged automatically.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Cloud Ingress Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newUrl) => setApiBaseUrlState(newUrl)}
      />
    </div>
  );
}
