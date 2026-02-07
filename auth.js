// auth.js (frontend-only auth for GitHub Pages)
// Требования: login по username+password, пароли не хранить открыто, сессия в localStorage.

const USERS_URL = "./users.json";
const SESSION_KEY = "limo_session_v1";

let _usersCache = null;

/** sha256(password) -> hex */
export async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function loadUsers() {
  if (_usersCache) return _usersCache;
  const res = await fetch(USERS_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("USERS_LOAD_FAILED");
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("USERS_BAD_FORMAT");
  _usersCache = data;
  return data;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s.username !== "string" || !s.username.trim()) return null;
    return { username: s.username.trim(), createdAt: s.createdAt || null };
  } catch {
    return null;
  }
}

export function setSession(username) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ username: username.trim(), createdAt: Date.now() })
  );
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(username, password) {
  const u = (username || "").trim();
  const p = String(password || "");
  if (!u || !p) return { ok: false, reason: "EMPTY" };

  const users = await loadUsers();
  const rec = users.find(x => (x?.username || "").toLowerCase() === u.toLowerCase());
  if (!rec || !rec.passwordHash) return { ok: false, reason: "BAD_CREDENTIALS" };

  const hash = await sha256Hex(p);
  if (hash !== rec.passwordHash) return { ok: false, reason: "BAD_CREDENTIALS" };

  // сохраняем username как в users.json (оригинальный регистр)
  setSession(rec.username);
  return { ok: true, username: rec.username };
}

export function logout() {
  clearSession();
}

export function requireAuth({ next = "index.html", loginPage = "login.html" } = {}) {
  const s = getSession();
  if (!s) {
    const url = `${loginPage}?next=${encodeURIComponent(next)}`;
    location.replace(url);
    return null;
  }
  return s;
}

// Удобный доступ как раньше (через window.__auth)
window.__auth = { sha256Hex, login, logout, getSession, setSession, clearSession, requireAuth };
