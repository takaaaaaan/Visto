from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)

# CORSを設定し、特定のChrome拡張機能からのリクエストを許可する
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": [
            "chrome-extension://pgfahnbjbccfpnfkmlheppmoojddbgbd",  # 実際の拡張機能のIDに置き換えてください
            "http://localhost:3000"  # ローカルの開発時など、他に許可したいオリジンがあれば追加
        ]
    }
})

# Firebaseの設定
cred = credentials.Certificate("python/kpmg-39cf2-firebase-adminsdk-qozw8-6553b90bbb.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://kpmg-39cf2-default-rtdb.firebaseio.com/'
})

# 検索クエリを保存するエンドポイント
@app.route('/save-query', methods=['POST'])
def save_query():
    data = request.json
    ref = db.reference('/searchQueries')
    ref.push({
        'query': data['query'],
        'timestamp': data['timestamp']
    })
    return jsonify({'status': 'success'})

# 保存された検索クエリを取得するエンドポイント
@app.route('/get-queries', methods=['GET'])
def get_queries():
    ref = db.reference('/searchQueries')
    queries = ref.get()
    return jsonify(queries)

if __name__ == '__main__':
    app.run(debug=True)
