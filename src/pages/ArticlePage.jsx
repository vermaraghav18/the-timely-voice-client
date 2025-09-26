// client/src/pages/ArticlePage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { articles } from "../shared/api";   // ✅ use the shared API module
import i18n from "../i18n";

const FALLBACK_HERO = "https://picsum.photos/seed/article-hero/1200/675";

export default function ArticlePage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let aborted = false;
    setState({ loading: true, error: "", data: null });

    articles
      .get(slug) // hits /api/articles/:slug per your shared API
      .then((data) => {
        if (!aborted) setState({ loading: false, error: "", data });
      })
      .catch((err) => {
        if (!aborted)
          setState({
            loading: false,
            error: err?.message || "Failed to load article",
            data: null,
          });
      });

    return () => {
      aborted = true;
    };
  }, [slug, i18n?.language]); // keep if you later localize content server-side

  useEffect(() => {
    const t = state?.data?.title
      ? `${state.data.title} — The Timely Voice`
      : "Article — The Timely Voice";
    document.title = t;
  }, [state?.data?.title]);

  if (state.loading) return <div className="page">Loading…</div>;
  if (state.error) return <div className="page">Error: {state.error}</div>;

  const a = state.data || {};

  return (
    <div className="page article">
      <nav className="crumbs">
        <Link to="/">Home</Link>
        {a?.category?.slug && (
          <>
            {" / "}
            <Link to={`/section/${a.category.slug}`}>
              {a.category.name || a.category.slug}
            </Link>
          </>
        )}
      </nav>

      <h1 className="article-title">{a.title || ""}</h1>

      <div className="article-meta">
        <span>{a.author || "Staff"}</span>
        {a.publishedAt && (
          <>
            {" · "}
            <time dateTime={a.publishedAt}>
              {new Date(a.publishedAt).toLocaleString()}
            </time>
          </>
        )}
        {a.source && (
          <>
            {" · "}
            <span>{a.source}</span>
          </>
        )}
      </div>

      <div className="article-hero">
        <img
          src={a.heroImageUrl || a.thumbnailUrl || FALLBACK_HERO}
          alt={a.title || ""}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_HERO)
              e.currentTarget.src = FALLBACK_HERO;
          }}
        />
      </div>

      {a.bodyHtml ? (
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: a.bodyHtml }}
        />
      ) : (
        <p className="article-body">{a.body || ""}</p>
      )}

      {!!(a.tagsCsv || "").trim() && (
        <div className="article-tags">
          {(a.tagsCsv || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((t) => (
              <span className="tag" key={t}>
                #{t}
              </span>
            ))}
        </div>
      )}

      {!!(a.related?.length) && (
        <>
          <h3>Related</h3>
          <div
            className="tv-rail"
            style={{ overflowX: "auto", display: "flex", gap: 16 }}
          >
            {a.related.map((r) => (
              <Link key={r.slug} className="tv-card" to={`/article/${r.slug}`}>
                <div className="tv-media">
                  <img
                    src={r.thumbnailUrl || r.heroImageUrl || FALLBACK_HERO}
                    alt={r.title}
                  />
                </div>
                <div className="tv-body">
                  <h4 className="tv-title">{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
