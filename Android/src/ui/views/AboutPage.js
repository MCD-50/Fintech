//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, Switch, Linking, BackAndroid } from 'react-native';

//import from app
import { Toolbar, Card, Avatar } from 'react-native-material-component';
import { style } from '../../constants/AppStyle.js';
import { MARGIN_5 } from '../../constants/AppConstant';
import Container from '../../../Container';
import Communications from 'react-native-communications';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};


class InfoPage extends Component {
	constructor(params) {
		super(params);

		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);
		this.onEmail = this.onEmail.bind(this);
		this.popUp = this.popUp.bind(this);
	}

	componentWillMount() {
		this.addBackEvent();
	}

	componentWillUnmount() {
		this.removeBackEvent();
	}


	addBackEvent() {
		BackAndroid.addEventListener('hardwareBackPress', () => {
			this.popUp();
		});
	}

	removeBackEvent() {
		BackAndroid.removeEventListener('hardwareBackPress', () => {
			this.popUp();
		});
	}

	onEmail() {
		const email = 'ayush.as.shukla@gmail.com';
		Communications.email([email], null, null, null, null);
	}

	popUp() {
		if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
			this.props.navigator.pop();
			return true;
		}
		return false;
	}

	render() {
		return (
			<Container>
				<Toolbar
					leftElement="arrow-back"
					onLeftElementPress={() => this.popUp()}
					centerElement={this.props.route.name} />

				<ScrollView style={style.container_with_flex_1} keyboardDismissMode='interactive'>
					<Card style={{ minHeight: 50, justifyContent: 'center' }} fullWidth="1">
						<View style={style.setting_page_inside_card_view}>
							<Text style={style.setting_page_text}>Accept Privacy Policy </Text>
							<Switch style={style.setting_page_switch} value={true} disabled={true} />
						</View>
					</Card>

					<Card style={{ minHeight: 50, justifyContent: 'center' }} fullWidth="1">
						<View style={[style.setting_page_inside_card_view, { flexDirection: 'column' }]}>
							<Text style={[style.setting_page_text, { fontSize: 15 }]}>Simple app for chatting with bot.</Text>
							<View style={{ margin: MARGIN_5, height: 1, backgroundColor: '#131313' }} />
							<Text onPress={() => this.onEmail()} style={[style.setting_page_text, { fontSize: 15, color: '#dd2c00', paddingTop: 5, paddingLeft: MARGIN_5, paddingRight: MARGIN_5 }]}>Contact developer</Text>
							<Text onPress={() => Linking.openURL('https://github.com/MCD-50/AI-Bot')} style={[style.setting_page_text, { fontSize: 15, color: '#dd2c00', paddingTop: 5, paddingLeft: MARGIN_5, paddingRight: MARGIN_5 }]}>Source code at github</Text>
						</View>
					</Card>

					<Card style={{ minHeight: 50, justifyContent: 'center' }} fullWidth="1">
						<View style={[style.setting_page_inside_card_view, { flexDirection: 'column' }]}>
							<Text style={[style.setting_page_text, { fontSize: 15 }]}>Powered by react-native-material-component</Text>
							<View style={{ margin: MARGIN_5, height: 1, backgroundColor: '#131313' }} />
							<Text onPress={() => Linking.openURL('https://github.com/MCD-50/react-native-material-component')} style={[style.setting_page_text, { fontSize: 15, color: '#dd2c00', padding: 1, paddingLeft: MARGIN_5, paddingRight: MARGIN_5 }]}>Get react-native-material-component for faster development.</Text>
							<Text onPress={() => Linking.openURL('https://github.com/MCD-50/react-native-database-model')} style={[style.setting_page_text, { fontSize: 15, color: '#dd2c00', paddingTop: 5, paddingLeft: MARGIN_5, paddingRight: MARGIN_5 }]}>Get react-native-database-model for faster development.</Text>
							<Text onPress={() => Linking.openURL('https://github.com/MCD-50/react-native-air-chat')} style={[style.setting_page_text, { fontSize: 15, color: '#dd2c00', paddingTop: 5, paddingLeft: MARGIN_5, paddingRight: MARGIN_5 }]}>Get react-native-air-chat for faster development.</Text>
						</View>
					</Card>

					<View style={[style.setting_page_inside_card_view, { justifyContent: 'flex-end' }]}>
						<Text style={[style.setting_page_text, { color: '#b2b2b2', padding: 0, paddingLeft: MARGIN_5, paddingRight: MARGIN_5, fontSize: 13, alignItems: 'flex-end' }]}>AI-Bot 1.0</Text>
					</View>

				</ScrollView>
			</Container>
		)
	}
}

InfoPage.propTypes = propTypes;
export default InfoPage;