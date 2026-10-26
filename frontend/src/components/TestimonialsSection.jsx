import React, { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Leo Bennett",
      role: "Creative Lead, Form & Co",
      quote:
        "They brought structure and personality to our brand in a way that immediately made everything feel more confident, polished, and cohesive.",
      color: "blue",
    },
    {
      name: "Nina Carter",
      role: "Founder, North Studio",
      quote:
        "Working together felt effortless from start to finish. They translated a rough idea into a visual identity that felt clear, expressive, and genuinely memorable.",
      color: "orange",
    },
    {
      name: "Ethan Brooks",
      role: "Co-Founder, Fieldwave",
      quote:
        "They have a rare ability to make complex ideas feel simple and beautiful. The final result was thoughtful, strategic, and full of character.",
      color: "green",
    },
    {
      name: "Maya Flores",
      role: "Marketing Manager, Lune Labs",
      quote:
        "The new visuals gave our launch a completely different energy. Everything felt intentional, distinctive, and much more aligned with the audience we wanted to reach.",
      color: "yellow",
    },
    {
      name: "Miles Rivera",
      role: "Product Marketing Lead, Orbit Supply",
      quote:
        "The illustrations added warmth and personality without losing professionalism. It made the whole brand feel more human, modern, and engaging.",
      color: "blue",
    },
    {
      name: "Sofia Grant",
      role: "Brand Manager, Kinfolk Agency",
      quote:
        "From the first concepts to the final files, every detail was handled with care. The work felt refined, playful, and incredibly easy to build a brand around.",
      color: "orange",
    },
    {
      name: "Gillian Anderson",
      role: "Art Director, North Avenue",
      quote:
        "What stood out most was the balance between creativity and clarity. The system felt original, but it also worked beautifully across every touchpoint.",
      color: "green",
    },
    {
      name: "Tom Turner",
      role: "Founder, Ember House",
      quote:
        "They helped us move from scattered inspiration to a brand that finally felt unified. The result looked distinctive and instantly more mature.",
      color: "yellow",
    },
  ];

  return (
    <section id="testimonials" className="picco-section">
      <div className="picco-section-header">
        <div className="picco-section-tag">
          <span>03 // ENDORSEMENTS</span>
        </div>
        <h2 className="picco-section-title">
          What nice <span className="picco-serif-highlight">People</span> say
        </h2>
        <p className="picco-section-subtitle">
          Kind words from collaborators, creative leads, and product founders.
        </p>
      </div>

      <div className="picco-testimonials-grid">
        {testimonials.map((item, idx) => (
          <div key={idx} className={`picco-testimonial-card test-accent-${item.color}`}>
            <div className="picco-testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="star-filled" />
              ))}
            </div>

            <p className="picco-testimonial-quote">"{item.quote}"</p>

            <div className="picco-testimonial-author">
              <div className="picco-author-avatar">
                {item.name.charAt(0)}
              </div>
              <div className="picco-author-info">
                <span className="picco-author-name">{item.name}</span>
                <span className="picco-author-role">{item.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
