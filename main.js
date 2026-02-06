(() => {
  const copyBtn = document.querySelector('[data-action="copy-solution"]');
  const explainBtn = document.querySelector('[data-action="toggle-explain"]');
  const solution = document.getElementById('solution');
  const panel = document.getElementById('explainPanel');

  // copy with squish animation
  if (copyBtn && solution) {
    copyBtn.addEventListener('click', async () => {
      const text = solution.innerText.replace(/\n{3,}/g, '\n\n').trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }

      copyBtn.classList.remove('squish');
      // reflow to restart animation
      void copyBtn.offsetWidth;
      copyBtn.classList.add('squish');
    });
  }

  // explain slide-out panel (clones current solution without changing what user already sees)
  if (explainBtn && solution && panel) {
    let filled = false;

    const open = () => {
      if (!filled) {
        panel.innerHTML = solution.innerHTML;
        filled = true;
      }
      panel.classList.add('open');
      explainBtn.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      panel.classList.remove('open');
      explainBtn.setAttribute('aria-expanded', 'false');
    };

    explainBtn.addEventListener('click', () => {
      if (panel.classList.contains('open')) close();
      else open();
    });
  }
})();
