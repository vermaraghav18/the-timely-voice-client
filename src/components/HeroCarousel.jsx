// src/components/HeroCarousel.jsx
import { useEffect, useRef, useState } from "react";

export default function HeroCarousel({ slides = [], intervalMs = 5500 }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // auto-rotate
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % Math.max(slides.length, 1));
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;
  const slide = slides[idx];

  return (
    <section className="hero card hover-raise" aria-label="Top Stories">
      <a className="hero-link" href={slide.href}>
        <div className="hero-media">
          <img src={slide.image} alt="" loading="eager" decoding="async" />
          <div className="hero-fade" />
          <div className="hero-tag">{slide.tag}</div>
          <div className="hero-text">
            <h1 className="hero-title">{slide.title}</h1>
            {slide.dek && <p className="hero-dek">{slide.dek}</p>}
          </div>
        </div>
      </a>

      <div className="hero-dots" role="tablist" aria-label="Slides">
        {slides.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === idx}
            className={`dot ${i === idx ? "is-active" : ""}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
