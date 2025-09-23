// src/components/Header.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/** Built-in defaults (used if server config isn't available) */
const TABS_DEFAULT = [
  { key: "top", label: "TOP NEWS", to: "/" },
  { key: "india", label: "INDIA", to: "/india" },
  { key: "world", label: "WORLD", to: "/world" },
  { key: "finance", label: "FINANCE", to: "/finance" },
  { key: "health", label: "HEALTH & LIFESTYLE", to: "/health" },
  { key: "tech", label: "TECH", to: "/tech" },
  { key: "entertainment", label: "ENTERTAINMENT", to: "/entertainment" },
  { key: "business", label: "BUSINESS", to: "/business" },
  { key: "sports", label: "SPORTS", to: "/sports" },
  { key: "women-magazine", label: "WOMEN MAGAZINE", to: "/women-magazine" },
];

const LANGS_DEFAULT = [
  { code: "en", label: "ENGLISH" },
  { code: "hi", label: "हिंदी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
];

/** Map admin "key" to site routes, if admin `to` isn't a site route */
const routeFor = (item) => {
  const key = item?.key || "";
  const map = {
    top: "/",
    india: "/india",
    world: "/world",
    finance: "/finance",
    health: "/health",
    tech: "/tech",
    entertainment: "/entertainment",
    business: "/business",
    sports: "/sports",
    women: "/women-magazine",
    "women-magazine": "/women-magazine",
  };
  return map[key] || item?.to || "/";
};

export default function Header({
  /** Optional config from /api/settings/navbar */
  config,
  onGetDaily = () => {},
  onSignIn = () => {},
}) {
  const { t, i18n } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const raf = useRef(0);

  const todayLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(i18n.resolvedLanguage || "en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date());
    } catch {
      return "";
    }
  }, [i18n.resolvedLanguage]);

  /* ----- derive dynamic pieces from config ----- */
  const siteName = (config?.siteName || t("brandName", "THE TIMELY VOICE")).toUpperCase();

  const tabs = useMemo(() => {
    const nav = Array.isArray(config?.nav) && config.nav.length ? config.nav : TABS_DEFAULT;
    return nav.map((n) => ({
      key: n.key || n.label,
      label: n.label,
      to: routeFor(n),
    }));
  }, [config]);

  const langs = useMemo(() => {
    if (Array.isArray(config?.languages) && config.languages.length) {
      // Try to map admin labels to known codes
      const known = Object.fromEntries(LANGS_DEFAULT.map((l) => [l.label, l.code]));
      return config.languages.map((lbl) => ({ label: lbl, code: known[lbl] || "en" }));
    }
    return LANGS_DEFAULT;
  }, [config]);

  // Header collapse on scroll (keeps your existing behavior)
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const goingDown = y > lastY && y > 80;
        setIsCollapsed(goingDown);
        lastY = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <header className={`tv-header ${isCollapsed ? "is-collapsed is-stuck" : ""}`}>
      {/* Full masthead */}
      <div className="hide-on-collapse">
        <div className="tv-masthead">
          {/* LEFT: socials/tickers area could be here (kept minimal) */}
          <div className="brand-wrap">
            <Link to="/" className="wordmark" aria-label={siteName}>
              {siteName}
            </Link>
            <div className="ticker" aria-live="polite">
              <span className="chip">{todayLabel}</span>
            </div>
          </div>

          <div className="mast-actions">
            <button className="btn btn-outline" onClick={onGetDaily}>
              <span>{t("ctaDaily", "Get the Daily Updates")}</span>
            </button>
            <button className="btn btn-solid" onClick={onSignIn}>
              <span>{t("ctaSignIn", "Sign In")}</span>
            </button>

            <nav className="langs" aria-label="Languages">
              {langs.map((l) => (
                <a
                  key={l.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    i18n.changeLanguage(l.code);
                  }}
                  className={`lang ${i18n.resolvedLanguage === l.code ? "active" : ""}`}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Tabs row */}
        <div className="tv-tabsbar">
          <nav className="tabs" aria-label="Sections">
            {tabs.map((ti) => (
              <NavLink
                key={ti.key}
                to={ti.to}
                end={ti.to === "/"}
                className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                <span>{ti.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Breaking ticker bar (kept minimal placeholder; your existing ticker can stay here) */}
        <div className="tv-breakingbar" aria-live="polite">
          {/* You can render config.liveText/config.liveTicker here if you like */}
        </div>
      </div>

      {/* Compact bar when collapsed */}
      <div className="tv-compactbar" role="banner" aria-label="Site masthead compact">
        <div className="cb-inner">
          <div className="cb-brand">
            <Link to="/" className="cb-brand-link">
              {siteName}
            </Link>
          </div>
          <div className="cb-date">{todayLabel}</div>
        </div>
      </div>
    </header>
  );
}
