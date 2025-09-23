import React, { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK_IMG = "https://picsum.photos/seed/breaking-fallback/600/400";

export default function BreakingSection({
  title = "Breaking",
  // items may be backend-article shape OR custom shape
  items = [],
}) {
  const containerRef = useRef(null);
  const highlightRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Map to the simple UI shape the component renders
  const mapped = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      // Fallback demo content
      return [
        {
          title: "Woman critical after being hit by Car at Lasjan Bridge",
          image:
            "https://images.unsplash.com/photo-1520975618313-6c9b1b7b77a3?q=80&w=600&auto=format&fit=crop",
          href: "#",
        },
        {
          title:
            "India’s unemployment rate falls to 5.1% in August; women’s participation gains momentum",
          image:
            "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=600&auto=format&fit=crop",
          href: "#",
        },
        {
          title:
            "Afghanistan’s Naveen-ul-Haq ruled out of Asia Cup 2025 due to injury",
          image:
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop",
          href: "#",
        },
        {
          title:
            "‘Enough is enough’: Omar Abdullah says Centre should hand over highway to J&K if it cannot maintain it",
          image:
            "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=600&auto=format&fit=crop",
          href: "#",
        },
        {
          title:
            "Minister Javed Dar visits Qazigund, Jablipora to assess situation on highway",
          image:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
          href: "#",
        },
      ];
    }

    // Accept BOTH shapes:
    // - article: { title, slug, thumbnailUrl?, heroImageUrl? }
    // - custom:  { title, image?, href? }
    return items.map((a) => ({
      title: a?.title || "Untitled",
      image:
        a?.thumbnailUrl ||
        a?.heroImageUrl ||
        a?.image ||
        FALLBACK_IMG,
      href: a?.slug ? `/article/${a.slug}` : (a?.href || "#"),
    }));
  }, [items]);

  // Reset active index when list size changes
  useEffect(() => { setActiveIndex(0); }, [mapped.length]);

  // Orange highlight animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemsEls = container.querySelectorAll(".b-item");
    if (!itemsEls.length) return;

    const moveHighlight = () => {
      const el = itemsEls[activeIndex];
      if (!el || !highlightRef.current) return;
      const rect = el.getBoundingClientRect();
      const top = el.offsetTop - 4;
      const left = el.offsetLeft - 2;
      highlightRef.current.style.top = `${top}px`;
      highlightRef.current.style.left = `${left}px`;
      highlightRef.current.style.width = `${rect.width + 4}px`;
      highlightRef.current.style.height = `${rect.height + 8}px`;
    };

    moveHighlight();
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemsEls.length);
    }, 2600);

    window.addEventListener("resize", moveHighlight);
    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", moveHighlight);
    };
  }, [activeIndex, mapped.length]);

  return (
    <section className="breaking-wrap">
      <header className="breaking-head">
        <h2 className="breaking-title">{title}</h2>
      </header>

      <div
        className="breaking-grid"
        style={{ position: "relative" }}
        ref={containerRef}
      >
        {/* Orange highlight box */}
        <div ref={highlightRef} className="breaking-highlight" />

        {mapped.map((it, i) => (
          <a
            className="b-item"
            href={it.href}
            key={it.href || it.title || i}
            onClick={(e) => {
              if (!it.href || it.href === "#") e.preventDefault();
            }}
          >
            <div className="b-thumb">
              <img
                src={it.image}
                alt={it.title}
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_IMG) {
                    e.currentTarget.src = FALLBACK_IMG;
                  }
                }}
              />
            </div>
            <div className="b-copy">
              <div className="b-title">{it.title}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
