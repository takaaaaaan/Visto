# coding: utf-8
from datetime import datetime, timedelta, timezone
import pandas as pd
from googleapiclient.discovery import build
import os
import requests
from firebase_query import get_latest_data

pd.set_option("display.max_colwidth", 1000)

# Google APIキーとCustom Search Engine IDを設定
API_KEY = "AIzaSyCk62A_YJQxhPI7QmHt5x7BFkV3EVVLjOc"
KR_CSE_ID = "b428942f354ee4fd3"
JP_CSE_ID = "004ef88c5b84d4fa7"
US_CSE_ID = "c3ea97b9d04794f5a"

# DeepL APIキー
DEEPL_API_KEY = "c5c6b479-4fe6-7991-dba4-8cd5245d3473:fx"


def translate_text(text, target_language):
    url = "https://api-free.deepl.com/v2/translate"  # DeepLの無料APIエンドポイントに変更
    payload = {"auth_key": DEEPL_API_KEY, "text": text, "target_lang": target_language}
    response = requests.post(url, data=payload)

    # レスポンスの確認
    if response.status_code != 200:
        print("Error in the API request")
        print("Status code:", response.status_code)
        print("Response:", response.text)
        return None

    return response.json()["translations"][0]["text"]


def get_search_results(query, start_index, cse_id):
    service = build("customsearch", "v1", cache_discovery=False, developerKey=API_KEY)
    result = service.cse().list(q=query, cx=cse_id, num=10, start=start_index).execute()
    return result


def save_results_to_csv(data, query, country_code):
    # ExecDate
    timezone_jst = timezone(timedelta(hours=+9), "JST")
    now = datetime.now(timezone_jst)
    dt_csv = now.strftime("%Y%m%d%H%M")

    items = data["items"]
    result = []
    for i, item in enumerate(items):
        title = item.get("title", "")
        link = item.get("link", "")
        snippet = item.get("snippet", "")
        result.append("\t".join([str(i + 1), title, link, snippet]))

    df_search_results = pd.DataFrame(result)[0].str.split("\t", expand=True)
    df_search_results.columns = ["rank", "title", "url", "snippet"]

    output_dir = "csv"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_csv = f"{output_dir}/{query}_{country_code}_{dt_csv}.csv"
    df_search_results.to_csv(
        output_csv, sep=",", index=False, header=True, encoding="utf-8"
    )


def main():
    # Firebaseから最新のデータを取得
    latest_data = get_latest_data()

    # このlatest_dataをoriginal_queryなどに使用
    original_query = latest_data
    target_languages = {"KR": "KO", "JP": "JA", "US": "EN"}  # 翻訳先言語コード

    for country_code, lang_code in target_languages.items():
        cse_id = globals()[f"{country_code}_CSE_ID"]
        translated_query = translate_text(original_query, lang_code)
        data = get_search_results(translated_query, 1, cse_id)
        save_results_to_csv(data, translated_query, country_code)


if __name__ == "__main__":
    main()
