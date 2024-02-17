// ロード時に実行
window.onload = function () {
  getSearchQueryFromURL();
  checkAndInsertElement();
};

// pデータを取得してbackground.js
function getSearchQueryFromURL() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (query) {
    chrome.runtime.sendMessage({ type: "SEARCH_QUERY", query: query });
  }
}


// iframe 要素を指定した部分に作成
function checkAndInsertElement() {
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
      insertIframeIntoPage(targetElement, div);
    }
  }, 100);
}

function insertIframeIntoPage(targetElement, div) {
  const secondChild = targetElement.children[1];
  if (secondChild) {
    targetElement.insertBefore(div, secondChild);
  } else {
    targetElement.appendChild(div);
  }
}
