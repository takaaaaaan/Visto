document.querySelector('.prev-btn').addEventListener('click', function () {
  let container = document.querySelector('.mini-box-container');
  let links = container.querySelectorAll('.link');
  let containerScrollPosition = container.scrollLeft;
  let targetScrollPosition = 0;

  // 現在のスクロール位置より左にある最後の.link要素を見つける
  for (let i = links.length - 1; i >= 0; i--) {
    let link = links[i];
    if (link.offsetLeft < containerScrollPosition) {
      targetScrollPosition = link.offsetLeft - container.offsetLeft; // コンテナ内での相対位置を計算
      break;
    }
  }

  // 計算した位置までスクロールする
  container.scrollTo({
    left: targetScrollPosition,
    behavior: 'smooth'
  });
});

document.querySelector('.next-btn').addEventListener('click', function () {
  let container = document.querySelector('.mini-box-container');
  let links = container.querySelectorAll('.link');
  let containerScrollPosition = container.scrollLeft + container.offsetWidth;
  let targetScrollPosition = container.scrollWidth; // 最後までスクロールする場合の初期値

  // 現在のビューポートより右にある最初の.link要素を見つける
  for (let link of links) {
    if (link.offsetLeft + link.offsetWidth > containerScrollPosition) {
      targetScrollPosition = link.offsetLeft - container.offsetLeft; // コンテナ内での相対位置を計算
      break;
    }
  }

  // 計算した位置までスクロールする
  container.scrollTo({
    left: targetScrollPosition,
    behavior: 'smooth'
  });
});