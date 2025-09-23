import React, { useEffect, useMemo, useState } from "react";
import "./entertainment.css";

const FALLBACK_HERO = "https://picsum.photos/seed/ent-hero/1600/900";
const FALLBACK_TILE = "https://picsum.photos/seed/ent-tile/1000/1400";
const FALLBACK_STRIP = "https://picsum.photos/seed/ent-strip/1200/600";

const imgHero = (a) => a?.heroImageUrl || a?.thumbnailUrl || FALLBACK_HERO;
const imgTile = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_TILE;
const imgStrip = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_STRIP;

export default function EntertainmentSection({
  heading = "ENTERTAINMENT",
  /** NEW: pass live items from HomePage: <EntertainmentSection items={sections.entertainment || []} /> */
  items = [],
  // keep your original props as fallback
  heroSlides: heroSlidesFallback = [
    {
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1600&auto=format&fit=crop",
      title:
        "Breaking into the charts: Rising stars to watch in the music world",
      time: "2 HOURS AGO",
      href: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop",
      title: "Streaming boom: how short videos are minting overnight idols",
      time: "3 HOURS AGO",
      href: "#",
    },
    {
      image:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop",
      title: "Indie revival: tiny labels, big sounds, and global audiences",
      time: "5 HOURS AGO",
      href: "#",
    },
  ],
  tiles: tilesFallback = [
    {
      id: "t1",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1000&auto=format&fit=crop",
      title: "Acclaimed set to star in new crime thriller",
      time: "4 HOURS AGO",
      href: "#",
    },
    {
      id: "t2",
      image:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=1000&auto=format&fit=crop",
      title: "Fan-favorite series renewed for another season",
      time: "5 HOURS AGO",
      href: "#",
    },
    {
      id: "t3",
      image:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop",
      title: "Inside the epic journey of the latest fantasy film",
      time: "7 HOURS AGO",
      href: "#",
    },
    {
      id: "t4",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1000&auto=format&fit=crop",
      title: "Directors reveal how the saga came together",
      time: "7 HOURS AGO",
      href: "#",
    },
  ],
  strip: stripFallback = [
    {
      id: "s1",
      image:
        "https://images.unsplash.com/photo-1481653125770-b78c206c35b3?q=80&w=1200&auto=format&fit=crop",
      title: "Stand-up comedy special garners rave reviews",
      time: "1 HOUR AGO",
      href: "#",
    },
    {
      id: "s2",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
      title: "Renowned director announces new sci-project",
      time: "3 HOURS AGO",
      href: "#",
    },
    {
      id: "s3",
      image:
        "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?q=80&w=1200&auto=format&fit=crop",
      title: "Caught on camera: Celebrities out and about",
      time: "3 HOURS AGO",
      href: "#",
    },
  ],
}) {
  // Map backend items -> three buckets (hero rotator, right tiles, lower strip)
  const { heroSlides, tiles, strip } = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        heroSlides: heroSlidesFallback,
        tiles: tilesFallback,
        strip: stripFallback,
      };
    }

    const hs = items.slice(0, 3).map((a, i) => ({
      image: imgHero(a),
      title: a?.title || "",
      time: a?.publishedAt ? timeAgo(a.publishedAt).toUpperCase() : "",
      href: a?.slug ? `/article/${a.slug}` : "#",
      id: a.id || `hs-${i}`,
    }));

    const rightTiles = items.slice(3, 7).map((a, i) => ({
      id: a.id || `t-${i}`,
      image: imgTile(a),
      title: a?.title || "",
      time: a?.publishedAt ? timeAgo(a.publishedAt).toUpperCase() : "",
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));

    const lower = items.slice(7, 11).map((a, i) => ({
      id: a.id || `s-${i}`,
      image: imgStrip(a),
      title: a?.title || "",
      time: a?.publishedAt ? timeAgo(a.publishedAt).toUpperCase() : "",
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));

    return {
      heroSlides: hs.length ? hs : heroSlidesFallback,
      tiles: rightTiles.length ? rightTiles : tilesFallback,
      strip: lower.length ? lower : stripFallback,
    };
  }, [items, heroSlidesFallback, tilesFallback, stripFallback]);

  // Auto-rotator for hero
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || heroSlides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 2400);
    return () => clearInterval(t);
  }, [paused, heroSlides.length]);

  return (
    <section className="ent-wrap" aria-label="Entertainment">
      <header className="ent-head">
        <h2 className="ent-label">{heading}</h2>
        <span className="ent-underline" />
      </header>

      {/* Top: hero rotator + portrait tiles */}
      <div className="ent-grid">
        {/* HERO */}
        <article
          className="ent-hero"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="ent-rotator">
            {heroSlides.map((s, i) => (
              <a
                key={s.id || i}
                href={s.href || "#"}
                className={`ent-hero-media ent-slide ${i === idx ? "is-active" : ""}`}
                aria-hidden={i === idx ? "false" : "true"}
                tabIndex={i === idx ? 0 : -1}
                onClick={(e) => {
                  if (!s.href || s.href === "#") e.preventDefault();
                }}
              >
                <img
                  src={s.image || FALLBACK_HERO}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_HERO) {
                      e.currentTarget.src = FALLBACK_HERO;
                    }
                  }}
                />
                <div className="ent-hero-overlay">
                  <h3 className="ent-hero-title">{s.title}</h3>
                  {s.time && <div className="ent-hero-meta">{s.time}</div>}
                </div>
              </a>
            ))}
          </div>
        </article>

        {/* RIGHT: portrait tiles (taller) */}
        <div className="ent-tiles">
          {tiles.map((t) => (
            <a
              className="ent-card"
              href={t.href || "#"}
              key={t.id}
              onClick={(e) => {
                if (!t.href || t.href === "#") e.preventDefault();
              }}
            >
              <img
                className="ent-card-img"
                src={t.image || FALLBACK_TILE}
                alt=""
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_TILE) {
                    e.currentTarget.src = FALLBACK_TILE;
                  }
                }}
              />
              <div className="ent-card-overlay">
                <h4 className="ent-card-title">{t.title}</h4>
                {t.time && <div className="ent-card-meta">{t.time}</div>}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* LOWER STRIP */}
      <div className="ent-strip">
        {strip.slice(0, 4).map((s) => (
          <a
            className="ent-strip-card"
            href={s.href || "#"}
            key={s.id}
            onClick={(e) => {
              if (!s.href || s.href === "#") e.preventDefault();
            }}
          >
            <div className="ent-strip-media">
              <img
                src={s.image || FALLBACK_STRIP}
                alt=""
                loading="lazy"
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_STRIP) {
                    e.currentTarget.src = FALLBACK_STRIP;
                  }
                }}
              />
            </div>
            <h5 className="ent-strip-title">{s.title}</h5>
            <div className="ent-strip-meta">{s.time}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* helpers */
function timeAgo(iso) {
  try {
    if (!iso) return "";
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
