document.addEventListener("DOMContentLoaded", function () {
  var jsonData = [
    { name: "USA", image: "assets/img/popup/US.svg" },
    { name: "CHN", image: "assets/img/popup/China.svg" },
    { name: "KOR", image: "assets/img/popup/korea.svg" },
    { name: "CAN", image: "assets/img/popup/canada.svg" },
    { name: "IND", image: "assets/img/popup/india.svg" },
    { name: "GBR", image: "assets/img/popup/uk.svg" },
    { name: "JPN", image: "assets/img/popup/Japan.svg" },
  ];
  var mainElement = document.getElementById("country-list");
  createCountryList(jsonData, mainElement);

  jsonData.forEach(function (country) {
    chrome.storage.local.get([country.name], function (result) {
      updateCountryStatus(country.name, result[country.name]);
    });
  });
});

function createCountryList(countries, mainElement) {
  countries.forEach(function (country) {
    var colDiv = document.createElement("div");
    colDiv.className = "col-offset-1";

    var overlapGroupDiv = document.createElement("div");
    overlapGroupDiv.className = "overlap-group";

    var imgElement = document.createElement("img");
    imgElement.className = "img";
    imgElement.src = country.image;

    var textWrapperDiv = document.createElement("div");
    textWrapperDiv.className = "text-wrapper";
    textWrapperDiv.textContent = country.name;

    var labelElement = document.createElement("label");
    labelElement.className = "switch";

    var inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = country.name + "-checkbox";

    // このイベントリスナーで必要な処理を追加
    inputElement.addEventListener("change", function () {
      var checkedState = {
        type: "UPDATE_COUNTRY_STATUS", // メッセージのタイプを区別するため
        country: country.name,
        status: this.checked,
      };

      // background.jsにメッセージを送信
      chrome.runtime.sendMessage(checkedState, function (response) {
        console.log("Response from background:", response);
      });

      // ここでローカルストレージに保存する処理も含めることができます
      chrome.storage.local.set({ [country.name]: this.checked });
    });

    var spanElement = document.createElement("span");
    spanElement.className = "slider round";

    labelElement.appendChild(inputElement);
    labelElement.appendChild(spanElement);

    overlapGroupDiv.appendChild(imgElement);
    overlapGroupDiv.appendChild(textWrapperDiv);
    overlapGroupDiv.appendChild(labelElement);

    colDiv.appendChild(overlapGroupDiv);

    mainElement.appendChild(colDiv);
  });
}

function updateCountryStatus(name, checked) {
  var checkbox = document.getElementById(name + "-checkbox");
  if (checkbox) {
    checkbox.checked = !!checked;
  }
}
