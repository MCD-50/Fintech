import os
import time
import json


from chatterbot import ChatBot
from textblob import TextBlob
import htmllib
import difflib
import pandas as pd
import numpy as np
import sklearn
from bs4 import BeautifulSoup


from src.helper.collection import handle_error, light_error_handle, get_response
class MLHandler(object):

	@staticmethod
	def process(text):
		try:
			text_blob_text = TextBlob(text)
			text_blob_text.correct()


			chatbot = ChatBot(
				'MCD-50',
				trainer='chatterbot.trainers.ListTrainer'
			)

			chatbot.train([
				"Ya, Hi"
				"Hi, can I help you?",
				"If you want something better got for google",
				"How are you doing",
				"My name is kick bot",
				"How are you doing",
				"You want me to find things nearby you?"
				"Mumbai is great",
				"Buy a house",
				"Richest thing u can buy is a 32gb laptop",
				"You can't save money"
			])
			# Get a response to an input statement
			answer =  str(chatbot.get_response(text))
			res_json = get_response({'text': answer})
			return res_json
		except Exception as exception:
			return light_error_handle(exception)
