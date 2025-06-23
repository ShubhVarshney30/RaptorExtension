const tabCountEl = document.getElementById('tabCount');
const statusMessage = document.getElementById('statusMessage');
const toggleAlert = document.getElementById('toggleAlert');
const toggleWarp = document.getElementById('toggleWarp');

const THRESHOLD = 10;

// Load stored settings and update UI
chrome.storage.local.get(['tabSwitchCount', 'alertsEnabled', 'timeWarpEnabled'], (data) => {
  updateUI(data.tabSwitchCount || 0);

  // Restore toggle states
  toggleAlert.checked = data.alertsEnabled ?? true;
  toggleWarp.checked = data.timeWarpEnabled ?? true;
});

// Save toggle states when changed
toggleAlert.addEventListener('change', () => {
  chrome.storage.local.set({ alertsEnabled: toggleAlert.checked });
});

toggleWarp.addEventListener('change', () => {
  chrome.storage.local.set({ timeWarpEnabled: toggleWarp.checked });
});

// Status update logic
function updateUI(count) {
  tabCountEl.textContent = count;

  if (count > THRESHOLD) {
    statusMessage.textContent = 'Please stop — too many tab switches.';
    statusMessage.classList.remove('normal');
    statusMessage.classList.add('warning');
  } else {
    statusMessage.textContent = 'You’re staying focused!';
    statusMessage.classList.remove('warning');
    statusMessage.classList.add('normal');
  }
}


chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const currentTabId = tabs[0].id.toString();
  chrome.storage.local.get("tabActiveTimes", data => {
    const times = data.tabActiveTimes || {};
    const timeSpent = times[currentTabId] || 0;
    document.getElementById("time-display").textContent = 
      `Time on this tab: ${(timeSpent / 1000).toFixed(2)} seconds`;
  });
});
