// popup.js
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get('searchQuery', function(data) {
    if (data.searchQuery) {
      const displayElement = document.getElementById('queryDisplay');
      displayElement.textContent = data.searchQuery;
    }
  });
});
