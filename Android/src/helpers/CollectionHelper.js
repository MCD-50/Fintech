//import from app
import { CARROT, PETER_RIVER, WISTERIA, ALIZARIN, TURQUOISE, MIDNIGHT_BLUE } from '../constants/AppColor.js';
import { COMING_ID, COMING_NAME } from '../constants/AppConstant';
import { resolveRequest } from './InternetHelper.js';

export const getTextColor = (str) => {
	if (!str) {
		return WISTERIA;
	}
	const array = [CARROT, PETER_RIVER, WISTERIA, ALIZARIN, TURQUOISE, MIDNIGHT_BLUE];
	return array[str.length % array.length];
}

export const capitalize = (str) => {
	if (str) {
		let pieces = str.split(/_| /);
		for (let i = 0; i < pieces.length; i++) {
			let j = pieces[i].charAt(0).toUpperCase();
			pieces[i] = j + pieces[i].substr(1);
		}
		return pieces.join(" ").trim();
	}
	return "Unknown";
}

export const loadAsync = (url, data) => {
	return resolveRequest(url, data)
		.then((res) => {
			if (res && res.message && res.message.length > 0) {
				return Promise.resolve(res.message)
			} else {
				return Promise.reject();
			}
		}).catch((rej) => {
			return Promise.reject(res);
		})
}

export const convertToAirchatObject = (communications) => {
	return communications
		.filter((communication) => communication != null || communication != undefined)
		.map((communication) => {
			return {
				_id: Math.round(Math.random() * 1000000),
				text: communication.content.trim() || "",
				createdAt: communication.creation.split('.')[0],
				user: {
					_id: communication.sender,
					name: communication.sender,
				},
				communication: communication,
				attachments: []
			}
		});
}


export const createChatItem = (message, link = []) => {
	//Date.UTC(2016, 7, 30, 17, 20, 0)
	return [
		{
			_id: Math.round(Math.random() * 1000000), 
			text: message.text, 
			createdAt: new Date(),
			user: {
				_id: COMING_ID,
				name: COMING_NAME,
			}, alert: false,
			communication: null,
			attachments: link,
		},
	];
}

