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

    // データを要素に追加
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const query = data[key].query;
        const timestamp = new Date(data[key].timestamp).toLocaleString();
        const element = document.createElement("div");
        element.innerHTML = `<strong>Query:</strong> ${query} <br> <strong>Timestamp:</strong> ${timestamp}`;
        displayElement.appendChild(element);
      }
    }
  }

  // ページ読み込み時にデータを取得
  fetchData();
});
