// 検索欄取得
const searchInput = document.querySelector('textarea[name="q"]');
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value;
    chrome.runtime.sendMessage({ type: "SEARCH_QUERY", query: query });
  });
}

// データを取得して表示する関数
function displayData() {
  fetch("http://localhost:5000/get-queries") // PythonサーバーのURL
    .then((response) => response.json())
    .then((data) => {
      // ここでデータをiframe内に表示するロジックを実装
      console.log(data); // とりあえずコンソールに出力
    })
    .catch((error) => console.error("Error:", error));
}

// ページ読み込み時にデータを表示
window.onload = displayData;
// ページ読み込み時にデータを表示
window.onload = function () {
  let checkExist = setInterval(function () {
    var targetElement =
      document.getElementsByClassName("TQc1id")[0] ||
      document.getElementsByClassName("GyAeWb")[0];
    if (targetElement) {
      console.log("Element is now present.");
      clearInterval(checkExist);

      // div 要素を作成
      const div = document.createElement("div");

      // div にクラス名を設定
      div.className = "custom-iframe-container";

      // iframe 要素を作成
      const iframe = document.createElement("iframe");
      iframe.className = "custom-iframe";

      iframe.src = chrome.runtime.getURL("embedded.html");

      // div の子要素として iframe を追加
      div.appendChild(iframe);

      // targetElement の子要素として div を追加
      const secondChild = targetElement.children[1];
      if (secondChild) {
        targetElement.insertBefore(div, secondChild);
      } else {
        targetElement.appendChild(div);
      }
    }
  }, 100);

  displayData();
};
