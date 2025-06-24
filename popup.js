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
    showNudge();
  } else {
    statusMessage.textContent = 'You’re staying focused!';
    statusMessage.classList.remove('warning');
    statusMessage.classList.add('normal');
  }
}


// onswitchcodenotification
function showNudge() {
  const existing = document.getElementById("warp-nudge");
  if (existing) return;

  const nudge = document.createElement("div");
  nudge.id = "warp-nudge";
  nudge.innerText =  "You've been switching rapidly!! What’s your goal here? 💫";
  nudge.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: rgba(0,0,0,0.75);
    color: #fff;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
    font-family: sans-serif;
  `;
  document.body.appendChild(nudge);
  setTimeout(() => (nudge.style.opacity = 1), 100);
  setTimeout(() => {
    nudge.style.opacity = 0;
    setTimeout(() => nudge.remove(), 1000);
  }, 5000);
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
