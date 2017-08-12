import os
import time

from flask import Flask, jsonify, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS

from config import Config
from src.module.hello_handler import HelloHandler

app = Flask(__name__)
CORS(app)
app.config.update(DEBUG=False)

@app.route('/')
def hello():
	return HelloHandler.show_message()

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=Config.PORT)
