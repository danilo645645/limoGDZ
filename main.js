(() => {
  const solution = document.getElementById('solution');
  const copyBtn = document.querySelector('[data-action="copy-solution"]');
  const ttsBtn  = document.querySelector('[data-action="tts"]');

  // Copy solution with squish animation
  if (copyBtn && solution) {
    copyBtn.addEventListener('click', async () => {
      const text = solution.innerText.replace(/\n{3,}/g, '\n\n').trim();

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older browsers / non-secure context
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch {}
        ta.remove();
      }

      copyBtn.classList.remove('squish');
      void copyBtn.offsetWidth; // restart animation
      copyBtn.classList.add('squish');
    });
  }

  // Text-to-speech (reads the visible solution text)
  if (ttsBtn && solution && 'speechSynthesis' in window) {
    const synth = window.speechSynthesis;
    let isOn = false;

    const setState = (on) => {
      isOn = on;
      ttsBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      ttsBtn.textContent = on ? '⏹ Остановить' : '🔊 Озвучить';
    };

    const speak = () => {
      const text = solution.innerText.replace(/\n{3,}/g, '\n\n').trim();
      if (!text) return;

      // Cancel anything that might be playing
      try { synth.cancel(); } catch {}

      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ru-RU';
      u.rate = 1;
      u.pitch = 1;

      u.onend = () => setState(false);
      u.onerror = () => setState(false);

      setState(true);
      synth.speak(u);
    };

    ttsBtn.addEventListener('click', () => {
      if (synth.speaking || synth.pending) {
        try { synth.cancel(); } catch {}
        setState(false);
      } else {
        speak();
      }
    });

    // Stop reading when leaving the page
    window.addEventListener('pagehide', () => {
      try { synth.cancel(); } catch {}
      setState(false);
    });
  }
})();
