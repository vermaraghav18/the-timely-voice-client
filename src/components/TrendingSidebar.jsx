// src/components/TrendingSidebar.jsx
import React, { useMemo } from "react";

const DEMO = [
  { id: "t1", title: "Markets whipsaw as tech rebounds", href: "#" },
  { id: "t2", title: "Heavy rain disrupts flights in Mumbai", href: "#" },
  { id: "t3", title: "AI push: govt unveils new compute mission", href: "#" },
  { id: "t4", title: "ISL: late penalty drama sparks debate", href: "#" },
  { id: "t5", title: "Gold near 3-week high on softer dollar", href: "#" },
];

function normalize(it, i) {
  // If it looks like a backend article:
  if (it && (it.slug || it.thumbnailUrl || it.heroImageUrl)) {
    return {
      id: it.id || it.slug || `trend-${i}`,
      title: it.title || "",
      href: it.slug ? `/article/${it.slug}` : "#",
      source: it.source || "",
      publishedAt: it.publishedAt || null,
    };
  }
  // Legacy/demo item:
  return {
    id: it?.id || `trend-${i}`,
    title: it?.title || "",
    href: it?.href || "#",
    source: it?.source || "",
    publishedAt: it?.publishedAt || null,
  };
}

export default function TrendingSidebar({
  items = [],
  max = 10,
  title = "Trending",
  showMeta = false, // toggle to show source/time below titles
}) {
  const list = useMemo(() => {
    const base = Array.isArray(items) && items.length ? items : DEMO;
    return base.slice(0, max).map(normalize);
  }, [items, max]);

  if (!list.length) return null;

  const headingId = "trending-title";

  return (
    <aside className="trending card" aria-labelledby={headingId}>
      <div className="trend-head">
        <h3 id={headingId}>{title}</h3>
      </div>

      <ol className="trend-list">
        {list.map((it, i) => (
          <li key={it.id}>
            <a className="u-ink" href={it.href} aria-label={it.title}>
              <span className="rank">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-title">{it.title}</span>
            </a>
            {showMeta && (it.source || it.publishedAt) && (
              <div className="t-meta">
                {it.source}
                {it.source && it.publishedAt ? " • " : ""}
                {it.publishedAt ? new Date(it.publishedAt).toLocaleString() : ""}
              </div>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
