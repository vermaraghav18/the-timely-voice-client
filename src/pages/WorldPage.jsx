// client/src/pages/WorldPage.jsx
import { useEffect, useMemo, useState } from "react";
import ArticleBlockLight from "../components/ArticleBlockLight.jsx";
import "../App.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

/* ---------- map admin ArticleBlockLight settings ---------- */
function mapABLFromAdmin(cfg) {
  const safe = {
    featured: { title: "", summary: "", image: "", alt: "", href: "#", time: "" },
    featuredItems: [],
    opinions: { heading: "Opinions", items: [] },
    spotlightItems: [],
    latestGrid: [],
    moreWorld: [],
  };
  if (!cfg || typeof cfg !== "object") return safe;

  const hero = cfg.hero || {};
  const featured = {
    title: hero.title || "",
    summary: hero.summary || "",
    image: hero.image || hero.imageUrl || "",
    alt: hero.title || "",
    href: hero.href || "#",
    time: hero.time || "",
  };

  const featuredItems = Array.isArray(cfg.featuredItems)
    ? cfg.featuredItems.map((s) => ({
        title: s?.title || "",
        summary: s?.summary || "",
        time: s?.time || "",
        image: s?.image || s?.imageUrl || "",
        alt: s?.alt || s?.title || "",
        href: s?.href || "#",
      }))
    : [];

  const opinions = {
    heading: cfg?.opinions?.heading || "Opinions",
    items: Array.isArray(cfg?.opinions?.items)
      ? cfg.opinions.items.map((n) => ({
          title: n?.title || "",
          time: n?.time || "",
          image: n?.image || n?.imageUrl || "",
          alt: n?.alt || n?.title || "",
          href: n?.href || "#",
        }))
      : [],
  };

  const spotlightItems = Array.isArray(cfg.spotlightItems)
    ? cfg.spotlightItems.map((n) => ({
        brand: n?.brand || "",
        title: n?.title || "",
        image: n?.image || n?.imageUrl || "",
        alt: n?.alt || n?.title || "",
        href: n?.href || "#",
      }))
    : [];

  const latestGrid = Array.isArray(cfg.latestGrid)
    ? cfg.latestGrid.map((n) => ({
        title: n?.title || "",
        image: n?.image || n?.imageUrl || "",
        href: n?.href || "#",
        publishedAt: n?.publishedAt || "",
      }))
    : [];

  const moreWorld = Array.isArray(cfg.moreWorld)
    ? cfg.moreWorld.map((n) => ({
        title: n?.title || "",
        summary: n?.summary || "",
        image: n?.image || n?.imageUrl || "",
        href: n?.href || "#",
        publishedAt: n?.publishedAt || "",
      }))
    : [];

  return { featured, featuredItems, opinions, spotlightItems, latestGrid, moreWorld };
}

/* ---------- tiny time-ago helper ---------- */
function timeAgo(iso) {
  if (!iso) return "";
  try {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diff = Math.max(0, now - then);
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
    const d = Math.floor(h / 24);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  } catch {
    return "";
  }
}

/* ---------- demo data fallbacks (only used if admin leaves empty) ---------- */
const demoLatest = [
  { title: "UN warns of rising global food insecurity amid conflicts",
    image:"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-8*60*1000).toISOString(), href:"#"},
  { title:"Asian markets steady as energy prices cool",
    image:"https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-22*60*1000).toISOString(), href:"#"},
  { title:"Himalayan glacier study flags faster melt this decade",
    image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-47*60*1000).toISOString(), href:"#"},
  { title:"Tech firms unveil new data centers to boost cloud capacity",
    image:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-79*60*1000).toISOString(), href:"#"},
  { title:"EU, US resume key trade talks; tariffs back on table",
    image:"https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-2*60*60*1000).toISOString(), href:"#"},
  { title:"Flood control teams deployed after heavy monsoon rains",
    image:"https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-3*60*60*1000).toISOString(), href:"#"},
  { title:"Air travel demand surges; airports advise early check-ins",
    image:"https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-5*60*60*1000).toISOString(), href:"#"},
  { title:"Startups in Asia see renewed funding as valuations stabilize",
    image:"https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-8*60*60*1000).toISOString(), href:"#"},
];

const demoLandscape = [
  { title:"Satellite images show rapid urban growth on city outskirts",
    summary:"New analysis highlights how fringe districts expanded 20% in five years, raising concerns over transit and water planning.",
    image:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-12*60*1000).toISOString(), href:"#"},
  { title:"Research labs publish open toolkits for model safety evals",
    summary:"Reproducible tests focus on jailbreak robustness, prompt injection, and sensitive data leaks across model sizes.",
    image:"https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-35*60*1000).toISOString(), href:"#"},
  { title:"Wildfires ease after overnight rain; air quality improves",
    summary:"Containment lines held as crews used cooler conditions to secure hotspots near suburbs.",
    image:"https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-58*60*1000).toISOString(), href:"#"},
  { title:"Scientists test low-cost desalination kit for coastal towns",
    summary:"Prototype shows stable output with solar heat and modular membranes; trials expand to island communities.",
    image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-2*60*60*1000).toISOString(), href:"#"},
  { title:"Metro expansion clears final approval; tunneling starts Q4",
    summary:"Stations will feature step-free access, platform doors, and integrated bus bays.",
    image:"https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-3*60*60*1000).toISOString(), href:"#"},
  { title:"Hospitals adopt AI scribe pilots to cut paperwork",
    summary:"Clinicians recover 1–2 hours per shift; privacy boards demand strong on-prem safeguards.",
    image:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-4*60*60*1000).toISOString(), href:"#"},
  { title:"Seaports trial electric tugboats to reduce emissions",
    summary:"Battery swap systems aim to keep turnarounds within current berth schedules.",
    image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-6*60*60*1000).toISOString(), href:"#"},
  { title:"Cities test dynamic curb pricing to ease congestion",
    summary:"Sensors price loading zones by demand, nudging off-peak deliveries and freeing short-stay spots.",
    image:"https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?q=80&w=900&auto=format&fit=crop",
    publishedAt:new Date(Date.now()-9*60*60*1000).toISOString(), href:"#"},
];

export default function WorldPage() {
  const [ablCfg, setAblCfg] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/articleBlockLight`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setAblCfg(await res.json());
      } catch {
        setAblCfg(null);
      }
    })();
  }, []);
  const abl = useMemo(() => mapABLFromAdmin(ablCfg), [ablCfg]);

  const latest = abl.latestGrid?.length ? abl.latestGrid : demoLatest;
  const more = abl.moreWorld?.length ? abl.moreWorld : demoLandscape;

  return (
    <div className="page section-tight">
      {/* Same Article Block Light as homepage */}
      <ArticleBlockLight
        featured={abl.featured}
        featuredItems={abl.featuredItems}
        opinions={abl.opinions}
        spotlightItems={abl.spotlightItems}
      />

      {/* 4×2 grid */}
      <h2 className="tv-section-title tv-plain" style={{ marginTop: 24 }}>LATEST</h2>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(4, 1fr)" }}>
        {latest.map((it, i) => (
          <a
            key={i}
            href={it.href || "#"}
            onClick={(e) => { if (!it.href || it.href === "#") e.preventDefault(); }}
            style={{
              display: "block",
              background: "var(--tv-bg-soft)",
              border: "1px solid var(--tv-border)",
              textDecoration: "none",
              color: "inherit",
              /* THE ONE TRUE RADIUS: put it on the card, let everything clip inside it */
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div style={{ aspectRatio: "16/10" /* no radius here */ }}>
              <img
                src={it.image}
                alt={it.title}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => {
                  const fb = "https://picsum.photos/seed/world-fallback/800/500";
                  if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                }}
              />
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25 }}>{it.title}</div>
              <div style={{ marginTop: 4, fontSize: 11.5, color: "var(--tv-text-muted)" }}>
                {timeAgo(it.publishedAt)}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Stacked landscape list */}
      <h2 className="tv-section-title tv-plain" style={{ marginTop: 26 }}>MORE WORLD</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
        {more.map((it, i) => (
          <li key={i}>
            <a
              href={it.href || "#"}
              onClick={(e) => { if (!it.href || it.href === "#") e.preventDefault(); }}
              style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
                gap: 12,
                alignItems: "stretch",
                textDecoration: "none",
                color: "inherit",
                background: "var(--tv-bg-soft)",
                border: "1px solid var(--tv-border)",
                /* ONE radius here as well (on the anchor that wraps both columns) */
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ aspectRatio: "16/10" /* no radius here */ }}>
                <img
                  src={it.image}
                  alt={it.title}
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={(e) => {
                    const fb = "https://picsum.photos/seed/landscape-fallback/900/560";
                    if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                  }}
                />
              </div>
              <div style={{ padding: "10px 12px 10px 0", display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.25 }}>{it.title}</div>
                <div style={{ color: "var(--tv-text-muted)", fontSize: 13, lineHeight: 1.35 }}>
                  {it.summary}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--tv-text-muted)" }}>
                  {timeAgo(it.publishedAt)}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* responsive tweaks */}
      <style>{`
        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 860px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          a[style*="grid-template-columns: 220px 1fr"] {
            grid-template-columns: 200px 1fr !important;
          }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          a[style*="grid-template-columns: 220px 1fr"] {
            grid-template-columns: 1fr !important;
          }
          a[style*="grid-template-columns: 220px 1fr"] > div:first-child {
            aspect-ratio: 16 / 9 !important;
          }
        }
      `}</style>
    </div>
  );
}
