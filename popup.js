chrome.storage.local.get("switchCount", (data) => {
    document.getElementById("count").innerText = `${data.switchCount || 0} times`;
  });
  