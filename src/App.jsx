// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import FeaturedArticle from "./components/FeaturedArticle.jsx";
import ArticleBlockDark from "./components/ArticleBlockDark.jsx";
import ArticleBlockLight from "./components/ArticleBlockLight.jsx";
// ⬇️ use the data-driven container (handles its own fetch)
import BreakingContainer from "./components/BreakingContainer.jsx";
import SportsShowcase from "./components/SportsShowcase.jsx";
import FinanceSection from "./components/FinanceSection.jsx";
import TechSection from "./components/TechSection.jsx";
import EntertainmentSection from "./components/EntertainmentSection.jsx";
import BusinessSection from "./components/BusinessSection.jsx";
import NewsGrid from "./components/NewsRail.jsx";
import SectionTriColumn from "./components/SectionTriColumn.jsx";
import SectionTriColumnB from "./components/SectionTriColumnB.jsx";
import NewsSplitContainer from "./components/NewsSplitContainer.jsx";
import ArticlePage from "./pages/ArticlePage.jsx";
import WorldPage from "./pages/WorldPage.jsx";
import FeatureEssay from "./components/FeatureEssay.jsx";

import "./App.css";
import i18n from "./i18n";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000";

/* ------------ tiny route transition (fade + slight rise) ------------ */
function RouteTransition({ pathKey, children }) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    setInView(false);
    const id = requestAnimationFrame(() => setInView(true));
    return () => cancelAnimationFrame(id);
  }, [pathKey]);
  return <div className={`route-fade ${inView ? "is-in" : ""}`}>{children}</div>;
}

/* ---------------- helpers ---------------- */
function addTimes(list = []) {
  const now = Date.now();
  return list.map((it, i) => {
    const mins = (i + 1) * 3;
    const t = new Date(now - mins * 60 * 1000).toISOString();
    return { ...it, _publishedAt: t, _minsAgo: `${mins} min ago` };
  });
}

/* map Featured (hero on top) from admin */
function mapFeaturedFromAdmin(cfg) {
  if (!cfg || typeof cfg !== "object") {
    return { article: null, related: [], top: [], trending: [] };
  }
  const hero = cfg.hero || {};
  const img = (hero.imageUrl || "").trim();

  const article = {
    slug: "",
    title: hero.title || "",
    summary: hero.summary || "",
    heroImageUrl: img || undefined,
    thumbnailUrl: img || undefined,
    author: "The Timely Voice",
    language: "en",
    status: "published",
    publishedAt: new Date().toISOString(),
  };

  const related = addTimes(
    (cfg.related || []).map((r) => ({
      title: r?.title || "",
      href: r?.href || "#",
      image: r?.image || "",
    }))
  );

  const top = (cfg.topStories || []).map((r) => ({
    title: r?.title || "",
    href: r?.href || "#",
    image: r?.image || "",
  }));

  const trending = (cfg.trendingStories || []).map((r) => ({
    title: r?.title || "",
    href: r?.href || "#",
    image: r?.image || "",
  }));

  return { article, related, top, trending };
}

/* map Article Block Light from admin */
function mapABLFromAdmin(cfg) {
  const safe = {
    featured: { title: "", summary: "", image: "", alt: "", href: "#", time: "" },
    featuredItems: [],
    opinions: { heading: "Opinions", items: [] },
    spotlightItems: [],
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
    ? cfg.featuredItems
        .filter(Boolean)
        .map((s) => ({
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
      ? cfg.opinions.items
          .filter(Boolean)
          .map((n) => ({
            title: n?.title || "",
            time: n?.time || "",
            image: n?.image || n?.imageUrl || "",
            alt: n?.alt || n?.title || "",
            href: n?.href || "#",
          }))
      : [],
  };

  const spotlightItems = Array.isArray(cfg.spotlightItems)
    ? cfg.spotlightItems
        .filter(Boolean)
        .map((n) => ({
          brand: n?.brand || "",
          title: n?.title || "",
          image: n?.image || n?.imageUrl || "",
          alt: n?.alt || n?.title || "",
          href: n?.href || "#",
        }))
    : [];

  return { featured, featuredItems, opinions, spotlightItems };
}

/* Resilient GET helpers */
async function fetchWithFallback(base, keys = []) {
  let lastErr;
  for (const key of keys) {
    try {
      const res = await fetch(`${base}/api/settings/${key}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} /api/settings/${key}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("All endpoints failed");
}

const fetchEssaySettingsWithFallback = (base) =>
  fetchWithFallback(base, ["featureEssay", "feature-essay", "feature_essay"]);

const fetchTriSettingsWithFallback = (base) =>
  fetchWithFallback(base, ["sectionTriColumn", "section-tri-column", "section_tri_column"]);

/* ---------------- Homepage ---------------- */
function HomePage({
  featuredArticle,
  relatedMini,
  topStories,
  trendingStories,
  opinions,
  onOpenFeatured,
  onOpenRelated,
  ablFeatured,
  ablFeaturedItems,
  ablOpinions,
  ablSpotlightItems,
  abdItem,
  abdRelated,
  essay,          // FeatureEssay server-shape object
  triProps,       // SectionTriColumn props from admin (optional)
}) {
  return (
    <div className="page">
      <FeaturedArticle
        article={featuredArticle}
        relatedItems={relatedMini}
        topStories={topStories}
        trendingStories={trendingStories}
        onOpenFeatured={onOpenFeatured}
        onOpenRelated={onOpenRelated}
      />

      {/* Feature Essay (admin-driven) */}
      {(essay?.headline || essay?.kicker || essay?.dek) ? (
        <FeatureEssay data={essay} />
      ) : null}

      {/* Article Block Dark (admin-driven) */}
      <ArticleBlockDark itemFromAdmin={abdItem} relatedFromAdmin={abdRelated} />

      {/* Article Block Light (admin-driven) */}
      <ArticleBlockLight
        featured={ablFeatured}
        featuredItems={ablFeaturedItems}
        opinions={ablOpinions}
        spotlightItems={ablSpotlightItems}
      />

      {/* Section Tri Column (admin-driven props if present, otherwise defaults) */}
      <SectionTriColumn
        leftTitle={triProps?.leftTitle}
        rightTitle={triProps?.rightTitle}
        techTitle={triProps?.techTitle}
        bizTitle={triProps?.bizTitle}
        feature={triProps?.feature}
        hero={triProps?.hero}
        popular={triProps?.popular}
        coverage={triProps?.coverage}
        techItems={triProps?.techItems}
        bizItems={triProps?.bizItems}
        leftPromoImg={triProps?.leftPromo?.img}
        leftPromoHref={triProps?.leftPromo?.href}
        leftPromoCaption={triProps?.leftPromo?.caption}
        rightPromoImg={triProps?.rightPromo?.img}
        rightPromoHref={triProps?.rightPromo?.href}
        rightPromoCaption={triProps?.rightPromo?.caption}
      />

      {/* News Split (admin-driven) */}
      <NewsSplitContainer />
      <NewsGrid />

      <div className="section-wrap">
        <div className="news-3col two-col">
          <div className="news-center">
            {/* 🔥 Breaking — now fully data-driven by BreakingContainer */}
            <BreakingContainer />
          </div>

          <aside className="panel-auto">
            <div className="side-title">Opinions</div>
            <div className="latest-list">
              {opinions.map((it, i) => (
                <a className="ln-item" href={it.href} key={i}>
                  <span className="ln-bullet">•</span>
                  <span className="ln-title">{it.title}</span>
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <SectionTriColumnB />
      <SportsShowcase />
      <div style={{ height: 16 }} />
      <BusinessSection />
      <div style={{ height: 16 }} />
      <FinanceSection />
      <div style={{ height: 16 }} />
      <EntertainmentSection />
      <TechSection />
      <div style={{ height: 16 }} />
    </div>
  );
}

function SectionPlaceholder({ title }) {
  return (
    <div className="page section-tight">
      <h1>{title}</h1>
      <p>This section page is under construction.</p>
    </div>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate(); // ✅ declared once

  /* Navbar config */
  const [navCfg, setNavCfg] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/navbar`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setNavCfg(await res.json());
      } catch {
        setNavCfg(null);
      }
    })();
  }, []);

  /* Apply header colors */
  useEffect(() => {
    const root = document.documentElement;
    const c = navCfg?.colors || {};
    if (c.blue1) root.style.setProperty("--blue-1", c.blue1);
    if (c.blue2) root.style.setProperty("--blue-2", c.blue2);
    if (c.blue3) root.style.setProperty("--blue-3", c.blue3);
    if (!c.blue1 && !c.blue2 && !c.blue3 && navCfg?.colors?.headerBg) {
      root.style.setProperty("--blue-1", navCfg.colors.headerBg);
      root.style.setProperty("--blue-2", navCfg.colors.headerBg);
      root.style.setProperty("--blue-3", navCfg.colors.headerBg);
    }
  }, [navCfg]);

  /* Featured settings (hero/top) */
  const [featuredCfg, setFeaturedCfg] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/featured`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setFeaturedCfg(await res.json());
      } catch {
        setFeaturedCfg(null);
      }
    })();
  }, []);
  const {
    article: featuredArticle,
    related: relatedMini,
    top: topStories,
    trending: trendingStories,
  } = useMemo(() => mapFeaturedFromAdmin(featuredCfg), [featuredCfg]);

  /* Article Block Light settings */
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
  const ablMapped = useMemo(() => mapABLFromAdmin(ablCfg), [ablCfg]);
  const ablFeatured =
    ablMapped?.featured || { title: "", summary: "", image: "", alt: "", href: "#", time: "" };
  const ablFeaturedItems = (ablMapped?.featuredItems || []).filter(Boolean);
  const ablOpinions = ablMapped?.opinions || { heading: "Opinions", items: [] };
  const ablSpotlightItems = (ablMapped?.spotlightItems || []).filter(Boolean);

  /* Article Block Dark settings */
  const [abdCfg, setAbdCfg] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/settings/articleBlockDark`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setAbdCfg(await res.json());
      } catch {
        setAbdCfg(null);
      }
    })();
  }, []);
  const abdItem = useMemo(() => {
    const a = abdCfg?.item || null;
    return a
      ? {
          title: a.title || "",
          byline: a.byline || "",
          summary: a.summary || "",
          imageUrl: a.imageUrl || a.image || "",
          imageAlt: a.imageAlt || a.title || "",
          href: a.href || "#",
        }
      : null;
  }, [abdCfg]);
  const abdRelated = useMemo(
    () => (Array.isArray(abdCfg?.related) ? abdCfg.related : []),
    [abdCfg]
  );

  /* Feature Essay settings */
  const [essayData, setEssayData] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEssaySettingsWithFallback(API_BASE);
        setEssayData(data || null);
      } catch {
        setEssayData(null);
      }
    })();
  }, []);

  /* Section Tri Column settings → pass as props */
  const [triCfg, setTriCfg] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTriSettingsWithFallback(API_BASE);
        setTriCfg(data || null);
      } catch {
        setTriCfg(null);
      }
    })();
  }, []);
  const triProps = useMemo(() => {
    if (!triCfg || typeof triCfg !== "object") return null;
    return {
      leftTitle: triCfg.leftTitle,
      rightTitle: triCfg.rightTitle,
      techTitle: triCfg.techTitle,
      bizTitle: triCfg.bizTitle,
      feature: triCfg.feature,
      hero: triCfg.hero,
      popular: triCfg.popular,
      coverage: triCfg.coverage,
      techItems: triCfg.techItems,
      bizItems: triCfg.bizItems,
      leftPromo: triCfg.leftPromo,
      rightPromo: triCfg.rightPromo,
    };
  }, [triCfg]);

  /* navigation handlers (use the single navigate above) */
  const onOpenFeatured = (article) => {
    if (article?.slug) navigate(`/article/${article.slug}`);
  };
  const onOpenRelated = (item) => {
    if (item?.slug) navigate(`/article/${item.slug}`);
  };

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /* Keep <html lang="…"> in sync */
  useEffect(() => {
    const applyLang = (lng) => {
      const html = document.documentElement;
      html.setAttribute("lang", lng || "en");
    };
    applyLang(i18n.resolvedLanguage);
    const handler = (lng) => applyLang(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  /* Sticky header height → CSS var */
  useEffect(() => {
    const setHeaderOffset = () => {
      const el = document.querySelector(".tv-header");
      if (!el) return;
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    };
    setHeaderOffset();
    const onResize = () => setHeaderOffset();
    window.addEventListener("resize", onResize);
    const el = document.querySelector(".tv-header");
    let ro;
    if (window.ResizeObserver && el) {
      ro = new ResizeObserver(setHeaderOffset);
      ro.observe(el);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setHeaderOffset).catch(() => {});
    }
    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, []);

  /* Opinions – sample list (left as-is) */
  const opinions = [
    { title: "Why infrastructure reforms must prioritise last-mile equity", href: "#" },
    { title: "AI regulation: striking a balance between speed and safety", href: "#" },
    { title: "A case for deeper federal cooperation on water sharing", href: "#" },
    { title: "What India’s EV surge means for grid planning", href: "#" },
    { title: "Reimagining public transport beyond mega metros", href: "#" },
    { title: "Digital payments: keeping users safe without killing UX", href: "#" },
    { title: "How to boost rural incomes without fuelling inflation", href: "#" },
  ];

  return (
    <>
      <Header
        config={navCfg}
        onGetDaily={() => alert("Subscribe: daily edition")}
        onSignIn={() => alert("Sign in clicked")}
      />

      {isHome ? <div style={{ height: 12 }} /> : null}

      <Routes>
        <Route
          path="/"
          element={
            <RouteTransition pathKey={location.pathname}>
              <HomePage
                featuredArticle={featuredArticle}
                relatedMini={relatedMini}
                topStories={topStories}
                trendingStories={trendingStories}
                opinions={opinions}
                onOpenFeatured={onOpenFeatured}
                onOpenRelated={onOpenRelated}
                ablFeatured={ablFeatured}
                ablFeaturedItems={ablFeaturedItems}
                ablOpinions={ablOpinions}
                ablSpotlightItems={ablSpotlightItems}
                abdItem={abdItem}
                abdRelated={abdRelated}
                essay={essayData}          /* Feature Essay settings */
                triProps={triProps}        /* Section Tri Column settings */
              />
            </RouteTransition>
          }
        />

        <Route
          path="/india"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="India" />
            </RouteTransition>
          }
        />

        <Route
          path="/world"
          element={
            <RouteTransition pathKey={location.pathname}>
              <WorldPage />
            </RouteTransition>
          }
        />

        <Route
          path="/finance"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Finance" />
            </RouteTransition>
          }
        />
        <Route
          path="/health"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Health & Lifestyle" />
            </RouteTransition>
          }
        />
        <Route
          path="/tech"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Tech" />
            </RouteTransition>
          }
        />
        <Route
          path="/entertainment"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Entertainment" />
            </RouteTransition>
          }
        />
        <Route
          path="/business"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Business" />
            </RouteTransition>
          }
        />
        <Route
          path="/sports"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Sports" />
            </RouteTransition>
          }
        />
        <Route
          path="/women-magazine"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="Women Magazine" />
            </RouteTransition>
          }
        />
        <Route
          path="/article/:slug"
          element={
            <RouteTransition pathKey={location.pathname}>
              <ArticlePage />
            </RouteTransition>
          }
        />
        <Route
          path="*"
          element={
            <RouteTransition pathKey={location.pathname}>
              <SectionPlaceholder title="404 — Page not found" />
            </RouteTransition>
          }
        />
      </Routes>

      {/* Transition CSS */}
      <style>{`
        .route-fade {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity .28s ease, transform .28s ease;
          will-change: opacity, transform;
        }
        .route-fade.is-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}
