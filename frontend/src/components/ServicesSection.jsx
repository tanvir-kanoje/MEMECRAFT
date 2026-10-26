import React from "react";
import { Cloud, Cpu, Layout, ShieldCheck, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const capabilities = [
    {
      icon: Cloud,
      title: "Cloud & Serverless Systems",
      colorClass: "service-blue",
      number: "01",
      description:
        "Architecting resilient event-driven systems that eliminate idle costs and scale horizontally from zero to thousands of concurrent transactions.",
      bullets: [
        "Direct-to-S3 presigned ingestion pipelines",
        "Sub-second Lambda microservice orchestration",
        "CloudFront global edge distribution with OAC",
        "Cost-optimized zero-idle serverless topologies",
      ],
    },
    {
      icon: Cpu,
      title: "Computer Vision & Applied AI",
      colorClass: "service-orange",
      number: "02",
      description:
        "Translating multi-modal deep learning models and Amazon Rekognition neural APIs into production-ready, low-latency business logic.",
      bullets: [
        "Facial landmark geometry & pose telemetry",
        "Expression affinity distance mathematical modeling",
        "Precomputed batch catalog indexing pipelines",
        "Warm in-memory Lambda caching (sub-400ms)",
      ],
    },
    {
      icon: Layout,
      title: "Full-Stack Web & Creative UI",
      colorClass: "service-green",
      number: "03",
      description:
        "Crafting responsive web interfaces that combine strict typographic rigor, buttery 60fps micro-interactions, and instant feedback.",
      bullets: [
        "React 19 + modern Vite development workflows",
        "Non-overlapping CSS Grid viewport systems",
        "Client-side HTML5 Canvas compositing & export",
        "Web Audio API hardware-free audio synthesizers",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Privacy & Governance",
      colorClass: "service-yellow",
      number: "04",
      description:
        "Engineering zero-trust cloud architectures with data minimization, immutable auditing, and automated compliance by design.",
      bullets: [
        "Zero biometric data retention compliance",
        "24-hour S3 Lifecycle automated purge rules",
        "IAM least-privilege cryptographic roles",
        "Short-lived cryptographic capability tokens",
      ],
    },
  ];

  return (
    <section id="services" className="picco-section">
      <div className="picco-section-header">
        <div className="picco-section-tag">
          <span>02 // CAPABILITIES</span>
        </div>
        <h2 className="picco-section-title">
          Architectural <span className="picco-serif-highlight">disciplines</span> & services
        </h2>
        <p className="picco-section-subtitle">
          How I approach designing high-scale cloud platforms, real-time computer vision, and user-facing digital experiences.
        </p>
      </div>

      <div className="picco-services-grid">
        {capabilities.map((srv, idx) => {
          const IconComponent = srv.icon;
          return (
            <div key={idx} className={`picco-service-card ${srv.colorClass}`}>
              <div className="picco-service-card-top">
                <div className="picco-service-icon-box">
                  <IconComponent size={22} />
                </div>
                <span className="picco-service-num">{srv.number}</span>
              </div>

              <h3 className="picco-service-title">{srv.title}</h3>
              <p className="picco-service-desc">{srv.description}</p>

              <ul className="picco-service-list">
                {srv.bullets.map((b, bIdx) => (
                  <li key={bIdx} className="picco-service-list-item">
                    <span className="picco-bullet-dot"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
