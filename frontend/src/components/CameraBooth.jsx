import React, { useRef, useState, useEffect } from "react";
import { Camera, Upload, RefreshCw, Sparkles, AlertCircle, Image as ImageIcon } from "lucide-react";
import { soundFX } from "../utils/audio";

// Sample expressive demo faces for instant evaluation
const DEMO_PRESETS = [
  {
    name: "Joyful Smile",
    emoji: "😄",
    vibe: "HAPPY",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Shocked / Wow",
    emoji: "😲",
    vibe: "SURPRISED",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Cool & Calm",
    emoji: "😎",
    vibe: "CALM",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Puzzled",
    emoji: "🤨",
    vibe: "CONFUSED",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
  },
  {
    name: "Intense / Fierce",
    emoji: "😤",
    vibe: "ANGRY",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
  },
];

export default function CameraBooth({ onCapture, isAnalyzing }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [flash, setFlash] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Initialize camera stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
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
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable:", err);
      setCameraError(
        "Camera stream unavailable. You can upload a photo or use the demo faces below!"
      );
      setStreamActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Capture snapshot from webcam
  const handleSnap = () => {
    if (!videoRef.current) return;
    soundFX.playShutter();
    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const previewUrl = canvas.toDataURL("image/jpeg");
        onCapture(blob, previewUrl);
      },
      "image/jpeg",
      0.92
    );
  };

  // Flip camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Handle manual file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG or PNG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onCapture(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Select demo preset
  const handleSelectDemo = async (preset) => {
    try {
      const response = await fetch(preset.url);
      const blob = await response.blob();
      onCapture(blob, preset.url, preset.vibe);
    } catch {
      onCapture(null, preset.url, preset.vibe);
    }
  };

  return (
    <div className="camera-booth-container">
      {flash && <div className="flash-active"></div>}

      {/* Main Viewfinder Card */}
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
          {/* Live Video Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`viewfinder-video ${streamActive ? "active" : "hidden"}`}
          />

          {/* Scanner laser overlay when stream is active */}
          {streamActive && !isAnalyzing && (
            <div className="reticle-box">
              <div className="reticle-corner corner-tl"></div>
              <div className="reticle-corner corner-tr"></div>
              <div className="reticle-corner corner-bl"></div>
              <div className="reticle-corner corner-br"></div>
              <div className="reticle-label font-mono">ALIGN FACE HERE</div>
            </div>
          )}

          {/* Fallback if camera stream is inactive */}
          {!streamActive && (
            <div className="camera-fallback-screen">
              <div className="fallback-icon-wrap">
                <Camera size={44} className="gradient-text" />
              </div>
              <h4 className="font-display">Webcam Standby</h4>
              <p className="text-secondary text-sm">
                Allow camera permissions or drag & drop a selfie right here.
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
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            capture="user"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Viewfinder Bottom Controls */}
        <div className="viewfinder-controls">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-ctrl-secondary"
            title="Upload photo from disk"
          >
            <Upload size={20} />
          </button>

          {/* Giant Shutter Button */}
          <button
            onClick={streamActive ? handleSnap : () => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="shutter-trigger-btn"
            title="Capture Snapshot"
          >
            <div className="shutter-inner">
              <Camera size={26} />
            </div>
          </button>

          <button
            onClick={toggleFacingMode}
            className="btn-ctrl-secondary"
            title="Switch front/rear camera"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Demo Expressive Presets */}
      <div className="demo-strip-card craft-card">
        <div className="demo-strip-header">
          <div className="badge-pill">
            <Sparkles size={14} /> INSTANT TEST
          </div>
          <span className="demo-strip-title">Try Demo Facial Expressions:</span>
        </div>
        <div className="demo-pills-row">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectDemo(preset)}
              className="demo-pill-btn"
              disabled={isAnalyzing}
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
