/* A little illustrated meadow. All geometry is generated locally, without assets. */
(function () {
  'use strict';

  const species = ['sunflower', 'daisy', 'tulip', 'cosmos'];
  let drawingCount = 0;
  const n = value => Number(value.toFixed(2));
  const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
  const ellipse = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}" ${extra}/>`;

  function random(seed) {
    let state = Number(seed) >>> 0;
    return () => {
      state += 0x6d2b79f5;
      let t = state;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function leaf(x, y, length, direction, shade, tilt = 0) {
    return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(tilt)}) scale(${direction} 1)">` +
      path(`M0 0 C${n(length * .13)} ${n(-length * .63)},${n(length * .71)} ${n(-length * .7)},${n(length)} ${n(-length * .8)} C${n(length * .82)} ${n(-length * .22)},${n(length * .4)} ${n(length * .16)},0 0Z`, shade) +
      path(`M1 -1 Q${n(length * .52)} ${n(-length * .37)} ${n(length * .9)} ${n(-length * .71)}`, 'none', 'stroke="#bad594" stroke-opacity=".28" stroke-width=".8"') +
      path(`M${n(length * .31)} ${n(-length * .23)} l${n(length * .06)} ${n(-length * .21)} M${n(length * .5)} ${n(-length * .38)} l${n(length * .17)} ${n(length * .02)}`, 'none', 'stroke="#bad594" stroke-opacity=".15" stroke-width=".65"') + '</g>';
  }

  function sunflower(size, rand) {
    let out = '';
    for (let layer = 0; layer < 2; layer++) {
      const count = layer ? 15 : 19;
      for (let i = 0; i < count; i++) {
        const length = size * (layer ? .84 : 1.05) * (.93 + rand() * .14);
        const width = size * (layer ? .2 : .23);
        const angle = i * 360 / count + (layer ? 10 : 0);
        const colors = layer ? ['#ffe899', '#ffdf69', '#ffcf4d'] : ['#f9c846', '#eeb834', '#ffd85c'];
        out += `<g transform="rotate(${n(angle)})">`;
        out += path(`M${n(-width * .42)} ${n(-size * .26)} C${n(-width * 1.5)} ${n(-length * .7)},${n(-width * .49)} ${n(-length)},0 ${n(-length * 1.08)} C${n(width * .93)} ${n(-length * .92)},${n(width * 1.05)} ${n(-length * .55)},${n(width * .43)} ${n(-size * .26)}Z`, colors[i % colors.length]);
        out += path(`M0 ${n(-size * .39)} Q${n(width * .24)} ${n(-length * .7)} 0 ${n(-length * .96)}`, 'none', 'stroke="#b68522" stroke-width=".55" opacity=".24"');
        out += '</g>';
      }
    }
    out += ellipse(0, 1, size * .42, size * .4, '#805120');
    out += ellipse(-1, 0, size * .33, size * .32, '#503921');
    const count = Math.round(size * 2);
    for (let i = 0; i < count; i++) {
      const angle = i * 2.39996;
      const radius = Math.sqrt((i + .5) / count) * size * .37;
      out += ellipse(Math.cos(angle) * radius, Math.sin(angle) * radius, size * .022, size * .018, i % 3 ? '#b98a40' : '#e6b753', `transform="rotate(${n(angle * 57.2958)} ${n(Math.cos(angle) * radius)} ${n(Math.sin(angle) * radius)})" opacity="${i % 3 ? '.75' : '.95'}"`);
    }
    return out;
  }

  function daisy(size, rand) {
    let out = '';
    for (let layer = 0; layer < 2; layer++) {
      for (let i = 0; i < 13; i++) {
        const length = size * (.9 + rand() * .16) * (layer ? .87 : 1);
        const width = size * (layer ? .16 : .175);
        out += `<g transform="rotate(${n(i * 360 / 13 + layer * 12)})">`;
        out += path(`M${n(-width * .4)} ${n(-size * .15)} C${n(-width * 1.3)} ${n(-length * .55)},${n(-width)} ${n(-length)},0 ${n(-length)} C${n(width)} ${n(-length)},${n(width * 1.3)} ${n(-length * .55)},${n(width * .4)} ${n(-size * .15)}Z`, ['#ffde72', '#f5cd50', '#ffe899'][(i + layer) % 3]);
        out += path(`M0 ${n(-size * .28)} L0 ${n(-length * .86)}`, 'none', 'stroke="#d6a82e" stroke-width=".5" opacity=".45"');
        out += '</g>';
      }
    }
    out += ellipse(0, 0, size * .26, size * .25, '#b98a29');
    out += ellipse(-size * .02, -size * .035, size * .22, size * .2, '#e9b833');
    for (let i = 0; i < 24; i++) {
      const angle = i * 2.39996;
      const radius = Math.sqrt(i / 24) * size * .205;
      out += ellipse(Math.cos(angle) * radius, Math.sin(angle) * radius, .8, .8, i % 2 ? '#ffeb91' : '#a77920');
    }
    return out;
  }

  function tulip(size) {
    let out = path(`M0 ${n(size * .7)} C${n(-size * .63)} ${n(size * .45)},${n(-size * .84)} ${n(-size * .17)},${n(-size * .69)} ${n(-size * .78)} Q${n(-size * .26)} ${n(-size * .62)} 0 ${n(-size * .98)} Q${n(size * .26)} ${n(-size * .62)} ${n(size * .69)} ${n(-size * .78)} C${n(size * .84)} ${n(-size * .17)},${n(size * .63)} ${n(size * .45)},0 ${n(size * .7)}Z`, '#e7ae2e');
    out += path(`M0 ${n(size * .69)} C${n(-size * .43)} ${n(size * .29)},${n(-size * .46)} ${n(-size * .3)},0 ${n(-size * .87)} C${n(size * .46)} ${n(-size * .3)},${n(size * .43)} ${n(size * .29)},0 ${n(size * .69)}Z`, '#ffe899');
    out += path(`M0 ${n(size * .69)} C${n(-size * .81)} ${n(size * .41)},${n(-size * .81)} ${n(-size * .22)},${n(-size * .76)} ${n(-size * .58)} C${n(-size * .3)} ${n(-size * .47)},${n(size * .11)} ${n(-size * .16)},0 ${n(size * .69)}Z`, '#ffcf4d');
    out += path(`M0 ${n(size * .69)} C${n(size * .81)} ${n(size * .41)},${n(size * .81)} ${n(-size * .22)},${n(size * .76)} ${n(-size * .58)} C${n(size * .3)} ${n(-size * .47)},${n(-size * .11)} ${n(-size * .16)},0 ${n(size * .69)}Z`, '#ffe087');
    for (const direction of [-1, 1]) {
      out += path(`M${n(direction * size * .07)} ${n(size * .53)} Q${n(direction * size * .33)} ${n(size * .04)} ${n(direction * size * .64)} ${n(-size * .42)}`, 'none', 'stroke="#bd8c21" stroke-width=".8" opacity=".3"');
    }
    return out;
  }

  function cosmos(size, rand) {
    let out = '';
    for (let i = 0; i < 8; i++) {
      const length = size * (.94 + rand() * .1);
      const width = size * .37;
      out += `<g transform="rotate(${i * 45})">`;
      out += path(`M${n(-width * .3)} ${n(-size * .12)} Q${n(-width * 1.22)} ${n(-length * .56)} ${n(-width * .74)} ${n(-length * .91)} L${n(-width * .33)} ${n(-length)} L0 ${n(-length * .95)} L${n(width * .35)} ${n(-length)} L${n(width * .79)} ${n(-length * .91)} Q${n(width * 1.05)} ${n(-length * .5)} ${n(width * .3)} ${n(-size * .12)}Z`, ['#ffd461', '#ffdc78', '#f1bd3e'][i % 3]);
      for (const k of [-1, 0, 1]) out += path(`M${n(k * width * .08)} ${n(-size * .18)} Q${n(k * width * .34)} ${n(-length * .59)} ${n(k * width * .48)} ${n(-length * .85)}`, 'none', 'stroke="#b78825" stroke-width=".5" opacity=".25"');
      out += '</g>';
    }
    out += ellipse(0, 0, size * .2, size * .19, '#8c671f');
    for (let i = 0; i < 17; i++) {
      const angle = i * 2.4;
      const radius = Math.sqrt(i / 17) * size * .16;
      out += ellipse(Math.cos(angle) * radius, Math.sin(angle) * radius, 1.15, 1.15, i % 2 ? '#f8de69' : '#d5a12d');
    }
    return out;
  }

  function head(type, size, rand) {
    if (type === 'sunflower') return sunflower(size, rand);
    if (type === 'tulip') return tulip(size);
    if (type === 'cosmos') return cosmos(size, rand);
    return daisy(size, rand);
  }

  function flower(spec, rand, filter) {
    const { x, y, height, size, type, depth } = spec;
    const bend = (rand() - .5) * 48;
    const angle = (rand() - .5) * (type === 'tulip' ? 22 : 35);
    const selected = filter === 'all' || filter === type;
    let out = `<g class="botanical-flower" data-species="${type}" data-center="${x > 445 && x < 1030}" transform="translate(${n(x)} ${n(y)})" style="opacity:${selected ? depth : .16};transition:opacity .6s ease"><g class="bloom-sway" style="--sway-duration:${n(4.8 + rand() * 4)}s;--sway-delay:${n(-rand() * 8)}s;transform-origin:0px 0px">`;
    out += path(`M0 4 C${n(-bend * .25)} ${n(-height * .33)},${n(bend * 1.4)} ${n(-height * .68)},${n(bend)} ${n(-height + size * .2)}`, 'none', `stroke="${type === 'sunflower' ? '#547443' : '#6b8b4c'}" stroke-width="${type === 'sunflower' ? '4.2' : '2.3'}" stroke-linecap="round"`);
    out += path(`M-1 0 Q${n(bend * .4)} ${n(-height * .58)} ${n(bend - .5)} ${n(-height + size * .2)}`, 'none', 'stroke="#aec984" stroke-width=".65" opacity=".28"');
    if (type === 'tulip') {
      out += path(`M0 -7 C-46 ${n(-height * .23)},-26 ${n(-height * .54)},-53 ${n(-height * .78)} C-13 ${n(-height * .64)},9 ${n(-height * .26)},0 -7Z`, '#496f49');
      out += path(`M0 -5 C32 ${n(-height * .28)},17 ${n(-height * .51)},45 ${n(-height * .61)} C38 ${n(-height * .34)},22 ${n(-height * .12)},0 -5Z`, '#63844d');
      out += path(`M-2 -10 Q-16 ${n(-height * .45)} -45 ${n(-height * .71)}`, 'none', 'stroke="#aac478" opacity=".3" stroke-width=".85"');
    } else if (type === 'cosmos') {
      for (let i = 0; i < 4; i++) {
        const branchY = -height * (.16 + i * .15);
        const direction = i % 2 ? 1 : -1;
        const length = 34 + rand() * 17;
        out += path(`M${n(bend * .35)} ${n(branchY)} q${n(direction * length * .55)} -13 ${n(direction * length)} -38`, 'none', 'stroke="#5e8550" stroke-width="1"');
        for (let j = 1; j < 5; j++) {
          const bx = bend * .35 + direction * length * j / 5;
          const by = branchY - 38 * j / 5;
          out += path(`M${n(bx)} ${n(by)} q${n(-direction * 5)} -12 ${n(-direction * 3)} -21 M${n(bx)} ${n(by)} q${n(direction * 13)} 0 ${n(direction * 22)} -10`, 'none', 'stroke="#83a466" stroke-width="1" stroke-linecap="round" opacity=".8"');
        }
      }
    } else {
      const leaves = type === 'sunflower' ? 4 : 3;
      for (let i = 0; i < leaves; i++) {
        out += leaf(bend * .38, -height * (.17 + i * .16), (type === 'sunflower' ? 53 : 31) * (.8 + rand() * .48), i % 2 ? 1 : -1, i % 2 ? '#4c754a' : '#65884f', (rand() - .5) * 25);
      }
    }
    out += `<g transform="translate(${n(bend)} ${n(-height)}) rotate(${n(angle)})">`;
    out += ellipse(0, size * .16, size * .33, size * .22, '#5a7337');
    out += head(type, size, rand);
    out += '</g></g></g>';
    return out;
  }

  function grass(rand, count, baseY, height, colors, opacity) {
    let out = `<g opacity="${opacity}">`;
    for (let i = 0; i < count; i++) {
      const x = rand() * 1510 - 35;
      const y = baseY + rand() * 36;
      const h = height * (.25 + rand() * .9);
      const lean = (rand() - .5) * h * .95;
      const width = 1.4 + rand() * 3.8;
      out += path(`M${n(x - width)} ${n(y)} Q${n(x + lean * .14)} ${n(y - h * .64)} ${n(x + lean)} ${n(y - h)} Q${n(x + lean * .5)} ${n(y - h * .36)} ${n(x + width)} ${n(y)}Z`, colors[i % colors.length]);
    }
    return out + '</g>';
  }

  function fern(x, y, scale, direction) {
    let out = `<g transform="translate(${x} ${y}) scale(${n(scale * direction)} ${scale})" opacity=".88">`;
    out += path('M0 0 Q-8 -89 60 -170', 'none', 'stroke="#73995a" stroke-width="1.8"');
    for (let i = 0; i < 12; i++) {
      const t = i / 12;
      const cy = -18 - t * 135;
      const cx = 3 + 46 * t * t;
      const length = 35 * Math.sin((t * .88 + .1) * Math.PI);
      for (const sign of [-1, 1]) {
        out += path(`M${n(cx)} ${n(cy)} Q${n(cx + sign * length * .45)} ${n(cy - 16)} ${n(cx + sign * length)} ${n(cy - 21)} Q${n(cx + sign * length * .76)} ${n(cy - 6)} ${n(cx)} ${n(cy + 2)}Z`, i % 2 ? '#396b4c' : '#507f51');
        out += path(`M${n(cx)} ${n(cy)} L${n(cx + sign * length * .9)} ${n(cy - 18)}`, 'none', 'stroke="#9fbd70" opacity=".24" stroke-width=".7"');
      }
    }
    return out + '</g>';
  }

  function butterfly(x, y, scale, angle) {
    return `<g class="butterfly" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><g class="butterfly-wings">` +
      path('M-1 0 C-28 -38 -38 -16 -22 -1 C-41 8 -18 27 -2 8Z', '#efc853') +
      path('M1 0 C28 -38 38 -16 22 -1 C41 8 18 27 2 8Z', '#ffe291') +
      path('M-4 -1 Q-19 -16 -25 -14 M4 -1 Q19 -16 25 -14 M-4 6 L-18 10 M4 6 L18 10', 'none', 'stroke="#a07623" stroke-width=".8" opacity=".5"') +
      ellipse(-21, -11, 2.5, 4, '#d29c2d') + ellipse(21, -11, 2.5, 4, '#e1b546') +
      '</g>' + ellipse(0, 2, 2.1, 11, '#8d702e') +
      path('M-1 -6 Q-1 -14 -6 -15 M1 -6 Q1 -14 6 -15', 'none', 'stroke="#c4a558" stroke-width=".85" stroke-linecap="round"') + '</g>';
  }

  function bee(x, y, scale, angle) {
    return `<g class="bee" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})">` +
      ellipse(-3, -9, 5, 10, '#dfedcc', 'opacity=".55" transform="rotate(-28 -3 -9)"') +
      ellipse(4, -10, 5, 10, '#e9eed9', 'opacity=".65" transform="rotate(23 4 -10)"') +
      ellipse(0, 0, 12, 8, '#f7ce61') +
      path('M-4 -7 Q-8 0 -4 7 M3 -7 Q-1 0 3 7', 'none', 'stroke="#4c4229" stroke-width="3.5"') +
      ellipse(11, 0, 5, 5.5, '#403e28') + ellipse(13, -1, 1, 1, '#e7d998') +
      path('M13 -4 L15 -8 M-12 0 L-16 -1 M0 6 L-3 11 M5 6 L7 10', 'none', 'stroke="#746d41" stroke-width="1" stroke-linecap="round"') + '</g>';
  }

  function rabbit(x, y) {
    return `<g class="rabbit" transform="translate(${x} ${y})">` +
      ellipse(0, 2, 40, 7, '#061a13', 'opacity=".6"') +
      ellipse(-5, -18, 27, 22, '#c8c7a7') + ellipse(-25, -14, 10, 10, '#e5dfbe') +
      ellipse(17, -36, 15, 15, '#e4dabb') +
      ellipse(14, -60, 5.5, 22, '#e5dcbf', 'transform="rotate(-12 14 -60)"') +
      ellipse(25, -58, 5, 20, '#d9d2b1', 'transform="rotate(14 25 -58)"') +
      ellipse(14, -61, 2.5, 15, '#bbaa8e', 'transform="rotate(-12 14 -61)"') +
      ellipse(25, -59, 2, 13, '#b8a68d', 'transform="rotate(14 25 -59)"') +
      ellipse(9, -3, 15, 5, '#e7dcbb') + ellipse(-10, -4, 16, 7, '#d9d0ae') +
      ellipse(24, -39, 2, 2.3, '#2b3227') + ellipse(24.5, -39.7, .6, .6, '#ffffdc') +
      path('M30 -32 l5 2 -5 2Z', '#9c927c') +
      path('M28 -29 l13 -3 M28 -27 l12 2 M-17 -24 Q-4 -34 4 -25', 'none', 'stroke="#a9a78b" stroke-width=".8" stroke-linecap="round"') + '</g>';
  }

  function snail(x, y) {
    return `<g class="snail" transform="translate(${x} ${y})">` +
      path('M-17 1 Q-4 -3 8 -2 Q17 -3 18 -12 L21 -11 Q23 -1 30 0 Q22 6 -17 4Z', '#a7ad72') +
      ellipse(-1, -9, 13, 12, '#ad905a') +
      path('M8 -6 C12 -19 -8 -24 -11 -11 C-14 0 7 3 7 -8 C7 -15 -4 -17 -5 -10 C-6 -5 2 -4 2 -9', 'none', 'stroke="#6d643e" stroke-width="1.7"') +
      path('M18 -10 L15 -17 M22 -10 L24 -17', 'none', 'stroke="#a7ad72" stroke-width="1.2"') +
      ellipse(15, -17, 1.4, 1.4, '#d1ce90') + ellipse(24, -17, 1.4, 1.4, '#d1ce90') + '</g>';
  }

  function render(svgElement, options = {}) {
    if (!svgElement || typeof svgElement.setAttribute !== 'function') return;
    const seed = Number.isFinite(Number(options.seed)) ? Number(options.seed) : 21;
    const filter = species.includes(options.filter) ? options.filter : 'all';
    const rand = random(seed);
    const id = `meadow-${++drawingCount}`;
    svgElement.setAttribute('viewBox', '0 0 1440 720');
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    let out = `<defs><linearGradient id="${id}-ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#153e2c" stop-opacity="0"/><stop offset=".48" stop-color="#173f2b" stop-opacity=".75"/><stop offset="1" stop-color="#09291d"/></linearGradient><radialGradient id="${id}-glow"><stop stop-color="#dcc475" stop-opacity=".075"/><stop offset="1" stop-color="#b0be73" stop-opacity="0"/></radialGradient></defs>`;
    out += `<ellipse cx="750" cy="450" rx="710" ry="315" fill="url(#${id}-glow)"/>`;
    out += path('M-30 637 Q190 570 385 623 T778 615 T1160 598 T1490 622 L1490 750 H-30Z', `url(#${id}-ground)`);
    out += grass(rand, 135, 661, 210, ['#1d4836', '#244d36', '#1b3f2d', '#31523a'], .6);

    // Smaller, distant flowers add depth without obscuring the individual varieties.
    const flowers = [];
    for (let i = 0; i < 16; i++) {
      flowers.push({ x: 18 + i * 92 + (rand() - .5) * 34, y: 648 + rand() * 21, height: 115 + rand() * 155, size: 12 + rand() * 8, type: species[(i + 1) % 4], depth: .48 + rand() * .2 });
    }
    const layout = [
      [39, 215, 26, 'cosmos'], [93, 330, 36, 'sunflower'], [150, 238, 26, 'daisy'],
      [203, 398, 42, 'sunflower'], [263, 274, 28, 'tulip'], [313, 333, 31, 'daisy'],
      [375, 457, 49, 'sunflower'], [426, 236, 28, 'cosmos'], [480, 314, 30, 'tulip'],
      [545, 241, 28, 'daisy'], [600, 360, 36, 'cosmos'], [664, 222, 29, 'tulip'],
      [724, 298, 29, 'daisy'], [782, 209, 29, 'cosmos'], [832, 352, 40, 'sunflower'],
      [898, 248, 29, 'tulip'], [956, 403, 42, 'sunflower'], [1014, 304, 30, 'cosmos'],
      [1080, 457, 47, 'sunflower'], [1140, 281, 29, 'daisy'], [1200, 355, 31, 'tulip'],
      [1260, 239, 30, 'cosmos'], [1325, 377, 42, 'sunflower'], [1401, 282, 29, 'daisy']
    ];
    layout.forEach(([x, height, size, type], index) => {
      flowers.push({ x: x + (rand() - .5) * 20, y: 681 + Math.sin(index * 1.9) * 17, height: height + (rand() - .5) * 27, size, type, depth: .96 });
    });
    // Keep a quiet clearing behind the centered heading, with taller edges.
    flowers.forEach(spec => {
      if (spec.x > 445 && spec.x < 1030) {
        spec.height = Math.min(spec.height, spec.y - 354 - spec.size * 1.2);
      }
    });
    flowers.sort((a, b) => a.y - b.y);
    flowers.forEach(spec => { out += flower(spec, rand, filter); });

    out += fern(69, 700, .8, 1) + fern(470, 713, .67, -1) + fern(742, 716, .53, 1) + fern(1160, 704, .68, -1) + fern(1393, 720, 1, -1);
    out += grass(rand, 145, 712, 133, ['#315b3a', '#456e42', '#264f37', '#567b45', '#1f4831'], .92);

    // Fine seed heads and clover-like herbs soften the edge of the meadow.
    for (let i = 0; i < 25; i++) {
      const x = rand() * 1440;
      const y = 691 + rand() * 25;
      const h = 60 + rand() * 100;
      const lean = (rand() - .5) * 35;
      out += path(`M${n(x)} ${n(y)} Q${n(x + lean * .25)} ${n(y - h * .65)} ${n(x + lean)} ${n(y - h)}`, 'none', 'stroke="#7f9652" stroke-width=".9" opacity=".7"');
      for (let j = 0; j < 6; j++) {
        const sx = x + lean - j * lean * .025;
        const sy = y - h + j * 6;
        out += ellipse(sx + (j % 2 ? 3 : -3), sy, 2, 4, j % 2 ? '#aaa463' : '#738550', `transform="rotate(${j % 2 ? 30 : -30} ${n(sx)} ${n(sy)})" opacity=".7"`);
      }
    }
    for (let i = 0; i < 34; i++) {
      const x = rand() * 1440;
      const y = 695 + rand() * 31;
      const size = 5 + rand() * 5;
      out += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(rand() * 50 - 25)})">`;
      out += ellipse(-size * .62, -size, size * .68, size, '#527644', 'transform="rotate(-38)"');
      out += ellipse(size * .62, -size, size * .68, size, '#668751', 'transform="rotate(38)"');
      out += ellipse(0, -size * 1.55, size * .68, size, '#759257');
      out += '</g>';
    }

    out += rabbit(886, 590) + snail(570, 575);
    out += grass(rand, 62, 748, 85, ['#163e2b', '#204a30', '#325b36'], .98);
    out += butterfly(499, 279, .68, -26) + butterfly(1199, 199, .48, 24) + butterfly(705, 412, .34, -17);
    out += bee(306, 213, .61, -18) + bee(912, 320, .49, 16);
    for (let i = 0; i < 26; i++) {
      const x = 40 + rand() * 1360;
      const y = 238 + rand() * 400;
      const r = .7 + rand() * 1.25;
      out += `<g class="firefly" style="--firefly-delay:${n(-rand() * 8)}s">` + ellipse(x, y, r * 4, r * 4, '#eadc8c', 'opacity=".035"') + ellipse(x, y, r, r, '#f2df8b', `opacity="${n(.22 + rand() * .5)}"`) + '</g>';
    }
    svgElement.innerHTML = out;
  }

  function flowerIcon(type) {
    const selected = species.includes(type) ? type : 'daisy';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72" fill="none" aria-hidden="true">` +
      path('M32 65 Q29 48 33 29', 'none', 'stroke="#648553" stroke-width="2.3" stroke-linecap="round"') +
      leaf(31, 55, 15, -1, '#5a7b4b') + leaf(31, 48, 12, 1, '#7b9656') +
      `<g transform="translate(33 25)">${head(selected, selected === 'tulip' ? 20 : 21, random(42))}</g></svg>`;
  }

  window.GardenArt = { render, flowerIcon };
})();
