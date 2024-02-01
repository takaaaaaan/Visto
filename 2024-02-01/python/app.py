# app.py

from flask import Flask
from VPN_3_conto import main

app = Flask(__name__)

@app.route('/run-script')
def run_script():
    main()  # スクリプトのメイン関数を呼び出す
    return "Script executed successfully!"

if __name__ == '__main__':
    app.run(debug=True)
