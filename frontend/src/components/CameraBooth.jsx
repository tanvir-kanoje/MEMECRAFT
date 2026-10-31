import React, { useRef, useState, useEffect, useCallback } from "react";
import { Camera, Upload, RefreshCw, AlertCircle, AlertTriangle } from "lucide-react";
import { soundFX } from "../utils/audio";

// Curated Expression Archive Presets (MEMECRAFT Vector Archetypes)
const ARCHIVE_PRESETS = [
  {
    num: "NO. 014",
    name: "The Overthinker",
    caption: "Processing 47 hypothetical timelines at once.",
    vibe: "CONFUSED",
    url: "/memes/archetype_overthinker.svg",
  },
  {
    num: "NO. 029",
    name: "The Unbothered",
    caption: "Inner peace through catastrophic acceptance.",
    vibe: "CALM",
    url: "/memes/archetype_unbothered.svg",
  },
  {
    num: "NO. 052",
    name: "The Plot Twist",
    caption: "When reality writes a script no one asked for.",
    vibe: "SURPRISED",
    url: "/memes/archetype_plottwist.svg",
  },
  {
    num: "NO. 088",
    name: "The Dramatic Entrance",
    caption: "Arriving with unmatched narrative momentum.",
    vibe: "HAPPY",
    url: "/memes/archetype_dramatic.svg",
  },
];

export default function CameraBooth({ onCapture, isAnalyzing }) {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("idle"); // "idle" | "initializing" | "active" | "denied" | "error"
  const [facingMode, setFacingMode] = useState("user");
  const [flash, setFlash] = useState(false);
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
    setTimeout(() => setFlash(false), 220);

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

  // Upload photo from file system with client-side validation
  const handleFileChange = (e) => {
    setValidationError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setValidationError("Please select a standard JPEG, PNG, or WebP photograph.");
      return;
    }

    // Validate size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setValidationError("Photograph size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onCapture(file, previewUrl);
  };

  const handleSelectPreset = (preset) => {
    onCapture(null, preset.url, preset.vibe, preset);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  // Only consider camera genuinely active if stream is set and active
  const isCameraLive = streamActive && cameraStatus === "active";

  return (
    <div className="studio-container-viewport">
      {flash && <div className="gallery-flash" />}

      {/* Hidden File Input accessible anytime */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
        aria-label="Upload portrait image file"
      />

      <div className="studio-panel-body">
        {/* Header Metadata */}
        <div className="panel-header font-mono">
          <div className="panel-status">
            <span className={isCameraLive ? "status-dot-lime" : "status-dot-idle"}></span>
            <span>{isCameraLive ? "OPTICAL SENSOR ACTIVE" : "SENSOR STANDBY"}</span>
          </div>
          <span className="panel-id">REF. MMXXVI</span>
        </div>

        {/* Viewfinder Lens with Live Video Stream */}
        <div className="panel-viewfinder">
          {/* Video element is permanently mounted to preserve ref and avoid race conditions */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`studio-video ${isCameraLive ? "studio-video-active" : "studio-video-hidden"}`}
          />

          {isCameraLive && (
            <>
              {/* Delicate Archival Viewfinder Framing Ticks */}
              <div className="viewfinder-framing" aria-hidden="true">
                <div className="frame-tick frame-tl"></div>
                <div className="frame-tick frame-tr"></div>
                <div className="frame-tick frame-bl"></div>
                <div className="frame-tick frame-br"></div>
              </div>

              {/* Viewfinder Lens Tag */}
              <div className="viewfinder-lens-tag font-mono">
                <span>ALIGN COUNTENANCE</span>
              </div>
            </>
          )}

          {/* Standby / Initializing View when stream is not active */}
          {!isCameraLive && (
            <div className="viewfinder-standby">
              {cameraStatus === "initializing" && (
                <>
                  <div className="standby-spinner" aria-hidden="true"></div>
                  <span className="font-mono text-xs">CONNECTING OPTICAL SENSOR...</span>
                </>
              )}

              {cameraStatus === "denied" && (
                <div className="standby-content-box">
                  <AlertCircle size={24} color="var(--electric-lime)" />
                  <span className="font-mono text-xs text-warm-dim">
                    CAMERA ACCESS DENIED BY BROWSER
                  </span>
                  <p className="standby-explanation font-serif">
                    Allow camera permission in browser settings, or upload an existing photo.
                  </p>
                  <div className="standby-btn-group">
                    <button onClick={startCamera} className="btn-archive-outline text-xs">
                      Try Camera Again
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-lime text-xs"
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              )}

              {(cameraStatus === "error" || cameraStatus === "idle") && (
                <div className="standby-content-box">
                  <Camera size={24} color="var(--archive-grey)" />
                  <span className="font-mono text-xs text-warm-dim">
                    NO CAMERA SENSOR DETECTED
                  </span>
                  <p className="standby-explanation font-serif">
                    Upload an existing photograph to find your comedic archetype.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-lime text-xs mt-1"
                  >
                    Upload Photograph
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Validation Warning Alert */}
        {validationError && (
          <div className="studio-validation-alert font-mono" role="alert">
            <AlertTriangle size={14} color="var(--electric-lime)" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Primary Controls Row */}
        <div className="studio-actions-bar">
          {isCameraLive ? (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-studio-secondary font-mono"
                title="Upload photo from device"
                aria-label="Upload photo from device"
              >
                <Upload size={15} />
                <span>UPLOAD</span>
              </button>

              <button
                onClick={handleSnap}
                disabled={isAnalyzing}
                className="btn-lime btn-snap-shutter font-mono"
                title="Capture expression and find meme twin"
                aria-label="Capture photo and match meme twin"
              >
                <Camera size={18} />
                <span>SNAP & MATCH</span>
              </button>

              <button
                onClick={toggleFacingMode}
                className="btn-studio-secondary font-mono"
                title="Switch camera lens"
                aria-label="Switch camera lens"
              >
                <RefreshCw size={15} />
                <span>FLIP</span>
              </button>
            </>
          ) : (
            <div className="studio-launch-row">
              <button onClick={startCamera} className="btn-lime btn-launch-primary font-mono">
                <Camera size={16} />
                <span>ENABLE CAMERA</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-archive-outline btn-launch-secondary font-mono"
              >
                <Upload size={15} />
                <span>UPLOAD PHOTO</span>
              </button>
            </div>
          )}
        </div>

        {/* Curated Archive Specimens Bar */}
        <div className="archive-specimens-section">
          <div className="specimens-label-row font-mono">
            <span>OR TEST A CURATED ARCHIVE SPECIMEN</span>
          </div>
          <div className="specimens-row">
            {ARCHIVE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className="specimen-pill font-mono"
                disabled={isAnalyzing}
                title={`${preset.name}: ${preset.caption}`}
              >
                <span className="specimen-id">{preset.num}</span>
                <span className="specimen-title">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & Ephemeral Data Guarantee */}
        <div className="panel-privacy-reassurance font-mono">
          <span>PRIVATE UPLOAD · EPHEMERAL PROCESSING · PURGED IN 24H</span>
        </div>
      </div>
    </div>
  );
}
