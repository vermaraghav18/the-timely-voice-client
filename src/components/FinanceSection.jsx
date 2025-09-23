import React, { useEffect, useMemo, useRef, useState } from "react";
import "./finance.css";

/** Utility: time ago */
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

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop";
const FALLBACK_THUMB = "https://picsum.photos/seed/fin-thumb/600/400";

/**
 * Map backend `items` (articles) into the shape your FinanceSection expects.
 * Keeps your complex layout, but sources content from API when available.
 */
function buildDataFromItems(items = [], fallback = demoData) {
  if (!Array.isArray(items) || items.length === 0) {
    // No API items → use your demoData as-is
    return fallback;
  }

  const safe = (i) => items[i] || {};
  const imgHero = (a) => a?.heroImageUrl || a?.thumbnailUrl || FALLBACK_HERO;
  const imgThumb = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_THUMB;

  const heroArticle = safe(0);
  const leadArticle = safe(1);

  // Briefs from next few articles
  const briefArticles = items.slice(2, 6);

  // Grid/news list from remaining
  const gridArticles = items.slice(2); // reuse all after hero/lead

  const data = {
    // updatedAgo comes from hero publishedAt if present
    updatedAgo: timeAgo(heroArticle.publishedAt) || fallback.updatedAgo,

    // HERO block
    hero: {
      image: imgHero(heroArticle),
      alt: heroArticle.title || "",
      title: heroArticle.title || fallback.hero.title,
      subtitle: heroArticle.summary || fallback.hero.subtitle,
      href: heroArticle.slug ? `/article/${heroArticle.slug}` : "#",
    },

    // LEAD block (center top)
    lead: {
      title: leadArticle.title || fallback.lead.title,
      subtitle: leadArticle.summary || fallback.lead.subtitle,
      // tags aren’t in backend yet: derive from category or fallback
      tags: [
        leadArticle.category?.name || "Markets",
        (leadArticle.source || "The Timely Voice"),
      ],
      href: leadArticle.slug ? `/article/${leadArticle.slug}` : "#",
    },

    // Two rows of briefs (we’ll render first two, then next two)
    briefs:
      briefArticles.length > 0
        ? briefArticles.map((b, idx) => ({
            id: b.id || `b${idx}`,
            title: b.title || "",
            time: timeAgo(b.publishedAt) || "",
            href: b.slug ? `/article/${b.slug}` : "#",
          }))
        : fallback.briefs,

    // Right side markets: keep your demo for now
    markets: fallback.markets,

    // Scrolling ticker: keep your demo for now
    ticker: fallback.ticker,

    // Sector chips: keep your demo for now
    sectors: fallback.sectors,

    // Optional hero slides: build from hero + two grid items
    heroSlides: [
      {
        image: imgHero(heroArticle),
        alt: heroArticle.title || "",
        title: heroArticle.title || "",
        subtitle: heroArticle.summary || "",
        href: heroArticle.slug ? `/article/${heroArticle.slug}` : "#",
      },
      ...gridArticles.slice(0, 2).map((g) => ({
        image: imgThumb(g),
        alt: g.title || "",
        title: g.title || "",
        subtitle: g.summary || "",
        href: g.slug ? `/article/${g.slug}` : "#",
      })),
    ],

    // Bottom finance news grid (4x3)
    financeNews:
      gridArticles.length > 0
        ? gridArticles.slice(0, 12).map((n) => ({
            title: n.title || "",
            image: imgThumb(n),
            href: n.slug ? `/article/${n.slug}` : "#",
          }))
        : fallback.financeNews, // if no API items, use demo grid
  };

  return data;
}

export default function FinanceSection({
  // NEW: accept API items (e.g., from HomePage: <FinanceSection items={sections.finance} />)
  items = [],
  // Legacy prop still supported; if you pass `data`, it has priority.
  data,
}) {
  // 1) Decide the content source: data (if given) > items (mapped) > demoData
  const built = useMemo(
    () => (data ? data : buildDataFromItems(items, demoData)),
    [data, items]
  );

  const {
    hero,
    lead,
    briefs,
    sectors,
    markets,
    ticker,
    updatedAgo,
    heroSlides: providedHeroSlides,
    financeNews,
  } = built;

  /* ================= BG DOT (green) — scale with scroll visibility ================= */
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

  /* ================= HERO ROTATOR (fade/slide every 2s) ================= */
  const heroSlides =
    providedHeroSlides && providedHeroSlides.length
      ? providedHeroSlides
      : [
          {
            image: hero.image,
            alt: hero.alt,
            title: hero.title,
            subtitle: hero.subtitle,
            href: hero.href || "#",
          },
        ];

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (heroPaused || heroSlides.length < 2) return;
    const t = setInterval(
      () => setHeroIndex((i) => (i + 1) % heroSlides.length),
      2000
    );
    return () => clearInterval(t);
  }, [heroPaused, heroSlides.length]);

  /* ================= Moving highlight for the 4×3 finance grid ================= */
  const gridRef = useRef(null);
  const itemRefs = useRef([]);
  const [gridPaused, setGridPaused] = useState(false);
  const [gridIndex, setGridIndex] = useState(0);
  const [gridHiStyle, setGridHiStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (gridPaused || !financeNews?.length) return;
    const t = setInterval(() => {
      setGridIndex((i) => (i + 1) % financeNews.length);
    }, 2000);
    return () => clearInterval(t);
  }, [gridPaused, financeNews?.length]);

  useEffect(() => {
    const grid = gridRef.current;
    const target = itemRefs.current[gridIndex];
    if (!grid || !target) return;

    const g = grid.getBoundingClientRect();
    const r = target.getBoundingClientRect();

    setGridHiStyle({
      top: r.top - g.top + grid.scrollTop,
      left: r.left - g.left + grid.scrollLeft,
      width: r.width,
      height: r.height,
    });
  }, [gridIndex]);

  return (
    <section
      ref={secRef}
      className="fin-wrap"
      aria-labelledby="finance-title"
      style={{ "--finDotScale": dotScale }}
    >
      {/* green back circle */}
      <div className="fin-bg-dot" aria-hidden="true" />

      <header className="fin-header">
        <h2 id="finance-title" className="fin-title">
          FINANCE
        </h2>
      </header>

      <div className="fin-grid">
        {/* LEFT: HERO ROTATOR */}
        <div
          className="fin-hero-rotator"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          {heroSlides.map((h, i) => (
            <article
              key={i}
              className={`fin-hero card ${i === heroIndex ? "is-active" : ""}`}
              aria-hidden={i === heroIndex ? "false" : "true"}
              tabIndex={i === heroIndex ? 0 : -1}
            >
              <a
                className="fin-hero-img"
                href={h.href || "#"}
                onClick={(e) => {
                  if (!h.href || h.href === "#") e.preventDefault();
                }}
              >
                <img
                  src={h.image || FALLBACK_HERO}
                  alt={h.alt || ""}
                  loading="lazy"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_HERO) {
                      e.currentTarget.src = FALLBACK_HERO;
                    }
                  }}
                />
              </a>
              <div className="fin-hero-text">
                <h3 className="fin-hero-title">{h.title}</h3>
                {h.subtitle ? (
                  <p className="fin-hero-sub">{h.subtitle}</p>
                ) : null}
                <time className="fin-time">Updated {updatedAgo}</time>
              </div>
            </article>
          ))}
        </div>

        {/* CENTER: lead story + chips + 2 briefs */}
        <div className="fin-center">
          <div className="fin-lead">
            <a
              href={lead.href || "#"}
              onClick={(e) => {
                if (!lead.href || lead.href === "#") e.preventDefault();
              }}
            >
              <h3 className="fin-lead-title">{lead.title}</h3>
            </a>
            <p className="fin-lead-sub">{lead.subtitle}</p>
            <div className="fin-chips">
              {(lead.tags || []).map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="fin-briefs">
            {(briefs || []).slice(0, 2).map((b) => (
              <article className="brief card" key={b.id}>
                <a
                  href={b.href || "#"}
                  onClick={(e) => {
                    if (!b.href || b.href === "#") e.preventDefault();
                  }}
                >
                  <h4 className="brief-title">{b.title}</h4>
                </a>
                <time className="brief-time">{b.time}</time>
              </article>
            ))}
          </div>
        </div>

        {/* RIGHT: market tiles (still demo) */}
        <aside className="fin-markets">
          {markets.map((m) => (
            <div
              key={m.symbol}
              className={`mkt card ${m.change >= 0 ? "up" : "down"}`}
            >
              <div className="mkt-head">
                <span className="mkt-name">{m.name}</span>
                <span className="mkt-symbol">{m.symbol}</span>
              </div>
              <div className="mkt-val">{m.value}</div>
              <div className="mkt-chg">
                {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change).toLocaleString()}
              </div>
              <svg
                className="mkt-spark"
                viewBox="0 0 100 28"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline
                  className="spark-line"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  points={m.spark.join(" ")}
                />
              </svg>
            </div>
          ))}
        </aside>
      </div>

      {/* Sector heat buttons (still demo) */}
      <div className="fin-sectors">
        {[...new Map(sectors.map((s) => [s.name, s])).values()].map((s, i) => (
          <button
            key={`${s.name}-${s.trend}-${i}`}
            className={`sector ${s.trend}`}
            aria-label={`${s.name} ${s.trend}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Additional briefs row (under hero) */}
      <div className="fin-briefs-row">
        {(briefs || []).slice(2, 4).map((b) => (
          <article className="brief card" key={b.id}>
            <a
              href={b.href || "#"}
              onClick={(e) => {
                if (!b.href || b.href === "#") e.preventDefault();
              }}
            >
              <h4 className="brief-title">{b.title}</h4>
            </a>
            <time className="brief-time">{b.time}</time>
          </article>
        ))}
      </div>

      {/* Finance news grid (4×3) with moving highlight */}
      <div
        className="fin-news-grid"
        ref={gridRef}
        onMouseEnter={() => setGridPaused(true)}
        onMouseLeave={() => setGridPaused(false)}
      >
        {/* floating highlight box */}
        <div
          className="fin-grid-hi"
          style={{
            top: gridHiStyle.top,
            left: gridHiStyle.left,
            width: gridHiStyle.width,
            height: gridHiStyle.height,
          }}
          aria-hidden="true"
        />
        {(financeNews || []).map((n, i) => (
          <a
            className="fn-item"
            href={n.href || "#"}
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            onClick={(e) => {
              if (!n.href || n.href === "#") e.preventDefault();
            }}
          >
            <div className="fn-thumb">
              <img
                src={n.image || FALLBACK_THUMB}
                alt=""
                onError={(e) => {
                  if (e.currentTarget.src !== FALLBACK_THUMB) {
                    e.currentTarget.src = FALLBACK_THUMB;
                  }
                }}
              />
            </div>
            <div className="fn-title">{n.title}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- demo data (kept for fallback & non-news widgets) ---------- */
const demoData = {
  updatedAgo: "2m ago",
  hero: {
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop",
    alt: "US flag near stock exchange building",
    title: "Wall Street shrugs off recession fears, powers higher",
    subtitle:
      "Investors are rethinking how long the good times can roll, betting on the economy’s resilience",
    href: "#",
  },
  lead: {
    title: "Wall Street shrugs off recession fears, powers higher",
    subtitle:
      "Investors are rethinking how long the good times can roll, betting on the economy’s resilience",
    tags: ["Regulators", "Banks"],
    href: "#",
  },
  briefs: [
    { id: "b1", title: "Federal Reserve remains cautious on inflation risks", time: "1 hour ago", href: "#" },
    { id: "b2", title: "Regulators propose new rules for regional banks", time: "3 hours ago", href: "#" },
    { id: "b3", title: "Crude oil rises as OPEC sticks to demand growth", time: "4 hours ago", href: "#" },
    { id: "b4", title: "USD/INR steady ahead of CPI data", time: "5 hours ago", href: "#" },
  ],
  markets: [
    { name: "NIFTY 50", symbol: "NIFTY", value: "19,048.20", change: 152.95, spark: "0,20 20,8 40,12 60,5 80,10 100,2".split(" ") },
    { name: "Sensex", symbol: "SENSEX", value: "64,112.65", change: 330.54, spark: "0,18 20,10 40,12 60,14 80,9 100,16".split(" ") },
    { name: "Nasdaq", symbol: "IXIC", value: "13,523.99", change: 8.28, spark: "0,12 20,14 40,9 60,15 80,12 100,18".split(" ") },
    { name: "Dow", symbol: "DJI", value: "35,756.90", change: -58.04, spark: "0,8 20,12 40,10 60,7 80,9 100,6".split(" ") },
    { name: "USD/INR", symbol: "USDINR", value: "82.65", change: 0.25, spark: "0,16 20,12 40,14 60,16 80,15 100,17".split(" ") },
    { name: "Crude Oil", symbol: "WTI", value: "78.23", change: -0.41, spark: "0,12 20,10 40,11 60,8 80,9 100,7".split(" ") },
  ],
  sectors: [
    { name: "ENERGY", trend: "down" },
    { name: "FINANC", trend: "up" },
    { name: "HEALTH", trend: "up" },
    { name: "COMMS", trend: "down" },
    { name: "CONS ST", trend: "down" },
    { name: "REALTY", trend: "up" },
    { name: "MATLS", trend: "down" },
    { name: "UTILS", trend: "up" },
  ],
  ticker: [
    { name: "SENSEX", value: "64,112.65", change: 1, changeAbs: 64.12 },
    { name: "USD/INR", value: "82.65", change: 1, changeAbs: 0.25 },
    { name: "NIFTY 50", value: "19,048.20", change: 1, changeAbs: 152.95 },
    { name: "CRUDE OIL", value: "78.23", change: -1, changeAbs: 0.41 },
  ],
  financeNews: [
    { title: "Rupee steady amid mixed global cues; traders eye CPI print this week", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Bond yields ease as crude dips; street watches RBI commentary closely", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "IT stocks extend gains on upbeat deal pipeline; valuations in focus", image: "https://images.unsplash.com/photo-1536227661368-deef57acf1d0?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "PSU banks rally on strong credit growth; provisioning trends improve", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Gold holds near 3-week high as dollar softens; ETF inflows pick up", image: "https://images.unsplash.com/photo-1610375229734-4cc5669f3a00?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Auto shares mixed; festive demand outlook & inventory watch continue", image: "https://images.unsplash.com/photo-1531934788018-04f9b45316d7?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "FMCG under pressure as input costs normalize; margins seen peaking", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Startups raise late-stage rounds; PE investors turn selective on price", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Realty index climbs on robust pre-sales; rate-cut hopes aid sentiment", image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Crude pares gains; OPEC+ output signals and US stocks in spotlight", image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "Brokerages upgrade select midcaps; earnings revision cycle ongoing", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop", href: "#" },
    { title: "NBFCs eye lower borrowing costs; securitisation market stays active", image: "https://images.unsplash.com/photo-1518183214770-9cffbec72538?q=80&w=600&auto=format&fit=crop", href: "#" },
  ],
};
