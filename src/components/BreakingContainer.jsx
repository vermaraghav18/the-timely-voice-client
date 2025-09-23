// client/src/components/BreakingContainer.jsx
import { useEffect, useState } from "react";
import BreakingSection from "./BreakingSection.jsx";
import { settings, articles } from "../shared/api/index.js";

export default function BreakingContainer() {
  const [cfg, setCfg] = useState(null);
  const [resolved, setResolved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const c = await settings.get("breaking"); // expect { title, items: [...] }
        if (!mounted) return;

        setCfg(c || { title: "Breaking", items: [] });

        const items = Array.isArray(c?.items) ? c.items : [];
        const articleSlugs = items
          .filter((x) => x.mode === "article" && x.slug)
          .map((x) => x.slug);

        const fetched = await Promise.allSettled(
          articleSlugs.map((slug) => articles.get(slug))
        );

        const bySlug = new Map();
        fetched.forEach((r, idx) => {
          const slug = articleSlugs[idx];
          if (r.status === "fulfilled") bySlug.set(slug, r.value);
        });

        const final = items.map((x) => {
          if (x.mode === "article" && x.slug && bySlug.has(x.slug)) {
            const a = bySlug.get(x.slug);
            // article-like shape
            return {
              title: a?.title || "",
              thumbnailUrl: a?.thumbnailUrl || "",
              heroImageUrl: a?.heroImageUrl || "",
              slug: a?.slug || x.slug,
            };
          }
          // custom shape
          return {
            title: x?.title || "",
            image: x?.image || "",
            href: x?.href || "#",
          };
        });

        if (mounted) setResolved(final);
      } catch {
        if (mounted) {
          setCfg({ title: "Breaking", items: [] });
          setResolved([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading && !resolved.length) return null;

  return (
    <BreakingSection
      title={cfg?.title || "Breaking"}
      items={resolved}
    />
  );
}
