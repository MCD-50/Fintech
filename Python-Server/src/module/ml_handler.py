import os
import time
import json


from chatterbot import ChatBot
from textblob import TextBlob


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
				"You can't save money",
				"Looks microsoft is alos doing well",
				"You can find the best nearby god",
				"Ayush is cool",
				"My name is Bot, bot hoon mai hard coded",
				"Mai bot hoon",
				"Hackathon was good",
				"Going to mumbai today",
				"No, This is not a great app. But!!!!",
				"Food as good",
				"Don't use readymade library where you can drag and drop the stuff to make things happens",
				"I'm made using python, node, react native",
				"React native alternative is VueJS",
				"Coolest gitrepo is https://www.github.com/mcd-50 Changing the world"
				"Ok bye",
				"Most overpriced company is Apple"
			])
			# Get a response to an input statement
			answer =  str(chatbot.get_response(text))
			res_json = get_response({'text': answer})
			return res_json
		except Exception as exception:
			return light_error_handle(exception)
