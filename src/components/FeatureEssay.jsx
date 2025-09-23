// client/src/components/FeatureEssay.jsx
import React, { useMemo } from "react";

/**
 * Expected shape (same as saved by the admin):
 * {
 *   kicker, headline, byline, dek, secondaryLinkText, secondaryLinkHref, contributor,
 *   image: { imageUrl, imageAlt, imageCredit, imageAspect, imagePosition, imageFit, imageFocalPoint },
 *   layout: { containerMaxWidth, columnRatio, gap, padding, showFrame },
 *   typography: { headlineFontFamily, headlineSize, headlineWeight, bodyFontFamily, kickerTransform, kickerTracking },
 *   themePreset, colors
 * }
 */

const PRESETS = {
  Sky: {
    bg: "#CDEFF3",
    text: "#1B2330",
    headline: "#16202A",
    accent: "#0E7C86",
    frameBg: "#E9F7F9",
    frameBorder: "#BCE4EA",
  },
  Mint: {
    bg: "#D8F3E5",
    text: "#18221A",
    headline: "#111A13",
    accent: "#117A5B",
    frameBg: "#EFFAF5",
    frameBorder: "#C4ECDC",
  },
  Sand: {
    bg: "#F3E8D7",
    text: "#2A241D",
    headline: "#1E1913",
    accent: "#8A5A26",
    frameBg: "#FBF6EF",
    frameBorder: "#ECDDC6",
  },
  Rose: {
    bg: "#F8E2E7",
    text: "#2B1E23",
    headline: "#1E1418",
    accent: "#B24B63",
    frameBg: "#FDF1F4",
    frameBorder: "#F0C8D2",
  },
  Slate: {
    bg: "#E7EDF3",
    text: "#1D2330",
    headline: "#121723",
    accent: "#3C5A99",
    frameBg: "#F3F7FB",
    frameBorder: "#CFDAE6",
  },
};

const DEFAULTS = {
  kicker: "",
  headline: "",
  byline: "",
  dek: "",
  secondaryLinkText: "",
  secondaryLinkHref: "#",
  contributor: "",
  image: {
    imageUrl: "",
    imageAlt: "",
    imageCredit: "",
    imageAspect: "16:9",
    imagePosition: "right",
    imageFit: "cover",
    imageFocalPoint: { x: 50, y: 50 },
  },
  layout: {
    containerMaxWidth: 1160,
    columnRatio: 0.6,
    gap: 28,
    padding: { top: 28, right: 20, bottom: 28, left: 20 },
    showFrame: false, // default OFF so no frame/padding line shows up
  },
  typography: {
    headlineFontFamily: "Playfair Display, Georgia, serif",
    headlineSize: "XL", // L | XL | XXL
    headlineWeight: 700,
    bodyFontFamily:
      "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    kickerTransform: "uppercase",
    kickerTracking: 0.06, // em
  },
  themePreset: "Sky",
  colors: null, // used only when themePreset === "Custom"
};

function sizeToPx(sizeToken) {
  switch (sizeToken) {
    case "XXL":
      return { fontSize: "56px", lineHeight: 1.04 };
    case "XL":
      return { fontSize: "50px", lineHeight: 1.06 };
    case "L":
    default:
      return { fontSize: "44px", lineHeight: 1.08 };
  }
}

export default function FeatureEssay({ data = {} }) {
  const cfg = useMemo(() => {
    // merge defaults deeply (simple merge is fine here)
    const merged = {
      ...DEFAULTS,
      ...data,
      image: { ...DEFAULTS.image, ...(data.image || {}) },
      layout: { ...DEFAULTS.layout, ...(data.layout || {}) },
      typography: { ...DEFAULTS.typography, ...(data.typography || {}) },
    };
    const preset =
      merged.themePreset === "Custom"
        ? (merged.colors || PRESETS.Sky)
        : PRESETS[merged.themePreset] || PRESETS.Sky;
    return { ...merged, theme: preset };
  }, [data]);

  const { fontSize, lineHeight } = sizeToPx(cfg.typography.headlineSize);

  const leftIsText = cfg.image.imagePosition !== "left"; // default right image
  const colLeft = leftIsText ? cfg.layout.columnRatio : 1 - cfg.layout.columnRatio;
  const colRight = 1 - colLeft;

  const aspect = cfg.image.imageAspect || "16:9";
  const [ax, ay] = aspect.split(":").map((n) => parseFloat(n) || 1);

  const focal = cfg.image.imageFocalPoint || { x: 50, y: 50 };

  // Square-only helpers (no image zoom)
  const isSquare =
    (cfg.image.imageAspect || "16:9") === "1:1" || Math.abs(ax / ay - 1) < 0.001;
  const pad = cfg.layout?.padding || { top: 0, right: 0, bottom: 0, left: 0 };

  // How much wider to make the square image box relative to its grid column
  // (keeps bitmap crisp; height grows with width thanks to aspect-ratio)
  const squareWidthBoost = 1.18; // ~18% wider; tweak to taste

  return (
    <section
      className="feature-essay"
      style={{
        background: cfg.theme.bg,
        color: cfg.theme.text,
        fontFamily: cfg.typography.bodyFontFamily,
      }}
    >
      <div
        className="fe-wrap"
        style={{
          maxWidth: cfg.layout.containerMaxWidth,
          padding: `${cfg.layout.padding.top}px ${cfg.layout.padding.right}px ${cfg.layout.padding.bottom}px ${cfg.layout.padding.left}px`,
          margin: "0 auto",
        }}
      >
        <div
          className="fe-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `${colLeft}fr ${colRight}fr`,
            gap: cfg.layout.gap,
            alignItems: "start",
          }}
        >
          {/* LEFT / RIGHT – text column */}
          <div
            className="fe-text"
            style={{ order: leftIsText ? 0 : 1, minWidth: 0 }}
          >
            {cfg.kicker ? (
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: `${cfg.typography.kickerTracking}em`,
                  textTransform: cfg.typography.kickerTransform,
                  color: cfg.theme.accent,
                  fontWeight: 700,
                  marginBottom: 14,
                }}
              >
                {cfg.kicker}
              </div>
            ) : null}

            {cfg.headline ? (
              <h2
                style={{
                  margin: 0,
                  fontFamily: cfg.typography.headlineFontFamily,
                  color: cfg.theme.headline,
                  fontWeight: cfg.typography.headlineWeight,
                  fontSize,
                  lineHeight,
                  wordWrap: "break-word",
                }}
              >
                {cfg.headline.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </h2>
            ) : null}

            {cfg.byline ? (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  fontWeight: 700,
                  color: cfg.theme.text,
                }}
              >
                {cfg.byline}
              </div>
            ) : null}

            {cfg.dek ? (
              <p
                style={{
                  marginTop: 16,
                  fontSize: 16,
                  lineHeight: 1.5,
                  maxWidth: 42 * 16, // ~42ch
                }}
              >
                {cfg.dek}
              </p>
            ) : null}

            {cfg.secondaryLinkText ? (
              <div style={{ marginTop: 16 }}>
                <a
                  href={cfg.secondaryLinkHref || "#"}
                  onClick={(e) => !cfg.secondaryLinkHref && e.preventDefault()}
                  style={{
                    color: cfg.theme.accent,
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  {cfg.secondaryLinkText}
                </a>
              </div>
            ) : null}

            {cfg.contributor ? (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: cfg.theme.text,
                  opacity: 0.8,
                }}
              >
                {cfg.contributor}
              </div>
            ) : null}
          </div>

          {/* RIGHT / LEFT – image column */}
          <div
            className="fe-media"
            style={{ order: leftIsText ? 1 : 0, minWidth: 0 }}
          >
            <div
              className="fe-frame"
              style={{
                // frame visuals only when explicitly enabled from admin
                background: cfg.layout.showFrame ? cfg.theme.frameBg : "transparent",
                border: cfg.layout.showFrame ? `1px solid ${cfg.theme.frameBorder}` : "none",
                borderRadius: cfg.layout.showFrame ? 12 : 0,
                padding: cfg.layout.showFrame ? 8 : 0,
                overflow: "hidden",

                // 🔵 For 1:1, widen the container and bleed it to the edge
                width: isSquare ? `${squareWidthBoost * 100}%` : "100%",
                marginRight: isSquare && leftIsText ? -(pad.right || 0) : 0,
                marginLeft: isSquare && !leftIsText ? -(pad.left || 0) : 0,
              }}
            >
              <div
                className="fe-aspect"
                style={{
                  position: "relative",
                  width: "100%",                 // keep 100%, the frame above is widened
                  aspectRatio: `${ax} / ${ay}`,  // keeps square/tall ratios
                  borderRadius: 1,              // ← keep image corner radius as-is
                  overflow: "hidden",
                }}
              >
                {cfg.image.imageUrl ? (
                  <img
                    src={cfg.image.imageUrl}
                    alt={cfg.image.imageAlt || ""}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: cfg.image.imageFit || "cover",
                      objectPosition: `${focal.x || 50}% ${focal.y || 50}%`,
                      display: "block",
                      // ❌ no transform/zoom — keeps bitmap crisp
                    }}
                    onError={(e) => {
                      const fb = "https://picsum.photos/seed/feature-essay/1200/675";
                      if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      color: "#999",
                      fontSize: 13,
                      background: "#f4f6f8",
                    }}
                  >
                    No image
                  </div>
                )}
              </div>
              {cfg.image.imageCredit ? (
                <div
                  style={{
                    fontSize: 11,
                    marginTop: 6,
                    textAlign: "right",
                    color: cfg.theme.text,
                    opacity: 0.7,
                  }}
                >
                  {cfg.image.imageCredit}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 900px) {
          .fe-grid {
            grid-template-columns: 1fr !important;
          }
          .fe-media, .fe-text { order: 0 !important; }
        }
      `}</style>
    </section>
  );
}
