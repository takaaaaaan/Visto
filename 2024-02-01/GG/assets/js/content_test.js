var stylesApplied = false; // スタイルが適用されているかどうかを追跡するフラグ

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "toggleStyles") {
    var styleTag = document.querySelector("style.hover-effect-style");
    if (stylesApplied && styleTag) {
      // スタイルが既に適用されている場合は削除
      styleTag.remove();
      var tags = document.querySelectorAll(".hover-effect, .ad-effect");
      tags.forEach(function (tag) {
        tag.classList.remove("hover-effect");
        tag.classList.remove("ad-effect");
      });
    } else {
      // スタイルが適用されていない場合は適用
      var tags_to_target = ["a", "area", "button", "input", "form"];
      var tags = [];
      tags_to_target.forEach(function (tag_name) {
        var found_tags = document.querySelectorAll(tag_name);
        tags = tags.concat(Array.from(found_tags));
      });
      var url_tags = Array.from(
        document.querySelectorAll("[href], [src]")
      ).filter(function (tag) {
        var url = tag.href || tag.src;
        return (
          url &&
          !url.endsWith(".jpg") &&
          !url.endsWith(".png") &&
          !url.endsWith(".gif")
        );
      });
      tags = tags.concat(url_tags);

      // 広告と思われる要素に対するスタイルを追加
      var adTags = Array.from(
        document.querySelectorAll('[class*="ad"], [id*="ad"]')
      ).filter(function (tag) {
        var className = tag.className || "";
        var id = tag.id || "";
        return !(className.includes("head") || id.includes("head")); // 'head'という文字列を含むクラス名またはIDを除外
      });
      adTags.forEach(function (tag) {
        tag.classList.add("ad-effect");
      });

      // adTagsリストにないタグに対するスタイルを追加
      var blueTags = tags.filter((tag) => !adTags.includes(tag));
      blueTags.forEach(function (tag) {
        tag.classList.add("hover-effect");
      });

      // 新しい<style>タグを作成する
      var style_tag = document.createElement("style");
      style_tag.classList.add("hover-effect-style"); // このスタイルタグにクラス名を追加
      style_tag.textContent = `
      .ad-effect:hover {
        outline: 5px solid yellow !important;
        outline-offset: -5px;
        position: relative;  // 追加
        z-index: 1000;       // 追加
      }
      .hover-effect:hover {
        outline: 2px solid blue !important;
        outline-offset: -2px;
        position: relative;  // 追加
        z-index: 100;       // 追加
      }

    `;
      var head_tag = document.head || document.createElement("head");
      head_tag.appendChild(style_tag);
      document.head ||
        document.documentElement.insertBefore(
          head_tag,
          document.documentElement.firstChild
        );
    }
    stylesApplied = !stylesApplied; // 状態を切り替える
  }
});
