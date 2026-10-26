import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How does MEMECRAFT support 500+ concurrent students without server crashes?",
      a: "Instead of uploading large image files through API Gateway and Lambda (which exhausts Lambda memory and hits the 10MB gateway ceiling), the frontend issues a lightweight handshake to get a cryptographic S3 presigned PUT URL. The browser uploads the raw photo directly to Amazon S3 over encrypted HTTPS. API Gateway and Lambda process only lightweight JSON, allowing hundreds of simultaneous uploads with zero memory bloat.",
    },
    {
      q: "Why use Amazon Rekognition DetectFaces rather than SearchFacesByImage?",
      a: "Memes are caricatures, cartoons, actors, and exaggerated expressions. Traditional biometric face search (SearchFacesByImage) looks for physical bone structure and exact facial identities—failing 99% of the time on humorous images. By using DetectFaces, we extract an explainable 8-dimensional expression vector (dominant emotion, smile intensity, eye state, mouth aperture, pose angles) and perform weighted geometric affinity matching, succeeding 100% of the time.",
    },
    {
      q: "How is student privacy and sensitive biometric data safeguarded?",
      a: "MEMECRAFT enforces zero biometric data debt. Uploaded selfies are compartmentalized under temporary prefix paths in S3 with no public enumeration access. An automated AWS S3 Lifecycle configuration (AutoExpireStudentSelfies) permanently deletes every upload after 24 hours. No biometric fingerprints, facial geometry vectors, or identity profiles are stored in any persistent database.",
    },
    {
      q: "How does the system achieve sub-400ms match response times?",
      a: "The 800+ meme catalogue was pre-processed offline using a checkpointed Rekognition batch script and saved as normalized metadata in S3. During live user requests, Rekognition runs only once on the uploaded selfie. The matching Lambda caches the 800-record metadata JSON in global execution context memory across warm invocations, eliminating redundant S3 GET requests and keeping live scoring under 350ms.",
    },
    {
      q: "What is the AWS infrastructure cost of running this platform?",
      a: "Because all services are 100% serverless, there is zero idle cost. Static assets are served via CloudFront edge caches at pennies per million hits. Lambda executions run for under 400ms at 512MB RAM ($0.000003 per match). Running 1,000 live student submissions costs approximately $1.00 USD in Amazon Rekognition API fees.",
    },
  ];

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="picco-section">
      <div className="picco-section-header">
        <div className="picco-section-tag">
          <span>04 // CLARITY</span>
        </div>
        <h2 className="picco-section-title">
          Frequently asked <span className="picco-serif-highlight">questions</span>
        </h2>
        <p className="picco-section-subtitle">
          Key architectural decisions, performance benchmarks, and data security explained clearly.
        </p>
      </div>

      <div className="picco-faq-container">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`picco-faq-card ${isOpen ? "faq-card-open" : ""}`}
              onClick={() => toggle(idx)}
            >
              <div className="picco-faq-question-row">
                <h3 className="picco-faq-question">{faq.q}</h3>
                <div className="picco-faq-toggle-icon">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </div>
              {isOpen && (
                <div className="picco-faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
