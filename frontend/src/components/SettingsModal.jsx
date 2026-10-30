import React, { useState } from "react";
import { X, Check, Server, Info } from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl } from "../api/client";

export default function SettingsModal({ isOpen, onClose, onSave }) {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiBaseUrl(url);
    setSaved(true);
    if (onSave) onSave(url);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card gallery-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Server size={20} color="var(--electric-lime)" />
            <h3 className="modal-title font-serif">Cloud Ingress Configuration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="modal-description">
          Paste your AWS API Gateway HTTP Invoke URL. Leave blank to run in instant interactive local demo mode.
        </p>

        <div className="input-group">
          <label className="input-label font-mono">API GATEWAY ENDPOINT</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://xxxxxx.execute-api.us-east-1.amazonaws.com"
            className="craft-input font-mono"
          />
        </div>

        <div className="modal-info-box font-mono">
          <Info size={14} color="var(--electric-lime)" />
          <span>
            Expected routes: <code>POST /uploads/presign</code> and <code>POST /matches</code>
          </span>
        </div>

        <div className="modal-actions">
          <button className="btn-archive-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-lime" onClick={handleSave}>
            {saved ? <Check size={16} /> : null}
            {saved ? "Saved" : "Save & Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}
