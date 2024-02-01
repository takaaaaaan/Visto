// content.js
// GyAeWb クラスを持つ要素を選択
var targetElement = document.getElementsByClassName("GyAeWb")[0];

// iframe 要素を作成
const iframe = document.createElement("iframe");

// iframe のスタイルと属性を設定
iframe.style.width = "100%";
iframe.style.height = "300px"; // 高さは適宜調整
iframe.src = chrome.runtime.getURL("embedded.html"); // 拡張機能の内部URLを使用

// GyAeWbの2つ目の子要素が存在するか確認し、あればその前に挿入、なければappendChildを使用
const secondChild = targetElement.children[1]; // 子要素は0から始まるので、2番目はインデックス1
if (secondChild) {
  targetElement.insertBefore(iframe, secondChild);
} else {
  targetElement.appendChild(iframe);
}
// // 対象となる要素を選択
// var targetElement = document.getElementsByClassName("TQc1id")[0];

// // iframe 要素を作成
// const iframe = document.createElement("iframe");

// // iframe のスタイルと属性を設定
// iframe.style.width = "100%";
// iframe.style.height = "300px"; // 高さは適宜調整
// iframe.src = chrome.runtime.getURL("embedded.html"); // 拡張機能の内部URLを使用

// // iframe を目的の要素に挿入
// targetElement.insertBefore(iframe, targetElement.firstChild);

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
  fetch('http://localhost:5000/get-queries')  // PythonサーバーのURL
    .then(response => response.json())
    .then(data => {
      // ここでデータをiframe内に表示するロジックを実装
      console.log(data);  // とりあえずコンソールに出力
    })
    .catch(error => console.error('Error:', error));
}

// ページ読み込み時にデータを表示
window.onload = displayData;
