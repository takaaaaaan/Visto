const button = document.getElementById('applyStyles');
const icon = document.getElementById('icon');
let isOn = false;  // 初期状態はOFF

button.addEventListener('click', function () {
    isOn = !isOn;  // 状態を切り替える
    if (isOn) {
        icon.src = './assets/img/icon-on.png';  // ONのアイコンに切り替える
    } else {
        icon.src = './assets/img/icon-off.png';  // OFFのアイコンに切り替える
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleStyles', state: isOn });
    });
});