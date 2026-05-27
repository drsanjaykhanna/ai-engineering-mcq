const app = {
  currentScreen: 'home',
  quizQuestions: [],
  quizIndex: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  answered: false,
  streak: 0,
  bestStreak: 0,

  init() {
    this.loadProgress();
    this.updateHomeStats();
    this.showScreen('home');
    this.bestStreak = parseInt(localStorage.getItem('aimcq_streak') || '0');
  },

  getProgress() {
    try { return JSON.parse(localStorage.getItem('aimcq_progress') || '{}'); }
    catch { return {}; }
  },

  saveProgress(progress) {
    localStorage.setItem('aimcq_progress', JSON.stringify(progress));
  },

  getFlagged() {
    try { return JSON.parse(localStorage.getItem('aimcq_flagged') || '[]'); }
    catch { return []; }
  },

  saveFlagged(flagged) {
    localStorage.setItem('aimcq_flagged', JSON.stringify(flagged));
  },

  loadProgress() {
    this.progress = this.getProgress();
    this.flagged = new Set(this.getFlagged());
  },

  updateHomeStats() {
    const total = QUESTIONS.length;
    const progress = this.getProgress();
    const attempted = Object.keys(progress).length;
    const correct = Object.values(progress).filter(p => p.lastCorrect).length;
    const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const mastered = Object.values(progress).filter(p => p.correctStreak >= 3).length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-done').textContent = attempted;
    document.getElementById('stat-pct').textContent = pct + '%';
    document.getElementById('stat-mastered').textContent = mastered;
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
    this.currentScreen = name;
    if (name === 'topics') this.renderTopics();
    if (name === 'modules') this.renderModules();
    if (name === 'learn') this.renderLearnList();
    if (name === 'stats') this.renderStats();
    if (name === 'home') this.updateHomeStats();
  },

  getTopics() {
    const topics = {};
    QUESTIONS.forEach(q => {
      if (!topics[q.topic]) topics[q.topic] = [];
      topics[q.topic].push(q);
    });
    return topics;
  },

  getKnowledgePages() {
    const pages = {};
    KNOWLEDGE_PAGES.forEach(p => { pages[p.id] = p; });
    return pages;
  },

  renderTopics() {
    const topics = this.getTopics();
    const progress = this.getProgress();
    const list = document.getElementById('topic-list');
    list.innerHTML = '';

    Object.entries(topics).sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, qs]) => {
      const attempted = qs.filter(q => progress[q.id]).length;
      const correct = qs.filter(q => progress[q.id]?.lastCorrect).length;
      const mastered = qs.filter(q => progress[q.id]?.correctStreak >= 3).length;
      const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const progressPct = Math.round((attempted / qs.length) * 100);

      const card = document.createElement('div');
      card.className = 'topic-card';
      card.onclick = () => this.startTopic(name);
      card.innerHTML = `
        <div class="topic-info">
          <div class="topic-name">${name}</div>
          <div class="topic-meta">${attempted}/${qs.length} done · ${mastered} mastered${attempted > 0 ? ' · ' + pct + '%' : ''}</div>
          <div class="topic-progress"><div class="topic-progress-fill" style="width:${progressPct}%"></div></div>
        </div>
        <div class="topic-count">${qs.length}</div>
      `;
      list.appendChild(card);
    });
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  startQuickMix() {
    const progress = this.getProgress();
    const wrong = QUESTIONS.filter(q => progress[q.id] && !progress[q.id].lastCorrect);
    const unanswered = QUESTIONS.filter(q => !progress[q.id]);
    const pool = [...wrong, ...wrong, ...unanswered];
    const qs = pool.length >= 20 ? this.shuffle(pool).slice(0, 20) : this.shuffle(QUESTIONS).slice(0, 20);
    this.startQuiz(qs);
  },

  startTopic(name) {
    const progress = this.getProgress();
    const qs = QUESTIONS.filter(q => q.topic === name);
    const wrong = qs.filter(q => progress[q.id] && !progress[q.id].lastCorrect);
    const unanswered = qs.filter(q => !progress[q.id]);
    const rest = qs.filter(q => progress[q.id]?.lastCorrect);
    this.startQuiz([...this.shuffle(wrong), ...this.shuffle(unanswered), ...this.shuffle(rest)]);
  },

  startWeakest() {
    const progress = this.getProgress();
    const weak = QUESTIONS.filter(q => progress[q.id] && !progress[q.id].lastCorrect);
    const unanswered = QUESTIONS.filter(q => !progress[q.id]);
    const pool = [...weak, ...weak, ...unanswered];
    if (pool.length === 0) { alert('No weak areas — great job!'); return; }
    this.startQuiz(this.shuffle(pool).slice(0, 20));
  },

  startFlagged() {
    const flagged = this.getFlagged();
    if (flagged.length === 0) { alert('No flagged questions yet.'); return; }
    this.startQuiz(this.shuffle(QUESTIONS.filter(q => flagged.includes(q.id))));
  },

  startQuiz(questions) {
    this.quizQuestions = questions;
    this.quizIndex = 0;
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
    this.streak = 0;
    this.showScreen('quiz');
    this.renderQuestion();
  },

  renderQuestion() {
    const q = this.quizQuestions[this.quizIndex];
    if (!q) return;
    this.answered = false;

    document.getElementById('quiz-counter').textContent = `${this.quizIndex + 1}/${this.quizQuestions.length}`;
    document.getElementById('quiz-progress-fill').style.width = `${((this.quizIndex) / this.quizQuestions.length) * 100}%`;
    document.getElementById('quiz-topic').textContent = q.topic;
    document.getElementById('quiz-question').textContent = q.question;
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('streak-display').textContent = this.streak > 1 ? `${this.streak} streak` : '';

    const flagBtn = document.getElementById('flag-btn');
    flagBtn.classList.toggle('flagged', this.flagged.has(q.id));

    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span class="option-text">${opt}</span>`;
      btn.onclick = () => this.selectAnswer(i);
      optionsEl.appendChild(btn);
    });
  },

  selectAnswer(idx) {
    if (this.answered) return;
    this.answered = true;

    const q = this.quizQuestions[this.quizIndex];
    const isCorrect = idx === q.correct;
    this.sessionTotal++;

    if (isCorrect) {
      this.sessionCorrect++;
      this.streak++;
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
        localStorage.setItem('aimcq_streak', this.bestStreak.toString());
      }
    } else {
      this.streak = 0;
    }
    document.getElementById('streak-display').textContent = this.streak > 1 ? `${this.streak} streak` : '';

    const progress = this.getProgress();
    if (!progress[q.id]) progress[q.id] = { correct: 0, wrong: 0, attempts: 0, lastCorrect: false, correctStreak: 0 };
    progress[q.id].attempts++;
    if (isCorrect) {
      progress[q.id].correct++;
      progress[q.id].lastCorrect = true;
      progress[q.id].correctStreak = (progress[q.id].correctStreak || 0) + 1;
    } else {
      progress[q.id].wrong++;
      progress[q.id].lastCorrect = false;
      progress[q.id].correctStreak = 0;
    }
    this.saveProgress(progress);

    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, i) => {
      btn.classList.add('disabled');
      if (i === q.correct) btn.classList.add('correct');
      else if (i === idx && !isCorrect) btn.classList.add('incorrect');
      else btn.classList.add('revealed');
    });

    this.showKnowledgePage(q, isCorrect);
    document.getElementById('next-btn').classList.remove('hidden');
  },

  showKnowledgePage(q, isCorrect) {
    const el = document.getElementById('quiz-explanation');
    const page = KNOWLEDGE_PAGES.find(p => p.id === q.pageId);
    const letters = ['A', 'B', 'C', 'D', 'E'];

    let html = '';

    html += `<div class="result-banner ${isCorrect ? 'result-correct' : 'result-incorrect'}">
      ${isCorrect ? 'Correct!' : 'Incorrect'} — The answer is ${letters[q.correct]}
    </div>`;

    if (page) {
      html += `<div class="knowledge-page">`;
      html += `<h3 class="kp-title">${page.title}</h3>`;
      html += `<div class="kp-body">${page.content}</div>`;

      if (page.keyPoints && page.keyPoints.length > 0) {
        html += `<div class="kp-remember"><strong>Remember:</strong><ul>`;
        page.keyPoints.forEach(p => { html += `<li>${p}</li>`; });
        html += `</ul></div>`;
      }

      if (page.comparison) {
        html += `<div class="kp-comparison"><strong>${page.comparison.title}</strong>`;
        html += `<table class="kp-table"><thead><tr>`;
        page.comparison.headers.forEach(h => { html += `<th>${h}</th>`; });
        html += `</tr></thead><tbody>`;
        page.comparison.rows.forEach(row => {
          html += `<tr>`;
          row.forEach(cell => { html += `<td>${cell}</td>`; });
          html += `</tr>`;
        });
        html += `</tbody></table></div>`;
      }

      html += `</div>`;
    }

    html += `<div class="option-explanations">`;
    q.options.forEach((opt, i) => {
      const isRight = i === q.correct;
      html += `<div class="exp-option ${isRight ? 'exp-correct' : 'exp-wrong'}">
        <strong>${letters[i]}. ${opt}</strong>
        <p>${q.explanation[i]}</p>
      </div>`;
    });
    html += `</div>`;

    el.innerHTML = html;
    el.classList.remove('hidden');

    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  },

  nextQuestion() {
    this.quizIndex++;
    if (this.quizIndex >= this.quizQuestions.length) {
      this.showResults();
      return;
    }
    this.renderQuestion();
    document.querySelector('.quiz-body').scrollTop = 0;
    window.scrollTo(0, 0);
  },

  showResults() {
    const pct = Math.round((this.sessionCorrect / this.sessionTotal) * 100);
    document.getElementById('results-pct').textContent = pct + '%';
    document.getElementById('results-pct').style.color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)';

    let html = `<div class="stats-row"><span class="stats-row-label">Correct</span><span class="stats-row-value">${this.sessionCorrect}/${this.sessionTotal}</span></div>`;
    html += `<div class="stats-row"><span class="stats-row-label">Best Streak</span><span class="stats-row-value">${this.bestStreak}</span></div>`;

    const topicScores = {};
    this.quizQuestions.forEach((q, i) => {
      if (!topicScores[q.topic]) topicScores[q.topic] = { c: 0, t: 0 };
      topicScores[q.topic].t++;
    });
    const progress = this.getProgress();
    this.quizQuestions.forEach(q => {
      if (progress[q.id]?.lastCorrect) topicScores[q.topic].c++;
    });

    Object.entries(topicScores).forEach(([name, d]) => {
      const p = Math.round((d.c / d.t) * 100);
      html += `<div class="stats-row"><span class="stats-row-label">${name}</span><span class="stats-row-value" style="color:${p >= 80 ? 'var(--green)' : p >= 50 ? 'var(--orange)' : 'var(--red)'}">${p}%</span></div>`;
    });

    document.getElementById('results-breakdown').innerHTML = html;
    this.showScreen('results');
  },

  toggleFlag() {
    const q = this.quizQuestions[this.quizIndex];
    if (!q) return;
    if (this.flagged.has(q.id)) this.flagged.delete(q.id);
    else this.flagged.add(q.id);
    this.saveFlagged([...this.flagged]);
    document.getElementById('flag-btn').classList.toggle('flagged', this.flagged.has(q.id));
  },

  renderStats() {
    const progress = this.getProgress();
    const body = document.getElementById('stats-body');
    const topics = this.getTopics();

    const totalAttempted = Object.keys(progress).length;
    const totalCorrect = Object.values(progress).filter(p => p.lastCorrect).length;
    const totalMastered = Object.values(progress).filter(p => p.correctStreak >= 3).length;
    const totalAttempts = Object.values(progress).reduce((s, p) => s + p.attempts, 0);

    let html = `<div class="stats-section">
      <h3>Overall</h3>
      <div class="stats-row"><span class="stats-row-label">Total Questions</span><span class="stats-row-value">${QUESTIONS.length}</span></div>
      <div class="stats-row"><span class="stats-row-label">Attempted</span><span class="stats-row-value">${totalAttempted}</span></div>
      <div class="stats-row"><span class="stats-row-label">Currently Correct</span><span class="stats-row-value">${totalCorrect}</span></div>
      <div class="stats-row"><span class="stats-row-label">Mastered (3+ in a row)</span><span class="stats-row-value">${totalMastered}</span></div>
      <div class="stats-row"><span class="stats-row-label">Total Attempts</span><span class="stats-row-value">${totalAttempts}</span></div>
      <div class="stats-row"><span class="stats-row-label">Best Streak</span><span class="stats-row-value">${this.bestStreak}</span></div>
      <div class="stats-row"><span class="stats-row-label">Flagged</span><span class="stats-row-value">${this.flagged.size}</span></div>
    </div>`;

    html += '<div class="stats-section"><h3>By Topic</h3>';
    Object.entries(topics).sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, qs]) => {
      const attempted = qs.filter(q => progress[q.id]).length;
      const correct = qs.filter(q => progress[q.id]?.lastCorrect).length;
      const mastered = qs.filter(q => progress[q.id]?.correctStreak >= 3).length;
      const pct = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : pct > 0 ? 'var(--red)' : 'var(--bg3)';

      html += `<div class="stats-topic-bar">
        <span class="stats-topic-name">${name}<br><small style="color:var(--text2)">${mastered}/${qs.length} mastered</small></span>
        <div class="stats-mini-bar"><div class="stats-mini-fill" style="width:${pct}%;background:${color}"></div></div>
        <span class="stats-topic-pct" style="color:${color}">${attempted > 0 ? pct + '%' : '—'}</span>
      </div>`;
    });
    html += '</div>';
    body.innerHTML = html;
  },

  resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
      localStorage.removeItem('aimcq_progress');
      localStorage.removeItem('aimcq_flagged');
      localStorage.removeItem('aimcq_streak');
      this.progress = {};
      this.flagged = new Set();
      this.bestStreak = 0;
      this.updateHomeStats();
    }
  },

  endQuiz() {
    if (this.sessionTotal > 0 && !confirm('End this session?')) return;
    this.showScreen('home');
  },

  renderModules() {
    const list = document.getElementById('module-list');
    list.innerHTML = '';
    LEARNING_MODULES.forEach((mod, i) => {
      const card = document.createElement('div');
      card.className = 'module-card';
      card.onclick = () => this.openModule(i);
      const levelClass = mod.level === 'beginner' ? 'module-badge-beginner' : mod.level === 'advanced' ? 'module-badge-advanced' : 'module-badge-intermediate';
      card.innerHTML = `
        <div class="module-card-title">${mod.title}</div>
        <div class="module-card-desc">${mod.description}</div>
        <div class="module-card-meta">
          <span class="module-badge ${levelClass}">${mod.level}</span>
          <span>${mod.readTime} read</span>
        </div>
      `;
      list.appendChild(card);
    });
  },

  currentModuleIdx: null,

  openModule(idx) {
    const mod = LEARNING_MODULES[idx];
    if (!mod) return;
    this.currentModuleIdx = idx;
    document.getElementById('module-read-title').textContent = mod.title;
    document.getElementById('module-read-body').innerHTML = mod.content;
    const linkedTopics = mod.linkedTopics || [];
    const linkedQs = QUESTIONS.filter(q => linkedTopics.includes(q.topic));
    document.getElementById('module-quiz-btn').style.display = linkedQs.length > 0 ? 'block' : 'none';
    this.showScreen('module-read');
  },

  startModuleQuiz() {
    if (this.currentModuleIdx === null) return;
    const mod = LEARNING_MODULES[this.currentModuleIdx];
    const linkedTopics = mod.linkedTopics || [];
    const qs = QUESTIONS.filter(q => linkedTopics.includes(q.topic));
    if (qs.length === 0) return;
    this.startQuiz(this.shuffle(qs).slice(0, 20));
  },

  renderLearnList() {
    const list = document.getElementById('learn-list');
    list.innerHTML = '';
    const grouped = {};
    KNOWLEDGE_PAGES.forEach(page => {
      const relatedQs = QUESTIONS.filter(q => q.pageId === page.id);
      const topic = relatedQs.length > 0 ? relatedQs[0].topic : 'General';
      if (!grouped[topic]) grouped[topic] = [];
      grouped[topic].push(page);
    });

    Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])).forEach(([topic, pages]) => {
      const header = document.createElement('div');
      header.className = 'learn-topic-header';
      header.textContent = topic;
      list.appendChild(header);

      pages.forEach(page => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.onclick = () => this.openPage(page.id);
        const qCount = QUESTIONS.filter(q => q.pageId === page.id).length;
        card.innerHTML = `
          <div class="topic-info">
            <div class="topic-name">${page.title}</div>
            <div class="topic-meta">${qCount} linked question${qCount !== 1 ? 's' : ''}</div>
          </div>
        `;
        list.appendChild(card);
      });
    });
  },

  currentPageId: null,

  openPage(pageId) {
    const page = KNOWLEDGE_PAGES.find(p => p.id === pageId);
    if (!page) return;
    this.currentPageId = pageId;

    document.getElementById('read-title').textContent = page.title;
    let html = `<div class="knowledge-page">`;
    html += `<div class="kp-body">${page.content}</div>`;
    if (page.keyPoints && page.keyPoints.length > 0) {
      html += `<div class="kp-remember"><strong>Remember:</strong><ul>`;
      page.keyPoints.forEach(p => { html += `<li>${p}</li>`; });
      html += `</ul></div>`;
    }
    if (page.comparison) {
      html += `<div class="kp-comparison"><strong>${page.comparison.title}</strong>`;
      html += `<table class="kp-table"><thead><tr>`;
      page.comparison.headers.forEach(h => { html += `<th>${h}</th>`; });
      html += `</tr></thead><tbody>`;
      page.comparison.rows.forEach(row => {
        html += `<tr>`;
        row.forEach(cell => { html += `<td>${cell}</td>`; });
        html += `</tr>`;
      });
      html += `</tbody></table></div>`;
    }
    html += `</div>`;

    document.getElementById('read-body').innerHTML = html;

    const linkedQs = QUESTIONS.filter(q => q.pageId === pageId);
    document.getElementById('read-quiz-btn').style.display = linkedQs.length > 0 ? 'block' : 'none';

    this.showScreen('read');
  },

  startPageQuiz() {
    if (!this.currentPageId) return;
    const qs = QUESTIONS.filter(q => q.pageId === this.currentPageId);
    if (qs.length === 0) return;
    this.startQuiz(this.shuffle(qs));
  }
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'activated') {
          window.location.reload();
        }
      });
    });
    reg.update();
  }).catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => app.init());
