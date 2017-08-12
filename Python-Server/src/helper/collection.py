import json
import re
import traceback
from flask import jsonify


def read_json(path):
	rows = []
	with open(path, 'rb') as filedata:
		rows = json.load(filedata)
	return rows


def print_json(data):
	print json.dumps(data, indent=4)


def write_json(data, filename):
	with open(filename, 'w') as outfile:
		json.dump(data, outfile, indent=4)


def flatten(arr):
	return [e for sl in arr for e in sl]


def uniq(arr):
	return list(set(arr))


def handle_error(endpoint, e, status_code=500, tb=traceback):
	err_msg = {
		'message': str(e),
		'trace': re.sub('\s+', ' ', tb.format_exc()) if tb is not None else None
	}
	response = jsonify(err_msg)
	response.status_code = status_code
	return response

def get_response(message):
	return json.dumps({'message': message})
