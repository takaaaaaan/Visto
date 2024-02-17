// embedded-DB.js
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.type === "QUERY_SAVED") {
//     // 検索結果を表示する
//     displaySearchResults();

//     // chatWithGPT4関数を呼び出し、GPT-4とのチャットを開始
//     chatWithGPT4(testMessageToGPT4)
//       .then(() => {
//         console.log("GPT-4とのチャットが完了しました。");
//       })
//       .catch((error) => {
//         console.error("GPT-4とのチャット中にエラーが発生しました:", error);
//       });

//     // 非同期レスポンスを処理するためにtrueを返す
//     return true;
//   }
// });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "QUERY_SAVED") {
    // 検索結果を表示する
    displaySearchResults();

    // GPT-4とのチャットを開始するためのメッセージを定義
    const testMessageToGPT4 = "これはGPT-4へのテストメッセージです。"; // この行を追加

    // chatWithGPT4関数を呼び出し、GPT-4とのチャットを開始
    chatWithGPT4(testMessageToGPT4)
      .then(() => {
        console.log("GPT-4とのチャットが完了しました。");
      })
      .catch((error) => {
        console.error("GPT-4とのチャット中にエラーが発生しました:", error);
      });

    // 非同期レスポンスを処理するためにtrueを返す
    return true;
  }
});

async function chatWithGPT4(message) {
  const endpoint = "http://localhost:5000/chat"; // FlaskアプリのURLとポートを適切に設定してください
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message }),
  };

  try {
    const response = await fetch(endpoint, payload);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Response from GPT-4:", data.response); // レスポンスの内容をコンソールに表示

    // class="search"が指定されたdivを取得
    const searchDiv = document.querySelector(".search");
    // 取得したdivにレスポンスの内容を表示
    if (searchDiv) {
      searchDiv.innerHTML = `<p>${data.response}</p>`; // HTMLとして挿入
      // または searchDiv.textContent = data.response; // テキストとして挿入
    }
  } catch (error) {
    console.error("Error during fetching:", error);
  }
}

function displaySearchResults() {
  fetch("http://localhost:5000/get-search-results")
    .then((response) => response.json())
    .then((data) => {
      const mainContent = document.getElementById("main-content");
      if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        displayErrorMessage(mainContent, "データが見つかりませんでした。");
        return;
      }

      Object.keys(data).forEach((countryCode) => {
        Object.keys(data[countryCode]).forEach((languageCode) => {
          const searchResults = data[countryCode][languageCode];
          if (searchResults && searchResults.data && searchResults.data.items) {
            searchResults.data.items.forEach((item) => {
              // 新しい記事コンテナを作成
              const articleDiv = document.createElement("div");
              articleDiv.className = "article";

              // 記事コンテナ内のHTMLを構築
              articleDiv.innerHTML = `
                <div class="pd-8-16">
                  <div class="overlap-group">
                    <div class="span">
                      <div class="image"></div>
                    </div>
                    <div class="div-2">
                      <div class="text-main-page-name">${item.displaylink}</div>
                      <div class="text">
                        <p class="p">${item.url}</p>
                        <img class="img" src="./assets/img/embedded/2.svg" />
                      </div>
                    </div>
                  </div>
                  <div class="link-heading">${item.title}</div>
                  <p class="emphasis-firebase">
                    <span class="text-B">${item.title}</span>
                    <span class="text-b">${item.snippet}</span>
                  </p>
                </div>
              `;

              // mainContentに追加
              mainContent.appendChild(articleDiv);
            });
          }
        });
      });

      console.log("データの表示に成功しました。");
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
      displayErrorMessage(
        mainContent,
        "検索結果の取得中にエラーが発生しました。"
      );
    });
}

function displayErrorMessage(parentElement, message) {
  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
  errorMessage.textContent = message;
  parentElement.appendChild(errorMessage);
}
