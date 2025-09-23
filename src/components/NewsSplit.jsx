import React, { useMemo } from "react";
import "./NewsSplit.css";

// DEMO ASSETS (put your images in /src/assets and adjust paths)
import leftImg from "../assets/portrait-9x16.jpg";   // 9:16 (portrait)
import rightImg from "../assets/landscape-16x9.jpg"; // 16:9 (landscape)

const DEMO = {
  leftImage: leftImg,
  title: "Rahul Gandhi Prepares Explosive Disclosure on ‘Vote Theft’ Allegations",
  rightImage: rightImg,
  description:
    "Rahul Gandhi plans a high-profile briefing alleging systematic “vote theft,” claiming widespread voter roll manipulation and misuse of digital access. He is expected to present documents and testimonies, pressuring the Election Commission to respond and urging safeguards before upcoming polls. The ruling party has dismissed the charges as theatrics, yet the announcement has intensified scrutiny, energized supporters, and raised questions about electoral transparency, digital security, and trust in democratic institutions.",
  byline: "Agencies",
  href: "#",
};

const FALLBACK_L = leftImg;
const FALLBACK_R = rightImg;

export default function NewsSplit({ item = DEMO }) {
  // Accept both demo shape and backend article shape
  const data = useMemo(() => {
    // If it looks like a backend article, remap to local props
    if (item && (item.slug || item.thumbnailUrl || item.heroImageUrl)) {
      return {
        leftImage: item.heroImageUrl || FALLBACK_L,
        rightImage: item.thumbnailUrl || item.heroImageUrl || FALLBACK_R,
        title: item.title || "",
        description: item.summary || item.body?.slice?.(0, 240) || "",
        byline:
          item.author ||
          (item.source ? `Source: ${item.source}` : "") ||
          "",
        href: item.slug ? `/article/${item.slug}` : "#",
        publishedAt: item.publishedAt,
      };
    }
    // Otherwise assume the demo/legacy shape
    return {
      leftImage: item.leftImage || FALLBACK_L,
      rightImage: item.rightImage || FALLBACK_R,
      title: item.title || "",
      description: item.description || "",
      byline: item.byline || "",
      href: item.href || "#",
      publishedAt: item.publishedAt,
    };
  }, [item]);

  const {
    leftImage,
    rightImage,
    title,
    description,
    byline,
    href,
    publishedAt,
  } = data;

  return (
    <section className="news-split" aria-label="Featured news">
      <div className="news-split__left">
        <img
          src={leftImage}
          alt=""
          className="news-split__left-img"
          loading="eager"
          onError={(e) => (e.currentTarget.src = FALLBACK_L)}
        />
      </div>

      <div className="news-split__right">
        <a href={href} className="news-split__title-link" aria-label={title || "Open story"}>
          <h2 className="news-split__title">{title}</h2>
        </a>

        <a href={href} aria-label="Open story image">
          <img
            src={rightImage}
            alt=""
            className="news-split__right-img"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK_R)}
          />
        </a>

        {(byline || publishedAt) && (
          <p className="news-split__byline">
            {byline}
            {byline && publishedAt ? " • " : ""}
            {publishedAt ? new Date(publishedAt).toLocaleString() : ""}
          </p>
        )}

        {description && <p className="news-split__desc">{description}</p>}

        <a className="news-split__cta" href={href} aria-label="Continue reading">
          Read full story →
        </a>
      </div>
    </section>
  );
}
