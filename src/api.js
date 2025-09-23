// client/src/api.js

const BASE =
  (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "").replace(/\/+$/, ""); // strip trailing slash

function buildUrl(path, params = {}) {
  const url = new URL(path, BASE || window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    url.searchParams.set(k, v);
  });
  return url.toString();
}

async function apiGet(path, { signal } = {}) {
  const res = await fetch(path, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** List articles (supports q, category, tag, lang, limit/offset) */
export async function fetchArticles({
  q = "",
  lang = "en",
  category,
  tag,
  limit = 20,
  offset = 0,
  signal,
} = {}) {
  const url = buildUrl("/api/articles", { q, lang, category, tag, limit, offset });
  const payload = await apiGet(url, { signal });
  return payload.items || [];
}

/** Single article (for /article/:slug) */
export async function fetchArticle(slug, { lang = "en", signal } = {}) {
  if (!slug) throw new Error("slug required");
  const url = buildUrl(`/api/articles/${encodeURIComponent(slug)}`, { lang });
  return apiGet(url, { signal });
}

/** Homepage sections for all blocks */
export async function fetchHomeSections(lang = "en", { signal } = {}) {
  const url = buildUrl("/api/sections/home", { lang });
  return apiGet(url, { signal });
}

/** Categories */
export async function fetchCategories({ signal } = {}) {
  const url = buildUrl("/api/categories");
  const payload = await apiGet(url, { signal });
  return payload.items || [];
}

/** Weather (optional) */
export async function fetchWeather({ lat, lon, lang = "en", signal }) {
  if (lat == null || lon == null) throw new Error("lat/lon required");
  const url = buildUrl("/api/weather", { lat, lon, lang });
  return apiGet(url, { signal });
}

export { apiGet, buildUrl };
