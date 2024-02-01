chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SEARCH_QUERY') {
    fetch('http://localhost:5000/save-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: message.query,
        timestamp: Date.now()
      })
    })
    .then(response => response.json())
    .then(data => console.log('Response from server:', data))  // この行でレスポンスをログに出力
    .then(data => console.log('Data sent successfully:', data))
    .catch(error => console.error('Error sending data:', error));
  }
});
