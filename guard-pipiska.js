// guard-pipiska.js
const waitAuth = () =>
  new Promise((resolve) => {
    const t = setInterval(() => {
      if (window.__auth?.auth) {
        clearInterval(t);
        resolve(window.__auth);
      }
    }, 20);
  });

const { auth, onAuthStateChanged } = await waitAuth();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // не вошёл — отправляем на логин и вернём обратно в pipiska.html
    location.href = "login.html?next=pipiska.html";
  }
});
