// pipiska.js — лента (только фронтенд, GitHub Pages)
// Данные постов/профилей: localStorage. Медиа хранится ссылками (например Cloudinary).

const $ = (id) => document.getElementById(id);

// localStorage keys (должны совпадать на всех страницах)
const POSTS_KEY = "limo_posts_v1";         // array<Post>
const PROFILES_KEY = "limo_profiles_v1";   // { [username]: Profile }

// auth (username only)
const currentUsername = window.__auth?.getSession?.()?.username || "";
if (!currentUsername) {
  // guard-pipiska.js должен уже редиректить, но на всякий случай:
  location.replace("login.html?next=pipiska.html");
}

// UI
const meAva = $("meAva");
const meName = $("meName");
const meNick = $("meNick");
const feed = $("feed");
const feedHint = $("feedHint");
const feedCount = $("feedCount");
const logoutBtn = $("logoutBtn");

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

function loadProfiles() {
  return safeJsonParse(localStorage.getItem(PROFILES_KEY) || "{}", {});
}
function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}
function loadPosts() {
  const arr = safeJsonParse(localStorage.getItem(POSTS_KEY) || "[]", []);
  return Array.isArray(arr) ? arr : [];
}

function initials(name) {
  const s = (name || "").trim();
  if (!s) return "U";
  return s.slice(0, 1).toUpperCase();
}

function fmtTime(ts) {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, { year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit" });
  } catch { return ""; }
}

function applyMeUI(profile) {
  const displayName = (profile?.displayName || currentUsername);
  meName.textContent = displayName;
  meNick.textContent = "@" + currentUsername;

  meAva.innerHTML = "";
  if (profile?.avatarUrl) {
    const img = document.createElement("img");
    img.src = profile.avatarUrl;
    img.alt = "";
    meAva.appendChild(img);
  } else {
    meAva.textContent = initials(displayName);
  }
}

function renderPost(post, profiles) {
  const p = profiles[post.username] || { displayName: post.username, avatarUrl: "" };

  const card = document.createElement("div");
  card.className = "postCard";

  const head = document.createElement("div");
  head.className = "postHead";

  const author = document.createElement("div");
  author.className = "postAuthor";

  const ava = document.createElement("div");
  ava.className = "postAva";
  if (p.avatarUrl) {
    const img = document.createElement("img");
    img.src = p.avatarUrl;
    img.alt = "";
    ava.appendChild(img);
  } else {
    ava.textContent = initials(p.displayName || post.username);
  }

  const meta = document.createElement("div");
  meta.className = "postMeta";
  const b = document.createElement("b");
  b.textContent = p.displayName || post.username;
  const m = document.createElement("div");
  m.className = "muted";
  m.textContent = "@" + post.username + " · " + fmtTime(post.createdAt);
  meta.appendChild(b);
  meta.appendChild(m);

  author.appendChild(ava);
  author.appendChild(meta);

  const right = document.createElement("div");
  right.className = "muted";
  right.textContent = ""; // место под меню/лайки позже

  head.appendChild(author);
  head.appendChild(right);

  const body = document.createElement("div");
  body.className = "postBody";
  body.textContent = post.text || "";

  card.appendChild(head);
  if (post.text) card.appendChild(body);

  if (post.mediaUrl && post.mediaType) {
    const box = document.createElement("div");
    box.className = "postMedia";
    if (post.mediaType === "video") {
      const v = document.createElement("video");
      v.src = post.mediaUrl;
      v.controls = true;
      v.playsInline = true;
      box.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = post.mediaUrl;
      img.alt = "";
      box.appendChild(img);
    }
    card.appendChild(box);
  }

  return card;
}

function renderFeed() {
  const profiles = loadProfiles();
  const posts = loadPosts().slice().sort((a,b) => (b.createdAt||0) - (a.createdAt||0));

  feed.innerHTML = "";
  posts.forEach((p) => feed.appendChild(renderPost(p, profiles)));

  feedHint.style.display = posts.length ? "none" : "block";
  feedCount.textContent = posts.length ? `${posts.length} пост(ов)` : "";
}

function ensureProfile() {
  const profiles = loadProfiles();
  if (!profiles[currentUsername]) {
    profiles[currentUsername] = {
      username: currentUsername,
      displayName: currentUsername,
      avatarUrl: ""
    };
    saveProfiles(profiles);
  }
  return profiles[currentUsername];
}

logoutBtn?.addEventListener("click", () => {
  window.__auth?.logout?.();
});

const meProfile = ensureProfile();
applyMeUI(meProfile);
renderFeed();
