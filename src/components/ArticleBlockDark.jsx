// client/src/components/ArticleBlockDark.jsx
import React, { useMemo } from "react";

/* --- normalizers: accept admin or legacy shapes, keep design intact --- */
function normalizeItem(a) {
  if (!a) return null;
  return {
    title: a.title || "",
    byline: a.byline || a.author || "",
    summary: a.summary || a.description || "",
    imageUrl: a.imageUrl || a.image || "",
    imageAlt: a.imageAlt || a.title || "",
    href: a.href || "#",
  };
}

function normalizeRelated(list = []) {
  return list.slice(0, 4).map((r) => ({
    tag: r.tag || "",
    title: r.title || "",
    thumb: r.thumb || r.image || r.imageUrl || "",
    href: r.href || "#",
  }));
}

export default function ArticleBlockDark({
  // NEW (admin-driven)
  itemFromAdmin = null,       // { title, byline, summary, imageUrl, imageAlt, href }
  relatedFromAdmin = [],      // [ { tag, title, thumb, href }, ... ]

  // LEGACY defaults (unchanged)
  item = {
    title:
      "Anti-Israel protesters block final stage of Vuelta after drawing Spanish PM’s praise",
    byline: "BY AGENCIES, ZEV STUB AND TOI STAFF",
    summary:
      "Finale of major cycling race nixed in Madrid after clashes, despite presence of over 1,500 police officers; member of Israeli team wins award; Safar calls Sanchez ‘a disgrace’.",
    imageUrl:
      "https://images.unsplash.com/photo-1606117331085-5760e3b58520?q=80&w=1600&auto=format&fit=crop",
    imageAlt: "Protest scene",
    href: "#",
  },
  related = [
    {
      tag: "Live updates",
      title:
        "Sept. 14: Safar brands Spanish PM a ‘disgrace’ after he praised anti-Israel protesters at Vuelta",
      thumb:
        "https://images.unsplash.com/photo-1558980664-10ef0b0b7a3b?q=80&w=600&auto=format&fit=crop",
      href: "#",
    },
    {
      tag: "Analysis",
      title:
        "Spain’s Vuelta disrupted again by anti-Israel protesters ahead of race’s last leg",
      thumb:
        "https://images.unsplash.com/photo-1568227619407-9e3d1d40fd3f?q=80&w=600&auto=format&fit=crop",
      href: "#",
    },
    {
      tag: "Opinion",
      title: "How sports events became flashpoints for global politics",
      thumb:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop",
      href: "#",
    },
    {
      tag: "Opinion",
      title: "How sports events became flashpoints for global politics",
      thumb:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop",
      href: "#",
    },
  ],
}) {
  // prefer admin data if present, otherwise fall back to your existing props
  const main = useMemo(
    () => normalizeItem(itemFromAdmin) || normalizeItem(item),
    [itemFromAdmin, item]
  );
  const rel = useMemo(
    () => (relatedFromAdmin?.length ? normalizeRelated(relatedFromAdmin) : normalizeRelated(related)),
    [relatedFromAdmin, related]
  );

  return (
    <section className="ab ab-dark">
      {/* layout: image with overlay title | divider | red cards */}
      <div className="ab-layout">
        {/* LEFT — image with overlay title */}
        <div className="ab-main">
          <a
            href={main?.href || "#"}
            onClick={(e) => {
              if (!main?.href || main.href === "#") e.preventDefault();
            }}
            className="ab-imgLink"
          >
            <div className="ab-imgbox ab-imgbox--overlay">
              {main?.imageUrl ? (
                <img
                  src={main.imageUrl}
                  alt={main.imageAlt || ""}
                  onError={(e) => {
                    const fb =
                      "https://picsum.photos/seed/ab-dark-fallback/1600/900";
                    if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                  }}
                />
              ) : null}
              <div className="ab-img-overlay">
                <h2 className="ab-title">
                  <span>{main?.title || ""}</span>
                </h2>
              </div>
            </div>
          </a>
        </div>

        {/* CENTER — divider */}
        <div className="ab-divider" aria-hidden="true" />

        {/* RIGHT — related (up to 4) */}
        <aside className="ab-sidebar">
          <div className="ab-rel-row">
            {rel.slice(0, 4).map((r, i) => (
              <a
                key={i}
                href={r.href}
                onClick={(e) => {
                  if (!r.href || r.href === "#") e.preventDefault();
                }}
                className="ab-rel-card ab-rel-card--red"
              >
                {r.thumb && (
                  <div className="ab-rel-thumb">
                    <img
                      src={r.thumb}
                      alt=""
                      onError={(e) => {
                        const fb =
                          "https://picsum.photos/seed/ab-dark-rel/600/400";
                        if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                      }}
                    />
                  </div>
                )}
                <div className="ab-rel-meta">
                  {r.tag ? <div className="ab-rel-tag">{r.tag}</div> : null}
                  <div className="ab-rel-title">{r.title}</div>
                </div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
