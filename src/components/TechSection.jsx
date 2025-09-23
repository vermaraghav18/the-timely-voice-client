import React, { useEffect, useMemo, useRef, useState } from "react";
import "./tech-section.css";

const FALLBACK_HERO = "https://picsum.photos/seed/feature-tech/1280/720";
const FALLBACK_4x3 = "https://picsum.photos/seed/tech-4x3/640/480";

// Tiny helper
function timeAgo(iso) {
  if (!iso) return "Just now";
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
    return "Just now";
  }
}

export default function TechSection({
  // NEW: accept API items (HomePage passes: <TechSection items={sections.tech} />)
  items = [],
}) {
  // ---- Pills / lists (static for now; can be derived from tags later) ----
  const pills = ["AI", "GADGETS", "STARTUPS", "CYBERSECURITY"];

  // Map backend → UI pieces, with safe fallbacks
  const {
    hero,
    heroMeta,
    stacked,
    sideTrends,
    dealWatch,
    latestReviews,
    rotatorImages,
  } = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      // Fallback to your original static presentation
      return {
        hero: {
          image: FALLBACK_HERO,
          title: "The future of AI: What's next for artificial intelligence",
          dek:
            "Industry experts discuss emerging trends and technologies shaping the future of AI, including advancements in machine learning and ethical considerations.",
          href: "#",
        },
        heroMeta: "Just now",
        stacked: [
          {
            image: "https://picsum.photos/seed/earbuds/640/480",
            chip: "GADGETS",
            title:
              "Hands-on with the latest wireless earbuds: Are they worth it?",
            href: "#",
          },
          {
            image: "https://picsum.photos/seed/startups/640/480",
            chip: "STARTUPS",
            title: "Promising tech startups to watch this year",
            href: "#",
          },
        ],
        sideTrends: [
          "AI-powered search engines are on the rise",
          "Social media platforms face new regulations",
        ],
        dealWatch: [
          "Huge discounts on 4K TVs this week",
          "Latest smartwatch models now on sale",
        ],
        latestReviews: [
          "Best laptops of 2025 compared",
          "Smartphone camera showdown",
          "Top tablets for students",
          "Noise-cancelling headphones tested",
          "Smartwatch face-off: Which is best in 2025?",
        ],
        rotatorImages: [
          "https://picsum.photos/seed/tech-rot-1/1280/540",
          "https://picsum.photos/seed/tech-rot-2/1280/540",
          "https://picsum.photos/seed/tech-rot-3/1280/540",
          "https://picsum.photos/seed/tech-rot-4/1280/540",
        ],
      };
    }

    const imgHero = (a) => a?.heroImageUrl || a?.thumbnailUrl || FALLBACK_HERO;
    const img4x3 = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_4x3;

    const h = items[0] || {};
    const s1 = items[1] || {};
    const s2 = items[2] || {};

    // sidebar derive titles from subsequent items
    const trendTitles = items.slice(3, 5).map((a) => a?.title).filter(Boolean);
    const dealTitles = items.slice(5, 7).map((a) => a?.title).filter(Boolean);
    const reviewTitles = items
      .slice(7, 12)
      .map((a) => a?.title)
      .filter(Boolean);

    // rotator from first few items’ images
    const rot = (items.slice(0, 4).length ? items.slice(0, 4) : [h])
      .map((a, i) => imgHero(a) || `https://picsum.photos/seed/tech-rot-fb-${i}/1280/540`);

    return {
      hero: {
        image: imgHero(h),
        title: h?.title || "Tech headline",
        dek: h?.summary || "",
        href: h?.slug ? `/article/${h.slug}` : "#",
      },
      heroMeta: timeAgo(h?.publishedAt),
      stacked: [
        {
          image: img4x3(s1),
          chip: s1?.category?.name?.toUpperCase() || "GADGETS",
          title: s1?.title || "Second tech story",
          href: s1?.slug ? `/article/${s1.slug}` : "#",
        },
        {
          image: img4x3(s2),
          chip: s2?.category?.name?.toUpperCase() || "STARTUPS",
          title: s2?.title || "Third tech story",
          href: s2?.slug ? `/article/${s2.slug}` : "#",
        },
      ],
      sideTrends: trendTitles.length
        ? trendTitles
        : ["AI-powered search engines are on the rise", "Social media platforms face new regulations"],
      dealWatch: dealTitles.length
        ? dealTitles
        : ["Huge discounts on 4K TVs this week", "Latest smartwatch models now on sale"],
      latestReviews: reviewTitles.length
        ? reviewTitles
        : [
            "Best laptops of 2025 compared",
            "Smartphone camera showdown",
            "Top tablets for students",
            "Noise-cancelling headphones tested",
            "Smartwatch face-off: Which is best in 2025?",
          ],
      rotatorImages: rot,
    };
  }, [items]);

  // ---- Rotator images for the strip under the main article ----
  const [rotIdx, setRotIdx] = useState(0);
  useEffect(() => {
    if (!rotatorImages?.length) return;
    const id = setInterval(() => {
      setRotIdx((i) => (i + 1) % rotatorImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [rotatorImages?.length]);

  // ---- Background blue circle that scales with section visibility ----
  const secRef = useRef(null);
  const [dotScale, setDotScale] = useState(0);
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible =
        Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height;
      const t = (visible - 0.35) / 0.25;
      const scale = Math.max(0, Math.min(1.35, t));
      setDotScale(scale);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={secRef}
      className="tech-wrap"
      aria-label="Tech section"
      style={{ "--techDotScale": dotScale }}
    >
      {/* BACKGROUND BLUE CIRCLE */}
      <div className="tech-bg-dot" aria-hidden="true" />

      {/* HEADER */}
      <header className="tech-header">
        <div className="tech-title">
          <h2 aria-label="Tech">TECH</h2>
          <span className="title-underline" />
        </div>
        {/* Pills (static for now) */}
        <div className="tech-pills" aria-label="Tech topics">
          {pills.map((p) => (
            <span className="chip" key={p}>
              {p}
            </span>
          ))}
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="tech-grid">
        {/* LEFT: FEATURED */}
        <article className="featured-card">
          <a
            className="media featured-media"
            href={hero.href || "#"}
            onClick={(e) => {
              if (!hero.href || hero.href === "#") e.preventDefault();
            }}
          >
            <img
              src={hero.image || FALLBACK_HERO}
              alt="Tech circuit board glowing abstract"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_HERO) {
                  e.currentTarget.src = FALLBACK_HERO;
                }
              }}
            />
            <span className="chip chip-solid">TECH INSIGHT</span>
          </a>

          <h3 className="featured-title">{hero.title}</h3>
          {hero.dek ? <p className="featured-dek">{hero.dek}</p> : null}
          <div className="featured-meta">{heroMeta}</div>

          {/* Rotating image banner under the main article */}
          <div className="feature-rotator" aria-label="Top tech highlights">
            {rotatorImages.map((src, i) => (
              <img
                key={`${src}-${i}`}
                src={src}
                alt=""
                loading="lazy"
                className={`rot-img ${i === rotIdx ? "active" : ""}`}
                aria-hidden={i === rotIdx ? "false" : "true"}
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_HERO) {
                    e.currentTarget.src = FALLBACK_HERO;
                  }
                }}
              />
            ))}
          </div>
        </article>

        {/* MIDDLE: STACKED */}
        <div className="stack-col">
          {stacked.map((s, i) => (
            <article className="stack-card" key={s.href || i}>
              <a
                className="media stack-media ratio-4x3"
                href={s.href || "#"}
                onClick={(e) => {
                  if (!s.href || s.href === "#") e.preventDefault();
                }}
              >
                <img
                  src={s.image || FALLBACK_4x3}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_4x3) {
                      e.currentTarget.src = FALLBACK_4x3;
                    }
                  }}
                />
                <span className="chip">{s.chip || "TECH"}</span>
              </a>
              <h4 className="stack-title">{s.title}</h4>
            </article>
          ))}
        </div>

        {/* RIGHT: SIDEBAR */}
        <aside className="side-col">
          <section className="side-panel">
            <h5 className="panel-title">TECH TRENDS</h5>
            <ul className="panel-list">
              {(sideTrends || []).map((t, idx) => (
                <li key={`trend-${idx}`}>{t}</li>
              ))}
            </ul>
          </section>

          <section className="side-panel">
            <h5 className="panel-title">DEAL WATCH</h5>
            <ul className="panel-list">
              {(dealWatch || []).map((t, idx) => (
                <li key={`deal-${idx}`}>{t}</li>
              ))}
            </ul>
          </section>

          <section className="side-panel">
            <h5 className="panel-title">LATEST REVIEWS</h5>
            <ul className="panel-list">
              {(latestReviews || []).map((t, idx) => (
                <li key={`rev-${idx}`}>{t}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
