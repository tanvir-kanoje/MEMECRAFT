import React from "react";
import { Palette, PenTool, Sparkles, Package, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  const capabilities = [
    {
      icon: Palette,
      title: "Brand Identity",
      colorClass: "service-blue",
      number: "01",
      description:
        "Building flexible identity systems designed to unify diverse touchpoints. Clean typography, structured grids, and strategic color palettes.",
      bullets: [
        "Visual identity guidelines & design tokens",
        "Logo systems, marks & brand architecture",
        "Digital & physical collateral design",
        "Scalable design systems & UI patterns",
      ],
    },
    {
      icon: PenTool,
      title: "Graphic Design",
      colorClass: "service-orange",
      number: "02",
      description:
        "Editorial design, typographic rhythm, and print production. Crafting publications, posters, and books where content defines the aesthetic.",
      bullets: [
        "Editorial layouts & publishing systems",
        "Custom typography pairings & hierarchy",
        "Print specifications & paper craft",
        "Event exhibitions & promotional posters",
      ],
    },
    {
      icon: Sparkles,
      title: "Illustrations & Vector Art",
      colorClass: "service-green",
      number: "03",
      description:
        "Expressive vector sets, editorial spot illustrations, and computer vision alter-egos. Adding warmth, character, and delight to complex ideas.",
      bullets: [
        "Custom editorial illustration suites",
        "Vector iconography & asset libraries",
        "Character design & facial expressions",
        "Digital storyboards & motion assets",
      ],
    },
    {
      icon: Package,
      title: "Packaging & Physical",
      colorClass: "service-yellow",
      number: "04",
      description:
        "Tactile, hands-on packaging design. Turning products into small collectible objects through bold forms, raw textures, and playful compositions.",
      bullets: [
        "Structural box design & die-line preparation",
        "Label systems & SKU color coding",
        "Material selection & tactile finishes",
        "Shelf impact & retail presentation",
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
          Services // <span className="picco-serif-highlight">What I bring</span>
        </h2>
        <p className="picco-section-subtitle">
          Comprehensive creative disciplines from brand identity to vector craft and high-performance interactive experiences.
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
