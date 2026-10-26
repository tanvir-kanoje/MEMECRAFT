import React from "react";
import { Sparkles, ExternalLink, ArrowUpRight, Shield, Zap, Layers, Cpu, Code2 } from "lucide-react";

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  );
}

export default function ProjectsSection({ onJumpToStudio }) {
  const projects = [
    {
      id: "memecraft",
      title: "MEMECRAFT // The Neural Mirror",
      category: "COMPUTER VISION & AWS SERVERLESS",
      year: "2026",
      status: "LIVE PRODUCTION",
      accentColor: "blue",
      description:
        "An event-driven facial expression matching platform built on Amazon Rekognition and AWS Lambda. Bypasses compute bottlenecks via direct S3 presigned PUT ingestion, matches users to 800+ indexed memes in sub-400ms, and enforces zero biometric data debt with 24-hour auto-purging.",
      metrics: [
        { label: "P99 LATENCY", value: "< 350ms" },
        { label: "CONCURRENCY", value: "500+ Users" },
        { label: "CATALOGUE", value: "800+ Memes" },
        { label: "COMPLIANCE", value: "Zero Retention" },
      ],
      tags: ["AWS Rekognition", "AWS Lambda (Python 3.12)", "S3 Presigned Ingestion", "CloudFront OAC", "React 19"],
      liveUrl: "https://d2tuc83mjm02el.cloudfront.net",
      githubUrl: "https://github.com/tanvir-kanoje/AWS-Memer",
      isFlagship: true,
    },
    {
      id: "cloudstream",
      title: "CloudStream // Event-Driven Video Transcoder",
      category: "DISTRIBUTED CLOUD PIPELINE",
      year: "2025",
      status: "COMPLETED",
      accentColor: "orange",
      description:
        "A zero-idle serverless media processing pipeline. Ingests raw multi-gigabyte video uploads to S3, orchestrates validation and watermark burn-in via AWS Step Functions state machines, and parallelizes adaptive bitrate HLS packaging with AWS Elemental MediaConvert.",
      metrics: [
        { label: "IDLE COST", value: "$0.00 / Mo" },
        { label: "STEP FUNCTIONS", value: "8 States" },
        { label: "CODECS", value: "H.264 / HLS" },
        { label: "REDUCTION", value: "70% Bandwidth" },
      ],
      tags: ["AWS Step Functions", "Elemental MediaConvert", "Amazon EventBridge", "S3 Notifications", "Terraform"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "omnirag",
      title: "OmniRAG // Enterprise Multimodal Knowledge Agent",
      category: "GENERATIVE AI & VECTOR SEARCH",
      year: "2025",
      status: "CASE STUDY",
      accentColor: "green",
      description:
        "High-concurrency hybrid vector retrieval and synthesis agent. Integrates AWS Bedrock (Claude 3.5 Sonnet) with OpenSearch Serverless hybrid k-NN embeddings, returning verifiable document citations and streaming markdown responses with sub-second time-to-first-token.",
      metrics: [
        { label: "TTFT", value: "480ms" },
        { label: "EMBEDDINGS", value: "Titan v2" },
        { label: "SEARCH", value: "Hybrid k-NN" },
        { label: "CITATION", value: "100% Traceable" },
      ],
      tags: ["AWS Bedrock", "OpenSearch Serverless", "Claude 3.5 Sonnet", "DynamoDB Caching", "FastAPI"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
    {
      id: "pulseiot",
      title: "PulseIoT // Real-Time Fleet Telemetry Streamer",
      category: "STREAMING DATA & WEBSOCKETS",
      year: "2024",
      status: "OPEN SOURCE",
      accentColor: "yellow",
      description:
        "High-frequency MQTT telemetry ingestion gateway for distributed IoT devices. Ingests 10,000+ metrics/sec via AWS IoT Core Rules Engine, fans out to Amazon Kinesis Data Firehose, and streams real-time anomaly telemetry over bidirectional WebSockets.",
      metrics: [
        { label: "THROUGHPUT", value: "10K msg/sec" },
        { label: "INGESTION", value: "AWS IoT Core" },
        { label: "STORAGE", value: "Timestream" },
        { label: "FRONTEND", value: "Canvas Realtime" },
      ],
      tags: ["AWS IoT Core", "Amazon Kinesis", "Timestream", "API Gateway WebSockets", "React"],
      githubUrl: "https://github.com/tanvir-kanoje",
    },
  ];

  return (
    <section id="projects" className="picco-section">
      <div className="picco-section-header">
        <div className="picco-section-tag">
          <span>01 // PORTFOLIO</span>
        </div>
        <h2 className="picco-section-title">
          Selected <span className="picco-serif-highlight">projects</span>
        </h2>
        <p className="picco-section-subtitle">
          A showcase of cloud-native distributed systems, computer vision models, and production web engineering.
        </p>
      </div>

      <div className="picco-projects-grid">
        {projects.map((proj) => (
          <article key={proj.id} className={`picco-project-card card-accent-${proj.accentColor}`}>
            {/* Top Bar: Category & Year */}
            <div className="picco-card-meta">
              <span className="picco-card-category">{proj.category}</span>
              <div className="picco-card-badges">
                {proj.isFlagship && (
                  <span className="picco-card-pill-flagship">
                    <Sparkles size={11} /> FLAGSHIP
                  </span>
                )}
                <span className="picco-card-year">{proj.year}</span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="picco-card-title">{proj.title}</h3>
            <p className="picco-card-desc">{proj.description}</p>

            {/* Metrics Dashboard Inside Card */}
            <div className="picco-card-metrics">
              {proj.metrics.map((m, idx) => (
                <div key={idx} className="picco-metric-item">
                  <span className="picco-metric-label">{m.label}</span>
                  <span className="picco-metric-val">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Tech Tags */}
            <div className="picco-card-tags">
              {proj.tags.map((t, idx) => (
                <span key={idx} className="picco-tag-item">
                  {t}
                </span>
              ))}
            </div>

            {/* Card Actions */}
            <div className="picco-card-actions">
              {proj.isFlagship ? (
                <>
                  <button onClick={onJumpToStudio} className="picco-btn-card-primary">
                    <Sparkles size={16} />
                    <span>Launch Live Interactive Studio</span>
                  </button>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="picco-btn-card-secondary"
                    title="View GitHub Repository"
                  >
                    <GithubIcon size={16} />
                    <span>Code</span>
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="picco-btn-card-secondary"
                  >
                    <GithubIcon size={16} />
                    <span>View Repository</span>
                    <ArrowUpRight size={14} />
                  </a>
                  <span className="picco-card-status-badge">
                    <span className="status-indicator-dot"></span>
                    <span>{proj.status}</span>
                  </span>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
