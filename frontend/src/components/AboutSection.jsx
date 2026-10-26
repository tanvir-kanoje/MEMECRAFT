import React from "react";
import { Terminal, Award, Compass, Heart } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="picco-section">
      <div className="picco-about-card">
        <div className="picco-about-grid">
          {/* Left Column: Personal Story */}
          <div className="picco-about-content">
            <div className="picco-section-tag">
              <span>03 // THE BUILDER</span>
            </div>
            <h2 className="picco-about-title">
              The person behind <span className="picco-serif-highlight">the work</span>
            </h2>

            <div className="picco-about-paragraphs">
              <p>
                I am <strong>Tanvir Kanoje</strong>, a cloud solutions and full-stack systems engineer passionate about creating architectures that bridge advanced cloud artificial intelligence with intuitive, high-energy user experiences.
              </p>
              <p>
                My work centers on solving real concurrency bottlenecks—designing direct S3 presigned ingestion pipelines so hundreds of concurrent users can upload media simultaneously without stressing Lambda memory, implementing in-memory caches that drop computer vision latency below 400ms, and enforcing strict data governance through zero biometric retention.
              </p>
              <p>
                Whether building event-driven cloud microservices on AWS or engineering 60fps editorial interfaces with React, I focus on systems that are performant, cost-efficient, and deeply memorable.
              </p>
            </div>

            {/* Handwritten Quote */}
            <div className="picco-handwritten-note">
              <p>
                "Great architecture isn't just about handling traffic—it's about making complex cloud intelligence feel effortless, instant, and joyful."
              </p>
              <span className="picco-signature">— Tanvir Kanoje</span>
            </div>
          </div>

          {/* Right Column: Key Details & Tech Stack */}
          <div className="picco-about-sidebar">
            <div className="picco-sidebar-card">
              <h4 className="picco-sidebar-heading">
                <Terminal size={16} className="inline-icon" /> Core Toolkit
              </h4>
              <div className="picco-tool-tags">
                <span className="picco-tool-pill">AWS Lambda</span>
                <span className="picco-tool-pill">Amazon Rekognition</span>
                <span className="picco-tool-pill">Amazon S3</span>
                <span className="picco-tool-pill">Amazon CloudFront (OAC)</span>
                <span className="picco-tool-pill">Amazon API Gateway</span>
                <span className="picco-tool-pill">Python 3.12</span>
                <span className="picco-tool-pill">React 19</span>
                <span className="picco-tool-pill">Vite</span>
                <span className="picco-tool-pill">Web Audio API</span>
                <span className="picco-tool-pill">HTML5 Canvas</span>
              </div>
            </div>

            <div className="picco-sidebar-card">
              <h4 className="picco-sidebar-heading">
                <Compass size={16} className="inline-icon" /> Engineering Philosophy
              </h4>
              <ul className="picco-philosophy-list">
                <li>
                  <strong>Serverless by Default:</strong> Pay only for real executions; zero idle bills.
                </li>
                <li>
                  <strong>Direct Storage Ingestion:</strong> Keep heavy binaries out of compute layers.
                </li>
                <li>
                  <strong>Privacy First:</strong> Automate data purges; minimize stored personal identifiers.
                </li>
                <li>
                  <strong>Unobstructed Design:</strong> Never sacrifice content readability for flashy UI decoration.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
