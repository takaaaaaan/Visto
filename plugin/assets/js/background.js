chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 検索クエリを保存するためのメッセージ処理
  if (message.type === 'SEARCH_QUERY') {
    fetch('http://localhost:5000/save-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: message.query,
        timestamp: new Date().toISOString()
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from server:', data);
        sendResponse({ status: 'success', data: data });

        // 保存が完了したら、content scriptにメッセージを送信
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "QUERY_SAVED" });

          // ここに/run-summaryへのPOSTリクエストを追加
          fetch('http://localhost:5000/run-summary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            // この部分には、/run-summaryエンドポイントが期待する適切なリクエストボディを含めます
            body: JSON.stringify({
              // リクエストボディの内容は、/run-summaryエンドポイントが何を期待しているかによります
              // 例: query: message.query, timestamp: new Date().toISOString() など
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Response from /run-summary:', data);
              // 必要に応じて、さらに処理をここに追加できます
            })
            .catch(error => {
              console.error('Error from /run-summary:', error);
            });
        });

      })
      .catch(error => {
        console.error('Error sending data:', error);
        sendResponse({ status: 'error', message: error.message });
      });

    // 非同期のレスポンスを可能にするためにtrueを返す
    return true;
  }


  // 国の有効化状態を更新するためのメッセージ処理
  if (message.type === 'UPDATE_COUNTRY_STATUS') {
    fetch('http://localhost:5000/update_country_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: message.country,
        status: message.status
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from server:', data);
        sendResponse({ status: 'success', data: data });
      })
      .catch(error => {
        console.error('Error sending data:', error);
        sendResponse({ status: 'error', message: error.message });
      });

    // 非同期のレスポンスを可能にするためにtrueを返す
    return true;
  }
});
