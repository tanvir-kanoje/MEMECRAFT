import React from "react";
import { Terminal, Award, Compass, Mic, Users, Trophy } from "lucide-react";

export default function AboutSection() {
  const talks = [
    { event: "Orange Beak Studio", location: "Berlin", year: "2023" },
    { event: "Design & Cloud Conference", location: "Amsterdam", year: "2022" },
    { event: "Nordic Vision Forum", location: "Copenhagen", year: "2022" },
    { event: "Creative Systems Summit", location: "Paris", year: "2021" },
  ];

  const awards = [
    { title: "European Illustration Awards", status: "Winner", year: "2025" },
    { title: "ADC Europe", status: "Merit", year: "2024" },
    { title: "Creative Communication Award", status: "Honoree", year: "2023" },
    { title: "World Illustration Awards", status: "Shortlist", year: "2022" },
  ];

  const clients = [
    "Dropbox", "Figma", "Adobe", "Monocle Magazine", "The Guardian",
    "Bloomberg Businessweek", "Stripe Press", "Penguin Books", "Airbnb",
    "Mailchimp", "Wired Magazine", "Creative Review"
  ];

  return (
    <section id="about" className="picco-section">
      <div className="picco-about-card">
        <div className="picco-about-grid">
          {/* Left Column: Personal Story */}
          <div className="picco-about-content">
            <div className="picco-section-tag">
              <span>04 // ABOUT</span>
            </div>
            <h2 className="picco-about-title">
              The person behind <span className="picco-serif-highlight">the work</span>
            </h2>

            <div className="picco-about-paragraphs">
              <p>
                An illustrator, designer, and cloud systems architect. The work explores playful shapes, bold color, and narrative composition, paired with high-performance event-driven cloud engineering.
              </p>
              <p>
                From designing expressive visual systems for international publications to architecting serverless computer vision platforms capable of handling 500+ concurrent users with sub-400ms latency, the focus is always on clarity, personality, and human delight.
              </p>
              <p>
                Every project balances craftsmanship with technical rigor — ensuring designs scale seamlessly across physical prints, interactive viewports, and distributed cloud backends.
              </p>
            </div>

            {/* Handwritten Quote */}
            <div className="picco-handwritten-note">
              <p>
                "The system feels original, thoughtful, and built to turn complex ideas into something simple and beautiful."
              </p>
              <span className="picco-signature">— Martin Hyden / Tanvir Kanoje</span>
            </div>

            {/* Selected Clients Strip */}
            <div className="picco-clients-box">
              <h4 className="picco-sub-heading">
                <Users size={16} className="inline-icon" /> Selected Clients
              </h4>
              <p className="picco-clients-text">
                {clients.join(" • ")}
              </p>
            </div>
          </div>

          {/* Right Column: Talks & Awards */}
          <div className="picco-about-sidebar">
            {/* Selected Talks */}
            <div className="picco-sidebar-card">
              <h4 className="picco-sidebar-heading">
                <Mic size={16} className="inline-icon" /> Selected Talks
              </h4>
              <div className="picco-talks-list">
                {talks.map((t, idx) => (
                  <div key={idx} className="picco-talk-row">
                    <span className="picco-talk-event">{t.event}</span>
                    <span className="picco-talk-loc">{t.location}</span>
                    <span className="picco-talk-year font-mono">{t.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards & Recognition */}
            <div className="picco-sidebar-card">
              <h4 className="picco-sidebar-heading">
                <Trophy size={16} className="inline-icon" /> Awards & Recognition
              </h4>
              <div className="picco-awards-list">
                {awards.map((a, idx) => (
                  <div key={idx} className="picco-award-row">
                    <span className="picco-award-title">{a.title}</span>
                    <div className="picco-award-badge-wrap">
                      <span className="picco-award-badge">{a.status}</span>
                      <span className="picco-award-year font-mono">{a.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Disciplines */}
            <div className="picco-sidebar-card">
              <h4 className="picco-sidebar-heading">
                <Compass size={16} className="inline-icon" /> Disciplines
              </h4>
              <div className="picco-tool-tags">
                <span className="picco-tool-pill">Brand Identity</span>
                <span className="picco-tool-pill">Editorial Illustration</span>
                <span className="picco-tool-pill">Packaging</span>
                <span className="picco-tool-pill">AWS Cloud AI</span>
                <span className="picco-tool-pill">React 19 & Canvas</span>
                <span className="picco-tool-pill">Vector Systems</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
