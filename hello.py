from flask import Flask
from flask_cors import CORS
from flask import request
import json

app = Flask(__name__)
CORS(app)

@app.route('/aaaa', methods=['GET', 'POST'])
def c():
	print(request.data)
	data = json.loads(request.data)
	result = { 'a': 1111 }
	return json.dumps(result)

@app.route('/bbbb', methods=['GET', 'POST'])
def bbbb_request():
	print(request.data)
	data = json.loads(request.data)
	result = { 'b': 2222 }
	return json.dumps(result)

if __name__ == '__main__':
    app.run()