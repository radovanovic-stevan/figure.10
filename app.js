(() => {
  const $ = (id) => document.getElementById(id);
  const albumName = Object.fromEntries(ALBUMS.map((a) => [a.id, a.name]));

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

  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;

  // ---- Start screen ----
  $("album-list").innerHTML = ALBUMS.map((a) => `
    <label>
      <input type="checkbox" value="${a.id}" checked>
      <span>${a.name}</span>
      <span class="year">${a.year}</span>
    </label>`).join("");

  function show(section) {
    for (const id of ["start", "quiz", "results"]) $(id).hidden = id !== section;
  }

  function start() {
    const albums = [...document.querySelectorAll("#album-list input:checked")].map((c) => c.value);
    const pool = SONGS.filter((s) => albums.includes(s.album));
    if (pool.length === 0) {
      $("start-error").textContent = "Pick at least one album.";
      $("start-error").hidden = false;
      return;
    }
    $("start-error").hidden = true;

    const count = Math.min(Number($("count").value), pool.length);
    questions = shuffle(pool).slice(0, count).map((song) => ({
      song,
      lyric: pick(song.lyrics),
      guess: "",
      correct: false,
    }));
    index = 0;
    score = 0;
    show("quiz");
    renderQuestion();
  }

  // ---- Quiz ----
  function renderQuestion() {
    const q = questions[index];
    answered = false;
    $("q-number").textContent = `Question ${index + 1} / ${questions.length}`;
    $("q-score").textContent = `Score: ${score}`;
    $("bar-fill").style.width = `${(index / questions.length) * 100}%`;
    $("lyric").innerHTML = q.lyric.split(" / ").map(escapeHtml).join("<br>");
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
    q.guess = $("answer").value.trim();
    q.correct = isCorrect(q.guess, q.song);
    if (q.correct) score++;
    answered = true;

    const fb = $("feedback");
    fb.className = "feedback " + (q.correct ? "good" : "bad");
    fb.innerHTML = q.correct
      ? `Correct! <small>${escapeHtml(q.song.title)} — ${albumName[q.song.album]}</small>`
      : `${q.guess ? "Nope." : "Skipped."} It's <strong>${escapeHtml(q.song.title)}</strong>` +
        `<small>${albumName[q.song.album]}</small>`;
    fb.hidden = false;

    $("q-score").textContent = `Score: ${score}`;
    $("answer").disabled = true;
    $("submit-btn").disabled = true;
    $("hint-btn").disabled = true;
    $("next-btn").textContent = index + 1 < questions.length ? "Next" : "See results";
    $("next-btn").hidden = false;
    $("next-btn").focus();
  }

  function next() {
    index++;
    if (index < questions.length) renderQuestion();
    else showResults();
  }

  function showHint() {
    $("hint").textContent = `From the album: ${albumName[questions[index].song.album]}`;
    $("hint").hidden = false;
    $("answer").focus();
  }

  // ---- Results ----
  function showResults() {
    const total = questions.length;
    const ratio = score / total;
    $("final-score").textContent = `${score} / ${total}`;
    $("verdict").textContent =
      ratio === 1 ? "Flawless. You've been in the Linkin Park since Hybrid Theory." :
      ratio >= 0.7 ? "Solid. You definitely know the words." :
      ratio >= 0.4 ? "Not bad, but some of these are fading in the memory." :
      "Time to put the albums back on rotation.";
    $("review").innerHTML = questions.map((q) => `
      <li>
        <div class="q">“${escapeHtml(q.lyric.replaceAll(" / ", " … "))}”</div>
        <div>${escapeHtml(q.song.title)} <span class="year">(${albumName[q.song.album]})</span></div>
        <div class="${q.correct ? "ok" : "no"}">
          ${q.correct ? "✓ Correct" : `✗ ${q.guess ? "You said: " + escapeHtml(q.guess) : "Skipped"}`}
        </div>
      </li>`).join("");
    show("results");
    $("again-btn").focus();
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  $("start-btn").addEventListener("click", start);
  $("answer-form").addEventListener("submit", submit);
  $("next-btn").addEventListener("click", next);
  $("hint-btn").addEventListener("click", showHint);
  $("again-btn").addEventListener("click", () => show("start"));
})();
