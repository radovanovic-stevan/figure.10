// Pixel background: rising embers + an equalizer that react to the music.
(() => {
  const canvas = document.getElementById("bg");
  const g = canvas.getContext("2d");
  const SCALE = 4; // each "pixel" is 4x4 screen pixels
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0;
  const embers = [];
  const freq = new Uint8Array(64);

  function resize() {
    w = Math.ceil(window.innerWidth / SCALE);
    h = Math.ceil(window.innerHeight / SCALE);
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener("resize", resize);
  resize();

  function spawn() {
    embers.push({
      x: Math.random() * w,
      y: h + 2,
      vy: 0.15 + Math.random() * 0.35,
      drift: Math.random() * Math.PI * 2,
      life: 1,
      hot: Math.random() < 0.3,
    });
  }

  let last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (now - last < 33) return; // ~30 fps keeps it chunky and cheap
    last = now;

    const an = Music.analyser;
    let bass = 0;
    if (an && Music.playing) {
      an.getByteFrequencyData(freq);
      bass = (freq[1] + freq[2] + freq[3]) / (3 * 255);
    } else {
      freq.fill(0);
    }

    g.clearRect(0, 0, w, h);

    // embers
    if (!reduced) {
      const rate = 0.25 + bass * 1.5;
      for (let i = 0; i < rate; i++) if (Math.random() < rate - i) spawn();
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.y -= e.vy * (1 + bass * 2);
        e.drift += 0.05;
        e.x += Math.sin(e.drift) * 0.15;
        e.life -= 0.004;
        if (e.y < -2 || e.life <= 0) { embers.splice(i, 1); continue; }
        g.globalAlpha = Math.max(0, e.life) * 0.8;
        g.fillStyle = e.hot ? "#ffb347" : "#e5322b";
        g.fillRect(Math.round(e.x), Math.round(e.y), 1, 1);
      }
      g.globalAlpha = 1;
    }

    // equalizer along the bottom
    const bars = Math.min(32, Math.floor(w / 3));
    const barW = Math.floor(w / bars);
    const maxH = Math.min(26, Math.floor(h * 0.18));
    for (let i = 0; i < bars; i++) {
      // log-ish spread so the bass doesn't hog the left side
      const bin = 1 + Math.floor(Math.pow(i / bars, 1.8) * 34);
      const v = Math.min(1, (freq[bin] / 255) * (1 + i / bars));
      const bh = Math.max(1, Math.round(v * v * maxH));
      for (let y = 0; y < bh; y += 2) {
        const t = y / maxH;
        g.fillStyle = t > 0.75 ? "#ffb347" : t > 0.45 ? "#ff5a3c" : "#8f1c17";
        g.globalAlpha = 0.55;
        g.fillRect(i * barW, h - 1 - y, barW - 1, 1);
      }
    }
    g.globalAlpha = 1;
  }
  requestAnimationFrame(frame);
})();
