document.addEventListener("DOMContentLoaded", function () {
  // バックエンドサーバーからデータを取得する関数
  function fetchData() {
    fetch("http://localhost:5000/get-queries")
      .then((response) => response.json())
      .then((data) => {
        displayData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        document.getElementById("dataDisplay").innerHTML =
          "Error loading data.";
      });
  }

  // データを HTML に表示する関数
  function displayData(data) {
    const displayElement = document.getElementById("dataDisplay");
    displayElement.innerHTML = ""; // 既存の内容をクリア

    // 最新のデータのみを取得（データがタイムスタンプ順にソートされている場合）
    // const latestData = data[0];

    // もしデータがタイムスタンプ順にソートされていない場合は、以下のコードを使用
    const latestData = Object.values(data).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    )[0];

    // 最新のデータを要素に追加
    if (latestData) {
      const query = latestData.query;
      const timestamp = new Date(latestData.timestamp).toLocaleString();
      const element = document.createElement("div");
      element.innerHTML = `${query}`;
      // <br> <strong>Timestamp:</strong> ${timestamp}
      displayElement.appendChild(element);
    }
  }

  // ページ読み込み時にデータを取得
  fetchData();
});
