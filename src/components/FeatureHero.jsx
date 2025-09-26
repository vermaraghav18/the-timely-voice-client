import React from "react";
import SmartLink from "./SmartLink";

export default function FeatureHero({
  main = {
    image:
      "https://images.unsplash.com/photo-1526413232641-82fd2ceaae38?q=80&w=1800&auto=format&fit=crop",
    title:
      "‘A historic moment’: leaked transcripts reveal secret deliberations at start of Iran war",
    author: "MICHAEL BACHNER",
    summary:
      "Quotes reveal existential fears that pushed Israel to strike, plans to kill Khamenei, efforts to get Trump to bomb fortified nuclear site and disputes over targeting oil refineries",
    href: "#"
  },
  teasers = [
    {
      title:
        "Ahead of holidays, Israel warns of Iran-backed terror threats to Israelis and Jews abroad",
      author: "NAVA FREIBERG",
      image:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
      href: "#"
    },
    {
      title:
        "Haredi yeshiva student convicted of carrying out tasks for Iranian agent",
      author: "CHARLIE SUMMERS",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
      href: "#"
    },
    {
      title:
        "Israel’s security cabinet holds emergency session amid rising regional tensions",
      author: "TAMAR LEVY",
      image:
        "https://images.unsplash.com/photo-1526253704381-08cdd6e0a72e?q=80&w=1200&auto=format&fit=crop",
      href: "#"
    }
  ],
  style = {}
}) {
  return (
    <section className="feature-hero" style={style} aria-label="Top stories">
      {/* Background image */}
      <SmartLink className="fh-bg" to={main.href} aria-label={main.title}>
        <img src={main.image} alt="" />
        <div className="fh-vignette" />
      </SmartLink>

      {/* Main copy block (left) */}
      <article className="fh-main">
        <SmartLink className="fh-title" to={main.href}>
          {main.title}
        </SmartLink>
        <div className="fh-byline">By {main.author}</div>
        <p className="fh-summary">{main.summary}</p>
      </article>

      {/* Bottom 3-teaser strip */}
      <div className="fh-teasers">
        {teasers.slice(0, 3).map((t, i) => (
          <SmartLink className="fh-teaser" to={t.href} key={i}>
            <div className="fh-teaser-media">
              <img src={t.image} alt="" />
            </div>
            <div className="fh-teaser-copy">
              <div className="fh-teaser-title">{t.title}</div>
              <div className="fh-teaser-byline">By {t.author}</div>
            </div>
          </SmartLink>
        ))}
      </div>
    </section>
  );
}
