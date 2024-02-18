![vsito](./img/Visto2.png)
# Multilingual Search and Translation API for Google Extension
![vsito-test](./img/kpmg_test.gif)

[한국어](./docs/README.ko-kr.md) | [日本語](./docs/README.ja-jp.md)

This API provides multilingual search and translation features through a Google Extension. It combines text translation using the DeepL API, retrieval of search results using Google Custom Search Engine, and data management with Firebase Firestore and Realtime Database.

## Key Features

- **Text Translation**: Translates specified text into the target language using the DeepL API.
- **Retrieval of Search Results**: Retrieves search results based on translated queries using Google Custom Search Engine.
- **Saving Results to Firebase**: Saves the retrieved search results to Firebase Firestore and Realtime Database.
- **CORS Configuration**: Uses Flask-CORS to allow access from specific origins.
- **Log Management**: Sets up logging to track the operation of the application and assist in diagnosing issues.

## Technology Stack

- **Flask**: A server-side application framework.
- **Firebase Admin SDK**: Provides access to Firebase services (Firestore, Realtime Database).
- **Google API Client Library**: Enables communication with the Google Custom Search Engine.
- **requests**: Used to send HTTP requests.
- **Flask-CORS**: Manages Cross-Origin Resource Sharing (CORS) settings.

## Setup Instructions

1. Install the required libraries: `pip install flask flask-cors firebase-admin google-api-python-client requests`
2. Set up the Firebase project and obtain the service account key.
3. Configure the Google API key, DeepL API key, and the path to the Firebase service account key file in a `.env` file or as environment variables.
4. Start the application: `python app.py`

## Installation

To install the packages and libraries needed for this project, execute the following command in the root directory of the project to install all dependencies listed in `requirements.txt`.

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
## API Endpoints

- `/save-query`: Receives and processes search queries via POST requests and saves them to Firebase.
- `/run-summary`: Executes a summary of the specified text via POST requests.
- `/get-search-results`: Retrieves saved search results via GET requests.
- `/update_country_status`: Updates the status of a specific country via POST requests.

## Project UI

This section describes the user interface of the extension. The extension includes toggle switches that allow users to select various countries to filter the search results.

### Country Selection Toggle

Users can activate or deactivate each country using the toggle switch next to the country as shown in the image below. Activated countries will have their search results retrieved and stored by the API.


### Search Results Interface

The search results interface allows users to enter a search query and view the results returned by the API. Users can click on the search results to obtain more information.


## Inquiries

Please report bugs or request features through GitHub Issues.

## Project Tree

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