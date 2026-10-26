import React, { useState } from "react";
import { X, Check, Server, Key, Info } from "lucide-react";
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
      <div className="modal-card craft-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Server size={22} className="gradient-text" />
            <h3 className="modal-title font-display">AWS API Gateway Endpoint</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="modal-description">
          Paste your AWS API Gateway HTTP Invoke URL generated in Phase 3. Leave blank to run in instant interactive Demo Studio mode.
        </p>

        <div className="input-group">
          <label className="input-label font-mono">API INVOKE URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://xxxxxx.execute-api.us-east-1.amazonaws.com"
            className="craft-input font-mono"
          />
        </div>

        <div className="modal-info-box">
          <Info size={16} />
          <span>
            Expected routes: <code>POST /uploads/presign</code> and <code>POST /matches</code>
          </span>
        </div>

        <div className="modal-actions">
          <button className="btn-craft btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-craft btn-primary" onClick={handleSave}>
            {saved ? <Check size={18} /> : null}
            {saved ? "Saved!" : "Save & Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}
