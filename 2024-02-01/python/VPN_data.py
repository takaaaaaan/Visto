# MjjYud
# AIzaSyCk62A_YJQxhPI7QmHt5x7BFkV3EVVLjOc
# <script async src="https://cse.google.com/cse.js?cx=b428942f354ee4fd3">
# </script>
# <div class="gcse-search"></div>
#!/usr/bin/env python
# coding: utf-8
from datetime import datetime, timedelta, timezone
import pandas as pd
from googleapiclient.discovery import build
import os

pd.set_option("display.max_colwidth", 1000)

# Google APIキーとCustom Search Engine IDを直接コードに記載
API_KEY = "AIzaSyCk62A_YJQxhPI7QmHt5x7BFkV3EVVLjOc"
KR_CSE_ID = "b428942f354ee4fd3"
JP_CSE_ID = "004ef88c5b84d4fa7"
US_CSE_ID = "c3ea97b9d04794f5a"
def get_search_results(query, start_index, num_results=10):
    # Google Custom Search API
    service = build("customsearch", "v1", cache_discovery=False, developerKey=API_KEY)
    # CSEの検索結果を取得（最大num_results件）
    result = (
        service.cse()
        .list(q=query, cx=CSE_ID, num=num_results, start=start_index)
        .execute()
    )
    # 検索結果(JSON形式)
    return result


def main():
    query = "いちご農家 HP"

    # ExecDate
    timezone_jst = timezone(timedelta(hours=+9), "JST")
    now = datetime.now(timezone_jst)
    dt_csv = now.strftime("%Y%m%d%H%M")  # 日時を文字列に変換

    # Google検索 - Custom Search API
    num_items_to_fetch = 5  # 抽出したいデータの数
    data = get_search_results(query, 1, num_items_to_fetch)
    total_results = int(data["searchInformation"]["totalResults"])
    print("total_results", total_results)

    # Google検索結果から任意の項目抽出 & rank付与
    items = data["items"]

    result = []
    num_items = len(items) if len(items) < 10 else 10
    for i in range(num_items):
        title = items[i]["title"] if "title" in items[i] else ""
        link = items[i]["link"] if "link" in items[i] else ""
        snippet = items[i]["snippet"] if "snippet" in items[i] else ""
        result.append("\t".join([str(i + 1), title, link, snippet]))

    # List->DataFrame
    df_search_results = pd.DataFrame(result)[0].str.split("\t", expand=True)
    df_search_results.columns = ["rank", "title", "url", "snippet"]

    # CSV出力用ディレクトリの確認・作成
    output_dir = "csv"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # CSV出力
    output_csv = f"{output_dir}/{query}_{dt_csv}.csv"
    df_search_results.to_csv(
        output_csv, sep=",", index=False, header=True, encoding="utf-8"
    )
    pd.read_csv(output_csv, index_col=0)


if __name__ == "__main__":
    main()
