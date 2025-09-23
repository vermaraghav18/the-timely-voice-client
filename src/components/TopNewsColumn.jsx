import React, { useMemo } from "react";

const FALLBACK_IMG = "https://picsum.photos/seed/topnews/320/200";

// Optional demo if nothing is passed
const DEMO = [
  {
    title: "Markets mixed; tech drags while banks rise",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "Monsoon warnings in several states; schools closed",
    image: "https://images.unsplash.com/photo-1502303756787-90e5b9e4f3a5?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
  {
    title: "New EV policy aims to accelerate domestic adoption",
    image: "https://images.unsplash.com/photo-1616762433279-6e1d9d6eaa0f?q=80&w=600&auto=format&fit=crop",
    href: "#",
  },
];

function normalize(item) {
  // Backend article → normalized
  if (item && (item.slug || item.thumbnailUrl || item.heroImageUrl)) {
    return {
      title: item.title || "",
      image: item.thumbnailUrl || item.heroImageUrl || FALLBACK_IMG,
      href: item.slug ? `/article/${item.slug}` : "#",
      source: item.source || "",
      publishedAt: item.publishedAt || null,
    };
  }
  // Legacy/demo shape
  return {
    title: item?.title || "",
    image: item?.image || FALLBACK_IMG,
    href: item?.href || "#",
    source: item?.source || "",
    publishedAt: item?.publishedAt || null,
  };
}

export default function TopNewsColumn({
  title = "Top News",
  items = [],
  max = 6,
  showMeta = true, // render source/time if present
}) {
  const list = useMemo(() => {
    const base = Array.isArray(items) && items.length ? items : DEMO;
    return base.slice(0, max).map(normalize);
  }, [items, max]);

  if (!list.length) return null;

  return (
    <aside className="side-col topnews" aria-labelledby="topnews-title">
      <h3 id="topnews-title" className="side-title">{title}</h3>

      <div className="topnews-list" role="list">
        {list.map((it, i) => (
          <a className="tn-item" href={it.href} key={i} role="listitem" aria-label={it.title}>
            <div className="tn-thumb">
              <img
                src={it.image}
                alt={it.title}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              />
            </div>
            <div className="tn-copy">
              <div className="tn-title">{it.title}</div>
              {showMeta && (it.source || it.publishedAt) && (
                <div className="tn-meta">
                  {it.source}
                  {it.source && it.publishedAt ? " • " : ""}
                  {it.publishedAt ? new Date(it.publishedAt).toLocaleString() : ""}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}
