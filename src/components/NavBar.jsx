import { useEffect, useMemo, useRef, useState } from "react";

/* Sections (kept from your version) */
const CATEGORIES = [
  { key: "top", label: "Top", q: "" },
  { key: "india", label: "India", q: "india" },
  { key: "world", label: "World", q: "world" },
  { key: "business", label: "Business", q: "market OR economy OR business" },
  { key: "tech", label: "Tech", q: "tech OR startup" },
  { key: "sports", label: "Sports", q: "sports OR cricket" },
];

function formatToday() {
  const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-IN", options).format(new Date());
}

export default function NavBar({
  activeKey = "top",
  onCategory = () => {},
  onSearch = () => {},
}) {
  const [q, setQ] = useState("");
  const [today, setToday] = useState(formatToday());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const raf = useRef(0);

  // Smooth collapse on scroll
  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        setIsCollapsed(y > 8);
        raf.current = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  // Update date at midnight
  useEffect(() => {
    const schedule = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      return window.setTimeout(() => {
        setToday(formatToday());
        timer = schedule();
      }, next - now);
    };
    let timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  const headerClass = `tv-header ${isCollapsed ? "is-collapsed is-stuck" : ""}`;

  const handleCat = (cat) => {
    onCategory(cat);
    onSearch(cat.q || "");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    onSearch(q.trim());
  };

  // Tiny demo items for the red vertical ticker
  const vTicker = useMemo(
    () => [
      "Breaking: Parliament adjourned amid heated debate",
      "Markets: Sensex ends flat; IT stocks outperform",
      "Weather: Heavy rain alert for Mumbai, Pune",
      "Sports: India clinch series 3–2 in Kolkata",
    ],
    []
  );
  const dup = useMemo(() => [...vTicker, ...vTicker], [vTicker]);

  return (
    <header className={headerClass}>
      {/* Everything inside here hides when collapsed */}
      <div className="hide-on-collapse">
        {/* === Masthead (blue gradient) === */}
        <div className="tv-masthead">
          {/* left spacer/utility column (kept minimal for grid) */}
          <div className="left-utility" aria-hidden="true" />

          {/* center brand */}
          <div className="brand-wrap">
            <div className="wordmark">THE TIMELY VOICE</div>
            <div className="ticker">
              <span className="chip">{today}</span>
            </div>
          </div>

          {/* right: search */}
          <div className="mast-actions">
            <form className="nav-search" onSubmit={submitSearch} role="search" aria-label="Search headlines">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search headlines…"
                aria-label="Search"
              />
              <button className="btn btn-outline" type="submit">
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>

        {/* === Tabs row === */}
        <div className="tv-tabsbar">
          <nav className="tabs" aria-label="Sections">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`tab ${activeKey === cat.key ? "active" : ""}`}
                aria-current={activeKey === cat.key ? "page" : undefined}
                onClick={() => handleCat(cat)}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>

        {/* === Red vertical ticker (optional; shows under tabs) === */}
        <div className="tv-vticker" role="region" aria-label="Breaking updates">
          <div className="vt-grid">
            <div className="vt-box">
              <div className="vt-track">
                {dup.map((t, i) => (
                  <div className="vt-item" key={i}>
                    <span className="vt-pill">LIVE</span>
                    <span className="vt-text">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Slim compact blue bar that appears when collapsed === */}
      <div className="tv-compactbar" role="banner" aria-label="Site masthead compact">
        <div className="cb-inner">
          <div className="cb-brand">THE TIMELY VOICE</div>
          <div className="cb-date">{today}</div>
        </div>
      </div>
    </header>
  );
}
