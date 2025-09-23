import React, { useMemo } from "react";
import "./section-tri-column.css";

/* Local assets for the two main center cards */
import featureMain from "../assets/feature-main.jpg";
import heroMain from "../assets/hero-main.jpg";

const FALLBACK_THUMB = "https://picsum.photos/seed/tz3/600/400";
const pickImg = (a) => a?.thumbnailUrl || a?.heroImageUrl || FALLBACK_THUMB;
const toLink = (a) => (a?.slug ? `/article/${a.slug}` : "#");

export default function SectionTriColumn({
  /* NEW: backend items (array of articles) */
  items = null,

  /* Original props still supported (used as fallback) */
  popular,
  coverage,
  feature,
  hero,

  leftTitle = "Popular",
  rightTitle = "Full Coverage — Donald Trump",

  rightPromoImg,
  rightPromoHref = "#",
  rightPromoCaption = "",

  leftPromoImg,
  leftPromoHref = "#",
  leftPromoCaption = "Special Report",

  techTitle = "TECH NEWS",
  techItem,
  techItems,

  bizTitle = "BUSINESS NEWS",
  bizItems,
}) {
  /* ---------- Map backend -> UI buckets (safe defaults later) ---------- */
  const {
    mappedP,
    mappedC,
    mappedF,
    mappedH,
    mappedTechList,
    mappedB,
  } = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        mappedP: null,
        mappedC: null,
        mappedF: null,
        mappedH: null,
        mappedTechList: null,
        mappedB: null,
      };
    }

    // Prefer tech/business slices by category name if available
    const techPool = items.filter(
      (a) => (a?.category?.name || "").toLowerCase().includes("tech")
    );
    const bizPool = items.filter(
      (a) =>
        (a?.category?.name || "").toLowerCase().includes("business") ||
        (a?.category?.name || "").toLowerCase().includes("finance")
    );

    // Center cards from first couple of items
    const f = items[0];
    const h = items[1];

    const mappedFeature = f
      ? {
          overline: (f?.category?.name || "").toUpperCase(),
          title: f?.title || "",
          img: pickImg(f) || featureMain,
          href: toLink(f),
        }
      : null;

    const mappedHero = h
      ? {
          overline: (h?.category?.name || "").toUpperCase(),
          title: h?.title || "",
          img: pickImg(h) || heroMain,
          href: toLink(h),
        }
      : null;

    // Popular and Coverage take the next items
    const popularSlice = items.slice(2, 7).map((a, i) => ({
      title: a?.title || "",
      img: pickImg(a),
      href: toLink(a),
      summary: a?.summary || "",
      id: a?.id || `pop-${i}`,
    }));

    const coverageSlice = items.slice(7, 11).map((a, i) => ({
      title: a?.title || "",
      img: pickImg(a),
      href: toLink(a),
      summary: a?.summary || "",
      id: a?.id || `cov-${i}`,
    }));

    // Tech & Business side blocks
    const mappedTech =
      (techPool.length ? techPool : items.slice(11, 14)).map((a, i) => ({
        title: a?.title || "",
        img: pickImg(a),
        href: toLink(a),
        summary: a?.summary || "",
        id: a?.id || `tech-${i}`,
      }));

    const mappedBiz =
      (bizPool.length ? bizPool : items.slice(14, 17)).map((a, i) => ({
        title: a?.title || "",
        img: pickImg(a),
        href: toLink(a),
        summary: a?.summary || "",
        id: a?.id || `biz-${i}`,
      }));

    return {
      mappedP: popularSlice,
      mappedC: coverageSlice,
      mappedF: mappedFeature,
      mappedH: mappedHero,
      mappedTechList: mappedTech,
      mappedB: mappedBiz,
    };
  }, [items]);

  /* ---------- Originals / sensible defaults ---------- */
  const popularDefaults = [
    {
      title: "Exclusive: New policy draft to shake up capital markets",
      img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary: "Draft aims to deepen liquidity and broaden retail participation.",
    },
    {
      title: "4 charts that explain energy prices this quarter",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary: "Fuel mix, inventories, and FX are driving short-term volatility.",
    },
    {
      title: "Flood relief: where donations helped the most",
      img: "https://images.unsplash.com/photo-1502303756787-90e5b9e4f3a5?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary: "Housing and medical aid saw the largest impact per dollar.",
    },
    {
      title: "How AI copilots are changing day-to-day work",
      img: "https://images.unsplash.com/photo-1520975922284-7b1037ab654f?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary: "Teams report time savings and higher output on routine tasks.",
    },
    {
      title: "Markets close mixed after tech selloff",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary: "Heavy weights dragged indices; breadth remained stable.",
    },
  ];

  const coverageDefaults = [
    {
      title: "UC outlines position after campus protest",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary:
        "University leadership lays out next steps and timelines after weekend demonstrations.",
    },
    {
      title: "Panel weighs new election rules",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary:
        "Draft changes focus on funding disclosures and counting procedures ahead of the polls.",
    },
    {
      title: "Finance committee signals budget rework",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary:
        "Mid-year review likely to reprioritize capex and soften non-essential spends.",
    },
    {
      title: "UC outlines position after campus protest",
      img: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=240&auto=format&fit=crop",
      href: "#",
      summary:
        "Administrators seek broader consultation with student groups before policy updates.",
    },
  ];

  const featureDefault = {
    overline: "",
    title: "",
    img: featureMain,
    href: "#",
  };

  const heroDefault = {
    overline: "",
    title: "",
    img: heroMain,
    href: "#",
  };

  const techDefaults = [
    {
      title: "AI chip startup raises $200M to accelerate cloud computing",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
      href: "#",
      summary:
        "The funding round highlights growing demand for energy-efficient processors.",
    },
    {
      title: "Quantum networking test links 3 cities in real-time",
      img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
      href: "#",
      summary:
        "Researchers demonstrate stable entanglement distribution across metropolitan fiber.",
    },
    {
      title: "Open-source LLM hits new efficiency milestone",
      img: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=600&auto=format&fit=crop",
      href: "#",
      summary:
        "Benchmarks show lower latency on commodity GPUs using quantized weights.",
    },
  ];

  const bizDefaults = [
    {
      title: "ASML to invest $1.5B in Mistral at $11B valuation",
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop",
      href: "#",
      summary: "Strategic stake deepens ties across chipmaking and AI.",
    },
    {
      title: "Oil steadies as OPEC+ signals steady output",
      img: "https://images.unsplash.com/photo-1516277871965-2a0e4c3e1e59?q=80&w=600&auto=format&fit=crop",
      href: "#",
      summary: "Traders eye inventories while demand signals stay mixed.",
    },
    {
      title: "Wall Street eyes IPO pipeline revival",
      img: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=600&auto=format&fit=crop",
      href: "#",
      summary:
        "Renewed filings suggest investor appetite returning to public markets.",
    },
  ];

  /* ---------- Rank: backend map → prop → defaults ---------- */
  const finalP =
    (mappedP && mappedP.length ? mappedP : popular) || popularDefaults;
  const finalC =
    (mappedC && mappedC.length ? mappedC : coverage) || coverageDefaults;
  const finalF = mappedF || feature || featureDefault;
  const finalH = mappedH || hero || heroDefault;
  const finalTechList =
    mappedTechList || techItems || (techItem ? [techItem] : techDefaults);
  const finalB = mappedB || bizItems || bizDefaults;

  // default promos (9:16 friendly)
  const rightPromo =
    rightPromoImg ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop";

  const leftPromo =
    leftPromoImg ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop";

  return (
    <>
      {/* optional top rail titles wrapper (kept to preserve spacing rules) */}
      <div className="tv-rail-wrap" />

      <section className="tz3">
        {/* LEFT RAIL */}
        <aside className="rail rail--left rail--boxed">
          <h3 className="rail-title rail-title--red">{leftTitle}</h3>
          <ul className="pop-list pop-list--boxed">
            {finalP.map((it, i) => (
              <li className="pop-item" key={i}>
                <img
                  className="thumb"
                  src={it.img || FALLBACK_THUMB}
                  alt=""
                  loading="lazy"
                />
                <div className="pop-text">
                  <a className="pop-link" href={it.href || "#"}>
                    {it.title}
                  </a>
                  {it.summary && <p className="pop-summary">{it.summary}</p>}
                </div>
              </li>
            ))}
          </ul>

          {/* 9:16 promo under Popular */}
          <a className="pop-promo" href={leftPromoHref}>
            <div className="frame">
              <img src={leftPromo} alt="Promo" loading="lazy" />
            </div>
            {leftPromoCaption && (
              <div className="caption">{leftPromoCaption}</div>
            )}
          </a>

          {/* Business block */}
          <div className="rail-biz">
            <h3 className="rail-title rail-title--biz">{bizTitle}</h3>
            <ul className="biz-list">
              {finalB.map((it, i) => (
                <li className="biz-item" key={i}>
                  <img
                    className="thumb"
                    src={it.img || FALLBACK_THUMB}
                    alt=""
                    loading="lazy"
                  />
                  <div className="biz-text">
                    <a className="biz-link" href={it.href || "#"}>
                      {it.title}
                    </a>
                    {it.summary && (
                      <p className="biz-summary">{it.summary}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* CENTER COLUMN */}
        <div className="center">
          <article className="card-feature">
            <a className="media" href={finalF.href || "#"}>
              <img src={finalF.img || featureMain} alt="" />
            </a>
            <div className="text">
              <div className="overline">{finalF.overline}</div>
              <h3 className="title">{finalF.title}</h3>
            </div>
          </article>

          <article className="card-hero">
            <a href={finalH.href || "#"}>
              <img src={finalH.img || heroMain} alt="" className="media" />
              <div className="overlay">
                <div className="overline">{finalH.overline}</div>
                <h3 className="title">{finalH.title}</h3>
              </div>
            </a>
          </article>
        </div>

        {/* RIGHT RAIL */}
        <aside className="rail rail--right">
          <h3 className="rail-title rail-title--yellow">{rightTitle}</h3>
          <ul className="cov-list">
            {finalC.map((it, i) => (
              <li className="cov-item" key={i}>
                <img
                  className="thumb"
                  src={it.img || FALLBACK_THUMB}
                  alt=""
                  loading="lazy"
                />
                <div className="cov-text">
                  <a className="cov-link" href={it.href || "#"}>
                    {it.title}
                  </a>
                  {it.summary && <p className="cov-summary">{it.summary}</p>}
                </div>
              </li>
            ))}
          </ul>

          {/* right promo */}
          <a className="cov-promo" href={rightPromoHref}>
            <div className="frame">
              <img src={rightPromo} alt="" loading="lazy" />
            </div>
            {rightPromoCaption && (
              <div className="caption">{rightPromoCaption}</div>
            )}
          </a>

          {/* Tech block */}
          <div className="rail-tech">
            <h3 className="rail-title rail-title--tech">{techTitle}</h3>
            <ul className="tech-list">
              {finalTechList.map((it, i) => (
                <li className="tech-item" key={i}>
                  <img
                    className="thumb"
                    src={it.img || FALLBACK_THUMB}
                    alt=""
                    loading="lazy"
                  />
                  <div className="tech-text">
                    <a className="tech-link" href={it.href || "#"}>
                      {it.title}
                    </a>
                    {it.summary && (
                      <p className="tech-summary">{it.summary}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
