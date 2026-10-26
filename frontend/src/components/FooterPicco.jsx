import React from "react";
import { Mail, ExternalLink, ArrowUp, Sparkles, Heart } from "lucide-react";

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

export default function FooterPicco() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="picco-footer">
      <div className="picco-footer-cta-card">
        <div className="picco-cta-badge">
          <Sparkles size={14} className="inline-icon" /> GET IN TOUCH
        </div>

        <h2 className="picco-footer-cta-title">
          Have a project in mind? <br />
          <span className="picco-serif-highlight">Let’s bring it to life.</span>
        </h2>

        <p className="picco-footer-cta-subtitle">
          Open for cloud architecture consulting, applied AI systems engineering, and innovative full-stack collaborations.
        </p>

        {/* Big Contact Pill */}
        <div className="picco-cta-email-wrap">
          <a
            href="mailto:tanvirkanoje@gmail.com"
            className="picco-cta-email-btn"
            title="Send an email to Tanvir Kanoje"
          >
            <Mail size={20} />
            <span>tanvirkanoje@gmail.com</span>
          </a>
        </div>

        {/* External Links */}
        <div className="picco-cta-links">
          <a
            href="https://github.com/tanvir-kanoje/AWS-Memer"
            target="_blank"
            rel="noreferrer"
            className="picco-cta-link-pill"
          >
            <GithubIcon size={16} />
            <span>GitHub Repository</span>
            <ExternalLink size={13} />
          </a>

          <a
            href="https://d2tuc83mjm02el.cloudfront.net"
            target="_blank"
            rel="noreferrer"
            className="picco-cta-link-pill"
          >
            <Sparkles size={16} />
            <span>Live CloudFront Demo</span>
            <ExternalLink size={13} />
          </a>

          <a
            href="https://linkedin.com/in/tanvir-kanoje"
            target="_blank"
            rel="noreferrer"
            className="picco-cta-link-pill"
          >
            <span>LinkedIn</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Bottom Legal / Credits Bar */}
      <div className="picco-footer-bottom">
        <div className="picco-footer-brand">
          <span className="picco-brand-bold">Tanvir Kanoje</span>
          <span className="picco-brand-sep">•</span>
          <span className="picco-brand-desc">Cloud Solutions & Applied AI Architect</span>
        </div>

        <div className="picco-footer-copy">
          <p>
            Copyrights © 2026. Designed with inspiration from Picco & engineered on AWS Serverless.
          </p>
        </div>

        <button onClick={scrollToTop} className="picco-scroll-top-btn" title="Back to top">
          <ArrowUp size={16} />
          <span>Top</span>
        </button>
      </div>
    </footer>
  );
}
