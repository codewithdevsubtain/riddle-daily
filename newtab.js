/**
 * RiddleDaily — New Tab page controller
 */
import {
  loadUserState,
  saveUserState,
  getDailyRiddle,
  getRandomRiddle,
  recordAttempt,
  checkAnswer,
  applyTheme,
  difficultyClass,
  categoryIcon,
  playSound,
  launchConfetti,
  showToast,
  randomFrom,
  CORRECT_MESSAGES,
  WRONG_MESSAGES,
  hashDate,
  getTodayString
} from './shared.js';
import { MOTIVATIONAL_QUOTES, FUN_FACTS } from './riddles.js';

let state = null;
let currentRiddle = null;
let hintsShown = 0;
let isDaily = true;

const $ = (sel) => document.querySelector(sel);
const els = {
  loading: $('#loading'),
  main: $('#main'),
  greeting: $('#greeting'),
  badges: $('#badges'),
  riddleText: $('#riddle-text'),
  hintsArea: $('#hints-area'),
  hintBtn: $('#hint-btn'),
  revealBtn: $('#reveal-btn'),
  randomBtn: $('#random-btn'),
  answerArea: $('#answer-area'),
  answerBox: $('#answer-box'),
  answerText: $('#answer-text'),
  guessInput: $('#guess-input'),
  submitBtn: $('#submit-btn'),
  feedback: $('#feedback'),
  quoteText: $('#quote-text'),
  quoteAuthor: $('#quote-author'),
  funFact: $('#fun-fact'),
  streakInfo: $('#streak-info'),
  openExtension: $('#open-extension'),
  themeToggle: $('#theme-toggle'),
  themeIcon: $('#theme-icon'),
  confetti: $('#confetti-container')
};

async function init() {
  state = await loadUserState();
  applyTheme(state.settings.theme);

  setGreeting();
  setQuoteAndFact();
  updateStreak();

  currentRiddle = await getDailyRiddle();
  isDaily = true;
  renderRiddle();

  els.loading.classList.add('hidden');
  els.main.classList.remove('hidden');
  lucide.createIcons();

  setupListeners();
}

function setGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  els.greeting.textContent = `${greeting}! Ready for a brain workout?`;
}

function setQuoteAndFact() {
  const day = getTodayString();
  const quote = MOTIVATIONAL_QUOTES[hashDate(day) % MOTIVATIONAL_QUOTES.length];
  const fact = FUN_FACTS[hashDate(day + 'fact') % FUN_FACTS.length];
  els.quoteText.textContent = `"${quote.text}"`;
  els.quoteAuthor.textContent = `— ${quote.author}`;
  els.funFact.textContent = fact;
}

function updateStreak() {
  const streak = state.streak?.current || 0;
  if (streak > 0) {
    els.streakInfo.classList.remove('hidden');
    els.streakInfo.innerHTML = `<i data-lucide="flame" class="w-3 h-3"></i> ${streak} day streak`;
    lucide.createIcons();
  }
}

function renderRiddle() {
  if (!currentRiddle) return;
  hintsShown = 0;
  els.hintsArea.innerHTML = '';
  els.hintsArea.classList.add('hidden');
  els.answerArea.classList.remove('revealed');
  els.answerBox.classList.add('spoiler-blur');
  els.guessInput.value = '';
  els.feedback.classList.add('hidden');

  els.badges.innerHTML = `
    <span class="badge ${difficultyClass(currentRiddle.difficulty)}">${currentRiddle.difficulty}</span>
    <span class="badge badge-category">${currentRiddle.category}</span>
  `;
  els.riddleText.textContent = currentRiddle.text;
  els.answerText.textContent = currentRiddle.answer;
  lucide.createIcons();
}

function showHint() {
  if (!currentRiddle?.hints?.length || hintsShown >= currentRiddle.hints.length) {
    showToast('No more hints!', 'info');
    return;
  }
  playSound('click', state.settings.soundEnabled);
  els.hintsArea.classList.remove('hidden');
  const div = document.createElement('div');
  div.className = 'hint-item';
  div.innerHTML = `<strong>Hint ${hintsShown + 1}:</strong> ${currentRiddle.hints[hintsShown]}`;
  els.hintsArea.appendChild(div);
  hintsShown++;
}

function revealAnswer() {
  playSound('click', state.settings.soundEnabled);
  els.answerArea.classList.add('revealed');
  els.answerBox.onclick = () => {
    els.answerBox.classList.remove('spoiler-blur');
    els.answerBox.onclick = null;
  };
}

async function submitGuess() {
  const guess = els.guessInput.value.trim();
  if (!guess) return;

  const correct = checkAnswer(guess, currentRiddle.answer);
  els.feedback.classList.remove('hidden');

  if (correct) {
    els.feedback.className = 'feedback-correct text-sm font-semibold text-center';
    els.feedback.textContent = randomFrom(CORRECT_MESSAGES);
    playSound('success', state.settings.soundEnabled);
    launchConfetti(els.confetti);
    state = await recordAttempt(currentRiddle.id, true, isDaily);
    updateStreak();
    if (isDaily) showToast('New riddle tomorrow! 🌅', 'info', 4000);
  } else {
    els.feedback.className = 'feedback-wrong text-sm font-semibold text-center';
    els.feedback.textContent = randomFrom(WRONG_MESSAGES);
    playSound('wrong', state.settings.soundEnabled);
    await recordAttempt(currentRiddle.id, false, false);
  }
}

async function handleRandom() {
  const riddle = await getRandomRiddle(currentRiddle?.id);
  if (riddle) {
    currentRiddle = riddle;
    isDaily = false;
    renderRiddle();
    showToast('Random riddle! 🎲', 'info');
  }
}

async function toggleTheme() {
  const themes = ['system', 'light', 'dark'];
  const idx = themes.indexOf(state.settings.theme);
  state.settings.theme = themes[(idx + 1) % themes.length];
  const resolved = applyTheme(state.settings.theme);
  els.themeIcon.setAttribute('data-lucide', resolved === 'dark' ? 'moon' : 'sun');
  await saveUserState({ settings: state.settings });
  lucide.createIcons();
}

function setupListeners() {
  els.hintBtn.addEventListener('click', showHint);
  els.revealBtn.addEventListener('click', revealAnswer);
  els.submitBtn.addEventListener('click', submitGuess);
  els.guessInput.addEventListener('keydown', (e) => e.key === 'Enter' && submitGuess());
  els.randomBtn.addEventListener('click', handleRandom);
  els.themeToggle.addEventListener('click', toggleTheme);
  els.openExtension.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
  });
}

document.addEventListener('DOMContentLoaded', init);
