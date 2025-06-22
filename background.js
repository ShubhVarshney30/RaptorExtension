let tabSwitchCount = 0;
let hasShownNotification = false;

// Load saved count on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["switchCount", "hasShownNotification"], (result) => {
    tabSwitchCount = result.switchCount || 0;
    hasShownNotification = result.hasShownNotification || false;
  });
});

// On tab switch
chrome.tabs.onActivated.addListener(() => {
  tabSwitchCount++;
  console.log("Tab switched. Total:", tabSwitchCount);

  // Check if we should show the notification
  if (tabSwitchCount > 10 && !hasShownNotification) {
    // Show notification asking if user is alright
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png', // You'll need to add an icon file
      title: 'Safety Check',
      message: 'Are you alright? You\'ve switched tabs quite a bit.'
    });
    
    hasShownNotification = true;
    
    // Save notification state
    chrome.storage.local.set({ hasShownNotification: true });
  }

  // Save to local storage
  chrome.storage.local.set({ switchCount: tabSwitchCount });
});
