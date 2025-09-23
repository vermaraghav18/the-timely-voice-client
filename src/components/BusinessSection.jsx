import React, { useMemo } from "react";
import "./business.css";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop";
const FALLBACK_THUMB =
  "https://picsum.photos/seed/biz-thumb/600/400";

// Turn ISO date into a short “time ago”
function timeAgo(iso) {
  if (!iso) return "";
  try {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const s = Math.max(0, Math.floor((now - then) / 1000));
    if (s < 60) return `${s} sec ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hr ago`;
    const d = Math.floor(h / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  } catch {
    return "";
  }
}

export default function BusinessSection({
  heading = "BUSINESS",
  // items may be backend articles (from /api/sections/home.business or /api/articles?category=business)
  items = [],
}) {
  // Map backend → UI shape, or fall back to demo list
  const mapped = useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return items.map((a, idx) => ({
        id: a.id || `biz-${idx}`,
        title: a?.title || "Untitled",
        dek: a?.summary || "",
        time: (timeAgo(a?.publishedAt) || "").toUpperCase(),
        image:
          (idx === 0
            ? a?.heroImageUrl || a?.thumbnailUrl || FALLBACK_HERO
            : a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_THUMB),
        href: a?.slug ? `/article/${a.slug}` : "#",
      }));
    }

    // Fallback demo content (your original defaults)
    return [
      {
        id: "hero-1",
        image: FALLBACK_HERO,
        title:
          "CEO turnover climbs as companies brace for growing uncertainty",
        dek: "Leadership shakeups continue at US firms amid economic concerns and strategic shifts. Experts say pressure is mounting on executives to adapt to changing market dynamics.",
        time: "2 HOURS AGO",
        href: "#",
      },
      {
        id: "r1",
        image:
          "https://images.unsplash.com/photo-1567427013953-1d312b6b14c2?q=80&w=600&auto=format&fit=crop",
        title:
          "Treasury yields edge lower as investors eye next round of Fed moves",
        time: "1 HOUR AGO",
        href: "#",
      },
      {
        id: "r2",
        image:
          "https://images.unsplash.com/photo-1600880292300-43e1c72e2c51?q=80&w=600&auto=format&fit=crop",
        title: "Dollar steadies against euro after Eurozone inflation cools",
        time: "2 HOURS AGO",
        href: "#",
      },
      {
        id: "r3",
        image:
          "https://images.unsplash.com/photo-1616762433279-6e1d9d6eaa0f?q=80&w=600&auto=format&fit=crop",
        title: "EV tax credits spark competition among global automakers",
        time: "3 HOURS AGO",
        href: "#",
      },
    ];
  }, [items]);

  if (!mapped.length) return null;

  const [hero, ...rest] = mapped;

  return (
    <section className="biz-wrap" aria-label="Business">
      <header className="biz-head">
        <h2 className="biz-label">{heading}</h2>
        <span className="biz-underline" />
      </header>

      <div className="biz-grid">
        {/* LEFT: HERO */}
        <article className="biz-hero">
          <a
            className="biz-media"
            href={hero.href || "#"}
            onClick={(e) => {
              if (!hero.href || hero.href === "#") e.preventDefault();
            }}
          >
            <img
              src={hero.image || FALLBACK_HERO}
              alt=""
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_HERO) {
                  e.currentTarget.src = FALLBACK_HERO;
                }
              }}
            />
          </a>

          <h3 className="biz-title">{hero.title}</h3>
          {hero.dek ? <p className="biz-dek">{hero.dek}</p> : null}
          <div className="biz-meta">{hero.time}</div>
        </article>

        {/* RIGHT: STACKED CARDS */}
        <div className="biz-list">
          {rest.map((it) => (
            <a
              className="biz-card"
              href={it.href || "#"}
              key={it.id}
              onClick={(e) => {
                if (!it.href || it.href === "#") e.preventDefault();
              }}
            >
              <div className="biz-thumb">
                <img
                  src={it.image || FALLBACK_THUMB}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_THUMB) {
                      e.currentTarget.src = FALLBACK_THUMB;
                    }
                  }}
                />
              </div>
              <div className="biz-card-text">
                <h4 className="biz-card-title">{it.title}</h4>
                <div className="biz-card-meta">{it.time}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
