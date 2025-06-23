(async function () {
    const { focusSite, focusEndTime } = await chrome.storage.local.get(["focusSite", "focusEndTime"]);
  
    if (!focusSite || !focusEndTime || Date.now() > focusEndTime) return;
  
    const currentUrl = window.location.href;
  
    if (!currentUrl.startsWith(focusSite)) {
      // Block this site
      const blockURL = chrome.runtime.getURL("block.html");
      window.location.replace(blockURL);
    }
  })();
  