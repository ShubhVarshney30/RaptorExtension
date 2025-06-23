let tabSwitchTimestamps = [];
const TIME_WINDOW_MINUTES = 20;
const MAX_TIME = TIME_WINDOW_MINUTES * 60 * 1000;
const THRESHOLD = 10;

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    tabSwitchCount: 0,
    alertsEnabled: true
  });

  // 🔔 Test notification (for debugging)
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Extension Ready',
    message: 'Tab Monitor is now tracking!',
    priority: 2
  });
});

// On tab switch
chrome.tabs.onActivated.addListener(() => {
  const now = Date.now();

  // Filter out old timestamps
  tabSwitchTimestamps = tabSwitchTimestamps.filter(
    ts => now - ts < MAX_TIME
  );

  // Add new timestamp
  tabSwitchTimestamps.push(now);

  // Update tab switch count
  const count = tabSwitchTimestamps.length;
  chrome.storage.local.set({ tabSwitchCount: count });

  // Notification check
  if (count > THRESHOLD) {
    chrome.storage.local.get('alertsEnabled', (data) => {
      if (data.alertsEnabled) {
        showNotification();
      }
    });
  }
});

// Show notification safely
function showNotification() {
  chrome.notifications.getPermissionLevel(level => {
    if (level === "granted") {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Tab Monitor Alert',
        message: 'Please stop — too many tab switches in 20 minutes.',
        priority: 2
      });
    }
  });
}

// Optional: Manual test by clicking extension icon
chrome.action.onClicked.addListener(() => {
  showNotification();
});

// Storage cleanup every hour
chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    tabSwitchTimestamps = [];
    chrome.storage.local.set({ tabSwitchCount: 0 });
  }
});




// shubhCodes
let currentTabId = null;
let currentWindowId = null;
let startTime = null;
let tabActiveTimes = {};

function startTracking(tabId, windowId) {
  currentTabId = tabId;
  currentWindowId = windowId;
  startTime = Date.now();
}

function stopTracking() {
  if (currentTabId !== null && startTime !== null) {
    const duration = Date.now() - startTime;
    if (!tabActiveTimes[currentTabId]) {
      tabActiveTimes[currentTabId] = 0;
    }
    tabActiveTimes[currentTabId] += duration;
    console.log(`Tab ${currentTabId} active time: ${tabActiveTimes[currentTabId]} ms`);
  }
  startTime = null;
}

// When active tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
  stopTracking();
  chrome.windows.getLastFocused({ populate: true }, window => {
    if (window.focused) {
      startTracking(activeInfo.tabId, window.id);
    }
  });
});

// When window focus changes
chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    stopTracking(); // user unfocused the browser
  } else {
    chrome.tabs.query({ active: true, windowId }, tabs => {
      if (tabs.length > 0) {
        startTracking(tabs[0].id, windowId);
      }
    });
  }
});

// Optional: handle idle state
chrome.idle.onStateChanged.addListener(state => {
  if (state === "idle" || state === "locked") {
    stopTracking();
  } else if (state === "active") {
    chrome.windows.getLastFocused({ populate: true }, window => {
      const activeTab = window.tabs.find(tab => tab.active);
      if (activeTab) {
        startTracking(activeTab.id, window.id);
      }
    });
  }
});
