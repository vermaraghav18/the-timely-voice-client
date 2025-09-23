// pages/HomePage.jsx
import { useEffect, useState } from "react";
import i18n from "../i18n";
import { fetchHomeSections } from "../api";

import FeaturedArticle from "../components/FeaturedArticle.jsx";
import ArticleBlockDark from "../components/ArticleBlockDark.jsx";
import ArticleBlockLight from "../components/ArticleBlockLight.jsx";
import BreakingSection from "../components/BreakingSection.jsx";
import SportsShowcase from "../components/SportsShowcase.jsx";
import FinanceSection from "../components/FinanceSection.jsx";
import TechSection from "../components/TechSection.jsx";
import EntertainmentSection from "../components/EntertainmentSection.jsx";
import BusinessSection from "../components/BusinessSection.jsx";
import NewsGrid from "../components/NewsRail.jsx";
import SectionTriColumn from "../components/SectionTriColumn.jsx";
import SectionTriColumnB from "../components/SectionTriColumnB.jsx";
import NewsSplit from "../components/NewsSplit.jsx";

export default function HomePage() {
  // 1) Load all homepage blocks from backend in one call
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchHomeSections(i18n?.language || "en")
      .then((data) => {
        if (!alive) return;
        setSections(data);
        setLoading(false);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [i18n?.language]);

  // 2) Simple loading / error handling (keeps UI predictable)
  if (loading) return <div className="page">Loading…</div>;
  if (error) return <div className="page">Error: {error}</div>;
  if (!sections) return <div className="page" />;

  // 3) Opinions aren’t in backend yet → hide the panel if empty
  const opinions = []; // placeholder until we add an Opinions source

  return (
    <div className="page">
      {/* If your FeaturedArticle supports a prop like `article`, pass it; 
         otherwise keep it as-is and we’ll wire it later inside that component. */}
      <FeaturedArticle article={sections.hero || null} />

      {/* Keep your existing blocks. If these components can accept `items`, pass them.
         If they ignore extra props, no problem. */}
      <ArticleBlockLight />

      <SectionTriColumn />
      <NewsSplit />
      <NewsGrid />

      {/* Two-column layout: Center (Breaking) | Right (Opinions) */}
      <div className="section-wrap">
        <div className="news-3col two-col">
          <div className="news-center">
            {/* Breaking now uses backend data */}
            <BreakingSection
              items={sections.breaking || []}
              title="Breaking — India"
            />
          </div>

          {/* Hide Opinions panel if we have nothing */}
          {opinions.length > 0 && (
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
          )}
        </div>
      </div>

      <SectionTriColumnB />

      {/* If these can take items, great; if not, they’ll render their own defaults for now.
         Later we can open each component and pass `sections.finance` / `sections.tech`, etc. */}
      <SportsShowcase items={sections.sports || []} />

      <ArticleBlockDark />
      <div style={{ height: 16 }} />

      <div style={{ height: 16 }} />
      <BusinessSection items={sections.business || []} />

      <div style={{ height: 16 }} />
      <FinanceSection items={sections.finance || []} />

      <div style={{ height: 16 }} />
      <EntertainmentSection items={sections.entertainment || []} />

      <TechSection items={sections.tech || []} />

      <div style={{ height: 16 }} />
    </div>
  );
}
