# coding: utf-8
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, db
import logging
from logging.handlers import RotatingFileHandler
from googleapiclient.discovery import build
import requests
from flask import request
import asyncio
import openai
from gptsearch.totalSummurize import run

# Google APIキーとCustom Search Engine IDを設定
API_KEY = "AIzaSyCk62A_YJQxhPI7QmHt5x7BFkV3EVVLjOc"

# DeepL APIキー
DEEPL_API_KEY = "c5c6b479-4fe6-7991-dba4-8cd5245d3473:fx"

app = Flask(__name__)

# CORS設定
CORS(
    app,
    supports_credentials=True,
    resources={
        r"/*": {
            "origins": [
                "chrome-extension://nfipdalojliiiflljnldpochdhnlfilm",  # 実際の拡張機能のIDに置き換えてください
                "http://localhost:5000",  # ローカルの開発時など、他に許可したいオリジンがあれば追加
            ]
        }
    },
)

# ログ設定
handler = RotatingFileHandler(
    "python/app.log", maxBytes=100000, backupCount=5, encoding="utf-8"
)
# エンコーディングを指定
log_format = logging.Formatter(
    "%(asctime)s - %(levelname)s - %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
)
handler.setFormatter(log_format)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(handler)


# Firebaseの初期化設定
cred = credentials.Certificate("python/key2.json")
# cred = credentials.Certificate("python/firebase-key.json")
firebase_app = firebase_admin.initialize_app(
    cred, {"databaseURL": "https://kpmg-39cf2-default-rtdb.firebaseio.com/"}
)
# FirestoreとRealtime Databaseのクライアントを取得
firestore_db = firestore.client()
realtime_db_ref = db.reference("/")


# DeepL翻訳関数
def translate_text(text, target_language):
    logger.info(f"{target_language}へのテキスト翻訳を開始します")
    try:
        url = "https://api-free.deepl.com/v2/translate"
        payload = {
            "auth_key": DEEPL_API_KEY,
            "text": text,
            "target_lang": target_language,
        }
        response = requests.post(url, data=payload)
        if response.status_code != 200:
            logger.error("APIリクエストでエラーが発生しました")
            return None
        translation = response.json()["translations"][0]["text"]
        logger.info("翻訳が成功しました")
        return translation
    except Exception as e:
        logger.error(f"翻訳中にエラーが発生しました: {e}")
        return None


# Googleカスタム検索結果取得関数
def get_search_results(query, start_index, cse_id):
    logger.info(f"クエリ: {query} の検索結果を取得中です")
    try:
        service = build(
            "customsearch", "v1", developerKey=API_KEY, cache_discovery=False
        )
        result = (
            service.cse().list(q=query, cx=cse_id, num=1, start=start_index).execute()
        )
        logger.info("検索結果の取得が成功しました")
        return result
    except Exception as e:
        logger.error(f"検索中にエラーが発生しました: {e}")
        return None


# Firebaseに結果を保存する関数
def sanitize_keys(data):
    if isinstance(data, dict):
        sanitized_data = {}
        for key, value in data.items():
            safe_key = (
                key.replace("$", "_")
                .replace("#", "_")
                .replace("[", "_")
                .replace("]", "_")
                .replace("/", "_")
                .replace(".", "_")
            )
            sanitized_data[safe_key] = sanitize_keys(value)
        return sanitized_data
    elif isinstance(data, list):
        return [sanitize_keys(item) for item in data]
    else:
        return data


def save_results_to_firebase(data, query, country_code, index="01"):
    logger.info(f"クエリ: {query} の結果をFirebaseに保存中です")
    try:
        sanitized_data = sanitize_keys(data)
        ref = db.reference(f"/searchResults/{index}/{country_code}")
        ref.set({"query": query, "data": sanitized_data})
        logger.info("Firebaseへの保存が成功しました")
    except Exception as e:
        logger.error(f"Firebaseへの保存中にエラーが発生しました: {e}")


# 新しいCSE IDと言語コードをグローバルレベルで追加
CSE_IDS = {
    "CAN": "a564dbd040bc64dc6",
    # "IND": "b69e8f7d115964c49", # 必要に応じてコメントアウトを解除または変更
    "JPN": "004ef88c5b84d4fa7",
    "GBR": "7573868f942014904",
    "USA": "c3ea97b9d04794f5a",
    "KOR": "b428942f354ee4fd3",
    "CHN": "b428942f354ee4fd3",
}

LANGUAGE_CODES = {
    "CAN": "EN",
    # "IND": "HIN", # 必要に応じてコメントアウトを解除または変更
    "JPN": "JA",
    "GBR": "EN",
    "USA": "EN",
    "KOR": "KO",
    "CHN": "ZH",
}


def process_query(data):
    logger.info(f"クエリを処理中: {data['query']}")
    try:
        # Firestoreからcountriesコレクションのデータを取得
        countries_ref = firestore_db.collection("countries")
        docs = countries_ref.stream()

        # 有効な国のデータがFirestoreに存在するかチェックし、なければデフォルト値を設定
        active_countries = {}
        for country_code in CSE_IDS.keys():
            doc = countries_ref.document(country_code).get()
            if not doc.exists:
                # ドキュメントが存在しない場合、デフォルト値を作成
                default_status = (
                    False  # ここでのデフォルトステータスをTrueまたはFalseに設定
                )
                countries_ref.document(country_code).set(
                    {"status": default_status})
                active_countries[country_code] = {"status": default_status}
            else:
                # ドキュメントが存在する場合、そのデータを使用
                active_countries[country_code] = doc.to_dict()

        original_query = data["query"]
        for country_code, country_data in active_countries.items():
            if country_data["status"]:  # 有効な国のみをチェック
                lang = LANGUAGE_CODES[country_code]
                translated_query = translate_text(original_query, lang)
                search_result = get_search_results(
                    translated_query, 1, CSE_IDS[country_code]
                )
                save_results_to_firebase(
                    search_result, translated_query, lang, country_code
                )
        logger.info("クエリの処理が完了しました。")
    except Exception as e:
        logger.error(f"クエリ処理中にエラーが発生しました: {e}")


@app.before_request
def log_request_info():
    logger.info(
        f"{request.remote_addr} - {request.method} {request.path} {request.scheme.upper()}/{request.environ.get('SERVER_PROTOCOL')}"
    )


@app.after_request
def log_response_info(response):
    logger.info(
        f"{request.remote_addr} - {request.method} {request.path} {request.scheme.upper()}/{request.environ.get('SERVER_PROTOCOL')} {response.status}"
    )
    return response


@app.route("/save-query", methods=["POST"])
def save_query():
    logger.info("クエリ保存のリクエストを受信しました")
    data = request.json
    process_query(data)
    return jsonify({"status": "success"})


@app.route('/run-summary', methods=['POST'])
def run_summary():
    # POSTリクエストからデータを取得する場合はここで行う
    try:
        logger.info("run_summary API called")
        result = run()  # 上記のスクリプトの関数を呼び出す
        logger.info("run_summary executed successfully")
        return jsonify({'status': 'success', 'result': result}), 200
    except Exception as e:
        logger.error(f"Error in run_summary: {e}", exc_info=True)
        return jsonify({'status': 'error', 'message': str(e)}), 500


# TODO: implement
@app.route("/api/results", methods=["GET"])
def get_all_active_search_results():
    try:
        # Firestoreからcountriesコレクションの全データを取得
        countries_ref = firestore_db.collection("countries")
        docs = countries_ref.stream()

        # 有効な国のみをフィルタリング
        active_countries = {
            doc.id: doc.to_dict() for doc in docs if doc.to_dict().get("status")
        }

        all_results = {}
        for country_code in active_countries:
            # LANGUAGE_CODES辞書から言語コードを取得。存在しない場合はENをデフォルトとする
            language_code = LANGUAGE_CODES.get(country_code, "EN")

            # Realtime Databaseからデータを取得
            try:
                ref = realtime_db_ref.child(
                    f"searchResults/{country_code}/{language_code}/data/summaryByCountry/summurize"
                )
                data = ref.get()
                if data:
                    all_results[f"{country_code}_{language_code}"] = data
                else:
                    # データが見つからなかった場合、ログに記録
                    logger.warning(
                        f"データが見つかりませんでした: {country_code}_{language_code}"
                    )
                    all_results[f"{country_code}_{language_code}"] = (
                        "データが見つかりませんでした"
                    )
            except Exception as e:
                logger.error(
                    f"Realtime Databaseからのデータ取得中にエラーが発生しました: {e}"
                )
                all_results[f"{country_code}_{language_code}"] = (
                    "データ取得中にエラーが発生しました"
                )

        if all_results:
            return jsonify(all_results), 200
        else:
            return jsonify({"message": "有効な国のデータが見つかりませんでした"}), 404
    except Exception as e:
        logger.error(f"Firestoreからの国のデータ取得中にエラーが発生しました: {e}")
        return jsonify({"error": str(e)}), 500

# async def chat_with_gpt4(message):
#     response = await openai.ChatCompletion.create(
#         model="gpt-4", messages=[{"role": "user", "content": message}]
#     )
#     return response.choices[0].message["content"]

# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.json
#     message = data.get("message", "")
#     logger.info(f"Received chat request with message: {message}")

#     try:
#         response = asyncio.run(chat_with_gpt4(message))
#         logger.info("Successfully received response from GPT-4")
#     except Exception as e:
#         logger.error(f"Error while chatting with GPT-4: {e}")
#         return jsonify({"error": "Failed to chat with GPT-4", "details": str(e)}), 500

#     return jsonify({"response": response})


@app.route("/get-search-results", methods=["GET"])
def get_search_results_endpoint():
    logger.info("検索結果のリクエストを受信しました")
    try:
        # Firestoreからcountriesコレクションのデータを取得して有効な国をフィルタリング
        countries_ref = firestore_db.collection("countries")
        active_countries_docs = countries_ref.where(
            "status", "==", True).stream()
        active_countries = {doc.id: doc.to_dict()
                            for doc in active_countries_docs}

        # 取得したactive_countriesの内容をログに出力
        logger.info(f"有効な国のドキュメント: {active_countries}")

        # Firebase Realtime DatabaseからsearchResultsを取得
        ref = db.reference("/searchResults")
        all_results = ref.get() if ref.get() else {}
        logger.info(f"Realtime Databaseから取得した全検索結果: {all_results}")

        logger.info(
            f"フィルタリング前の国コードと有効な国のマッピング: {active_countries}"
        )
        # 有効な国に対応する検索結果のみをフィルタリング
        filtered_results = {}

        for country_code, language_data in all_results.items():
            logger.info(f"処理中の国コードとデータ: {country_code}, {language_data}")
            if country_code in active_countries:
                for language_code, results in language_data.items():
                    logger.info(
                        f"フィルタリング試行: 国コード {country_code}, 言語コード {language_code}, 結果 {results}"
                    )
                    # ここでfiltered_resultsに結果を追加
                    if country_code not in filtered_results:
                        filtered_results[country_code] = {}
                    filtered_results[country_code][language_code] = results

        logger.info(f"フィルタリング後の結果: {filtered_results}")

        return jsonify(filtered_results), 200
    except Exception as e:
        logger.error(f"検索結果の取得中にエラーが発生しました: {e}")
        return jsonify({"error": "検索結果の取得に失敗しました"}), 500


@app.route("/update_country_status", methods=["POST"])
def update_country_status():
    logger.info("国のステータス更新のリクエストを受信しました")
    data = request.json
    country_name = data["name"]
    status = data["status"]
    try:
        # Firestoreを使用して国のステータスを更新
        doc_ref = firestore_db.collection("countries").document(country_name)
        doc_ref.set({"name": country_name, "status": status})
        logger.info(f"{country_name}のステータス更新が成功しました")
        return jsonify({"success": True}), 200
    except Exception as e:
        logger.error(f"{country_name}のステータス更新中にエラーが発生しました: {e}")
        return jsonify({"error": "ステータス更新に失敗しました"}), 500


if __name__ == "__main__":
    app.run(debug=True)
