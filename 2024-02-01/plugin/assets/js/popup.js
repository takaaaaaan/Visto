// popup.js
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get('searchQuery', function (data) {
    if (data.searchQuery) {
      const displayElement = document.getElementById('queryDisplay');
      displayElement.textContent = data.searchQuery;
    }
  });
});


// Firebaseの設定
var firebaseConfig = {
  apiKey: "AIzaSyCk62A_YJQxhPI7QmHt5x7BFkV3EVVLjOc",
  authDomain: "kpmg-39cf2.firebaseapp.com",
  databaseURL: "https://kpmg-39cf2-default-rtdb.firebaseio.com",
  projectId: "kpmg-39cf2",
  storageBucket: "kpmg-39cf2.appspot.com",
  messagingSenderId: "908621565003",
  appId: "1:908621565003:web:9160de8debf11716a1d1ce",
  measurementId: "G-Y7B6GEB0LM"
};

// Firebaseの初期化
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firestoreのインスタンスを取得
var db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
  var jsonData = [
    { "name": "US", "image": "assets/img/popup/US.svg" },
    { "name": "Canada", "image": "assets/img/popup/canada.svg" },
    { "name": "India", "image": "assets/img/popup/india.svg" },
    { "name": "UK", "image": "assets/img/popup/uk.svg" },
    { "name": "Japan", "image": "assets/img/popup/Japan.svg" }
  ];

  var mainElement = document.getElementById('country-list');
  createCountryList(jsonData, mainElement);

  jsonData.forEach(function (country) {
    db.collection("countries").doc(country.name).onSnapshot(function (doc) {
      if (doc.exists) {
        var checked = doc.data().checked;
        updateCountryStatus(country.name, checked);
      }
    });
  });
});

function createCountryList(countries, mainElement) {
  countries.forEach(function (country) {
    var colDiv = document.createElement('div');
    colDiv.className = 'col-offset-1';

    var overlapGroupDiv = document.createElement('div');
    overlapGroupDiv.className = 'overlap-group';

    var imgElement = document.createElement('img');
    imgElement.className = 'img';
    imgElement.src = country.image;

    var textWrapperDiv = document.createElement('div');
    textWrapperDiv.className = 'text-wrapper';
    textWrapperDiv.textContent = country.name;

    var labelElement = document.createElement('label');
    labelElement.className = 'switch';

    var inputElement = document.createElement('input');
    inputElement.type = 'checkbox';
    inputElement.id = country.name + '-checkbox';

    // チェックボックスの変更を検知し、Firestoreに保存
    inputElement.addEventListener('change', function () {
      db.collection("countries").doc(country.name).set({
        name: country.name,
        checked: this.checked
      });
    });

    var spanElement = document.createElement('span');
    spanElement.className = 'slider round';

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
  var checkbox = document.getElementById(name + '-checkbox');
  if (checkbox) {
    checkbox.checked = checked;
  }
}