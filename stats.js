const toggle = document.getElementById('darkModeToggle');

// Load saved theme
chrome.storage.local.get('darkMode', (data) => {
  if (data.darkMode) {
    document.body.classList.add('dark');
    toggle.checked = true;
  }
});

// Toggle dark mode
toggle.addEventListener('change', () => {
  const isDark = toggle.checked;
  document.body.classList.toggle('dark', isDark);
  chrome.storage.local.set({ darkMode: isDark });
});

// Load stats and render chart
chrome.storage.local.get([
  'tabSwitchCount',
  'longestFocusStreak',
  'warpTriggeredDays'
], (data) => {
  const switchCount = data.tabSwitchCount || 0;
  const streak = data.longestFocusStreak || 0;
  const warpDays = data.warpTriggeredDays || {};

  const today = new Date().toISOString().split("T")[0];
  const todayTriggers = warpDays[today] || 0;

  document.getElementById('tabSwitches').innerText = switchCount;
  document.getElementById('focusStreak').innerText = `${streak} min`;
  document.getElementById('warpDays').innerText = `${todayTriggers} times today`;

  new Chart(document.getElementById('usageChart'), {
    type: 'doughnut',
    data: {
      labels: ['Focused Time', 'Distracted Time'],
      datasets: [{
        data: [streak, switchCount / 3],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Focus vs Distraction'
        }
      }
    }
  });
});

// Load and display tabActiveTimes in table
chrome.storage.local.get('tabActiveTimes', (data) => {
  const tabTimes = data.tabActiveTimes || {};
  const tbody = document.getElementById('tabTimesTableBody');
  tbody.innerHTML = '';
  Object.values(tabTimes).forEach(({ url, time }) => {
    const tr = document.createElement('tr');
    const tdUrl = document.createElement('td');
    let domain = url;
    try {
      domain = new URL(url).hostname;
    } catch (e) {
      // fallback to original url if parsing fails
    }
    tdUrl.textContent = domain;
    const tdTime = document.createElement('td');
    tdTime.textContent = ((time / 1000)/60).toFixed(2);
    tr.appendChild(tdUrl);
    tr.appendChild(tdTime);
    tbody.appendChild(tr);
  });
});

// shubhCodes
