//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Linking, ScrollView, StatusBar } from 'react-native';

//import from app
import { Progress, Toast, Icon } from 'react-native-material-component';
import { login, signUp } from '../../helpers/InternetHelper.js';
import { setData, getData } from '../../helpers/AsyncStore.js';
import { APP_INFO } from '../../constants/AppConstant.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR } from '../../constants/AppColor.js'
import { Page } from '../../enums/Page.js';
const appIcon = require('../../res/appIcon.png');

import AlertHelper from '../../helpers/AlertHelper.js';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
	text: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	placeholderTextColor: React.PropTypes.string,
	multiline: React.PropTypes.bool,
	autoFocus: React.PropTypes.bool,
};

const defaultProps = {
	text: '',
	placeholder: 'Text...',
	placeholderTextColor: '#b2b2b2',
	multiline: false,
	autoFocus: false,
};


class LoginPage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			email: '',
			password: '',
			progress: false
		};
		this.onButtonClicked = this.onButtonClicked.bind(this);
		this.renderSignInLoading = this.renderSignInLoading.bind(this);
	}

	onButtonClicked() {
		this.setState({ progress: true });
		if (this.isNotEmpty()) {
			const { email, password } = this.state;
			signUp(email, password)
				.then(res => {
					if (res && res.code && res.code == 'user-already-exists') {
						login(email, password)
							.then(_res => {
								if (_res) {
									setData(APP_INFO, Object.assign({}, {
										email,
										password,
										hasura_id: _res.hasura_id,
										auth_token: _res.auth_token
									}));
									const page = Page.CHAT_PAGE;
									this.props.navigator.replace({ id: page.id, name: page.name })
								}
							})
					} else if (res && res.hasura_id) {
						setData(APP_INFO, Object.assign({}, {
							email,
							password,
							hasura_id: res.hasura_id,
							auth_token: res.auth_token
						}));
						const page = Page.CHAT_PAGE;
						this.props.navigator.replace({ id: page.id, name: page.name })
					} else if (res && res.message && res.message == 'Already logged in. Logout to create new user.') {
						const page = Page.CHAT_PAGE;
						this.props.navigator.replace({ id: page.id, name: page.name })
					}
				});
		} else {
			AlertHelper.showAlert("Something went wrong.", "Please fill in all the details");
		}
		this.setState({ progress: false });
	}


	isNotEmpty() {
		let state = this.state;
		const { email, password } = this.state;
		if (email && password && email.trim().length > 0 && password.trim().length > 0)
			return true;
		return false;
	}

	onType(e, whichState) {
		if (whichState == 1) {
			this.setState({ email: e.nativeEvent.text });
		} else if (whichState == 2) {
			this.setState({ password: e.nativeEvent.text });
		}
	}

	renderSignInLoading() {
		if (this.state.progress) {
			return (
				<View style={style.progress_ring_centered_view}>
					<Progress />
				</View>
			)
		}
		return null;
	}

	render() {
		return (
			<View style={[style.container_with_flex_1, { backgroundColor: 'black', }]}>
				<StatusBar backgroundColor='black' barStyle='light-content' />
				<View style={[style.align_center_justify_center, { marginTop: 30 }]}>
					<Image source={appIcon} style={style.small_image_80_height_and_width} resizeMode="contain" />
				</View>

				<View style={[style.container_with_flex_1, { justifyContent: 'center', padding: 10 }]}>
					<TextInput style={[style.text_input_standard_style, { marginTop: 10 }]}
						placeholder='Email' editable={!this.state.progress}
						onChange={(e) => this.onType(e, 1)}
						placeholderTextColor={this.props.placeholderTextColor}
						multiline={false} autoCapitalize='sentences'
						enablesReturnKeyAutomatically={true} underlineColorAndroid="transparent" />

					<TextInput style={[style.text_input_standard_style, { marginTop: 10 }]}
						placeholder='Password'
						editable={!this.state.progress}
						onChange={(e) => this.onType(e, 2)}
						placeholderTextColor={this.props.placeholderTextColor}
						multiline={false} autoCapitalize='sentences'
						enablesReturnKeyAutomatically={true} underlineColorAndroid="transparent" />

					<View style={{ backgroundColor: STATUS_BAR_COLOR, marginTop: 10 }}>
						<TouchableOpacity style={[style.align_center_justify_center, { height: 40, padding: 15, paddingBottom: 8, paddingTop: 8 }]}
							onPress={() => this.onButtonClicked()}
							accessibilityTraits="button">
							<Text style={[style.text_with_flex_1_and_font_size_17_centered, { color: 'white', fontSize: 16 }]}>
								Get Started
							</Text>
						</TouchableOpacity>
					</View>
					{this.renderSignInLoading()}

				</View>
			</View>
		);
	}
}

LoginPage.propTypes = propTypes;
LoginPage.defaultProps = defaultProps;
export default LoginPage;