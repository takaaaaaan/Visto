chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "log") {
    chrome.runtime.sendMessage(request);
  }
});
