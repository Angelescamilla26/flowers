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

  // The local song starts from a user gesture, including on mobile browsers.
  const soundButton = document.getElementById('sound-toggle');
  const song = document.getElementById('garden-song');
  let wantsSound = false;
  let playRequest = 0;
  song.volume = .65;

  function updateSoundState() {
    const playing = !song.paused && !song.ended;
    soundButton.setAttribute('aria-pressed', String(playing));
    const label = playing ? 'Desactivar sonidos del jardín' : 'Activar sonidos del jardín';
    soundButton.setAttribute('title', label);
    soundButton.setAttribute('aria-label', label);
    soundButton.querySelector('use').setAttribute('href', playing ? '#i-sound' : '#i-muted');
    document.getElementById('sound-label').textContent = playing ? 'activado' : 'desactivado';
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
  }

  async function playSong(shouldAnnounce = false) {
    const request = ++playRequest;
    wantsSound = true;
    soundButton.setAttribute('aria-busy', 'true');
    try {
      if (song.error) song.load();
      await song.play();
      if (request !== playRequest) return;
      updateSoundState();
      if (shouldAnnounce) announce('Cierra los ojos un instante. El jardín suena para ti.');
    } catch {
      if (request !== playRequest) return;
      wantsSound = false;
      updateSoundState();
      announce('El sonido no está disponible en este navegador.');
    } finally {
      if (request === playRequest) soundButton.removeAttribute('aria-busy');
    }
  }

  function pauseSong(shouldAnnounce = false) {
    ++playRequest;
    wantsSound = false;
    song.pause();
    soundButton.removeAttribute('aria-busy');
    updateSoundState();
    if (shouldAnnounce) announce('El jardín vuelve al silencio.');
  }

  soundButton.addEventListener('click', () => {
    if (wantsSound || !song.paused) pauseSong(true);
    else playSong(true);
  });
  song.addEventListener('playing', updateSoundState);
  song.addEventListener('pause', () => {
    wantsSound = false;
    updateSoundState();
  });
  song.addEventListener('error', () => {
    const wasRequested = wantsSound;
    pauseSong();
    if (wasRequested) announce('El sonido no está disponible en este navegador.');
  });
  song.addEventListener('ended', () => { wantsSound = false; updateSoundState(); });

  if ('mediaSession' in navigator) {
    if ('MediaMetadata' in window) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: 'Flores Amarillas', artist: 'Floricienta' });
    }
    try {
      navigator.mediaSession.setActionHandler('play', () => playSong());
      navigator.mediaSession.setActionHandler('pause', () => pauseSong());
      navigator.mediaSession.setActionHandler('stop', () => { pauseSong(); song.currentTime = 0; });
    } catch { /* The sound button also works without system media controls. */ }
  }
  document.addEventListener('visibilitychange', updateMotion);
  window.addEventListener('pagehide', () => pauseSong());
})();
