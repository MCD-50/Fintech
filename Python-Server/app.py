import os
import time
import json

from flask import Flask, jsonify, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS
from config import Config
from src.module.hello_handler import HelloHandler
from src.module.ml_handler import MLHandler


app = Flask(__name__)
CORS(app)
app.config.update(DEBUG=False)

@app.route('/', methods=['GET', 'POST'])
def hello():
	return HelloHandler.show_message()

@app.route('/process', methods=['GET', 'POST'])
def process():
	data = json.loads(request.data)
	return MLHandler.process(data['text'])

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=Config.PORT)
