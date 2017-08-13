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
				trainer='chatterbot.trainers.ChatterBotCorpusTrainer'
			)

			# Train based on the english corpus
			chatbot.train("chatterbot.corpus.english")

			# Train based on english greetings corpus
			chatbot.train("chatterbot.corpus.english.greetings")

			# Train based on the english conversations corpus
			chatbot.train("chatterbot.corpus.english.conversations")


			# Get a response to an input statement
			answer = chatbot.get_response(text)
			print answer
			res_json = get_response({'text': answer})
			return res_json
		except Exception as exception:
			return light_error_handle(exception)
