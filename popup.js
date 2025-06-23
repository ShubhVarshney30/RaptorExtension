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
    statusMessage.textContent = 'Youre staying focused!';
    statusMessage.classList.remove('warning');
    statusMessage.classList.add('normal');
  }
}

// Focus Mode logic
const focusForm = document.getElementById('focus-form');
const focusUrlInput = document.getElementById('focus-url');
const focusDurationInput = document.getElementById('focus-duration');
const startFocusBtn = document.getElementById('start-focus-btn');
const stopFocusBtn = document.getElementById('stop-focus-btn');
const focusStatus = document.getElementById('focus-status');

function updateFocusUI() {
  chrome.storage.local.get(['focusSite', 'focusEndTime'], (data) => {
    const now = Date.now();
    if (data.focusSite && data.focusEndTime && now < data.focusEndTime) {
      focusStatus.textContent = `Focus Mode ON: Only ${data.focusSite} allowed until ${new Date(data.focusEndTime).toLocaleTimeString()}`;
      stopFocusBtn.style.display = '';
      startFocusBtn.disabled = true;
      focusUrlInput.disabled = true;
      focusDurationInput.disabled = true;
    } else {
      focusStatus.textContent = '';
      stopFocusBtn.style.display = 'none';
      startFocusBtn.disabled = false;
      focusUrlInput.disabled = false;
      focusDurationInput.disabled = false;
    }
  });
}

if (focusForm) {
  focusForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = focusUrlInput.value.trim();
    const duration = parseInt(focusDurationInput.value, 10);
    if (!url || !duration) return;
    const endTime = Date.now() + duration * 60 * 1000;
    chrome.storage.local.set({ focusSite: url, focusEndTime: endTime }, () => {
      updateFocusUI();
    });
  });
}

if (stopFocusBtn) {
  stopFocusBtn.addEventListener('click', () => {
    chrome.storage.local.remove(['focusSite', 'focusEndTime'], () => {
      updateFocusUI();
    });
  });
}

document.addEventListener('DOMContentLoaded', updateFocusUI);
