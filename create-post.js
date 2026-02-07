// create-post.js — создание поста (только фронтенд)
const $ = (id) => document.getElementById(id);

const MAX_BYTES = 300 * 1024 * 1024;

// Cloudinary (unsigned uploads)
const CLOUDINARY_CLOUD_NAME = "dfcto3ehn";
const CLOUDINARY_PRESET_POSTS = "posts_unsigned";

// localStorage keys
const POSTS_KEY = "limo_posts_v1";

const postText = $("postText");
const postMedia = $("postMedia");
const postBtn = $("postBtn");
const status = $("status");

const currentUsername = window.__auth?.getSession?.()?.username || "";
if (!currentUsername) location.replace("login.html?next=create-post.html");

function safeJsonParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}
function loadPosts() {
  const arr = safeJsonParse(localStorage.getItem(POSTS_KEY) || "[]", []);
  return Array.isArray(arr) ? arr : [];
}
function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

async function uploadToCloudinary(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_PRESET_POSTS);

  const res = await fetch(url, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");
  return data.secure_url || data.url;
}

function newId() {
  return (crypto?.randomUUID?.() || ("id_" + Math.random().toString(16).slice(2) + Date.now().toString(16)));
}

postBtn?.addEventListener("click", async () => {
  status.textContent = "";
  postBtn.disabled = true;

  try {
    const text = (postText.value || "").trim();
    const file = postMedia?.files?.[0] || null;

    if (!text && !file) {
      status.textContent = "Напиши текст или выбери файл 🙂";
      return;
    }
    if (file && file.size > MAX_BYTES) {
      status.textContent = "Файл больше 300 МБ — не пущу 🙂";
      return;
    }

    let mediaUrl = "";
    let mediaType = "";

    if (file) {
      status.textContent = "Загружаю…";
      mediaUrl = await uploadToCloudinary(file);
      mediaType = (file.type || "").startsWith("video") ? "video" : "image";
    }

    const posts = loadPosts();
    posts.unshift({
      id: newId(),
      username: currentUsername,
      text,
      mediaUrl,
      mediaType,
      createdAt: Date.now(),
    });
    savePosts(posts);

    status.textContent = "Опубликовано! Перенаправляю…";
    setTimeout(() => location.replace("pipiska.html"), 450);
  } catch (e) {
    status.textContent = "Не получилось опубликовать: " + (e?.message || "ошибка");
  } finally {
    postBtn.disabled = false;
  }
});
