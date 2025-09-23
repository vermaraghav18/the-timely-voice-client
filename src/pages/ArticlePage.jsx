// client/src/pages/ArticlePage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import i18n from "../i18n";
import { fetchArticle } from "../api";

const FALLBACK_HERO = "https://picsum.photos/seed/article-hero/1200/675";

export default function ArticlePage() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ loading: true });
    fetchArticle(slug, { lang: i18n?.language || "en", signal: ctrl.signal })
      .then((data) => setState({ loading: false, data }))
      .catch((err) => setState({ loading: false, error: err.message }));
    return () => ctrl.abort();
  }, [slug, i18n?.language]);

  if (state.loading) return <div className="page">Loading…</div>;
  if (state.error) return <div className="page">Error: {state.error}</div>;
  const a = state.data || {};

  return (
    <div className="page article">
      <nav className="crumbs">
        <Link to="/">Home</Link>
        {a?.category?.slug && <> / <Link to={`/section/${a.category.slug}`}>{a.category.name || a.category.slug}</Link></>}
      </nav>

      <h1 className="article-title">{a.title}</h1>
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
        {a.source && <> {" · "} <span>{a.source}</span></>}
      </div>

      <div className="article-hero">
        <img
          src={a.heroImageUrl || a.thumbnailUrl || FALLBACK_HERO}
          alt={a.title || ""}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_HERO) e.currentTarget.src = FALLBACK_HERO;
          }}
        />
      </div>

      {/* Body: if server provides HTML, use dangerouslySetInnerHTML; if plain text, render as <p> */}
      {a.bodyHtml ? (
        <div className="article-body" dangerouslySetInnerHTML={{ __html: a.bodyHtml }} />
      ) : (
        <p className="article-body">{a.body || ""}</p>
      )}

      {!!(a.tagsCsv || "").trim() && (
        <div className="article-tags">
          {(a.tagsCsv || "")
            .split(",")
            .map(t => t.trim())
            .filter(Boolean)
            .map(t => <span className="tag" key={t}>#{t}</span>)}
        </div>
      )}

      {/* Simple related rail if provided */}
      {!!(a.related?.length) && (
        <>
          <h3>Related</h3>
          <div className="tv-rail" style={{ overflowX: "auto", display: "flex", gap: 16 }}>
            {a.related.map((r) => (
              <Link key={r.slug} className="tv-card" to={`/article/${r.slug}`}>
                <div className="tv-media">
                  <img src={r.thumbnailUrl || r.heroImageUrl || FALLBACK_HERO} alt={r.title} />
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
