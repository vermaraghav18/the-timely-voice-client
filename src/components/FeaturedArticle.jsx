// src/components/FeaturedArticle.jsx
import React, { useEffect, useMemo, useState } from "react";
import StoryList from "./StoryList";

/* -------- helpers -------- */
function timeAgo(iso) {
  if (!iso) return null;
  try {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffSec = Math.max(0, Math.floor((now - then) / 1000));
    if (diffSec < 60) return `${diffSec} sec ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } catch {
    return null;
  }
}

// FEATURED normalizer — accepts admin or API article shapes
function normalizeFeatured(a) {
  if (!a) return null;
  const img =
    a.imageUrl || a.image || a.heroImageUrl || a.thumbnailUrl || "";
  const when =
    a.publishedAt || a._publishedAt || (a.updatedAt ?? null);

  const updatedAgo = timeAgo(when);
  const authors = [a.author, a.source].filter(Boolean).join(" • ");

  return {
    live: !!a.live,
    updatedAgo,
    updatedDateTime: when || "",
    title: a.title || "—",
    authors: authors || "The Timely Voice",
    summary: a.summary || a.description || "",
    imageUrl: img || "https://picsum.photos/seed/backup-monsoon/1200/900",
    imageAlt: a.title || "",
    href: a.href || (a.slug ? `/article/${a.slug}` : "#"),
  };
}

// RELATED normalizer — accepts [{title, href, image}] OR API articles
function normalizeRelated(list = []) {
  return list.slice(0, 5).map((it, i) => {
    const img =
      it.image || it.thumbnailUrl || it.heroImageUrl || "";
    const when = it._publishedAt || it.publishedAt || null;
    const time =
      it.time || it._minsAgo || (when ? timeAgo(when) : "");
    const href = it.href || (it.slug ? `/article/${it.slug}` : "#");

    return {
      time: time || "",
      title: it.title || "",
      image: img || "https://picsum.photos/seed/rel-fallback/320/200",
      href,
    };
  });
}

export default function FeaturedArticle({
  // live/admin data
  article,
  relatedItems = [],
  topStories = [],
  trendingStories = [],

  // legacy fallbacks (kept exactly as you had)
  featured: featuredDefault = {
    live: true,
    updatedAgo: "9 sec ago",
    updatedDateTime: "",
    title:
      "Schools shut in Dehradun as red alert issued after cloudburst; landslide risk high",
    authors: "Agencies / TOI / Indian Express",
    summary:
      "Persistent heavy rain and a cloudburst around Dehradun triggered flash floods and landslides. Authorities closed schools and anganwadis, warned of waterlogging in low-lying areas, and put rescue teams on alert.",
    imageUrl: "https://picsum.photos/seed/monsoon-flood/1200/900",
    imageAlt: "Monsoon rain and flooding on an Indian street",
    href: "#",
  },
  related: relatedDefault = [
    {
      time: "10 min ago",
      title:
        "SC orders Maharashtra local body polls by January 2026; raps poll panel",
      image: "https://picsum.photos/seed/maha-polls/320/200",
      href: "#",
    },
    {
      time: "18 min ago",
      title:
        "Sensex jumps; Nifty holds above 25,200 as SpiceJet to lease 8 more jets",
      image: "https://picsum.photos/seed/markets-up/320/200",
      href: "#",
    },
    {
      time: "32 min ago",
      title: "Row over Rahul Gandhi video during visit to flood-hit Punjab",
      image: "https://picsum.photos/seed/rahul-visit/320/200",
      href: "#",
    },
    {
      time: "45 min ago",
      title:
        "US–India trade talks resume in Delhi; key issues back on the table",
      image: "https://picsum.photos/seed/trade-talks/320/200",
      href: "#",
    },
    {
      time: "56 min ago",
      title:
        "Heavy rainfall disrupts flights in Mumbai; authorities issue advisory",
      image: "https://picsum.photos/seed/mumbai-rain/320/200",
      href: "#",
    },
  ],

  // right column fallbacks
  topStories: topStoriesDefault = [
    {
      title:
        "Monsoon fury: Uttarakhand issues red alert; schools closed across districts",
      href: "#",
      image: "https://picsum.photos/seed/uttarakhand/96/72",
    },
    {
      title:
        "Supreme Court sets January 31, 2026 deadline for Maharashtra local body polls",
      href: "#",
      image: "https://picsum.photos/seed/supremecourt/96/72",
    },
    {
      title:
        "Markets rally: Sensex up nearly 600 pts; Nifty ends above 25,200",
      href: "#",
      image: "https://picsum.photos/seed/markets/96/72",
    },
  ],
  trendingStories: trendingStoriesDefault = [
    {
      title: "SpiceJet to lease 8 Boeing 737s ahead of festive season",
      href: "#",
      image: "https://picsum.photos/seed/spicejet/96/72",
    },
    {
      title:
        "Viral clip: Rahul Gandhi seen arguing with cop in flood-hit Punjab",
      href: "#",
      image: "https://picsum.photos/seed/rahulgandhi/96/72",
    },
    {
      title:
        "US delegation in Delhi for crucial trade talks; tariff issues in focus",
      href: "#",
      image: "https://picsum.photos/seed/tradetalks/96/72",
    },
  ],

  onOpenFeatured,
  onOpenRelated,
}) {
  // prefer live data; if missing, fallback to props you already had
  const mappedFeatured = useMemo(() => {
    const m = normalizeFeatured(article);
    return m || featuredDefault;
  }, [article, featuredDefault]);

  const mappedRelated = useMemo(() => {
    const norm = normalizeRelated(relatedItems);
    return norm.length ? norm : relatedDefault;
  }, [relatedItems, relatedDefault]);

  const rightTop = useMemo(
    () => (topStories && topStories.length ? topStories : topStoriesDefault),
    [topStories, topStoriesDefault]
  );
  const rightTrending = useMemo(
    () =>
      trendingStories && trendingStories.length
        ? trendingStories
        : trendingStoriesDefault,
    [trendingStories, trendingStoriesDefault]
  );

  const handleFeatured = (e) => {
    if (!mappedFeatured.href || mappedFeatured.href === "#") e.preventDefault();
    onOpenFeatured?.(mappedFeatured);
  };

  // rotating highlight on mini-cards
  const [activeRel, setActiveRel] = useState(0);
  useEffect(() => {
    if (!mappedRelated.length) return;
    const id = setInterval(() => {
      setActiveRel((i) => (i + 1) % mappedRelated.length);
    }, 3000);
    return () => clearInterval(id);
  }, [mappedRelated.length]);

  return (
    <section className="feat-wrap">
      <div className="feat-grid">
        {/* LEFT: Featured + related */}
        <article className="feat">
          <div className="feat-left">
            <div className="feat-meta" aria-live="polite">
              {mappedFeatured.live && (
                <span className="feat-live" aria-label="Live">
                  LIVE
                </span>
              )}
              {mappedFeatured.updatedAgo && (
                <span className="feat-upd">
                  UPDATED{" "}
                  {mappedFeatured.updatedDateTime ? (
                    <time dateTime={mappedFeatured.updatedDateTime}>
                      {mappedFeatured.updatedAgo}
                    </time>
                  ) : (
                    mappedFeatured.updatedAgo.toUpperCase()
                  )}
                </span>
              )}
            </div>

            <h2 className="feat-title">
              {mappedFeatured.href ? (
                <a href={mappedFeatured.href} onClick={handleFeatured}>
                  {mappedFeatured.title}
                </a>
              ) : (
                mappedFeatured.title
              )}
            </h2>

            <div className="feat-authors">{mappedFeatured.authors}</div>

            <p className="feat-summary">{mappedFeatured.summary}</p>
          </div>

          {mappedFeatured.imageUrl && (
            <a
              className="feat-image"
              href={mappedFeatured.href || "#"}
              aria-label={mappedFeatured.title}
              onClick={handleFeatured}
            >
              <div className="feat-imgbox">
                <img
                  src={mappedFeatured.imageUrl}
                  alt={mappedFeatured.imageAlt || ""}
                  loading="lazy"
                  decoding="async"
                  width="800"
                  height="600"
                  onError={(e) => {
                    const fallback =
                      "https://picsum.photos/seed/backup-monsoon/1200/900";
                    if (e.currentTarget.src !== fallback)
                      e.currentTarget.src = fallback;
                  }}
                />
              </div>
            </a>
          )}

          {/* MINI CARDS */}
          <ul className="feat-related">
            {mappedRelated.map((r, i) => (
              <li
                key={i}
                className={`rel-card ${activeRel === i ? "is-active" : ""}`}
              >
                <a
                  href={r.href || "#"}
                  onClick={(e) => {
                    if (!r.href || r.href === "#") e.preventDefault();
                    onOpenRelated?.(r, i);
                  }}
                  aria-label={`${r.title} — ${r.time || ""}`}
                >
                  <div className="rel-thumb">
                    <img
                      src={r.image}
                      alt={r.title}
                      loading="lazy"
                      width="320"
                      height="200"
                      onError={(e) => {
                        const fb =
                          "https://picsum.photos/seed/rel-fallback/320/200";
                        if (e.currentTarget.src !== fb)
                          e.currentTarget.src = fb;
                      }}
                    />
                  </div>
                  <div className="rel-time">{r.time}</div>
                  <div className="rel-title">{r.title}</div>
                </a>
              </li>
            ))}
          </ul>
        </article>

        {/* RIGHT: lists */}
        <aside className="feat-side" aria-label="Side stories">
          <StoryList title="TOP STORIES" stories={rightTop} delayMs={0} />
          <StoryList
            title="TRENDING STORIES"
            stories={rightTrending}
            delayMs={800}
          />
        </aside>
      </div>
    </section>
  );
}
