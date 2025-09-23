// client/src/shared/api/index.js
const BASE =
  (import.meta && (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
  (typeof process !== 'undefined' && (process.env.VITE_API_BASE_URL || process.env.VITE_API_URL)) ||
  'http://localhost:4000';

// --- low-level helpers (always send cookies) ---
async function _send(path, method = 'GET', body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',                 // keep session cookie
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${text}`);
  }
  if (res.status === 204) return { ok: true };
  return res.json();
}

export const auth = {
  me:   () => _send('/api/auth/me', 'GET'),
  login:(email, password) => _send('/api/auth/login', 'POST', { email, password }),
  logout:() => _send('/api/auth/logout', 'POST', {}),
};

export const categories = {
  list: () => _send('/api/categories', 'GET'),
};

export const articles = {
  list: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && String(v).trim() !== '') q.set(k, v);
    });
    const qs = q.toString();
    return _send(`/api/articles${qs ? `?${qs}` : ''}`, 'GET');
  },
  get: (slug) => _send(`/api/articles/${encodeURIComponent(slug)}`, 'GET'),
  create: (data) => _send('/api/articles', 'POST', data),
  update: (id, data) => _send(`/api/articles/${id}`, 'PUT', data),
  remove: (id) => _send(`/api/articles/${id}`, 'DELETE'),
};

export const settings = {
  get: (key) => _send(`/api/settings/${encodeURIComponent(key)}`, 'GET'),
  put: (key, value) => _send(`/api/settings/${encodeURIComponent(key)}`, 'PUT', value),
};
