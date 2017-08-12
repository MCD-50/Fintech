
import json
from src.helper.collection import handle_error, get_response


class HelloHandler(object):
	
	@staticmethod
	def show_message():
		try:
			res_json = get_response({'text': 'hello'})
			return res_json
		except Exception as exception:
			return handle_error('/', exception)