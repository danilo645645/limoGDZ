(() => {
  const root = document.documentElement;

  const acc = document.getElementById('accentPicker');
  const bg  = document.getElementById('bgPicker');
  const ui  = document.getElementById('uiPicker');

  if (!acc || !bg || !ui) return;

  // load saved
  acc.value = localStorage.getItem('accent') || '#ffcc66';
  bg.value  = localStorage.getItem('bg')     || '#000000';
  ui.value  = localStorage.getItem('ui')     || '#ffdd99';

  const apply = () => {
    root.style.setProperty('--accent-color', acc.value);
    root.style.setProperty('--bg-color', bg.value);
    root.style.setProperty('--ui-color', ui.value);

    localStorage.setItem('accent', acc.value);
    localStorage.setItem('bg', bg.value);
    localStorage.setItem('ui', ui.value);
  };

  apply();
  [acc,bg,ui].forEach(el => el.addEventListener('input', apply));
})();
