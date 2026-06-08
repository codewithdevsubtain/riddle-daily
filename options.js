/**
 * RiddleDaily — Options / Settings page
 */
import {
  loadUserState,
  saveUserState,
  applyTheme,
  exportProgress,
  importProgress,
  showToast,
  playSound,
  DEFAULT_STATS,
  DEFAULT_STREAK,
  STORAGE_KEYS
} from './shared.js';
import { RIDDLE_CATEGORIES } from './riddles.js';

let state = null;

const $ = (sel) => document.querySelector(sel);

const els = {
  theme: $('#setting-theme'),
  notifications: $('#setting-notifications'),
  sound: $('#setting-sound'),
  customText: $('#custom-text'),
  customAnswer: $('#custom-answer'),
  customHint: $('#custom-hint'),
  customCategory: $('#custom-category'),
  customDifficulty: $('#custom-difficulty'),
  addRiddleBtn: $('#add-riddle-btn'),
  customList: $('#custom-list'),
  exportBtn: $('#export-btn'),
  importFile: $('#import-file'),
  resetBtn: $('#reset-btn')
};

async function init() {
  state = await loadUserState();
  applyTheme(state.settings.theme);

  RIDDLE_CATEGORIES.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    els.customCategory.appendChild(opt);
  });

  loadSettings();
  renderCustomRiddles();
  setupListeners();
  lucide.createIcons();
}

function loadSettings() {
  els.theme.value = state.settings.theme;
  els.notifications.checked = state.settings.notifications;
  els.sound.checked = state.settings.soundEnabled;
}

async function saveSettings() {
  state.settings = {
    theme: els.theme.value,
    notifications: els.notifications.checked,
    soundEnabled: els.sound.checked,
    newTabEnabled: true
  };
  applyTheme(state.settings.theme);
  await saveUserState({ settings: state.settings });
  playSound('click', state.settings.soundEnabled);
}

function renderCustomRiddles() {
  const custom = state.customRiddles || [];
  if (!custom.length) {
    els.customList.innerHTML = `
      <div class="empty-state py-6">
        <div class="text-2xl mb-1">✏️</div>
        <p class="text-xs text-theme-muted">No custom riddles yet</p>
      </div>`;
    return;
  }

  els.customList.innerHTML = custom.map((r, i) => `
    <div class="flex items-start justify-between gap-3 p-3 rounded-xl border border-theme bg-theme-secondary">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">${r.text}</p>
        <p class="text-xs text-theme-muted">Answer: ${r.answer}</p>
      </div>
      <button class="btn btn-ghost btn-icon text-red-400 shrink-0 delete-custom" data-index="${i}">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </div>
  `).join('');

  els.customList.querySelectorAll('.delete-custom').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const idx = Number(btn.dataset.index);
      state.customRiddles.splice(idx, 1);
      await saveUserState({ customRiddles: state.customRiddles });
      renderCustomRiddles();
      showToast('Riddle deleted', 'info');
      lucide.createIcons();
    });
  });
  lucide.createIcons();
}

async function addCustomRiddle() {
  const text = els.customText.value.trim();
  const answer = els.customAnswer.value.trim();
  if (!text || !answer) {
    showToast('Please fill in riddle text and answer', 'error');
    return;
  }

  const hint = els.customHint.value.trim();
  const newRiddle = {
    id: Date.now(),
    text,
    answer,
    hints: hint ? [hint] : [],
    category: els.customCategory.value,
    difficulty: els.customDifficulty.value,
    keywords: ['custom'],
    custom: true
  };

  state.customRiddles = state.customRiddles || [];
  state.customRiddles.push(newRiddle);
  await saveUserState({ customRiddles: state.customRiddles });

  els.customText.value = '';
  els.customAnswer.value = '';
  els.customHint.value = '';
  renderCustomRiddles();
  showToast('Riddle added! 🎉', 'success');
  playSound('success', state.settings.soundEnabled);
}

async function handleExport() {
  try {
    const json = await exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riddledaily-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress exported!', 'success');
  } catch (err) {
    showToast('Export failed', 'error');
  }
}

async function handleImport(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    await importProgress(text);
    state = await loadUserState();
    loadSettings();
    renderCustomRiddles();
    showToast('Progress imported successfully!', 'success');
  } catch (err) {
    showToast('Invalid backup file', 'error');
  }
  e.target.value = '';
}

async function handleReset() {
  if (!confirm('Are you sure? This will reset all progress, streaks, and favorites.')) return;
  await chrome.storage.sync.set({
    [STORAGE_KEYS.SOLVED]: {},
    [STORAGE_KEYS.FAVORITES]: [],
    [STORAGE_KEYS.STATS]: DEFAULT_STATS,
    [STORAGE_KEYS.STREAK]: DEFAULT_STREAK
  });
  state = await loadUserState();
  showToast('Progress reset', 'info');
}

function setupListeners() {
  els.theme.addEventListener('change', saveSettings);
  els.notifications.addEventListener('change', saveSettings);
  els.sound.addEventListener('change', saveSettings);
  els.addRiddleBtn.addEventListener('click', addCustomRiddle);
  els.exportBtn.addEventListener('click', handleExport);
  els.importFile.addEventListener('change', handleImport);
  els.resetBtn.addEventListener('click', handleReset);
}

document.addEventListener('DOMContentLoaded', init);
