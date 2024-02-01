from urllib.parse import quote_plus
import requests
from bs4 import BeautifulSoup


def count_search_results(search_query):
    """指定された単語や文章のGoogle検索結果数を求める"""

    # エンコードされた検索クエリ
    encoded_query = quote_plus(search_query)

    # 検索URLの構築
    search_url = f"https://www.google.com/search?q={encoded_query}"
    headers = {"User-Agent": "Mozilla/5.0"}

    # リクエストの送信
    response = requests.get(search_url, headers=headers)
    response.encoding = response.apparent_encoding
    page_content = BeautifulSoup(response.text, "html.parser")

    # 検索結果数の抽出
    result_stats = page_content.find("div", {"id": "result-stats"})
    if result_stats:
        total_results_text = result_stats.get_text()
        results_num = "".join([num for num in total_results_text if num.isdigit()])
        print(results_num)
    else:
        print("No results found.")


# 使用例
search_term = "Python programming"
count_search_results(search_term)
