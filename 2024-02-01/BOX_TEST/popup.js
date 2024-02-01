document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === "log") {
      const logElement = document.getElementById("log");
      logElement.textContent = request.message;
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // ボタン要素を取得
  var actionButton = document.getElementById("actionButton");

  // ボタンのクリックイベントリスナーを設定
  actionButton.addEventListener("click", function () {
    // ここにボタンがクリックされたときの動作を記述
    console.log("ボタンがクリックされました");

    // 例: ログエリアにテキストを追加
    var logElement = document.getElementById("log");
    logElement.textContent += "ボタンがクリックされました\n";
  });
});
