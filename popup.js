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
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Focus Reminder",
      message: "Hey! Stay focused and avoid distractions.",
      priority: 2
    });
  } else {
    statusMessage.textContent = 'You’re staying focused!';
    statusMessage.classList.remove('warning');
    statusMessage.classList.add('normal');
  }
}

// focusmode code
document.getElementById('start').addEventListener('click', async () => {
  const site = document.getElementById('site').value.trim();
  const time = parseInt(document.getElementById('time').value.trim());

  if (!site || isNaN(time) || time <= 0) {
    alert('Please enter a valid site and time.');
    return;
  }

  const endTime = Date.now() + time * 60000;

  await chrome.storage.local.set({
    focusSite: site,
    focusEndTime: endTime
  });

  alert('Focus Mode Activated!');
});
