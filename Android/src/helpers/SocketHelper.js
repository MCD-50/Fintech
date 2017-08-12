//import from app
import { getData } from './AsyncStore.js';
import { SOCKET_URL } from '../constants/AppConstant.js';
import SocketClient from './SocketClient.js';


const socket = new SocketClient();
export default (socket_message_callback, socket_connect_callback, socket_room_joined_callback) => {
	
	socket.onConnect(() => {
		console.log('Connected.');
		socket_connect_callback();
	});
	socket.onOpen(() => console.log('Connection opened.'))
	socket.onError((event) => console.log('Error occured.', event))
	socket.onClose((event) => console.log('Connection closed', event))
	socket.onMessage((msg) => socket_message_callback(msg));
	// socket.onNotification((noti) => socket_message_callback(noti));
	socket.onJoin(() => socket_room_joined_callback())
	socket.initSocket(SOCKET_URL);



	const closeSocket = () => socket.disconnect()
	const joinRoom = (room_name) => socket.joinRoom(room_name);
	const leaveRoom = (room_name) => socket.leaveRoom(room_name);
	const sendMessage = (query) => socket.sendMessage(query);

	return { closeSocket, sendMessage, joinRoom, leaveRoom }
}

