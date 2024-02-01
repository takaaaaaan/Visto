# firebase_query.py

import firebase_admin
from firebase_admin import credentials, db

# Firebaseの設定ファイルを指定
cred = credentials.Certificate("./serviceAccountKey.json")

# Firebaseアプリを初期化
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-firebase-database-url.firebaseio.com/'
})

def get_latest_data():
    # データベースのパスを指定
    ref = db.reference('/your/data/path')

    # タイムスタンプで降順に並べ替え、最上位のアイテムを取得
    latest_data = ref.order_by_child('timestamp').limit_to_last(1).get()

    # データが空でない場合、最新のアイテムを返す
    if latest_data:
        return next(iter(latest_data.values()))

    return latest_data
