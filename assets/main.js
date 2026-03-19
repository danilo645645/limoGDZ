const SETTINGS_KEY='limo-app-settings-v1';
const DEFAULT_SETTINGS= {
  theme:'dark',accent:'orange'
};
const ACCENTS= {
  orange: {
    hex:'#ff8b3d',rgb:'255,139,61'
  }
  ,blue: {
    hex:'#4c8dff',rgb:'76,141,255'
  }
  ,purple: {
    hex:'#8c63ff',rgb:'140,99,255'
  }
  ,green: {
    hex:'#33c77c',rgb:'51,199,124'
  }
  ,red: {
    hex:'#ff5c6d',rgb:'255,92,109'
  }
};
function readSettings() {
  try {
    return {
      ...DEFAULT_SETTINGS,...(JSON.parse(localStorage.getItem(SETTINGS_KEY))|| {
      }
      )
    }
  }
  catch {
    return {
      ...DEFAULT_SETTINGS
    }
  }
}
function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))
}
function applySettings(settings) {
  const root=document.documentElement;
  root.dataset.theme=settings.theme;
  const accent=ACCENTS[settings.accent]||ACCENTS.orange;
  root.style.setProperty('--accent',accent.hex);
  root.style.setProperty('--accent-rgb',accent.rgb);
  document.querySelectorAll('[data-theme-option]').forEach(btn=>btn.classList.toggle('active',btn.dataset.themeOption===settings.theme));
  document.querySelectorAll('[data-accent-option]').forEach(btn=>btn.classList.toggle('active',btn.dataset.accentOption===settings.accent));
}
const settings=readSettings();
applySettings(settings);
document.querySelectorAll('[data-open-settings]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('[data-settings-modal]')?.classList.add('open')));
document.querySelectorAll('[data-close-settings]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('[data-settings-modal]')?.classList.remove('open')));
document.querySelector('[data-settings-modal]')?.addEventListener('click',e=> {
  if(e.target.hasAttribute('data-settings-modal'))e.currentTarget.classList.remove('open')
}
);
document.querySelectorAll('[data-theme-option]').forEach(btn=>btn.addEventListener('click',()=> {
  settings.theme=btn.dataset.themeOption;
  saveSettings(settings);
  applySettings(settings)
}
));
document.querySelectorAll('[data-accent-option]').forEach(btn=>btn.addEventListener('click',()=> {
  settings.accent=btn.dataset.accentOption;
  saveSettings(settings);
  applySettings(settings)
}
));
const subjectMeta= {
  math: {
    keywords:'математика алгебра геометрия номер решение'
  }
  ,russian: {
    keywords:'русский язык орфограммы упражнение текст'
  }
  ,english: {
    keywords:'английский english grammar text translate'
  }
  ,history: {
    keywords:'история пересказ даты термины князья'
  }
  ,other: {
    keywords:'география биология литература прочее'
  }
};
const searchInput=document.querySelector('[data-role="search"]');
const subjectCards=[...document.querySelectorAll('[data-subject-card]')];
if(searchInput&&subjectCards.length) {
  searchInput.addEventListener('input',()=> {
    const query=searchInput.value.trim().toLowerCase();
    subjectCards.forEach(card=> {
      const key=card.dataset.subjectCard;
      const hay=`${card.textContent} ${subjectMeta[key]?.keywords||''}`.toLowerCase();
      card.classList.toggle('hidden',query&&!hay.includes(query));
    }
    );
  }
  );
}
function getCopyText() {
  return document.querySelector('[data-copy-area]')?.innerText.trim()||''
}
async function copySolution() {
  const text=getCopyText();
  if(!text)return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Скопировано')
  }
  catch {
    showToast('Не удалось скопировать')
  }
}
let speechActive=false;
function toggleSpeech(btn) {
  if(!('speechSynthesis'in window))return showToast('Озвучка не поддерживается');
  if(speechActive) {
    speechSynthesis.cancel();
    speechActive=false;
    if(btn)btn.textContent='Озвучить';
    return;
  }
  const text=getCopyText();
  if(!text)return;
  const utter=new SpeechSynthesisUtterance(text);
  utter.lang='ru-RU';
  utter.onend=()=> {
    speechActive=false;
    if(btn)btn.textContent='Озвучить'
  };
  speechActive=true;
  if(btn)btn.textContent='Стоп';
  speechSynthesis.cancel();
  speechSynthesis.speak(utter)
}
function showToast(text) {
  let toast=document.querySelector('.site-toast');
  if(!toast) {
    toast=document.createElement('div');
    toast.className='site-toast';
    document.body.appendChild(toast)
  }
  toast.textContent=text;
  toast.style.opacity='1';
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=> {
    toast.style.opacity='0'
  }
  ,1200)
}
document.querySelectorAll('[data-action="copy"]').forEach(btn=>btn.addEventListener('click',copySolution));
document.querySelectorAll('[data-action="tts"]').forEach(btn=>btn.addEventListener('click',()=>toggleSpeech(btn)));
