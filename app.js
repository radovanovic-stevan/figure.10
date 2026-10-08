(() => {
  const $ = (id) => document.getElementById(id);
  const albumById = Object.fromEntries(ALBUMS.map((a) => [a.id, a]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // localStorage can throw (private mode, blocked storage) — never let that break the game
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  // Case-insensitive; also ignores spaces, punctuation and apostrophe styles,
  // so "dont stay", "Don't Stay" and "Don’t  Stay" all match.
  const normalize = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

  const isCorrect = (guess, song) => {
    const g = normalize(guess);
    return g !== "" && [song.title, ...(song.aliases || [])].some((t) => normalize(t) === g);
  };

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const pad = (n, len = 2) => String(n).padStart(len, "0");

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- sound ----------
  let soundOn = store.get("lp-sound", true);
  let volume = store.get("lp-volume", 0.6);
  $("volume").value = volume;

  function renderSoundBtn() {
    $("sound-btn").textContent = soundOn ? "♪ ON" : "♪ OFF";
    $("sound-btn").setAttribute("aria-pressed", String(soundOn));
  }
  renderSoundBtn();

  async function startAudio() {
    await Music.init();
    Music.setVolume(volume);
    if (soundOn) Music.play();
  }

  // Browsers only allow audio after a user gesture, so kick it off on the first one.
  const firstGesture = () => {
    startAudio();
    document.removeEventListener("pointerdown", firstGesture);
    document.removeEventListener("keydown", firstGesture);
  };
  document.addEventListener("pointerdown", firstGesture);
  document.addEventListener("keydown", firstGesture);

  $("sound-btn").addEventListener("click", async () => {
    soundOn = !soundOn;
    store.set("lp-sound", soundOn);
    renderSoundBtn();
    await Music.init();
    if (soundOn) Music.play(); else Music.stop();
  });

  $("volume").addEventListener("input", (e) => {
    volume = Number(e.target.value);
    store.set("lp-volume", volume);
    Music.setVolume(volume);
  });

  const sfx = (kind) => { if (soundOn) Music.sfx(kind); };

  // ---------- state ----------
  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;
  let count = 10;
  let typeTimer = null;

  // ---------- start screen ----------
  $("album-list").innerHTML = ALBUMS.map((a) => `
    <label class="album" style="--album:${a.color}">
      <input type="checkbox" value="${a.id}" checked>
      <span class="box" aria-hidden="true">[X]</span>
      <span class="name">${a.name}</span>
      <span class="year">${a.year}</span>
    </label>`).join("");

  $("album-list").addEventListener("change", (e) => {
    const box = e.target.closest(".album").querySelector(".box");
    box.textContent = e.target.checked ? "[X]" : "[ ]";
    sfx("blip");
  });

  $("count").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    count = Number(btn.dataset.n);
    for (const b of $("count").querySelectorAll("button")) b.setAttribute("aria-checked", String(b === btn));
    sfx("blip");
  });

  function renderBest() {
    const best = store.get("lp-best", null);
    $("best").hidden = !best;
    if (best) $("best").textContent = `HI-SCORE ${best.score}/${best.total}`;
  }
  renderBest();

  function show(section) {
    for (const id of ["start", "quiz", "results"]) $(id).hidden = id !== section;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  function start() {
    const albums = [...document.querySelectorAll("#album-list input:checked")].map((c) => c.value);
    const pool = SONGS.filter((s) => albums.includes(s.album));
    if (pool.length === 0) {
      $("start-error").textContent = "Pick at least one album.";
      $("start-error").hidden = false;
      sfx("wrong");
      return;
    }
    $("start-error").hidden = true;

    questions = shuffle(pool).slice(0, Math.min(count, pool.length)).map((song) => ({
      song,
      lyric: pick(song.lyrics),
      guess: "",
      correct: false,
    }));
    index = 0;
    score = 0;
    $("segments").innerHTML = questions.map(() => "<i></i>").join("");
    sfx("blip");
    show("quiz");
    renderQuestion();
  }

  // ---------- quiz ----------
  function typeLyric(text) {
    clearInterval(typeTimer);
    const el = $("lyric");
    const full = text.replaceAll(" / ", "\n");
    const render = (s, caret) =>
      escapeHtml(s).replaceAll("\n", "<br>") + (caret ? '<span class="caret">█</span>' : "");
    if (reduced) { el.innerHTML = render(full, false); return; }
    let i = 0;
    typeTimer = setInterval(() => {
      i += 2;
      if (i >= full.length) {
        clearInterval(typeTimer);
        el.innerHTML = render(full, false);
      } else {
        el.innerHTML = render(full.slice(0, i), true);
      }
    }, 22);
  }

  function renderSegments() {
    [...$("segments").children].forEach((seg, i) => {
      seg.className = i < index || (i === index && answered)
        ? (questions[i].correct ? "done-good" : "done-bad")
        : i === index ? "current" : "";
    });
  }

  function renderQuestion() {
    const q = questions[index];
    answered = false;
    $("quiz").style.setProperty("--album", albumById[q.song.album].color);
    $("q-number").textContent = `${pad(index + 1)}/${pad(questions.length)}`;
    $("q-score").textContent = pad(score, 4);
    renderSegments();
    typeLyric(q.lyric);
    $("answer").value = "";
    $("answer").disabled = false;
    $("submit-btn").disabled = false;
    $("hint-btn").disabled = false;
    $("hint").hidden = true;
    $("feedback").hidden = true;
    $("next-btn").hidden = true;
    $("answer").focus();
  }

  function submit(e) {
    e.preventDefault();
    if (answered) return next();
    const q = questions[index];
    const album = albumById[q.song.album];
    q.guess = $("answer").value.trim();
    q.correct = isCorrect(q.guess, q.song);
    if (q.correct) score++;
    answered = true;

    const fb = $("feedback");
    fb.className = "feedback " + (q.correct ? "good" : "bad shake");
    fb.innerHTML = q.correct
      ? `<span class="verdict-tag">+1 CORRECT!</span>${escapeHtml(q.song.title)} <span class="album-tag">· ${album.name}</span>`
      : `<span class="verdict-tag">${q.guess ? "✗ WRONG" : "✗ SKIPPED"}</span>It's <b>${escapeHtml(q.song.title)}</b> <span class="album-tag">· ${album.name}</span>`;
    fb.hidden = false;
    sfx(q.correct ? "correct" : "wrong");

    $("q-score").textContent = pad(score, 4);
    renderSegments();
    $("answer").disabled = true;
    $("submit-btn").disabled = true;
    $("hint-btn").disabled = true;
    $("next-btn").textContent = index + 1 < questions.length ? "NEXT >" : "RESULTS >";
    $("next-btn").hidden = false;
    $("next-btn").focus();
  }

  function next() {
    sfx("blip");
    index++;
    if (index < questions.length) renderQuestion();
    else showResults();
  }

  function showHint() {
    $("hint").textContent = `ALBUM: ${albumById[questions[index].song.album].name}`;
    $("hint").hidden = false;
    sfx("blip");
    $("answer").focus();
  }

  // ---------- results ----------
  function showResults() {
    clearInterval(typeTimer);
    const total = questions.length;
    const ratio = score / total;
    $("final-score").textContent = `${score}/${total}`;

    const [rank, verdict] =
      ratio === 1   ? ["★ RANK: HYBRID THEORIST ★", "Flawless. You were there at the turn."] :
      ratio >= 0.7  ? ["RANK: LP UNDERGROUND", "Solid. You definitely know the words."] :
      ratio >= 0.4  ? ["RANK: ROADIE", "Not bad — but in the end, it does matter."] :
                      ["RANK: NUMB", "Time to put the albums back on rotation."];
    $("rank").textContent = rank;
    $("verdict").textContent = verdict;

    const best = store.get("lp-best", null);
    if (!best || ratio > best.score / best.total) store.set("lp-best", { score, total });
    renderBest();

    $("review").innerHTML = questions.map((q) => {
      const album = albumById[q.song.album];
      return `
      <li style="--album:${album.color}">
        <div class="q">“${escapeHtml(q.lyric.replaceAll(" / ", " … "))}”</div>
        <div class="t">${escapeHtml(q.song.title)} <small>${album.name}</small></div>
        <div class="${q.correct ? "ok" : "no"}">
          ${q.correct ? "✓ correct" : `✗ ${q.guess ? "you said: " + escapeHtml(q.guess) : "skipped"}`}
        </div>
      </li>`;
    }).join("");
    show("results");
    sfx(ratio >= 0.7 ? "fanfare" : "wrong");
    $("again-btn").focus();
  }

  $("start-btn").addEventListener("click", start);
  $("answer-form").addEventListener("submit", submit);
  $("next-btn").addEventListener("click", next);
  $("hint-btn").addEventListener("click", showHint);
  $("again-btn").addEventListener("click", () => { sfx("blip"); show("start"); });
})();
