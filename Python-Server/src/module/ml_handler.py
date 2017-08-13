import os
import time
import json

from textblob import TextBlob
import htmllib
import difflib
import pandas as pd
import numpy as np
import sklearn
from bs4 import BeautifulSoup


from src.helper.collection import handle_error, light_error_handle, get_response
from src.helper.constant import ANSWER, QUESTION, TAG

class MLHandler(object):

	@staticmethod
	def process(text):

		try:
			text_blob_text = TextBlob(text)
			text_blob_text.correct()

			#print text_blob_text.polarity, text_blob_text.subjectivity

			question_path = os.path.join(os.getcwd(), 'questions.csv')
			answer_path = os.path.join(os.getcwd(), 'answers.csv')
			tag_path = os.path.join(os.getcwd(), 'tags.csv')
			
			#map correct question and get its answer
			q_dataset = pd.read_csv(question_path)
			q_dataset = q_dataset[QUESTION]

			title_array = np.array(q_dataset['Title'])
			id_array = np.array(q_dataset['Id'])
			
			answer = ''

			result_array = difflib.get_close_matches(str(text_blob_text), list(title_array), 10, 0.5)
			print result_array
			if len(result_array) > 0:
				#getting index
				a_dataset = pd.read_csv(answer_path)
				a_dataset = a_dataset[ANSWER]
				body_array = np.array(a_dataset['Body'])
				parent_id_array = np.array(a_dataset['ParentId'])

				for _item in result_array:
					#print _item
					_index = np.nonzero(title_array == _item)[0][0]
					#print _index
					_id = id_array[_index]
					#print _id
					if _id is not None:
						__index = np.nonzero(parent_id_array == _id)[0][0]
						#print __index
						if __index is not None:
							__body = body_array[__index]
							#print __body 
							answer = answer + 'Question:::::\n\n' + str(_item) + '\n------\n' + 'Answer::::\n' + str(__body)
			
			if answer is not None and answer is not '':
				soup = BeautifulSoup(answer, 'lxml')
				answer = soup.get_text()
				answer = 'Results\n\n\n' + answer
			else:
				answer = "Didn't found anything. Try something else."
			#print result_array
			#print q_dataset.head(2)

			#print q_dataset.head(5)
			#print '888888888888888888888888'
			#print q_dataset.describe()
			#print q_dataset.groupby('author').size()

			res_json = get_response({'text': answer})
			return res_json
		except Exception as exception:
			return light_error_handle(exception)
