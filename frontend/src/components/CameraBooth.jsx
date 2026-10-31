import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, Upload, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { soundFX } from "../utils/audio";

// Curated Expression Archetypes (MEMECRAFT Vector Archetypes)
const ARCHIVE_PRESETS = [
  {
    name: "The Overthinker",
    emoji: "🤔",
    vibe: "CONFUSED",
    num: "NO. 014",
    caption: "Processing 47 hypothetical timelines at once.",
    url: "/memes/archetype_overthinker.svg",
  },
  {
    name: "The Unbothered",
    emoji: "☕",
    vibe: "CALM",
    num: "NO. 029",
    caption: "Inner peace through catastrophic acceptance.",
    url: "/memes/archetype_unbothered.svg",
  },
  {
    name: "The Plot Twist",
    emoji: "😲",
    vibe: "SURPRISED",
    num: "NO. 052",
    caption: "When reality writes a script no one asked for.",
    url: "/memes/archetype_plottwist.svg",
  },
  {
    name: "The Dramatic Entrance",
    emoji: "😏",
    vibe: "HAPPY",
    num: "NO. 088",
    caption: "Arriving with unmatched narrative momentum.",
    url: "/memes/archetype_dramatic.svg",
  },
];

export default function CameraBooth({ onCapture, isAnalyzing }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("initializing"); // "initializing" | "active" | "denied" | "error"
  const [facingMode, setFacingMode] = useState("user");
  const [flash, setFlash] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Initialize camera stream
  const startCamera = useCallback(async () => {
    setCameraStatus("initializing");
    setValidationError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn("Video auto-play interrupted:", playErr);
        }
        setStreamActive(true);
        setCameraStatus("active");
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setStreamActive(false);
      setCameraStatus(err.name === "NotAllowedError" ? "denied" : "error");
    }
  }, [facingMode]);

  // Auto-start camera on mount and when facingMode changes
  useEffect(() => {
    let streamInstance = null;
    let isCancelled = false;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamInstance = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn("Video play interrupted:", playErr);
          }
          setStreamActive(true);
          setCameraStatus("active");
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Camera access denied or unavailable:", err);
          setStreamActive(false);
          setCameraStatus(err.name === "NotAllowedError" ? "denied" : "error");
        }
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (streamInstance) {
        streamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Capture snapshot from webcam
  const handleSnap = () => {
    if (!videoRef.current || !streamActive) return;
    soundFX.playShutter();
    setFlash(true);
    setTimeout(() => setFlash(false), 260);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");

    // Mirror image horizontally to match live webcam display
    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          onCapture(blob, previewUrl);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  // Upload photo from file system
  const handleFileChange = (e) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Please select a standard image photograph (JPG, PNG, WebP).");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onCapture(file, previewUrl);
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setValidationError("Please drop an image file (JPG, PNG, WebP).");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onCapture(file, previewUrl);
    }
  };

  const handleSelectPreset = (preset) => {
    onCapture(null, preset.url, preset.vibe, preset);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const isCameraLive = streamActive && cameraStatus === "active";

  return (
    <div className="camera-booth-container">
      {flash && <div className="flash-active"></div>}

      {/* Main Studio Viewfinder Card */}
      <div
        className={`craft-card viewfinder-card ${dragOver ? "drag-active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="viewfinder-lens">
          {/* Live Video Feed - permanently mounted */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`viewfinder-video ${isCameraLive ? "active" : "hidden"}`}
          />

          {/* Biometric Reticle Overlay (Exact match to CloudFront studio UI) */}
          {isCameraLive && !isAnalyzing && (
            <div className="reticle-box">
              <div className="reticle-corner corner-tl"></div>
              <div className="reticle-corner corner-tr"></div>
              <div className="reticle-corner corner-bl"></div>
              <div className="reticle-corner corner-br"></div>
              <div className="reticle-label font-mono">ALIGN FACE HERE</div>
            </div>
          )}

          {/* Standby / Permission Fallback Screen */}
          {!isCameraLive && (
            <div className="camera-fallback-screen">
              {cameraStatus === "initializing" && (
                <>
                  <div className="fallback-spinner" aria-hidden="true"></div>
                  <h4 className="font-display">Connecting Optical Sensor...</h4>
                  <p className="text-secondary text-sm">
                    Initializing your camera in the MEMECRAFT studio.
                  </p>
                </>
              )}

              {cameraStatus === "denied" && (
                <>
                  <div className="fallback-icon-wrap">
                    <AlertCircle size={38} color="#2563EB" />
                  </div>
                  <h4 className="font-display">Camera Permission Required</h4>
                  <p className="text-secondary text-sm">
                    Allow camera access in your browser or upload a portrait to match.
                  </p>
                  <div className="fallback-actions">
                    <button className="btn-craft btn-outline" onClick={startCamera}>
                      <RefreshCw size={16} /> Try Camera Again
                    </button>
                    <button
                      className="btn-craft btn-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} /> Upload Photo
                    </button>
                  </div>
                </>
              )}

              {cameraStatus === "error" && (
                <>
                  <div className="fallback-icon-wrap">
                    <Camera size={38} className="gradient-text" />
                  </div>
                  <h4 className="font-display">Webcam Standby</h4>
                  <p className="text-secondary text-sm">
                    No active optical sensor detected. Upload a photo or select an archetype below.
                  </p>
                  <div className="fallback-actions">
                    <button
                      className="btn-craft btn-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} /> Upload Photo
                    </button>
                    <button className="btn-craft btn-outline" onClick={startCamera}>
                      <RefreshCw size={16} /> Retry Camera
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            style={{ display: "none" }}
            aria-label="Upload photo file"
          />
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="studio-validation-alert font-mono" role="alert">
            <AlertCircle size={15} color="#2563EB" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Viewfinder Bottom Controls (Exact 3-Button Layout from Screenshot) */}
        <div className="viewfinder-controls">
          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-ctrl-secondary"
            title="Upload photo from disk"
            aria-label="Upload photo from disk"
          >
            <Upload size={20} />
          </button>

          {/* Giant Shutter Button */}
          <button
            onClick={isCameraLive ? handleSnap : () => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="shutter-trigger-btn"
            title={isCameraLive ? "Capture Snapshot" : "Upload Photo"}
            aria-label="Capture photo or upload"
          >
            <div className="shutter-inner">
              <Camera size={26} />
            </div>
          </button>

          {/* Camera Flip Button */}
          <button
            onClick={toggleFacingMode}
            className="btn-ctrl-secondary"
            title="Switch front/rear camera"
            aria-label="Switch front or rear camera"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Demo Expressive Presets Strip */}
      <div className="demo-strip-card craft-card">
        <div className="demo-strip-header">
          <div className="badge-pill font-mono">
            <Sparkles size={14} /> INSTANT TEST
          </div>
          <span className="demo-strip-title font-display">
            Or test curated meme archetypes without webcam:
          </span>
        </div>
        <div className="demo-pills-row font-mono">
          {ARCHIVE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(preset)}
              className="demo-pill-btn"
              disabled={isAnalyzing}
              title={`${preset.name}: ${preset.caption}`}
            >
              <span className="demo-emoji">{preset.emoji}</span>
              <span className="demo-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
