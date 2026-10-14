(() => {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    console.warn('Text-to-speech is not supported by this browser.');
    return;
  }

  let currentButton = null;

  function stopSpeaking() {
    window.speechSynthesis.cancel();

    if (currentButton) {
      currentButton.classList.remove('speaker-playing');
      currentButton.setAttribute('aria-label', 'Read aloud');
      currentButton.innerHTML = '🔊';
      currentButton = null;
    }
  }

  function speak(text, button) {
    text = (text || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    if (currentButton === button && window.speechSynthesis.speaking) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    currentButton = button;
    button.classList.add('speaker-playing');
    button.innerHTML = '⏹';
    button.setAttribute('aria-label', 'Stop reading');

    utterance.onend = utterance.onerror = () => {
      if (currentButton === button) {
        button.classList.remove('speaker-playing');
        button.innerHTML = '🔊';
        button.setAttribute('aria-label', 'Read aloud');
        currentButton = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  function addSpeaker(target, getText, label) {
    if (target.dataset.speakerAdded) return;
    target.dataset.speakerAdded = 'true';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'speaker-button';
    button.innerHTML = '🔊';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      speak(getText(), button);
    });

    target.appendChild(button);
  }

  function setupSpeakers() {
    document.querySelectorAll('.social-post').forEach(post => {
      const source = post.querySelector('.social-post-source');
      if (source) {
        addSpeaker(source, () => {
          const copy = post.cloneNode(true);
          copy.querySelectorAll('.speaker-button').forEach(el => el.remove());
          return copy.innerText;
        }, 'Read this post aloud');
      }
    });

    document.querySelectorAll('.questions').forEach(section => {
      section.querySelectorAll('label').forEach(label => {
        const select = label.querySelector('select');
        const questionText = label.cloneNode(true);
        questionText.querySelectorAll('select, .speaker-button').forEach(el => el.remove());

        if (questionText.textContent.trim()) {
          addSpeaker(label, () => {
            const fresh = label.cloneNode(true);
            fresh.querySelectorAll('select, .speaker-button').forEach(el => el.remove());
            const choiceText = label.querySelector('select');
            const options = choiceText
              ? Array.from(choiceText.options)
                  .filter(option => option.value && option.textContent.trim())
                  .map((option, index) => `${index + 1}. ${option.textContent}`)
                  .join('. ')
              : '';
            return `${fresh.textContent}. ${options}`;
          }, 'Read question and answer choices');
        }
      });
    });
  }

  const observer = new MutationObserver(setupSpeakers);

  function init() {
    setupSpeakers();
    observer.observe(document.body, { childList: true, subtree: true });

    const stop = document.createElement('button');
    stop.type = 'button';
    stop.className = 'speaker-stop-all';
    stop.textContent = '⏹ STOP AUDIO';
    stop.addEventListener('click', stopSpeaking);
    document.body.appendChild(stop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
