![vsito](../img/Visto2.png)
# Google 拡張機能用多言語検索＆翻訳API
![vsito](../img/kpmg_test.gif)

[English](../README.md) | [한국어](./README.ko-kr.md)

このAPIはGoogleの拡張機能を介して、多言語での検索および翻訳機能を提供します。DeepL APIを利用したテキストの翻訳、Google Custom Search Engineを活用した検索結果の取得、Firebase FirestoreおよびRealtime Databaseでのデータ管理機能を組み合わせて提供します。

## 主要機能

- **テキスト翻訳**: DeepL APIを使用して指定されたテキストを目的の言語に翻訳します。
- **検索結果の取得**: Google Custom Search Engineを利用して、翻訳されたクエリに基づいた検索結果を取得します。
- **Firebaseへの結果保存**: 取得した検索結果をFirebase FirestoreおよびRealtime Databaseに保存します。
- **CORS設定**: Flask-CORSを使用して特定のオリジンからのアクセスを許可します。
- **ログ管理**: アプリケーションの動作を追跡し、問題診断に役立つようログを設定します。

## 技術スタック

- **Flask**: サーバーサイドのアプリケーションフレームワーク。
- **Firebase Admin SDK**: Firebaseサービス（Firestore、Realtime Database）へのアクセスを提供します。
- **Google API Client Library**: Google Custom Search Engineとの通信を可能にします。
- **requests**: HTTPリクエストを送信するために使用されます。
- **Flask-CORS**: CORS（クロスオリジンリソース共有）設定を管理します。

## セットアップ方法

1. 必要なライブラリのインストール: `pip install flask flask-cors firebase-admin google-api-python-client requests`
2. Firebaseプロジェクトの設定とサービスアカウントキーの取得。
3. `.env`ファイルまたは環境変数にGoogle APIキー、DeepL APIキー、Firebaseサービスアカウントキーファイルのパスを設定します。
4. アプリケーションの起動: `python app.py`

## インストール方法

このプロジェクトを使用するためには、プロジェクトのルートディレクトリで次のコマンドを実行し、`requirements.txt`に指定されているすべての依存関係をインストールする必要があります。

```bash
pip install -r requirements.txt
```

```
firebase_admin==6.2.0
Flask==3.0.2
Flask_Cors==4.0.0
google_api_python_client==2.105.0
langchain_community==0.0.20
openai==0.27.10
Requests==2.31.0
```
## APIエンドポイント

- `/save-query`: POSTリクエストで検索クエリを受け取り、処理後にFirebaseに保存します。
- `/run-summary`: POSTリクエストで指定されたテキストの要約を実行します。
- `/get-search-results`: GETリクエストで保存された検索結果を取得します。
- `/update_country_status`: POSTリクエストで特定の国のステータスを更新します。

## プロジェクトのUI

このセクションでは、拡張機能のユーザーインターフェイスについて

説明します。拡張機能には、ユーザーが様々な国を選択して検索結果をフィルタリングできるトグルスイッチが含まれています。

### 国選択トグル

ユーザーは以下の画像に示されているように、各国の隣にあるトグルスイッチを使用して有効化または無効化することができます。有効化された国については、APIがその国の検索結果を取得して保存します。

![国選択トグル](../img/popup.png)

### 検索結果インターフェース

検索結果インターフェースでは、ユーザーが検索クエリを入力し、APIを通じて返された結果を表示します。ユーザーは検索結果をクリックしてより詳しい情報を得ることができます。

![検索結果インターフェース](../img/body.png)

## お問い合わせ

バグ報告や機能要望は、GitHubのIssuesを通じて受け付けています。

## プロジェクト構造

プロジェクトのフォルダやファイルの構造を示すセクションを追加することができます。以下はその例です。

```
Visto
├─ LICENSE
├─ plugin
│  ├─ assets
│  │  ├─ css
│  │  │  ├─ base.css
│  │  │  ├─ embedded-style.css
│  │  │  ├─ popup-style.css
│  │  │  └─ styles.css
│  │  ├─ img
│  │  │  ├─ embedded
│  │  │  │  ├─ 1.svg
│  │  │  │  ├─ 2.svg
│  │  │  │  ├─ 3.svg
│  │  │  │  ├─ image.png
│  │  │  │  └─ V.svg
│  │  │  ├─ main-logo
│  │  │  │  ├─ V.png
│  │  │  │  ├─ V3.png
│  │  │  │  └─ V3.svg
│  │  │  └─ popup
│  │  │     ├─ canada.svg
│  │  │     ├─ check.svg
│  │  │     ├─ china.svg
│  │  │     ├─ india.svg
│  │  │     ├─ Japan.svg
│  │  │     ├─ korea.svg
│  │  │     ├─ line.svg
│  │  │     ├─ uk.svg
│  │  │     ├─ US.svg
│  │  │     ├─ V.svg
│  │  │     └─ x.svg
│  │  └─ js
│  │     ├─ background.js
│  │     ├─ content.js
│  │     ├─ embedded-DB.js
│  │     ├─ embedded-main.js
│  │     └─ popup.js
│  ├─ embedded.html
│  ├─ home.html
│  ├─ manifest.json
│  ├─ popup.html
│  └─ README.md
├─ python
│  ├─ app.log
│  ├─ back-app.log
│  ├─ backup-app.py
│  ├─ data
│  │  ├─ all-data.json
│  │  └─ kpmg-39cf2-default-rtdb-export.json
│  ├─ gpt4_chat.py
│  ├─ gptsearch
│  │  ├─ db_control.py
│  │  ├─ summurize.py
│  │  ├─ totalSummurize.py
│  │  └─ __pycache__
│  │     ├─ db_control.cpython-310.pyc
│  │     ├─ link_search.cpython-310.pyc
│  │     ├─ read_db.cpython-310.pyc
│  │     ├─ summurize.cpython-310.pyc
│  │     ├─ summurize.cpython-311.pyc
│  │     ├─ totalSummurize.cpython-311.pyc
│  │     └─ update_db.cpython-310.pyc
│  ├─ gptsearch3
│  │  ├─ db_control.py
│  │  ├─ summurize.py
│  │  ├─ total_sum.py
│  │  └─ __pycache__
│  │     ├─ db_control.cpython-310.pyc
│  │     ├─ link_search.cpython-310.pyc
│  │     ├─ read_db.cpython-310.pyc
│  │     ├─ summurize.cpython-310.pyc
│  │     ├─ summurize.cpython-311.pyc
│  │     └─ update_db.cpython-310.pyc
│  ├─ key2.json
│  └─ __pycache__
│     ├─ gpt4_chat.cpython-310.pyc
│     └─ gpt4_chat.cpython-311.pyc
└─ README.md

```


## ライセンス

このプロジェクトは特定のライセンスのもとで公開されています。ライセンスの詳細については、リポジトリ内のLICENSEファイルを参照してください。