import React, { useEffect, useMemo, useRef, useState } from "react";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1400&auto=format&fit=crop";
const FALLBACK_CARD = "https://picsum.photos/seed/sports-fb/600/400";

// Helpers
const imgHero = (a) => a?.heroImageUrl || a?.thumbnailUrl || FALLBACK_HERO;
const imgCard = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_CARD;

export default function SportsShowcase({
  // From HomePage: <SportsShowcase items={sections.sports || []} />
  items = [],
}) {
  const [tab, setTab] = useState("recent");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const listRef = useRef(null);
  const itemRefs = useRef([]);

  /* ===== Scroll-reactive yellow “sun” behind Sports ===== */
  const sectionRef = useRef(null);
  const [spotScale, setSpotScale] = useState(0); // 0..1
  const [spotOpacity, setSpotOpacity] = useState(0);

  const thresholds = useMemo(
    () => Array.from({ length: 101 }, (_, i) => i / 100),
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const r = entry.intersectionRatio; // 0..1 visible
        let p = 0;
        if (r > 0.35) p = Math.min(1, (r - 0.35) / 0.25);
        const op = p > 0 ? Math.max(0.12, Math.min(1, p)) : 0;
        setSpotScale(p);
        setSpotOpacity(op);
      },
      { threshold: thresholds }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [thresholds]);

  /* ===== Map backend items → UI buckets with safe fallbacks ===== */
  const { heroSlides, trending, recent, top, sportsNews } = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      // ---- FALLBACK (your current static content) ----
      return {
        heroSlides: [
          {
            tag: "Tennis",
            title:
              "Top seeds ease through as US Open warm-up hits full stride",
            image:
              "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg",
            href: "#",
          },
          {
            tag: "Cricket",
            title: "Rohit’s quickfire 68 sets up India’s chase under lights",
            image:
              "https://images.unsplash.com/photo-1594470117722-2f63f68f1f30?q=80&w=1400&auto=format&fit=crop",
            href: "#",
          },
          {
            tag: "Football",
            title:
              "Late winner keeps title hopes alive in dramatic derby",
            image:
              "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1400&auto=format&fit=crop",
            href: "#",
          },
        ],
        trending: [
          {
            tag: "Cricket",
            title:
              "India clinch series with last-over thriller in Kolkata",
            image:
              "https://images.pexels.com/photos/3718433/pexels-photo-3718433.jpeg",
            href: "#",
          },
          {
            tag: "Football",
            title:
              "Title race tightens as late brace rescues points",
            image:
              "https://images.pexels.com/photos/1375149/pexels-photo-1375149.jpeg",
            href: "#",
          },
          {
            tag: "Tennis",
            title:
              "Comeback win puts former No.1 into quarterfinals",
            image:
              "https://images.pexels.com/photos/30902345/pexels-photo-30902345.jpeg",
            href: "#",
          },
          {
            tag: "Formula 1",
            title:
              "Upgrades arrive ahead of Suzuka; teams eye tyre-wear gains",
            image:
              "https://images.pexels.com/photos/18789693/pexels-photo-18789693.jpeg",
            href: "#",
          },
        ],
        recent: [
          {
            title:
              "Apollo Tyres becomes Team India’s new jersey sponsor",
            image:
              "https://images.pexels.com/photos/4412446/pexels-photo-4412446.jpeg",
            href: "#",
          },
          {
            title:
              "BCCI plays down ‘no-handshake’ row; India focus on Super 4s",
            image:
              "https://images.pexels.com/photos/11194889/pexels-photo-11194889.jpeg",
            href: "#",
          },
          {
            title:
              "India A trail after Australia A century; Harsh Dubey takes three",
            image:
              "https://images.pexels.com/photos/31605989/pexels-photo-31605989.jpeg",
            href: "#",
          },
          {
            title:
              "Smriti Mandhana back to World No.1 in ODI batting rankings",
            image:
              "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=400&auto=format&fit=crop",
            href: "#",
          },
        ],
        top: [
          {
            title:
              "India beat Pakistan by 7 wickets; path to Super 4s secured",
            image:
              "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=400&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Team India’s schedule reset in Dubai amid Asia Cup drama",
            image:
              "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Pakistan mulls U-turn on exit threat after ICC pushback",
            image:
              "https://images.unsplash.com/photo-1541769740-44d4b8f63c8b?q=80&w=400&auto=format&fit=crop",
            href: "#",
          },
        ],
        sportsNews: [
          {
            title:
              "Injury update: key pacer cleared for final; workload to be managed",
            image:
              "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=600&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Women’s team seals series 3–0 with commanding all-round display",
            image:
              "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Coach confirms tactical shift ahead of derby; academy star in XI",
            image:
              "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Grand Slam build-up: top seeds cruise as qualifiers spring a surprise",
            image:
              "https://images.pexels.com/photos/3628912/pexels-photo-3628912.jpeg",
            href: "#",
          },
          {
            title:
              "F1: upgrades validated in FP2; long-run pace impresses rivals",
            image:
              "https://images.pexels.com/photos/18789693/pexels-photo-18789693.jpeg",
            href: "#",
          },
          {
            title:
              "ISL: late penalty drama sparks debate over VAR consistency",
            image:
              "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=600&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Hockey Pro League: India edge Argentina in shootout thriller",
            image:
              "https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=600&auto=format&fit=crop",
            href: "#",
          },
          {
            title:
              "Shuttler storms into semifinal; top seed knocked out in straight games",
            image:
              "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop",
            href: "#",
          },
        ],
      };
    }

    // ---- LIVE DATA MAPPING ----
    const hs = items.slice(0, 3).map((a) => ({
      tag: a?.category?.name || "Sports",
      title: a?.title || "",
      image: imgHero(a),
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));

    const trend = items.slice(3, 7).map((a) => ({
      tag: a?.category?.name || "Sports",
      title: a?.title || "",
      image: imgCard(a),
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));

    // Side lists
    const rec = items.slice(7, 11).map((a) => ({
      title: a?.title || "",
      image: imgCard(a),
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));
    const topList = items.slice(11, 15).map((a) => ({
      title: a?.title || "",
      image: imgCard(a),
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));

    const grid = items.slice(3, 11).map((a) => ({
      title: a?.title || "",
      image: imgCard(a),
      href: a?.slug ? `/article/${a.slug}` : "#",
    }));

    return {
      heroSlides:
        hs.length > 0
          ? hs
          : [
              {
                tag: "Sports",
                title: items[0]?.title || "",
                image: imgHero(items[0]),
                href: items[0]?.slug ? `/article/${items[0].slug}` : "#",
              },
            ],
      trending: trend,
      recent: rec,
      top: topList,
      sportsNews: grid,
    };
  }, [items]);

  /* ===== HERO slides rotator ===== */
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  useEffect(() => {
    if (heroPaused || !heroSlides.length) return;
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [heroPaused, heroSlides.length]);

  /* ===== Right lists (Recent / Top) ===== */
  const sideList =
    tab === "recent"
      ? recent.length
        ? recent
        : top
      : top.length
      ? top
      : recent;

  useEffect(() => setHighlightIndex(0), [tab, sideList.length]);

  useEffect(() => {
    if (paused || !sideList.length) return;
    const timer = setInterval(() => {
      setHighlightIndex((i) => (i + 1) % sideList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, sideList.length]);

  const [hiStyle, setHiStyle] = useState({ top: 0, height: 0 });
  useEffect(() => {
    const container = listRef.current;
    const target = itemRefs.current[highlightIndex];
    if (!container || !target) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const top = tRect.top - cRect.top + container.scrollTop;
    const height = tRect.height;
    requestAnimationFrame(() => setHiStyle({ top, height }));
  }, [highlightIndex, tab, sideList.length]);

  /* ===== SIMPLE LIVE PLACEHOLDER (static) ===== */
  const matches = [
    {
      sport: "Cricket • T20",
      left: { flag: "🇮🇳", name: "IND", score: "172–7" },
      right: { flag: "🇧🇩", name: "BAN", score: "168–8" },
      status: "LIVE • 19.4 ov",
      live: true,
    },
    {
      sport: "Football • La Liga",
      left: { flag: "🇪🇸", name: "RMA", score: "2" },
      right: { flag: "🇪🇸", name: "SEV", score: "1" },
      status: "88’",
      live: true,
    },
  ];

  return (
    <>
      {/* Use string keys for CSS vars so React sets them correctly */}
      <section
        ref={sectionRef}
        className="sports-wrap"
        aria-label="Sports"
        style={{
          "--sports-spot-scale": String(spotScale),
          "--sports-spot-opacity": String(spotOpacity),
        }}
      >
        {/* Force visible even if custom props aren’t read by CSS */}
        <div
          className="sports-spot"
          aria-hidden="true"
          style={{
            transform: `scale(${Math.max(0, spotScale)})`,
            opacity: Math.max(0, spotOpacity),
          }}
        />

        <h2 className="tv-section-title tv-plain sports-title">SPORTS</h2>

        <div className="sports-grid">
          {/* LEFT: HERO ROTATOR + TRENDING */}
          <div
            className="sports-left"
          >
            <div
              className="sport-rotator"
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
            >
              {heroSlides.map((h, i) => (
                <a
                  key={h.href || i}
                  href={h.href || "#"}
                  className={`sport-hero sh-slide ${
                    i === heroIndex ? "is-active" : ""
                  }`}
                  aria-hidden={i === heroIndex ? "false" : "true"}
                  tabIndex={i === heroIndex ? 0 : -1}
                  onClick={(e) => {
                    if (!h.href || h.href === "#") e.preventDefault();
                  }}
                >
                  <img
                    src={h.image || FALLBACK_HERO}
                    alt=""
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_HERO) {
                        e.currentTarget.src = FALLBACK_HERO;
                      }
                    }}
                  />
                  <div className="sh-glass" />
                  <div className="sh-copy">
                    <span className="sh-tag">{h.tag || "Sports"}</span>
                    <h3 className="sh-title">
                      <span className="hl-sweep">{h.title}</span>
                    </h3>
                  </div>
                </a>
              ))}
            </div>

            <div className="row-head">
              <h4>Trendy News</h4>
              <div className="dots" aria-hidden="true">
                <span className="dot is-active" />
                <span className="dot" />
                <span className="dot" />
              </div>
            </div>

            <div className="trend-grid">
              {trending.map((t, i) => (
                <a
                  className="trend-card"
                  href={t.href || "#"}
                  key={t.href || i}
                  onClick={(e) => {
                    if (!t.href || t.href === "#") e.preventDefault();
                  }}
                >
                  <div className="tc-thumb">
                    <img
                      src={t.image || FALLBACK_CARD}
                      alt={t.tag || "Sports"}
                      onError={(e) => {
                        if (e.currentTarget.src !== FALLBACK_CARD) {
                          e.currentTarget.src = FALLBACK_CARD;
                        }
                      }}
                    />
                    <span className="tc-tag">{t.tag || "Sports"}</span>
                  </div>
                  <div className="tc-title">{t.title}</div>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: RECENT/TOP + LIVE */}
          <aside className="sports-right">
            <div className="side-panel">
              <div className="side-tabs" role="tablist" aria-label="News tabs">
                <button
                  className={`tab ${tab === "recent" ? "active" : ""}`}
                  onClick={() => setTab("recent")}
                  role="tab"
                  aria-selected={tab === "recent"}
                >
                  Recent News
                </button>
                <button
                  className={`tab ${tab === "top" ? "active" : ""}`}
                  onClick={() => setTab("top")}
                  role="tab"
                  aria-selected={tab === "top"}
                >
                  Top Story
                </button>
              </div>

              <div
                className="side-list"
                ref={listRef}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div
                  className="side-hi-bg"
                  style={{ top: hiStyle.top, height: hiStyle.height }}
                  aria-hidden="true"
                />
                {sideList.map((n, i) => (
                  <a
                    className="side-item"
                    href={n.href || "#"}
                    key={n.href || i}
                    ref={(el) => (itemRefs.current[i] = el)}
                    onClick={(e) => {
                      if (!n.href || n.href === "#") e.preventDefault();
                    }}
                  >
                    <div className="si-thumb">
                      <img
                        src={n.image || FALLBACK_CARD}
                        alt=""
                        onError={(e) => {
                          if (e.currentTarget.src !== FALLBACK_CARD) {
                            e.currentTarget.src = FALLBACK_CARD;
                          }
                        }}
                      />
                    </div>
                    <div className="si-title">{n.title}</div>
                  </a>
                ))}
              </div>
            </div>

            <div className="live-panel">
              <div className="live-head">
                <h4>Live Match</h4>
                <span className="live-dot" />
              </div>

              <div className="live-list">
                {matches.map((m, i) => (
                  <div className="match" key={i}>
                    <div className="match-meta">{m.sport}</div>
                    <div className="match-row">
                      <div className="team left">
                        <span className="flag">{m.left.flag}</span>
                        <span className="name">{m.left.name}</span>
                        <span className="score">{m.left.score}</span>
                      </div>
                      <div className="vs">vs</div>
                      <div className="team right">
                        <span className="flag">{m.right.flag}</span>
                        <span className="name">{m.right.name}</span>
                        <span className="score">{m.right.score}</span>
                      </div>
                    </div>
                    <div className={`status ${m.live ? "is-live" : ""}`}>
                      {m.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* ===== SPORTS NEWS GRID ===== */}
        <div className="sports-breaking-panel">
          <div className="breaking-head">
            <h3 className="breaking-title">Breaking — Sports</h3>
          </div>

          <div className="sb-grid">
            {sportsNews.map((it, i) => (
              <a
                className="sb-item"
                href={it.href || "#"}
                key={it.href || i}
                onClick={(e) => {
                  if (!it.href || it.href === "#") e.preventDefault();
                }}
              >
                <div className="sb-thumb">
                  <img
                    src={it.image || FALLBACK_CARD}
                    alt=""
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_CARD) {
                        e.currentTarget.src = FALLBACK_CARD;
                      }
                    }}
                  />
                </div>
                <div className="sb-title">{it.title}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
