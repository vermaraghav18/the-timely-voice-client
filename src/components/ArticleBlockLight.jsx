import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function ArticleWhiteBlock({
  featured = {
  heading: "Featured",
  title:
    "Chandrayaan: ISRO lines up next Gaganyaan abort test after system checks",
  summary:
    "The space agency confirmed a narrow window in October for the next crew-module abort test, with telemetry and pad infrastructure rehearsals slated this week. Engineers say the exercise will validate critical parachute deployments and crew-safety redundancy under high-stress conditions. If all parameters hold, the results will feed into the final human-rating review scheduled for later this year. Officials also hinted at incremental avionics updates and a smoother ground-ops timeline after the previous rehearsal exposed bottlenecks. A detailed post-test report is expected to be published for partners and vendors.",
  time: "1 HOUR AGO",
  image: "https://images.pexels.com/photos/16701076/pexels-photo-16701076.jpeg",
  alt: "Launch pad with rocket at dusk",
  href: "#",
},

/** Center rotator slides (fallbacks to `featured` when omitted) */
featuredItems = [
  {
    title:
      "White House unveils tech initiative to accelerate AI safety research",
    summary:
      "A new fund and public datasets aim to speed up evaluations, transparency reports, and red-team testing for frontier models. Agencies will coordinate benchmarks for robustness, bias, and misuse, while inviting universities to replicate results in the open. Cloud credits and standardized reporting templates are intended to lower the barrier for independent labs. The program also proposes incident-response playbooks so discovered failures can be triaged consistently across companies.",
    time: "12 MIN AGO",
    image:
      "https://images.pexels.com/photos/14320543/pexels-photo-14320543.jpeg",
    alt: "Government building with trees",
    href: "#",
  },
  {
    title:
      "Chandrayaan: ISRO lines up next Gaganyaan abort test after system checks",
    summary:
      "Ground teams have completed dry runs for fueling, navigation hand-offs, and telemetry links with downrange tracking stations. The upcoming trial focuses on crew-module separation under off-nominal loads and rapid recovery at sea. Data from strain gauges and high-speed cameras will be compared against simulations to validate margins. A green light could clear the path for the final uncrewed demonstration before human flights.",
    time: "1 HOUR AGO",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    alt: "Rocket on the pad",
    href: "#",
  },
  {
    title:
      "Global markets steady as energy prices cool; tech stocks lead gains",
    summary:
      "Easing crude prices and upbeat chip forecasts helped equities rebound in early trade across Asia and Europe. Traders rotated into semiconductors and cloud software while trimming positions in utilities and staples. Bond yields slipped after a softer-than-expected manufacturing print, supporting higher-beta names. Analysts caution that Friday’s inflation readout could still inject volatility into thin summer volumes.",
    time: "2 HOURS AGO",
    image:
      "https://images.pexels.com/photos/13801650/pexels-photo-13801650.jpeg",
    alt: "Stock market screens",
    href: "#",
  },
  {
    title:
      "New climate report flags rapid melt in Himalayan glaciers this decade",
    summary:
      "Scientists warn that accelerated melt is reshaping river flows, heightening both flood risk and late-season water scarcity. The report calls for cross-border data sharing, glacier monitoring networks, and community-level early-warning systems. Researchers say adaptive irrigation and smarter reservoir planning can buffer cities and farms from extreme swings. Funding proposals prioritize sensors, local training, and satellite time to sustain long-term observations.",
    time: "3 HOURS AGO",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    alt: "High mountain glacier",
    href: "#",
  },
],
  opinions = {
    heading: "Opinions",
    items: [
      {
        title: "What City Planning Can Learn from Our History",
        time: "1 HOUR AGO",
        image:
          "https://images.pexels.com/photos/5538643/pexels-photo-5538643.jpeg",
        alt: "Historic columns",
        href: "#",
      },
      {
        title: "What Politics and Reality TV Have in Common",
        time: "1 HOUR AGO",
        image:
          "https://images.pexels.com/photos/5538643/pexels-photo-5538643.jpeg",
        alt: "TV static wall",
        href: "#",
      },
      {
        title: "The Hidden Economics of Monsoon Management",
        time: "2 HOURS AGO",
        image:
          "https://images.pexels.com/photos/5538643/pexels-photo-5538643.jpeg",
        alt: "Rainy street with umbrellas",
        href: "#",
      },
      {
        title: "Here’s My Secret Sauce for Success in Elections",
        time: "3 HOURS AGO",
        image:
          "https://images.pexels.com/photos/5538643/pexels-photo-5538643.jpeg",
        alt: "Voting ink on finger",
        href: "#",
      },
      {
        title: "Here’s My Secret Sauce for Success in Elections",
        time: "3 HOURS AGO",
        image:
          "https://images.pexels.com/photos/5538643/pexels-photo-5538643.jpeg",
        alt: "Voting ink on finger",
        href: "#",
      },
      {
        title: "Here’s My Secret Sauce for Success in Elections",
        time: "3 HOURS AGO",
        image:
          "https://images.pexels.com/photos/5538643/pexels-photo-5538643.jpeg",
        alt: "Voting ink on finger",
        href: "#",
      },
      
      
    ],
  },

  /** NEW: right-side rotating 9:16 spotlight cards */
  spotlightItems = [
    {
      brand: "mint",
      title:
        "Trump’s first reaction to Chandranagamalilah’s beheading: ‘Time for being soft on illegal immigrant criminals is OVER’",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
      alt: "Portrait in low light",
      href: "#",
    },
    {
      brand: "Reuters",
      title: "Asian markets edge higher as chipmakers rally on upbeat outlook",
      image:
        "https://images.unsplash.com/photo-1558980664-10ea91750f18?q=80&w=800&auto=format&fit=crop",
      alt: "Skyscraper night skyline",
      href: "#",
    },
    {
      brand: "AP",
      title:
        "Massive storm system threatens gulf coast; emergency teams on standby",
      image:
        "https://images.unsplash.com/photo-1508161885673-3b226b1c29c5?q=80&w=800&auto=format&fit=crop",
      alt: "Storm clouds over city",
      href: "#",
    },
  ],
}) {
  // ----- Center (featured) rotator state -----
  const slides = useMemo(
    () => (featuredItems?.length ? featuredItems : [featured]),
    [featuredItems, featured]
  );
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  // ----- Right (spotlight) rotator state -----
  const spotSlides = useMemo(
    () => (spotlightItems?.length ? spotlightItems : []),
    [spotlightItems]
  );
  const [spotIdx, setSpotIdx] = useState(0);
  const [spotPaused, setSpotPaused] = useState(false);

  useEffect(() => {
    if (spotPaused || spotSlides.length <= 1) return;
    const id = setInterval(() => {
      setSpotIdx((i) => (i + 1) % spotSlides.length);
    }, 3000);
    return () => clearInterval(id);
  }, [spotPaused, spotSlides.length]);

  return (
    <div className="section-wrap">
     <h2 className="tv-section-title tv-plain">
       <Link to="/world" style={{ color: "inherit", textDecoration: "none" }}>
         WORLD
       </Link>
     </h2>

      <section className="awb">
        <div className="awb-grid">
          {/* LEFT — OPINIONS */}
          <div className="awb-col awb-left">
            <h3 className="awb-h">{opinions.heading}</h3>
            <ul className="op-list">
              {opinions.items.slice(0, 6).map((it, i) => (
                <li key={i} className="op-item">
                  <a
                    href={it.href}
                    onClick={(e) => e.preventDefault()}
                    className="op-link"
                  >
                    <div className="op-thumb">
                      <img src={it.image} alt={it.alt || ""} loading="lazy" />
                    </div>
                    <div className="op-copy">
                      <div className="op-title">{it.title}</div>
                      {it.time ? <div className="op-time">{it.time}</div> : null}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER — FEATURED / LATEST (auto-rotator) */}
          <div className="awb-col awb-mid">
  <div
    className="mid-rotator"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
  >
    {slides.map((it, i) => (
      <a
        key={i}
        href={it.href || "#"}
        onClick={(e) => e.preventDefault()}
        className={`mid-hero mid-slide ${i === idx ? "is-active" : ""}`}
        aria-label={it.title}
      >
        <figure className="mid-figure">
          <img src={it.image} alt={it.alt || ""} loading="lazy" />
        </figure>

        <div className="mid-title">
          <span className="hl-sweep hl-rough">{it.title}</span>
        </div>

        <div className="mid-summary">{it.summary}</div>
        {it.time ? <div className="mid-time">{it.time}</div> : null}
      </a>
    ))}
  </div>
</div>


          {/* RIGHT — SPOTLIGHT (auto-rotator, 9:16) */}
          <div className="awb-col awb-right">
            <div
              className="spotlight-rotator"
              onMouseEnter={() => setSpotPaused(true)}
              onMouseLeave={() => setSpotPaused(false)}
            >
              {spotSlides.map((s, i) => (
                <a
                  key={i}
                  href={s.href || "#"}
                  onClick={(e) => e.preventDefault()}
                  className={`spot-card ${i === spotIdx ? "is-active" : ""}`}
                  aria-label={s.title}
                >
                  <div className="spot-imgbox">
                    <img src={s.image} alt={s.alt || ""} loading="lazy" />
                  </div>

                  <div className="spot-top">
                    {s.brand ? <span className="spot-brand">{s.brand}</span> : null}
                  </div>

                  <div className="spot-bottom">
                    <div className="spot-title">{s.title}</div>
                  </div>
                </a>
              ))}

              {/* If no spotlight slides, keep column height sane */}
              {spotSlides.length === 0 && <div className="spot-fallback" />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
