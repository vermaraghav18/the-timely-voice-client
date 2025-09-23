// pages/SectionPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import i18n from "../i18n";
import { fetchArticles } from "../api";
import BreakingSection from "../components/BreakingSection.jsx";

const FALLBACK_IMG = "https://picsum.photos/seed/section-fallback/600/400";

export default function SectionPage() {
  const { sectionKey } = useParams();

  const title = useMemo(() => {
    const t = (sectionKey || "").replace(/-/g, " ");
    return t.length ? t[0].toUpperCase() + t.slice(1) : "Section";
  }, [sectionKey]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchArticles({
      category: sectionKey,            // backend expects the slug here
      lang: i18n?.language || "en",
      limit: 20,
      offset: 0,
    })
      .then((list) => {
        if (!alive) return;
        // Map backend → BreakingSection shape
        const mapped = (list || []).map((a) => ({
          title: a.title,
          image: a.thumbnailUrl || a.heroImageUrl || FALLBACK_IMG,
          href: a.slug ? `/article/${a.slug}` : "#",
        }));
        setItems(mapped);
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
  }, [sectionKey, i18n?.language]);

  return (
    <div className="page">
      <div className="section-headline">
        <h1 style={{ margin: "12px 0 8px" }}>{title}</h1>
        <div className="thin-rule" />
      </div>

      {loading && <div>Loading…</div>}
      {error && !loading && <div>Error: {error}</div>}

      {!loading && !error && <BreakingSection items={items} title={title} />}
    </div>
  );
}
