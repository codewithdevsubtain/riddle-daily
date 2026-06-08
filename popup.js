/**
 * RiddleDaily — Popup UI controller
 */
import {
  loadUserState,
  saveUserState,
  getAllRiddles,
  getDailyRiddle,
  getRandomRiddle,
  getTodayString,
  recordAttempt,
  toggleFavorite,
  filterRiddles,
  checkAnswer,
  applyTheme,
  formatRiddleForShare,
  getAccuracy,
  difficultyClass,
  categoryIcon,
  playSound,
  launchConfetti,
  showToast,
  randomFrom,
  CORRECT_MESSAGES,
  WRONG_MESSAGES
} from './shared.js';
import { RIDDLE_CATEGORIES } from './riddles.js';

// ─── State ───────────────────────────────────────────────────────────────────
let state = null;
let riddles = [];
let currentRiddle = null;
let hintsShown = 0;
let answerRevealed = false;
let categoryChart = null;
let isDailyView = true;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
  loading: $('#loading-state'),
  main: $('#main-content'),
  streakDisplay: $('#streak-display'),
  streakCount: $('#streak-count'),
  themeToggle: $('#theme-toggle'),
  themeIcon: $('#theme-icon'),
  settingsBtn: $('#settings-btn'),
  todayDate: $('#today-date'),
  todayBadges: $('#today-badges'),
  todayRiddleText: $('#today-riddle-text'),
  hintsContainer: $('#hints-container'),
  hintBtn: $('#hint-btn'),
  revealBtn: $('#reveal-btn'),
  answerReveal: $('#answer-reveal'),
  answerBox: $('#answer-box'),
  answerText: $('#answer-text'),
  guessInput: $('#guess-input'),
  submitBtn: $('#submit-btn'),
  feedback: $('#feedback'),
  shareBtn: $('#share-btn'),
  favBtn: $('#fav-btn'),
  randomBtn: $('#random-btn'),
  searchInput: $('#search-input'),
  filterCategory: $('#filter-category'),
  filterDifficulty: $('#filter-difficulty'),
  filterFavorites: $('#filter-favorites'),
  libraryList: $('#library-list'),
  libRandomBtn: $('#lib-random-btn'),
  statSolved: $('#stat-solved'),
  statAccuracy: $('#stat-accuracy'),
  statStreak: $('#stat-streak'),
  categoryChartContainer: $('#category-chart-container'),
  categoryBars: $('#category-bars'),
  onboarding: $('#onboarding'),
  onboardingStart: $('#onboarding-start'),
  confetti: $('#confetti-container')
};

// ─── Init ────────────────────────────────────────────────────────────────────
async function init() {
  try {
    state = await loadUserState();
    riddles = await getAllRiddles();
    applyTheme(state.settings.theme);

    populateCategoryFilter();
    setupEventListeners();
    await checkPendingRiddle();

    if (!state.onboardingComplete) {
      els.onboarding.classList.remove('hidden');
    }

    await loadTodayRiddle();
    renderLibrary();
    updateStreakDisplay();
    updateStats();

    els.loading.classList.add('hidden');
    els.main.classList.remove('hidden');
    lucide.createIcons();
  } catch (err) {
    console.error('Init error:', err);
    els.loading.innerHTML = `<p class="text-red-500 text-sm px-4">Failed to load. Please reload the extension.</p>`;
  }
}

async function checkPendingRiddle() {
  const data = await chrome.storage.local.get('pendingRiddle');
  if (data.pendingRiddle?.id) {
    const riddle = riddles.find((r) => r.id === data.pendingRiddle.id);
    if (riddle) {
      isDailyView = false;
      currentRiddle = riddle;
    }
    await chrome.storage.local.remove('pendingRiddle');
  }
}

function populateCategoryFilter() {
  RIDDLE_CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    els.filterCategory.appendChild(opt);
  });
}

// ─── Riddle display ──────────────────────────────────────────────────────────
async function loadTodayRiddle() {
  if (!currentRiddle || isDailyView) {
    currentRiddle = await getDailyRiddle();
    isDailyView = true;
  }
  renderCurrentRiddle();
}

function renderCurrentRiddle() {
  if (!currentRiddle) return;

  resetSolverState();

  const today = getTodayString();
  els.todayDate.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });

  els.todayBadges.innerHTML = `
    <span class="badge ${difficultyClass(currentRiddle.difficulty)}">${currentRiddle.difficulty}</span>
    <span class="badge badge-category">
      <i data-lucide="${categoryIcon(currentRiddle.category)}" class="w-3 h-3"></i>
      ${currentRiddle.category}
    </span>
    ${isDailyView ? '<span class="badge" style="background:rgba(59,130,246,0.15);color:#3b82f6">Daily</span>' : ''}
    ${state.solvedRiddles[String(currentRiddle.id)]?.correct ? '<span class="badge" style="background:rgba(16,185,129,0.15);color:#10b981">✓ Solved</span>' : ''}
  `;

  els.todayRiddleText.textContent = currentRiddle.text;
  els.answerText.textContent = currentRiddle.answer;

  const isFav = state.favorites.includes(currentRiddle.id);
  els.favBtn.classList.toggle('active', isFav);

  lucide.createIcons();
}

function resetSolverState() {
  hintsShown = 0;
  answerRevealed = false;
  els.hintsContainer.innerHTML = '';
  els.hintsContainer.classList.add('hidden');
  els.answerReveal.classList.remove('revealed');
  els.answerBox.classList.add('spoiler-blur');
  els.guessInput.value = '';
  els.feedback.classList.add('hidden');
  els.hintBtn.disabled = false;
  els.hintBtn.innerHTML = '<i data-lucide="lightbulb" class="icon-sm"></i> Show Hint';
}

// ─── Solver actions ──────────────────────────────────────────────────────────
function showHint() {
  if (!currentRiddle?.hints?.length) {
    showToast('No hints available for this riddle', 'info');
    return;
  }
  if (hintsShown >= currentRiddle.hints.length) {
    showToast('No more hints!', 'info');
    return;
  }

  playSound('click', state.settings.soundEnabled);
  els.hintsContainer.classList.remove('hidden');
  const hint = document.createElement('div');
  hint.className = 'hint-item';
  hint.innerHTML = `<strong>Hint ${hintsShown + 1}:</strong> ${currentRiddle.hints[hintsShown]}`;
  els.hintsContainer.appendChild(hint);
  hintsShown++;

  if (hintsShown >= currentRiddle.hints.length) {
    els.hintBtn.disabled = true;
    els.hintBtn.textContent = 'No more hints';
  }
  lucide.createIcons();
}

function revealAnswer() {
  playSound('click', state.settings.soundEnabled);
  answerRevealed = true;
  els.answerReveal.classList.add('revealed');
  els.answerBox.classList.add('spoiler-blur');

  els.answerBox.onclick = () => {
    els.answerBox.classList.remove('spoiler-blur');
    els.answerBox.onclick = null;
    const p = els.answerBox.querySelector('p:last-child');
    if (p) p.remove();
  };
}

async function submitGuess() {
  const guess = els.guessInput.value.trim();
  if (!guess) {
    showToast('Type your answer first!', 'info');
    return;
  }

  playSound('click', state.settings.soundEnabled);
  const correct = checkAnswer(guess, currentRiddle.answer);

  els.feedback.classList.remove('hidden');
  if (correct) {
    els.feedback.className = 'feedback-correct text-sm font-semibold';
    els.feedback.textContent = randomFrom(CORRECT_MESSAGES);
    playSound('success', state.settings.soundEnabled);
    launchConfetti(els.confetti);

    state = await recordAttempt(currentRiddle.id, true, isDailyView);
    updateStreakDisplay();
    renderCurrentRiddle();

    if (isDailyView) {
      setTimeout(() => showToast('New riddle tomorrow! 🌅', 'info', 4000), 1500);
    }
  } else {
    els.feedback.className = 'feedback-wrong text-sm font-semibold';
    els.feedback.textContent = randomFrom(WRONG_MESSAGES);
    playSound('wrong', state.settings.soundEnabled);
    await recordAttempt(currentRiddle.id, false, false);
  }
}

async function handleFavorite() {
  playSound('click', state.settings.soundEnabled);
  state.favorites = await toggleFavorite(currentRiddle.id);
  const isFav = state.favorites.includes(currentRiddle.id);
  els.favBtn.classList.toggle('active', isFav);
  showToast(isFav ? 'Added to favorites ⭐' : 'Removed from favorites', 'info');
  renderLibrary();
}

async function handleShare() {
  playSound('click', state.settings.soundEnabled);
  const text = formatRiddleForShare(currentRiddle);
  try {
    await navigator.clipboard.writeText(text);
    showToast('Riddle copied to clipboard! 📋', 'success');
  } catch {
    showToast('Could not copy — try again', 'error');
  }
}

async function handleRandom() {
  playSound('click', state.settings.soundEnabled);
  const riddle = await getRandomRiddle(currentRiddle?.id);
  if (riddle) {
    currentRiddle = riddle;
    isDailyView = false;
    renderCurrentRiddle();
    switchTab('today');
    showToast('Here\'s a random riddle! 🎲', 'info');
  }
}

// ─── Library ─────────────────────────────────────────────────────────────────
function renderLibrary() {
  const filtered = filterRiddles(riddles, {
    search: els.searchInput.value,
    category: els.filterCategory.value,
    difficulty: els.filterDifficulty.value,
    favoritesOnly: els.filterFavorites.checked,
    favoriteIds: state.favorites
  });

  if (!filtered.length) {
    els.libraryList.innerHTML = `
      <div class="empty-state">
        <div class="text-4xl mb-2">🔍</div>
        <p class="text-sm font-semibold text-theme-secondary">No riddles found</p>
        <p class="text-xs text-theme-muted mt-1">Try adjusting your filters</p>
      </div>`;
    return;
  }

  els.libraryList.innerHTML = filtered.map((r) => {
    const solved = state.solvedRiddles[String(r.id)]?.correct;
    const fav = state.favorites.includes(r.id);
    return `
      <div class="riddle-list-item" data-id="${r.id}">
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm font-medium line-clamp-2 flex-1">${r.text}</p>
          <div class="flex gap-1 shrink-0">
            ${fav ? '<i data-lucide="star" class="icon-sm text-amber-400" style="fill:#f59e0b"></i>' : ''}
            ${solved ? '<span class="text-emerald-500 text-xs">✓</span>' : ''}
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <span class="badge ${difficultyClass(r.difficulty)}">${r.difficulty}</span>
          <span class="badge badge-category text-xxs">${r.category}</span>
        </div>
      </div>`;
  }).join('');

  els.libraryList.querySelectorAll('.riddle-list-item').forEach((item) => {
    item.addEventListener('click', () => {
      const id = Number(item.dataset.id);
      currentRiddle = riddles.find((r) => r.id === id);
      isDailyView = false;
      renderCurrentRiddle();
      switchTab('today');
    });
  });

  lucide.createIcons();
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function updateStats() {
  const { stats, streak } = state;
  els.statSolved.textContent = stats.totalSolved;
  els.statAccuracy.textContent = `${getAccuracy(stats)}%`;
  els.statStreak.textContent = streak.current;

  renderCategoryChart();
  renderCategoryBars();
}

function renderCategoryChart() {
  const container = els.categoryChartContainer;
  if (!container) return;

  const progress = state.stats.categoryProgress || {};
  const labels = Object.keys(progress);
  const values = Object.values(progress);
  const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6366f1'];

  if (categoryChart) {
    categoryChart.destroy();
    categoryChart = null;
  }

  if (!labels.length) {
    container.innerHTML = `
      <div class="empty-state py-8">
        <div class="text-3xl mb-2">📊</div>
        <p class="text-xs text-theme-muted">Solve riddles to see your progress!</p>
      </div>`;
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'category-chart';
  container.innerHTML = '';
  container.appendChild(canvas);

  categoryChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 10 } }
        }
      }
    }
  });
}

function renderCategoryBars() {
  const progress = state.stats.categoryProgress || {};
  const entries = Object.entries(progress).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map((e) => e[1]), 1);

  if (!entries.length) {
    els.categoryBars.innerHTML = `<p class="text-xs text-theme-muted text-center py-4">No category data yet</p>`;
    return;
  }

  els.categoryBars.innerHTML = entries.map(([cat, count]) => `
    <div>
      <div class="flex justify-between text-xs mb-1">
        <span class="font-medium">${cat}</span>
        <span class="text-theme-muted">${count}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(count / max) * 100}%"></div>
      </div>
    </div>
  `).join('');
}

function updateStreakDisplay() {
  const streak = state.streak?.current || 0;
  if (streak > 0) {
    els.streakDisplay.classList.remove('hidden');
    els.streakCount.textContent = streak;
  } else {
    els.streakDisplay.classList.add('hidden');
  }
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function switchTab(tab) {
  $$('.nav-tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
  $$('.view-panel').forEach((p) => p.classList.toggle('active', p.id === `view-${tab}`));

  if (tab === 'stats') updateStats();
  if (tab === 'library') renderLibrary();
  lucide.createIcons();
}

// ─── Theme ───────────────────────────────────────────────────────────────────
async function toggleTheme() {
  const themes = ['system', 'light', 'dark'];
  const idx = themes.indexOf(state.settings.theme);
  state.settings.theme = themes[(idx + 1) % themes.length];
  const resolved = applyTheme(state.settings.theme);
  els.themeIcon.setAttribute('data-lucide', resolved === 'dark' ? 'moon' : 'sun');
  await saveUserState({ settings: state.settings });
  lucide.createIcons();
  playSound('click', state.settings.soundEnabled);
}

// ─── Event listeners ─────────────────────────────────────────────────────────
function setupEventListeners() {
  $$('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  els.hintBtn.addEventListener('click', showHint);
  els.revealBtn.addEventListener('click', revealAnswer);
  els.submitBtn.addEventListener('click', submitGuess);
  els.guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitGuess();
  });
  els.shareBtn.addEventListener('click', handleShare);
  els.favBtn.addEventListener('click', handleFavorite);
  els.randomBtn.addEventListener('click', handleRandom);
  els.libRandomBtn.addEventListener('click', handleRandom);

  els.searchInput.addEventListener('input', renderLibrary);
  els.filterCategory.addEventListener('change', renderLibrary);
  els.filterDifficulty.addEventListener('change', renderLibrary);
  els.filterFavorites.addEventListener('change', renderLibrary);

  els.themeToggle.addEventListener('click', toggleTheme);
  els.settingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());

  els.onboardingStart.addEventListener('click', async () => {
    state.onboardingComplete = true;
    await saveUserState({ onboardingComplete: true });
    els.onboarding.classList.add('hidden');
    playSound('success', state.settings.soundEnabled);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (state.settings.theme === 'system') applyTheme('system');
  });
}

document.addEventListener('DOMContentLoaded', init);
