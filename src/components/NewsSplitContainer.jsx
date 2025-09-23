// client/src/components/NewsSplitContainer.jsx
import { useEffect, useState, useMemo } from "react";
import NewsSplit from "./NewsSplit.jsx";

// OPTION A (recommended): if you set up an alias @shared in client/vite.config.js
// import { settings, articles } from "@shared/api/index.js";

// OPTION B (no alias): copy shared/api/index.js into client/src/shared/api/index.js
// and use this import instead:
import { settings, articles } from "../shared/api/index.js";

const DEMO_ITEM = {
  leftImage: "/assets/portrait-9x16.jpg",
  rightImage: "/assets/landscape-16x9.jpg",
  title: "News Split",
  description: "",
  byline: "",
  href: "#",
  publishedAt: "",
};

export default function NewsSplitContainer() {
  const [plan, setPlan] = useState(null);
  const [article, setArticle] = useState(null);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setBusy(true); setErr(null);
      try {
        const cfg = await settings.get("news-split");
        if (!mounted) return;

        const normalized =
          cfg && "mode" in cfg
            ? cfg
            : (cfg?.items?.length
                ? { mode: "article", articleSlug: cfg.items[0].articleSlug || "", item: cfg.items[0].item || {} }
                : { mode: "article", articleSlug: "", item: {} });

        setPlan({
          mode: normalized.mode === "custom" ? "custom" : "article",
          articleSlug: normalized.articleSlug || "",
          item: {
            leftImage: normalized.item?.leftImage || "",
            rightImage: normalized.item?.rightImage || "",
            title: normalized.item?.title || "",
            description: normalized.item?.description || "",
            byline: normalized.item?.byline || "",
            href: normalized.item?.href || "",
            publishedAt: normalized.item?.publishedAt || "",
          },
        });

        if (normalized.mode !== "custom" && normalized.articleSlug) {
          try {
            const a = await articles.get(normalized.articleSlug);
            if (mounted) setArticle(a);
          } catch (e) {
            if (mounted) setErr(e?.message || "Failed to load article.");
          }
        } else {
          if (mounted) setArticle(null);
        }
      } catch (e) {
        if (mounted) setErr(e?.message || "Failed to load News Split config.");
      } finally {
        if (mounted) setBusy(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const item = useMemo(() => {
    if (!plan) return null;
    if (plan.mode === "article" && article) return article; // NewsSplit remaps article shape
    if (plan.mode === "custom") {
      return {
        leftImage: plan.item.leftImage || DEMO_ITEM.leftImage,
        rightImage: plan.item.rightImage || DEMO_ITEM.rightImage,
        title: plan.item.title || "",
        description: plan.item.description || "",
        byline: plan.item.byline || "",
        href: plan.item.href || "#",
        publishedAt: plan.item.publishedAt || "",
      };
    }
    return null;
  }, [plan, article]);

  if (busy && !item) return null; // or a skeleton
  if (err && !item) return null;

  return <NewsSplit item={item || DEMO_ITEM} />;
}
