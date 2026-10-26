import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "What services do you offer?",
      a: "I specialize in brand identity, editorial illustrations, vector packaging systems, and creative full-stack cloud platforms. From full brand visual systems to custom interactive web experiences, every deliverable is tailored to strengthen connection and distinctiveness.",
    },
    {
      q: "What does a typical project process look like?",
      a: "The process begins with discovery and narrative direction, followed by exploratory sketches, architectural specs, and visual concepts. Once a direction is approved, we move into high-fidelity design, interactive prototyping, responsive code implementation, and production deployment.",
    },
    {
      q: "How long does a project usually take?",
      a: "Most identity and illustration projects range from 3 to 6 weeks. Interactive digital applications or custom cloud platforms (like MEMECRAFT) typically span 6 to 10 weeks, with clear weekly milestones and staging previews.",
    },
    {
      q: "Do you work with international clients?",
      a: "Yes, absolutely. I collaborate with agencies, startups, publishers, and studios worldwide across Europe, North America, and Asia, using structured async communication and regular syncs.",
    },
    {
      q: "Can you adapt illustrations and UI to our existing brand style?",
      a: "Yes. While my work has a distinctive playful and tactile sensibility, every typographic hierarchy, color palette, and micro-interaction is customized to harmonize with your existing design system and brand guidelines.",
    },
    {
      q: "How can I start a project with you?",
      a: "Simply send an email to tanvirkanoje@gmail.com with an outline of your project goals, desired timeline, and scope. I will reply within 24–48 hours to schedule an introductory discovery call.",
    },
  ];

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="picco-section">
      <div className="picco-section-header">
        <div className="picco-section-tag">
          <span>05 // CLARITY</span>
        </div>
        <h2 className="picco-section-title">
          FAQ // <span className="picco-serif-highlight">Your questions</span>, answered
        </h2>
        <p className="picco-section-subtitle">
          Everything you need to know about project timelines, process, and collaborations.
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
