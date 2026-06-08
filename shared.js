/**
 * RiddleDaily — Shared utilities for storage, daily riddles, stats, and theme
 */
import { BUILTIN_RIDDLES } from './riddles.js';

export const STORAGE_KEYS = {
  SOLVED: 'solvedRiddles',
  FAVORITES: 'favorites',
  CUSTOM: 'customRiddles',
  STATS: 'stats',
  STREAK: 'streak',
  SETTINGS: 'settings',
  ONBOARDING: 'onboardingComplete',
  DAILY: 'dailyState',
  RANDOM_CACHE: 'randomRiddleCache'
};

export const DEFAULT_SETTINGS = {
  theme: 'system',
  notifications: true,
  soundEnabled: true,
  newTabEnabled: true
};

export const DEFAULT_STATS = {
  totalSolved: 0,
  totalAttempts: 0,
  correctAttempts: 0,
  categoryProgress: {}
};

export const DEFAULT_STREAK = {
  current: 0,
  lastSolveDate: null
};

/** Get today's date string in local timezone (YYYY-MM-DD) */
export function getTodayString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Deterministic hash for daily riddle selection */
export function hashDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Get all riddles (builtin + custom) */
export async function getAllRiddles() {
  const data = await chrome.storage.sync.get(STORAGE_KEYS.CUSTOM);
  const custom = data[STORAGE_KEYS.CUSTOM] || [];
  return [...BUILTIN_RIDDLES, ...custom];
}

/** Get daily riddle for a given date */
export async function getDailyRiddle(dateStr = getTodayString()) {
  const riddles = await getAllRiddles();
  if (!riddles.length) return null;
  const index = hashDate(dateStr) % riddles.length;
  return riddles[index];
}

/** Load full user state from sync storage */
export async function loadUserState() {
  const keys = Object.values(STORAGE_KEYS);
  const data = await chrome.storage.sync.get(keys);
  return {
    solvedRiddles: data[STORAGE_KEYS.SOLVED] || {},
    favorites: data[STORAGE_KEYS.FAVORITES] || [],
    customRiddles: data[STORAGE_KEYS.CUSTOM] || [],
    stats: { ...DEFAULT_STATS, ...(data[STORAGE_KEYS.STATS] || {}) },
    streak: { ...DEFAULT_STREAK, ...(data[STORAGE_KEYS.STREAK] || {}) },
    settings: { ...DEFAULT_SETTINGS, ...(data[STORAGE_KEYS.SETTINGS] || {}) },
    onboardingComplete: data[STORAGE_KEYS.ONBOARDING] || false,
    dailyState: data[STORAGE_KEYS.DAILY] || { date: null, riddleId: null }
  };
}

/** Save partial state to sync storage */
export async function saveUserState(partial) {
  const payload = {};
  if (partial.solvedRiddles !== undefined) payload[STORAGE_KEYS.SOLVED] = partial.solvedRiddles;
  if (partial.favorites !== undefined) payload[STORAGE_KEYS.FAVORITES] = partial.favorites;
  if (partial.customRiddles !== undefined) payload[STORAGE_KEYS.CUSTOM] = partial.customRiddles;
  if (partial.stats !== undefined) payload[STORAGE_KEYS.STATS] = partial.stats;
  if (partial.streak !== undefined) payload[STORAGE_KEYS.STREAK] = partial.streak;
  if (partial.settings !== undefined) payload[STORAGE_KEYS.SETTINGS] = partial.settings;
  if (partial.onboardingComplete !== undefined) payload[STORAGE_KEYS.ONBOARDING] = partial.onboardingComplete;
  if (partial.dailyState !== undefined) payload[STORAGE_KEYS.DAILY] = partial.dailyState;
  await chrome.storage.sync.set(payload);
}

/** Normalize answer for comparison */
export function normalizeAnswer(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

/** Check if guess matches answer (flexible matching) */
export function checkAnswer(guess, answer) {
  const g = normalizeAnswer(guess);
  const a = normalizeAnswer(answer);
  if (!g || !a) return false;
  if (g === a) return true;
  // Allow answer contained in longer guess or vice versa for multi-word answers
  if (a.includes(g) && g.length >= a.length * 0.6) return true;
  if (g.includes(a)) return true;
  return false;
}

/** Update streak when solving daily riddle */
export function updateStreak(streak, today = getTodayString()) {
  const updated = { ...streak };
  if (updated.lastSolveDate === today) return updated;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getTodayString(yesterday);

  if (updated.lastSolveDate === yesterdayStr) {
    updated.current += 1;
  } else if (updated.lastSolveDate !== today) {
    updated.current = 1;
  }
  updated.lastSolveDate = today;
  return updated;
}

/** Record a solve attempt */
export async function recordAttempt(riddleId, correct, isDaily = false) {
  const state = await loadUserState();
  const id = String(riddleId);
  const now = new Date().toISOString();
  const today = getTodayString();

  state.stats.totalAttempts += 1;
  if (correct) state.stats.correctAttempts += 1;

  const wasAlreadySolved = state.solvedRiddles[id]?.correct;
  const existing = state.solvedRiddles[id] || { attempts: 0, correct: false };
  existing.attempts += 1;
  if (correct) {
    existing.correct = true;
    existing.solvedAt = existing.solvedAt || now;
    if (!wasAlreadySolved) {
      state.stats.totalSolved += 1;
    }
  }
  state.solvedRiddles[id] = existing;

  if (correct && !wasAlreadySolved) {
    const riddles = await getAllRiddles();
    const riddle = riddles.find((r) => String(r.id) === id);
    if (riddle) {
      const cat = riddle.category;
      state.stats.categoryProgress = state.stats.categoryProgress || {};
      state.stats.categoryProgress[cat] = (state.stats.categoryProgress[cat] || 0) + 1;
    }

    if (isDaily) {
      state.streak = updateStreak(state.streak, today);
      state.dailyState = { date: today, riddleId: riddleId, solved: true };
    }
  }

  await saveUserState({
    solvedRiddles: state.solvedRiddles,
    stats: state.stats,
    streak: state.streak,
    dailyState: state.dailyState
  });

  return state;
}

/** Toggle favorite */
export async function toggleFavorite(riddleId) {
  const state = await loadUserState();
  const id = Number(riddleId);
  const idx = state.favorites.indexOf(id);
  if (idx >= 0) state.favorites.splice(idx, 1);
  else state.favorites.push(id);
  await saveUserState({ favorites: state.favorites });
  return state.favorites;
}

/** Get random riddle */
export async function getRandomRiddle(excludeId = null) {
  const riddles = await getAllRiddles();
  const pool = excludeId ? riddles.filter((r) => r.id !== excludeId) : riddles;
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Filter riddles for library view */
export function filterRiddles(riddles, { search = '', category = 'all', difficulty = 'all', favoritesOnly = false, favoriteIds = [] }) {
  const q = search.toLowerCase().trim();
  return riddles.filter((r) => {
    if (category !== 'all' && r.category !== category) return false;
    if (difficulty !== 'all' && r.difficulty !== difficulty) return false;
    if (favoritesOnly && !favoriteIds.includes(r.id)) return false;
    if (!q) return true;
    const haystack = [r.text, r.answer, r.category, r.difficulty, ...(r.keywords || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

/** Calculate accuracy percentage */
export function getAccuracy(stats) {
  if (!stats.totalAttempts) return 0;
  return Math.round((stats.correctAttempts / stats.totalAttempts) * 100);
}

/** Apply theme to document */
export function applyTheme(theme, root = document.documentElement) {
  const resolved = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  root.setAttribute('data-theme', resolved);
  root.classList.toggle('dark', resolved === 'dark');
  return resolved;
}

/** Format riddle for sharing */
export function formatRiddleForShare(riddle) {
  return `🧩 RiddleDaily Challenge\n\n${riddle.text}\n\nCategory: ${riddle.category} | Difficulty: ${riddle.difficulty}\n\nCan you solve it? Get RiddleDaily extension!`;
}

/** Export progress as JSON */
export async function exportProgress() {
  const state = await loadUserState();
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    ...state
  }, null, 2);
}

/** Import progress from JSON */
export async function importProgress(jsonStr) {
  const data = JSON.parse(jsonStr);
  if (!data || data.version !== 1) throw new Error('Invalid or unsupported backup file.');
  await saveUserState({
    solvedRiddles: data.solvedRiddles || {},
    favorites: data.favorites || [],
    customRiddles: data.customRiddles || [],
    stats: { ...DEFAULT_STATS, ...(data.stats || {}) },
    streak: { ...DEFAULT_STREAK, ...(data.streak || {}) },
    settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
    onboardingComplete: data.onboardingComplete ?? true
  });
  return true;
}

/** Encouraging messages */
export const CORRECT_MESSAGES = [
  'Brilliant! You nailed it! 🎉',
  'Correct! Your brain is on fire! 🔥',
  'Amazing! Puzzle master! 🏆',
  'Yes! That\'s the answer! ✨',
  'Sharp thinking! Well done! 🧠'
];

export const WRONG_MESSAGES = [
  'Not quite — keep thinking! 💪',
  'Close, but try again!',
  'Hmm, that\'s not it. You\'ve got this!',
  'Wrong answer, but don\'t give up!',
  'Keep going — every guess makes you sharper!'
];

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Difficulty badge colors */
export function difficultyClass(difficulty) {
  const map = {
    Easy: 'badge-easy',
    Medium: 'badge-medium',
    Hard: 'badge-hard'
  };
  return map[difficulty] || 'badge-medium';
}

/** Category icon name for Lucide */
export function categoryIcon(category) {
  const map = {
    Logic: 'brain',
    Wordplay: 'message-square-text',
    Math: 'calculator',
    'Lateral Thinking': 'lightbulb',
    Classic: 'book-open',
    Science: 'flask-conical',
    Nature: 'leaf'
  };
  return map[category] || 'puzzle';
}

/** Play subtle sound effect */
export function playSound(type, enabled = true) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'success') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'click') {
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else {
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (_) {
    /* Audio not available */
  }
}

/** Launch confetti animation */
export function launchConfetti(container, count = 50) {
  if (!container) return;
  const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.animationDuration = `${1 + Math.random()}s`;
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
}

/** Toast notification */
export function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/** Initialize riddles on first install */
export async function initializeOnInstall() {
  const data = await chrome.storage.sync.get(['initialized']);
  if (data.initialized) return;
  await chrome.storage.sync.set({
    initialized: true,
    [STORAGE_KEYS.STATS]: DEFAULT_STATS,
    [STORAGE_KEYS.STREAK]: DEFAULT_STREAK,
    [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
    [STORAGE_KEYS.SOLVED]: {},
    [STORAGE_KEYS.FAVORITES]: [],
    [STORAGE_KEYS.CUSTOM]: [],
    [STORAGE_KEYS.ONBOARDING]: false
  });
}
