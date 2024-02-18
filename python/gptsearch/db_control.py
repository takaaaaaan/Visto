import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

def initialize_db():
    cred = credentials.Certificate("python/key.json")
    firebase_admin.initialize_app(cred,{
        'databaseURL' : 'https://your-db.com/'
    })

def read_db(firebase_path):
    '''
    cred = credentials.Certificate("python-DB\serviceAccountKey.json")
    firebase_admin.initialize_app(cred,{
        'databaseURL' : 'https://your-db.com/'
    })
    '''
    dir = db.reference(firebase_path)    # db에 저장되어있는 경로
    return dir

def update_db(firebase_path, summurized_text):
    '''
    if not firebase_admin._apps:
        cred = credentials.Certificate('python-DB\serviceAccountKey.json')
        firebase_admin.initialize_app(cred, {
            'databaseURL' : 'https://your-db.com/'
        })
    '''
    # 데이터 저장 또는 업데이트할 경로
    #ref = db.reference('searchResults/KOR/KO/data/items/0')
    ref = db.reference(firebase_path)

    # 'summurize' 필드에 저장 또는 업데이트할 데이터
    new_data = {'summurize': summurized_text}

    # 데이터베이스에 데이터 저장 또는 업데이트
    ref.update(new_data)

    print('Data has been updated successfully.')