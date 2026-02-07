// supabaseClient.js — минимальный клиент для Supabase REST (PostgREST)
// ВАЖНО: заполни SUPABASE_URL и SUPABASE_ANON_KEY своими значениями из Supabase проекта.
// GitHub Pages: это публичные ключи (anon), их можно хранить во фронтенде.

// Пример:
// const SUPABASE_URL = "https://abcd1234.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOi...";

const SUPABASE_URL = "https://ptueuuglerakqxeqsgjs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YGuwZL_jVOX_cAhoibp-yg_cYIy5EwW";

function _mustConfigured() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase не настроен: открой supabaseClient.js и вставь SUPABASE_URL + SUPABASE_ANON_KEY");
    return false;
  }
  return true;
}

function _headers(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function sbFetch(path, { method = "GET", headers = {}, body = null } = {}) {
  if (!_mustConfigured()) throw new Error("SUPABASE_NOT_CONFIGURED");
  const url = `${SUPABASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: _headers(headers),
    body: body ? JSON.stringify(body) : null,
  });
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!res.ok) {
    const err = new Error("SUPABASE_HTTP_ERROR");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// Публичное API
window.__sb = {
  isConfigured: () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),

  // POSTS
  listPosts: async (limit = 50) => {
    // newest first
    const q = `?select=*&order=created_at.desc&limit=${encodeURIComponent(limit)}`;
    return await sbFetch(`/rest/v1/posts${q}`);
  },
  insertPost: async (post) => {
    // Prefer: return=representation чтобы получить вставленную запись
    const headers = { Prefer: "return=representation" };
    const rows = await sbFetch(`/rest/v1/posts`, { method: "POST", headers, body: post });
    return Array.isArray(rows) ? rows[0] : rows;
  },
  updatePostById: async (id, patch) => {
    const headers = { Prefer: "return=representation" };
    const rows = await sbFetch(`/rest/v1/posts?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers, body: patch });
    return Array.isArray(rows) ? rows[0] : rows;
  },

  // PROFILES
  getProfilesByUsernames: async (usernames) => {
    if (!Array.isArray(usernames) || usernames.length === 0) return [];
    const unique = [...new Set(usernames.filter(Boolean))];
    const inList = unique.map(u => `"${String(u).replaceAll('"', '\\"')}"`).join(",");
    const q = `?select=*&username=in.(${inList})`;
    return await sbFetch(`/rest/v1/profiles${q}`);
  },
  upsertProfile: async (profile) => {
    const headers = {
      Prefer: "resolution=merge-duplicates,return=representation",
    };
    const rows = await sbFetch(`/rest/v1/profiles`, { method: "POST", headers, body: profile });
    return Array.isArray(rows) ? rows[0] : rows;
  },
};
