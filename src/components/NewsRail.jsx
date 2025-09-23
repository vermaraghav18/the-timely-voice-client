import React, { useMemo, useRef } from "react";
import "./news-rail.css";

/* Existing demo fallback stays */
const defaultStories = [
  {
    id: 1,
    tag: { label: "LIVE", tone: "alert" },
    title: "BREAKING NEWS: House passes new spending bill",
    minutes: 2,
    img: "https://images.pexels.com/photos/1202723/pexels-photo-1202723.jpeg",
    href: "#",
  },
  {
    id: 2,
    tag: null,
    title: "Red alert in force as floods disrupt daily life",
    minutes: 3,
    img: "https://images.pexels.com/photos/356844/pexels-photo-356844.jpeg",
    href: "#",
  },
  {
    id: 3,
    tag: { label: "OPINION", tone: "opinion" },
    title: "Can the U.S. keep up with China’s military?",
    minutes: 5,
    img: "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg",
    href: "#",
  },
  {
    id: 4,
    tag: { label: "LIVE", tone: "alert" },
    title: "Biden makes case for sanctions on Russia",
    minutes: 7,
    img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 5,
    tag: null,
    title: "Senate Republicans reject new tax proposal",
    minutes: 4,
    img: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
  {
    id: 6,
    tag: null,
    title: "Election lawsuits filed in key battleground state",
    minutes: 3,
    img: "https://images.unsplash.com/photo-1553514029-1318c9127859?q=80&w=1600&auto=format&fit=crop",
    href: "#",
  },
];

const FALLBACK_IMG = "https://picsum.photos/seed/rail-fallback/800/600";

/** rough minutes estimator from text length */
function minutesFrom(text = "") {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  if (!words) return 2;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
}

/** map backend article -> rail story */
function toStory(a, idx) {
  const img = a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_IMG;
  const href = a?.slug ? `/article/${a.slug}` : "#";

  // Basic tag derivation: show "LIVE" if status is 'live'; otherwise show category
  let tag = null;
  if (a?.status === "live") {
    tag = { label: "LIVE", tone: "alert" };
  } else if (a?.category?.name) {
    tag = { label: a.category.name.toUpperCase(), tone: "default" };
  }

  const minutes = minutesFrom(a?.summary || a?.body);

  return {
    id: a?.id || `rail-${idx}`,
    tag,
    title: a?.title || "Untitled",
    minutes,
    img,
    href,
  };
}

export default function NewsRail({
  title = "",
  /** NEW: pass backend items; if provided, they take priority */
  items = [],
  /** legacy prop still supported; used when items not passed */
  stories: storiesProp = defaultStories,
}) {
  const stories = useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return items.slice(0, 20).map(toStory);
    }
    return storiesProp;
  }, [items, storiesProp]);

  const railRef = useRef(null);

  const scrollByCard = (dir = 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".tv-card");
    const delta = card ? card.getBoundingClientRect().width + 16 : 320;
    rail.scrollBy({ left: dir * delta, behavior: "smooth" });
  };

  return (
    <section className="tv-rail-wrap">
      <div className="tv-rail-head">
        <h2 className="tv-rail-title">{title}</h2>
        <div className="tv-rail-controls">
          <button
            className="tv-rail-btn"
            aria-label="Scroll left"
            onClick={() => scrollByCard(-1)}
          >
            ‹
          </button>
          <button
            className="tv-rail-btn"
            aria-label="Scroll right"
            onClick={() => scrollByCard(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="tv-rail" ref={railRef}>
        {stories.map((s) => (
          <a
            className="tv-card"
            key={s.id}
            tabIndex={0}
            href={s.href || "#"}
            onClick={(e) => {
              if (!s.href || s.href === "#") e.preventDefault();
            }}
          >
            <div className="tv-media">
              <img
                src={s.img || FALLBACK_IMG}
                alt={s.title}
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_IMG) {
                    e.currentTarget.src = FALLBACK_IMG;
                  }
                }}
              />
              {s.tag && (
                <span className={`tv-tag tv-tag--${s.tag.tone}`}>{s.tag.label}</span>
              )}
              {/* keep your little play icon on card id=4 (optional) */}
              {String(s.id).endsWith("4") && (
                <span className="tv-play" aria-hidden>
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </span>
              )}
            </div>

            <div className="tv-body">
              <h3 className="tv-title">{s.title}</h3>
              {typeof s.minutes === "number" && (
                <div className="tv-meta">
                  <svg className="tv-clock" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{s.minutes} min read</span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
