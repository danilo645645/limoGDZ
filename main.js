(() => {
  const copyBtn = document.querySelector('[data-action="copy-solution"]');
  const solution = document.getElementById('solution');

  // copy with squish animation
  if (copyBtn && solution) {
    copyBtn.addEventListener('click', async () => {
      const text = solution.innerText
        .replace(/\n{3,}/g, '\n\n')
        .trim();

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

      // restart squish animation
      copyBtn.classList.remove('squish');
      void copyBtn.offsetWidth;
      copyBtn.classList.add('squish');
    });
  }
})();
