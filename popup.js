const tabCountEl = document.getElementById('tabCount');
const statusMessage = document.getElementById('statusMessage');
const toggleAlert = document.getElementById('toggleAlert');

const THRESHOLD = 10;

// Mock tab switch count (replace with real logic from background.js)
chrome.storage.local.get(['tabSwitchCount'], (data) => {
  updateUI(data.tabSwitchCount || 0);
});

toggleAlert.addEventListener('change', () => {
  chrome.storage.local.set({ alertsEnabled: toggleAlert.checked });
});

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
