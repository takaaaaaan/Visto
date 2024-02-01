document.addEventListener("DOMContentLoaded", function () {
  // 適切なセレクタを使用して要素を選択
  const targetElement = document.querySelector("#main #rcnt .GyAeWb");

  if (targetElement) {
    // 画像を作成して追加
    const imageElement = document.createElement("img");
    imageElement.src = "img.png"; // 適切なパスに変更してください
    imageElement.alt = "サンプル画像";
    imageElement.style.width = "100px";
    imageElement.style.height = "100px";
    targetElement.appendChild(imageElement);

    // ボタンを作成して追加
    const button = document.createElement("button");
    button.textContent = "クリック";
    button.addEventListener("click", function () {
      console.log("ボタンがクリックされました！");
      // ここにクリック時の動作を記述
    });
    targetElement.appendChild(button);

    // ポップアップにログを送信
    chrome.runtime.sendMessage({
      type: "log",
      message: "要素が見つかりました",
    });
  } else {
    console.error("指定された要素が見つかりません。");
  }
});
// DOMが読み込まれた後に実行される関数を設定
document.addEventListener("DOMContentLoaded", function () {
  // サイドバーを作成
  var sidebar = document.createElement("div");
  sidebar.id = "my-custom-sidebar";
  sidebar.style.position = "fixed";
  sidebar.style.left = "0";
  sidebar.style.top = "0";
  sidebar.style.width = "200px"; // サイドバーの幅
  sidebar.style.height = "100%";
  sidebar.style.background = "#f9f9f9";
  sidebar.style.boxShadow = "2px 0 5px rgba(0,0,0,0.2)";
  sidebar.style.zIndex = "1000";
  sidebar.style.overflowY = "auto";

  // サイドバーに追加する内容（例：見出しと段落）
  var sidebarContent = `
    <h2>My Sidebar</h2>
    <p>This is a custom sidebar.</p>
    <button id="sidebar-button">Click Me</button>
  `;

  sidebar.innerHTML = sidebarContent;
  document.body.appendChild(sidebar);

  // ボタンにイベントリスナーを追加（例：クリック時のアラート表示）
  document.getElementById("sidebar-button").addEventListener("click", function() {
    alert("Button was clicked!");
  });
});
