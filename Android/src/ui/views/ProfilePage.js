//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, BackAndroid, ScrollView, TouchableOpacity } from 'react-native';
var format = require('string-format')


//import from app
import { Toolbar, Card, Avatar } from 'react-native-material-component';
import { TextField } from 'react-native-material-textfield';
import { Page } from '../../enums/Page.js';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR, TURQUOISE } from '../../constants/AppColor';
import AlertHelper from '../../helpers/AlertHelper.js';
import Container from '../../../Container';
import { INCOME_INFO } from '../../constants/AppConstant'
import { setData, getData } from '../../helpers/AsyncStore.js';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};

class ProfilePage extends Component {
	constructor(params) {
		super(params);
		this.socket = null;
		this.state = {
			active: 'basic',

			name: 'Hola',
			email: '',
			age: '',

			currentIncome: '',
			dialyExpense: '10',
			targetSaving: '',

			currency: '',
		};

		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);
		this.popUp = this.popUp.bind(this);
	}



	componentWillMount() {
		this.addBackEvent();
	}

	componentWillUnmount() {
		this.removeBackEvent();
	}

	componentDidMount() {
		getData(INCOME_INFO)
			.then(res => {
				if (res) {
					res = JSON.parse(res);
					this.setState({ targetSaving: res.targetSaving, currentIncome: res.currentIncome });
				}
			})
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
					translucent={true} />

				<View style={style.container_with_flex_1}>
					<View style={{ height: 80 }}>
						<View style={{ height: 50, backgroundColor: STATUS_BAR_COLOR }}>
							<Text style={[style.text_with_margin_bottom_and_font_size_19, { marginLeft: 15 }]}>{this.state.displayDate}</Text>
						</View>
						<View style={{ marginRight: 10, alignItems: 'flex-end', marginTop: -25 }}>
							<TouchableOpacity onPress={() => {
								const { currentIncome, targetSaving } = this.state
								if (currentIncome.length > 0 && targetSaving.length > 0) {
									setData(INCOME_INFO, JSON.stringify({
										currentIncome, targetSaving
									}));
									this.popUp();
								} else {
									AlertHelper.showAlert('Something went wrong.', 'All fields are mandatory. Make sure all fields are filled.')
								}
							}}>
								<Avatar icon='done' size={50} iconSize={23} bgcolor={TURQUOISE} />
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ paddingLeft: 15, paddingRight: 15 }}>
						<TextField
							label='Current Monthly Income'
							value={this.state.currentIncome}
							keyboardType='numeric'
							onChangeText={(currentIncome) => this.setState({ currentIncome })} />

						<TextField
							label='Monthly Target Saving'
							value={this.state.targetSaving}
							keyboardType='numeric'
							onChangeText={(targetSaving) => this.setState({ targetSaving })} />
					</View>
				</View>

			</Container>
		)
	}
}

ProfilePage.propTypes = propTypes;
export default ProfilePage;

