(() => {
  'use strict';
  const shell = document.getElementById('garden-shell');
  const scene = document.getElementById('botanical-scene');
  const status = document.getElementById('status');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let seed = 21;
  let selectedFilter = 'all';
  let motionPaused = motionPreference.matches;
  let toastTimer, bloomTimer, sparkleTimer;

  function announce(message) {
    clearTimeout(toastTimer);
    status.textContent = message;
    status.classList.add('visible');
    toastTimer = setTimeout(() => status.classList.remove('visible'), 3600);
  }
  function fitGardenAroundText() {
    scene.style.setProperty('--center-offset', '0px');
    const flowers = [...scene.querySelectorAll('.botanical-flower[data-center="true"]')];
    const matrix = scene.getScreenCTM();
    if (!flowers.length || !matrix || !matrix.a) return;
    const top = Math.min(...flowers.map(flower => flower.getBoundingClientRect().top));
    const textBottom = document.querySelector('.hero-copy').getBoundingClientRect().bottom;
    const offset = Math.max(0, textBottom + 28 - top) / matrix.a;
    scene.style.setProperty('--center-offset', offset + 'px');
  }
  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(fitGardenAroundText);
  });
  function renderGarden() {
    window.GardenArt.render(scene, { seed, filter: 'all' });
    scene.querySelectorAll('.botanical-flower').forEach(flower => {
      // Preserve the depth of each layer when switching the highlighted species.
      flower.dataset.depth = flower.style.opacity;
      if (selectedFilter !== 'all' && flower.dataset.species !== selectedFilter) flower.style.opacity = '.16';
    });
    fitGardenAroundText();
  }
  renderGarden();
  document.querySelectorAll('[data-flower-icon]').forEach(element => {
    element.innerHTML = window.GardenArt.flowerIcon(element.dataset.flowerIcon);
  });

  let skySeed = 46;
  const random = () => { skySeed = (skySeed * 16807) % 2147483647; return (skySeed - 1) / 2147483646; };
  const stars = document.createDocumentFragment();
  for (let i = 0; i < 82; i++) {
    const star = document.createElement('span');
    star.className = `star${i % 19 === 0 ? ' cross' : ''}`;
    star.style.cssText = `left:${random() * 100}%;top:${8 + random() * 66}%;--size:${.6 + random() * 1.6}px;--opacity:${.12 + random() * .45};--duration:${3 + random() * 5}s;--delay:${-random() * 9}s`;
    stars.append(star);
  }
  document.getElementById('stars').append(stars);
  const fireflies = document.createDocumentFragment();
  for (let i = 0; i < 24; i++) {
    const fly = document.createElement('span');
    fly.className = 'firefly';
    fly.style.cssText = `left:${5 + random() * 90}%;top:${15 + random() * 80}%;--duration:${5 + random() * 6}s;--delay:${-random() * 12}s`;
    fireflies.append(fly);
  }
  document.getElementById('fireflies').append(fireflies);

  const filterLabels = { all: 'Todo el jardín', sunflower: 'Girasoles', daisy: 'Margaritas', tulip: 'Tulipanes', cosmos: 'Cosmos' };
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      selectedFilter = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(filter => {
        const selected = filter === button;
        filter.classList.toggle('selected', selected);
        filter.setAttribute('aria-pressed', String(selected));
      });
      scene.querySelectorAll('.botanical-flower').forEach(flower => {
        const highlighted = selectedFilter === 'all' || flower.dataset.species === selectedFilter;
        flower.style.opacity = highlighted ? flower.dataset.depth : '.16';
      });
      announce(selectedFilter === 'all' ? 'Todas las flores tienen su lugar aquí.' : `${filterLabels[selectedFilter]}: un pequeño sol en cada pétalo.`);
    });
  });

  document.getElementById('bloom-button').addEventListener('click', () => {
    seed += 7;
    renderGarden();
    clearTimeout(bloomTimer);
    shell.classList.remove('is-blooming');
    void shell.offsetWidth;
    shell.classList.add('is-blooming');
    bloomTimer = setTimeout(() => shell.classList.remove('is-blooming'), 1500);
    const container = document.getElementById('bloom-sparkles');
    container.replaceChildren();
    clearTimeout(sparkleTimer);
    if (!motionPaused && !motionPreference.matches) {
      for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'bloom-spark';
        sparkle.textContent = i % 2 ? '✧' : '·';
        sparkle.style.cssText = `left:${10 + random() * 80}%;top:${52 + random() * 27}%;--delay:${random() * .5}s`;
        container.append(sparkle);
      }
      sparkleTimer = setTimeout(() => container.replaceChildren(), 2600);
    }
    announce('Algo bonito acaba de florecer para ti.');
  });

  const motionButton = document.getElementById('motion-toggle');
  function updateMotion() {
    shell.classList.toggle('is-paused', motionPaused || document.hidden);
    const label = motionPaused ? 'Reanudar animaciones' : 'Pausar animaciones';
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('title', label);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionButton.querySelector('use').setAttribute('href', motionPaused ? '#i-play' : '#i-pause');
  }
  motionButton.addEventListener('click', () => {
    if (motionPreference.matches) { announce('El jardín respeta tu preferencia de movimiento reducido.'); return; }
    motionPaused = !motionPaused;
    updateMotion();
    announce(motionPaused ? 'El jardín se detiene. Respira un momento.' : 'La brisa vuelve al jardín.');
  });
  motionPreference.addEventListener('change', event => { motionPaused = event.matches; updateMotion(); });
  updateMotion();

  const inhabitants = document.getElementById('inhabitants');
  document.querySelector('[data-open-dialog="inhabitants"]').addEventListener('click', () => inhabitants.showModal());
  inhabitants.querySelector('.dialog-close').addEventListener('click', () => inhabitants.close());
  inhabitants.addEventListener('click', event => {
    if (event.target !== inhabitants) return;
    const rect = inhabitants.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) inhabitants.close();
  });

  const fullscreenButton = document.getElementById('fullscreen-toggle');
  if (!document.fullscreenEnabled) fullscreenButton.hidden = true;
  fullscreenButton.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { announce('Tu navegador no permite abrir la pantalla completa en este momento.'); }
  });
  document.addEventListener('fullscreenchange', () => {
    const fullscreen = Boolean(document.fullscreenElement);
    const label = fullscreen ? 'Salir de pantalla completa' : 'Ver a pantalla completa';
    fullscreenButton.setAttribute('aria-pressed', String(fullscreen));
    fullscreenButton.setAttribute('aria-label', label);
    fullscreenButton.setAttribute('title', label);
  });

  // Offline ambience, created only after the visitor enables sound.
  const soundButton = document.getElementById('sound-toggle');
  let audioContext, ambienceGain, chirpTimer;
  let soundEnabled = false;
  let soundBusy = false;
  function createAmbience() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) throw new Error('Audio no compatible');
    audioContext = new AudioContext();
    ambienceGain = audioContext.createGain();
    ambienceGain.gain.value = .14;
    ambienceGain.connect(audioContext.destination);
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
    const samples = buffer.getChannelData(0);
    let previous = 0;
    for (let i = 0; i < samples.length; i++) { previous = (previous + (Math.random() * 2 - 1) * .025) / 1.025; samples[i] = previous * 2; }
    const breeze = audioContext.createBufferSource();
    breeze.buffer = buffer;
    breeze.loop = true;
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    breeze.connect(filter);
    filter.connect(ambienceGain);
    breeze.start();
  }
  function chirp() {
    if (!soundEnabled || document.hidden || !audioContext) return;
    const time = audioContext.currentTime;
    for (let i = 0; i < 3; i++) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = time + i * .14;
      oscillator.frequency.setValueAtTime(2600 + Math.random() * 600, start);
      oscillator.frequency.exponentialRampToValueAtTime(2100, start + .09);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(.07, start + .01);
      gain.gain.exponentialRampToValueAtTime(.001, start + .1);
      oscillator.connect(gain);
      gain.connect(ambienceGain);
      oscillator.start(start);
      oscillator.stop(start + .12);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }
    chirpTimer = setTimeout(chirp, 2600 + Math.random() * 3600);
  }
  soundButton.addEventListener('click', async () => {
    if (soundBusy) return;
    soundBusy = true;
    soundButton.disabled = true;
    try {
      if (!audioContext) createAmbience();
      if (soundEnabled) { await audioContext.suspend(); clearTimeout(chirpTimer); soundEnabled = false; }
      else { await audioContext.resume(); soundEnabled = true; chirp(); }
      soundButton.setAttribute('aria-pressed', String(soundEnabled));
      const label = soundEnabled ? 'Desactivar sonidos del jardín' : 'Activar sonidos del jardín';
      soundButton.setAttribute('title', label);
      soundButton.setAttribute('aria-label', label);
      soundButton.querySelector('use').setAttribute('href', soundEnabled ? '#i-sound' : '#i-muted');
      document.getElementById('sound-label').textContent = soundEnabled ? 'activado' : 'desactivado';
      announce(soundEnabled ? 'Cierra los ojos un instante. El jardín suena para ti.' : 'El jardín vuelve al silencio.');
    } catch { announce('El sonido no está disponible en este navegador.'); }
    finally { soundBusy = false; soundButton.disabled = false; }
  });
  document.addEventListener('visibilitychange', async () => {
    updateMotion();
    if (!soundEnabled || !audioContext) return;
    clearTimeout(chirpTimer);
    try {
      if (document.hidden) await audioContext.suspend();
      else { await audioContext.resume(); chirp(); }
    } catch { /* Browsers may require a new sound-button click to resume audio. */ }
  });
})();
