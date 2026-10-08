// Original 8-bit rock loop + sound effects, synthesized with the Web Audio API.
// E minor, 150 BPM. Song form: A (verse) → B (chorus) → A → B, ~51s loop.

const Music = (() => {
  const BPM = 150;
  const STEP = 60 / BPM / 4; // one 16th note

  let ctx = null;
  let master, musicBus, sfxBus, analyser, noiseBuf, pulse12, pulse25;
  let playing = false;
  let timer = null;
  let nextTime = 0;
  let pos = 0; // absolute 16th-note position in the song

  // ---------- helpers ----------
  const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const midi = (name) => {
    const m = name.match(/^([A-G])(#|b)?(-?\d)$/);
    return 12 * (Number(m[3]) + 1) + NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  };
  const freq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function pulseWave(duty) {
    const n = 64;
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let i = 1; i < n; i++) real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * duty);
    return ctx.createPeriodicWave(real, imag);
  }

  // ---------- song data ----------
  // Chord per bar: [bass root MIDI, quality]
  const CH = {
    Em: [40, "min"], C: [36, "maj"], D: [38, "maj"], G: [43, "maj"], B: [35, "maj"],
  };
  const SECTION_A = ["Em", "Em", "C", "D", "Em", "Em", "C", "B"];
  const SECTION_B = ["C", "G", "D", "Em", "C", "G", "D", "B"];
  const FORM = [["A", SECTION_A], ["B", SECTION_B], ["A", SECTION_A], ["B", SECTION_B]];
  const BARS = FORM.length * 8;

  // Chorus lead: 16 tokens per bar; note name = attack, "-" = hold, "." = rest
  const LEAD_B = [
    "E5 - - - D5 - E5 - G5 - - - E5 - D5 -",
    "D5 - - - B4 - - - G4 - A4 - B4 - - -",
    "A4 - - - F#4 - A4 - D5 - - - C5 - B4 -",
    "B4 - - - - - - - G4 - A4 - B4 - - -",
    "E5 - - - D5 - E5 - G5 - - - A5 - G5 -",
    "F#5 - - - D5 - - - B4 - D5 - G5 - - -",
    "F#5 - - - E5 - D5 - A4 - - - D5 - E5 -",
    "F#5 - - - - - - - D#5 - - - B4 - - -",
  ].map(parseBar);

  function parseBar(str) {
    const toks = str.split(/\s+/);
    const out = [];
    for (let i = 0; i < 16; i++) {
      const t = toks[i];
      if (t === "-" || t === ".") continue;
      let len = 1;
      while (i + len < 16 && toks[i + len] === "-") len++;
      out[i] = { m: midi(t), len };
    }
    return out;
  }

  const DRUMS = {
    A: { k: "x.......x.x.....", s: "....x.......x...", h: "x.x.x.x.x.x.x.x." },
    B: { k: "x..x....x.x..x..", s: "....x.......x...", h: "xxxxxxxxxxxxxxxx" },
    FILL: { k: "x..x....x.......", s: "....x.....x.xxxx", h: "xxxxxxxx........" },
  };
  // Verse arpeggio: indices into [root, third, fifth, octave]
  const ARP = [0, 2, 3, 2, 1, 2, 3, 2, 0, 2, 3, 2, 1, 2, 1, 2];

  // ---------- instruments ----------
  function tone(t, f, dur, wave, vol, dest = musicBus) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    if (wave instanceof PeriodicWave) o.setPeriodicWave(wave); else o.type = wave;
    o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.004);
    g.gain.exponentialRampToValueAtTime(Math.max(vol * 0.5, 0.0001), t + Math.max(dur * 0.7, 0.01));
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  function noise(t, dur, vol, hp, dest = musicBus) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = hp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  }

  function kick(t) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + 0.2);
  }

  function snare(t) {
    noise(t, 0.14, 0.45, 1200);
    tone(t, 190, 0.06, "triangle", 0.25);
  }

  // ---------- sequencer ----------
  function scheduleStep(p, t) {
    const bar = Math.floor(p / 16) % BARS;
    const s = p % 16;
    const [secName, chords] = FORM[Math.floor(bar / 8)];
    const barInSec = bar % 8;
    const [root, q] = CH[chords[barInSec]];
    const third = q === "min" ? 3 : 4;
    const chorus = secName === "B";

    // drums
    const lastBarOfSong = bar === BARS - 1;
    const d = lastBarOfSong || (barInSec === 7 && !chorus) ? DRUMS.FILL : chorus ? DRUMS.B : DRUMS.A;
    if (d.k[s] === "x") kick(t);
    if (d.s[s] === "x") snare(t);
    if (d.h[s] === "x") noise(t, 0.03, chorus ? 0.12 : 0.16, 7000);
    if (chorus && barInSec === 0 && s === 0) noise(t, 0.9, 0.25, 4000); // crash

    // bass: galloping 8ths, octave pop on the "and" of 2 and 4
    if (s % 2 === 0) {
      const m = root + (s === 6 || s === 14 ? 12 : 0);
      tone(t, freq(m), STEP * 1.8, "triangle", 0.5);
      tone(t, freq(m + 12), STEP * 1.6, pulse25, 0.06);
    }

    // rhythm "guitar": power chord (root + fifth + octave)
    if (chorus) {
      if (s % 2 === 0) {
        for (const iv of [12, 19, 24]) tone(t, freq(root + iv), STEP * 1.9, pulse25, 0.05);
      }
    } else if (s % 2 === 0) {
      // palm-muted chugs
      for (const iv of [12, 19]) tone(t, freq(root + iv), STEP * 0.7, pulse25, 0.045);
    }

    // lead
    if (chorus) {
      const n = LEAD_B[barInSec][s];
      if (n) {
        tone(t, freq(n.m), STEP * n.len * 0.95, pulse12, 0.11);
        tone(t, freq(n.m) * 1.003, STEP * n.len * 0.95, pulse25, 0.03); // slight detune for width
      }
    } else {
      const ivs = [0, third, 7, 12];
      const m = root + 24 + ivs[ARP[s]];
      tone(t, freq(m), STEP * 0.9, pulse12, 0.06);
    }
  }

  function scheduler() {
    const lookahead = document.hidden ? 1.5 : 0.15; // background tabs throttle timers
    while (nextTime < ctx.currentTime + lookahead) {
      scheduleStep(pos, nextTime);
      pos++;
      nextTime += STEP;
    }
  }

  // ---------- public API ----------
  function init() {
    if (ctx) return ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return Promise.resolve();
    ctx = new AC();

    const comp = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    musicBus = ctx.createGain();
    sfxBus = ctx.createGain();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.75;

    musicBus.gain.value = 0;
    sfxBus.gain.value = 0.5;
    musicBus.connect(master);
    sfxBus.connect(master);
    master.connect(comp).connect(analyser).connect(ctx.destination);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    pulse12 = pulseWave(0.125);
    pulse25 = pulseWave(0.25);
    return ctx.resume();
  }

  function play() {
    if (!ctx || playing) return;
    playing = true;
    nextTime = ctx.currentTime + 0.05;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(1, ctx.currentTime, 0.05);
    timer = setInterval(scheduler, 25);
    scheduler();
  }

  function stop() {
    if (!ctx || !playing) return;
    playing = false;
    clearInterval(timer);
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
  }

  function setVolume(v) {
    if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
  }

  function sfx(kind) {
    if (!ctx) return;
    const t = ctx.currentTime + 0.01;
    if (kind === "correct") {
      ["C5", "E5", "G5", "C6"].forEach((n, i) => tone(t + i * 0.07, freq(midi(n)), 0.12, pulse25, 0.25, sfxBus));
    } else if (kind === "wrong") {
      tone(t, freq(midi("G3")), 0.15, pulse25, 0.3, sfxBus);
      tone(t + 0.15, freq(midi("D#3")), 0.35, pulse25, 0.3, sfxBus);
    } else if (kind === "blip") {
      tone(t, freq(midi("A5")), 0.05, pulse12, 0.15, sfxBus);
    } else if (kind === "fanfare") {
      ["E5", "G5", "B5", "E6", "B5", "E6"].forEach((n, i) =>
        tone(t + i * 0.1, freq(midi(n)), i === 5 ? 0.6 : 0.1, pulse25, 0.25, sfxBus));
    }
  }

  return {
    init, play, stop, setVolume, sfx,
    get playing() { return playing; },
    get analyser() { return analyser; },
  };
})();
