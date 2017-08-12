//import from system
import React, { Component, PropTypes } from 'react';
import { View, BackAndroid } from 'react-native';
var format = require('string-format')


//import from app
import { Toolbar } from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import {
	SEND_MESSAGE, GET_MESSAGE, ROOM_NAME,
	GOING_ID, GOING_NAME
} from '../../constants/AppConstant.js';

import { createChatItem } from '../../helpers/CollectionHelper';

import { style } from '../../constants/AppStyle.js';
import { AirChatUI } from 'react-native-air-chat';
import AlertHelper from '../../helpers/AlertHelper.js';
import Send from '../components/Send.js';
import Container from '../../../Container';
import SocketHelper from '../../helpers/SocketHelper.js';

//socket-io fix
window.navigator.userAgent = "react-native"

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};


const menuItems = ['About'];

class ChatPage extends Component {
	constructor(params) {
		super(params);
		this.socket = null;
		this.state = {
			messages: []
		};

		this.renderSend = this.renderSend.bind(this);
		this.onSend = this.onSend.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);


		this.setStateData = this.setStateData.bind(this);
		this.onMessageReceive = this.onMessageReceive.bind(this);
		this.onSocketConnectCallback = this.onSocketConnectCallback.bind(this);
		this.onRoomJoinedCallback = this.onRoomJoinedCallback.bind(this);
	}


	componentDidMount() {
		//this.socket = SocketHelper(this.onMessageReceive, this.onSocketConnectCallback, this.onRoomJoinedCallback);
	}

	// loadData() {
	// 	const url = format(GET_COMMUNICATION, this.state.appInfo.domain);
	// 	let data = {
	// 		doctype: this.props.route.data.doctype,
	// 		name: this.state.item.name,
	// 		limit_start: 0,
	// 		after: null
	// 	};
	// 	loadAsync(url, data)
	// 		.then((res) => {
	// 			if (res) {
	// 				Fluxify.doAction('updateCommunications', res);
	// 			} else {
	// 				this.setState({ progress: false });
	// 			}
	// 		}).catch((rej) => {
	// 			this.setState({ progress: false });
	// 		});
	// }

	setStateData(messages) {
		this.setState((previousState) => {
			return {
				messages: AirChatUI.append(previousState.messages, messages),
			};
		});
	}


	onMessageReceive(message) {
		this.setStateData(createChatItem(message));
	}

	onSocketConnectCallback() {
		//console.log(ROOM_NAME);
		this.socket.joinRoom(ROOM_NAME)
	}

	onRoomJoinedCallback() {
		this.socket.sendMessage('Welcome there..\n\nCurrently I answer only python questions.');
	}


	///////////
	renderSend(props) {
		return (<Send {...props } />);
	}

	onSend(messages = []) {
		this.setStateData(messages);
		//this.socket.sendMessage(messages[0].text);
	}

	onRightElementPress(action) {
		const page = Page.INFO_PAGE;
		this.props.navigator.push({ id: page.id, name: page.name });
	}
	//////////


	render() {
		return (
			<Container>
				<Toolbar
					rightElement={{ menu: { labels: menuItems } }}
					onRightElementPress={(action) => this.onRightElementPress(action)}
					centerElement={this.props.route.name} />

				<AirChatUI
					messages={this.state.messages}
					onSend={this.onSend}
					user={{
						_id: GOING_ID,
						name: GOING_NAME,
					}}
					keyboardDismissMode='interactive'
					enableEmptySections={true}
					alert={false}
					renderSend={this.renderSend} />
			</Container>
		)
	}
}

ChatPage.propTypes = propTypes;
export default ChatPage;

