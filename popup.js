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

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const currentTabId = tabs[0].id.toString();
  let startTime = Date.now();
  let totalTimeFromStorage = 0;
  
  // Get total time from storage
  chrome.storage.local.get("tabActiveTimes", data => {
    const times = data.tabActiveTimes || {};
    const tabData = times[currentTabId];
    if (tabData) {
      totalTimeFromStorage = tabData.time || 0;
    }
    
    // Update display every second
    function updateTimeDisplay() {
      const currentActiveTime = Date.now() - startTime;
      const totalTime = totalTimeFromStorage + currentActiveTime;
      const totalSeconds = totalTime / 1000;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      
      document.getElementById("time-display").textContent = 
        `Active: ${minutes}m ${seconds}s`;
    }
    
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
  });
});

// chrome.storage.local.get(['tabActiveTimes', 'tabSwitchCount'], data => {
//   const times = data.tabActiveTimes || {};
//   let totalSeconds = Object.values(times).reduce((acc, val) => acc + val, 0);
//   const switchCount = data.tabSwitchCount || 0;
//   const totalMinutes = Math.floor(totalSeconds / 60);
//   const totalHours = Math.floor(totalMinutes / 60);
//   // totalSeconds %= 60;
//   // totalMinutes %= 60;
//   console.log(`Total time spent: ${totalHours} hours, ${totalMinutes} minutes, ${totalSeconds} seconds`);
//   document.getElementById('time-display').textContent = 
//     `Total time spent: ${totalHours}h ${totalMinutes}m ${totalSeconds}s`;
// });