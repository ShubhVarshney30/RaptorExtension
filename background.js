let tabSwitchTimestamps = [];
const TIME_WINDOW_MINUTES = 20;
const MAX_TIME = TIME_WINDOW_MINUTES * 60 * 1000; // 20 minutes in ms

// Default alerts enabled
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    tabSwitchCount: 0,
    alertsEnabled: true
  });
});

// Listen for tab switching (focus changes)
chrome.tabs.onActivated.addListener(() => {
  const now = Date.now();

  // Remove old timestamps
  tabSwitchTimestamps = tabSwitchTimestamps.filter(
    ts => now - ts < MAX_TIME
  );

  // Add new timestamp
  tabSwitchTimestamps.push(now);

  // Save current count
  const count = tabSwitchTimestamps.length;
  chrome.storage.local.set({ tabSwitchCount: count });

  // Optional: trigger notification if alerts are enabled and count exceeds threshold
  if (count > 10) {
    chrome.storage.local.get('alertsEnabled', (data) => {
      if (data.alertsEnabled) {
        showNotification();
      }
    });
  }
});

// Show notification
function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Tab Monitor Alert',
    message: 'Please stop — too many tab switches in 20 minutes.',
    priority: 2
  });
}

// Optional: clear storage every X hours to prevent bloat
chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    tabSwitchTimestamps = [];
    chrome.storage.local.set({ tabSwitchCount: 0 });
  }
});
