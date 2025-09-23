import React, { useMemo } from "react";
import "./section-tri-column-b.css";

/* Local center images (put files in src/assets/) */
import featureMain from "../assets/feature-main2.jpg";
import heroMain from "../assets/hero-main.jpg";

/* Helpers */
const FALLBACK_THUMB = "https://picsum.photos/seed/tz3b/600/400";
const pickImg = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_THUMB;
const toLink = (a) => (a?.slug ? `/article/${a.slug}` : "#");

export default function SectionTriColumnB({
  /* NEW: unified backend list (array of articles) */
  items = null,

  /* Old props still supported (used as fallback) */
  popular,
  coverage,
  feature,
  hero,

  leftTitle = "Popular",
  rightTitle = "Full Coverage — Politics",
}) {
  /* ---------- Map backend -> UI buckets (optional) ---------- */
  const {
    mappedPopular, // array
    mappedCoverage, // array
    mappedFeature, // { overline,title,img,href }
    mappedHero, // { overline,title,img,href }
  } = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        mappedPopular: null,
        mappedCoverage: null,
        mappedFeature: null,
        mappedHero: null,
      };
    }

    const f = items[0];
    const h = items[1];

    const mFeature = f
      ? {
        overline: (f?.category?.name || "").toUpperCase(),
        title: f?.title || "",
        img: pickImg(f) || featureMain,
        href: toLink(f),
      }
      : null;

    const mHero = h
      ? {
        overline: (h?.category?.name || "").toUpperCase(),
        title: h?.title || "",
        img: pickImg(h) || heroMain,
        href: toLink(h),
      }
      : null;

    const mPopular = items.slice(2, 7).map((a, i) => ({
      title: a?.title || "",
      img: pickImg(a),
      href: toLink(a),
      id: a?.id || `popb-${i}`,
    }));

    const mCoverage = items.slice(7, 11).map((a, i) => ({
      title: a?.title || "",
      img: pickImg(a),
      href: toLink(a),
      id: a?.id || `covb-${i}`,
    }));

    return {
      mappedPopular: mPopular,
      mappedCoverage: mCoverage,
      mappedFeature: mFeature,
      mappedHero: mHero,
    };
  }, [items]);

  /* ---------- Legacy defaults ---------- */
  const popularDefaults = [
    {
      title: "Exclusive: New policy draft to shake up capital markets",
      img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "4 charts that explain energy prices this quarter",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "Flood relief: where donations helped the most",
      img: "https://images.unsplash.com/photo-1502303756787-90e5b9e4f3a5?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "How AI copilots are changing day-to-day work",
      img: "https://images.unsplash.com/photo-1520975922284-7b1037ab654f?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "Markets close mixed after tech selloff",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
  ];

  const coverageDefaults = [
    {
      title: "UC outlines position after campus protest",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "Panel weighs new election rules",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "What new polling means for 2026",
      img: "https://images.unsplash.com/photo-1520975922284-7b1037ab654f?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
    {
      title: "Court hearing scheduled for Friday",
      img: "https://images.unsplash.com/photo-1555371363-04f5e6eab9b8?q=80&w=240&auto=format&fit=crop",
      href: "#",
    },
  ];

  const featureDefault = { overline: "", title: "", img: featureMain, href: "#" };
  const heroDefault    = { overline: "", title: "", img: heroMain, href: "#" };

  /* ---------- Rank: backend map → prop → defaults ---------- */
  const finalPopular  = (mappedPopular && mappedPopular.length ? mappedPopular : popular) || popularDefaults;
  const finalCoverage = (mappedCoverage && mappedCoverage.length ? mappedCoverage : coverage) || coverageDefaults;
  const finalFeature  = mappedFeature || feature || featureDefault;
  const finalHero     = mappedHero || hero || heroDefault;

  return (
    <>
      <div className="tv-rail-wrap-b" />
      <section className="tz3-b">
        {/* LEFT RAIL */}
        <aside className="rail-b rail-b--left">
          <h3 className="rail-title-b rail-title-b--red">{leftTitle}</h3>
          <ul className="pop-list-b">
            {finalPopular.map((it, i) => (
              <li className="pop-item-b" key={it.id || i}>
                <img className="thumb-b" src={it.img || FALLBACK_THUMB} alt="" loading="lazy" />
                <a className="pop-link-b" href={it.href || "#"}>
                  {it.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* CENTER COLUMN */}
        <div className="center-b">
          {/* Feature card */}
          <article className="card-feature-b">
            <a href={finalFeature.href || "#"}>
              <img src={finalFeature.img || featureMain} alt="" className="media-b" />
              {(finalFeature.overline || finalFeature.title) && (
                <div className="overlay-b">
                  {finalFeature.overline && <div className="overline-b">{finalFeature.overline}</div>}
                  {finalFeature.title && <h3 className="title-b">{finalFeature.title}</h3>}
                </div>
              )}
            </a>
          </article>

          {/* Hero card */}
          <article className="card-hero-b">
            <a href={finalHero.href || "#"}>
              <img src={finalHero.img || heroMain} alt="" className="media-b" />
              {(finalHero.overline || finalHero.title) && (
                <div className="overlay-b">
                  {finalHero.overline && <div className="overline-b">{finalHero.overline}</div>}
                  {finalHero.title && <h3 className="title-b">{finalHero.title}</h3>}
                </div>
              )}
            </a>
          </article>
        </div>

        {/* RIGHT RAIL */}
        <aside className="rail-b rail-b--right">
          <h3 className="rail-title-b rail-title-b--yellow">{rightTitle}</h3>
          <ul className="cov-list-b">
            {finalCoverage.map((it, i) => (
              <li className="cov-item-b" key={it.id || i}>
                <img className="thumb-b" src={it.img || FALLBACK_THUMB} alt="" loading="lazy" />
                <a className="cov-link-b" href={it.href || "#"}>
                  {it.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
