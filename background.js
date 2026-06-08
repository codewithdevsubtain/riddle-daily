/**
 * RiddleDaily — Background service worker
 * Handles alarms, context menu, keyboard commands, and daily notifications
 */
import {
  initializeOnInstall,
  getDailyRiddle,
  getRandomRiddle,
  getTodayString
} from './shared.js';

const ALARM_NAME = 'daily-riddle-notification';

/** Create context menu on install */
chrome.runtime.onInstalled.addListener(async (details) => {
  await initializeOnInstall();

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'random-riddle',
      title: 'Get a Random Riddle',
      contexts: ['page', 'action', 'selection']
    });
    chrome.contextMenus.create({
      id: 'open-riddledaily',
      title: 'Open RiddleDaily',
      contexts: ['page', 'action']
    });
  });

  if (details.reason === 'install') {
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: 60
    });
  }
});

/** Daily notification alarm */
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const data = await chrome.storage.sync.get(['settings', 'dailyState']);
  const settings = data.settings || {};
  if (!settings.notifications) return;

  const today = getTodayString();
  const dailyState = data.dailyState || {};
  if (dailyState.date === today && dailyState.solved) return;

  const riddle = await getDailyRiddle(today);
  if (!riddle) return;

  const hour = new Date().getHours();
  if (hour < 8 || hour > 20) return;

  chrome.notifications.create('daily-riddle', {
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: "Today's Riddle is Waiting! 🧩",
    message: riddle.text.slice(0, 100) + (riddle.text.length > 100 ? '...' : ''),
    priority: 1
  });
});

/** Context menu clicks */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'random-riddle') {
    const riddle = await getRandomRiddle();
    if (!riddle) return;
    await chrome.storage.local.set({
      pendingRiddle: { id: riddle.id, source: 'context-menu' }
    });
    chrome.action.openPopup?.() || chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
  }

  if (info.menuItemId === 'open-riddledaily') {
    chrome.action.openPopup?.();
  }
});

/** Keyboard shortcuts */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'random-riddle') {
    const riddle = await getRandomRiddle();
    if (!riddle) return;
    await chrome.storage.local.set({
      pendingRiddle: { id: riddle.id, source: 'shortcut' }
    });
    try {
      await chrome.action.openPopup();
    } catch {
      chrome.tabs.create({ url: chrome.runtime.getURL('popup.html') });
    }
  }

  if (command === 'open-popup') {
    try {
      await chrome.action.openPopup();
    } catch {
      /* Popup may not open programmatically in all contexts */
    }
  }
});

/** Notification click opens popup */
chrome.notifications.onClicked.addListener(() => {
  chrome.action.openPopup?.();
});

/** Badge shows streak */
async function updateBadge() {
  const data = await chrome.storage.sync.get(['streak']);
  const streak = data.streak?.current || 0;
  if (streak > 0) {
    chrome.action.setBadgeText({ text: String(streak) });
    chrome.action.setBadgeBackgroundColor({ color: '#8b5cf6' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.streak) {
    updateBadge();
  }
});

updateBadge();
