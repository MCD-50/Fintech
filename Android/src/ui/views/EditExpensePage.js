//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, BackAndroid, TouchableOpacity } from 'react-native';

//import from app
import { Toolbar, Card, Avatar, Toast } from 'react-native-material-component';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR, TURQUOISE } from '../../constants/AppColor';
import { getDateInStringFormat, getDateTime } from '../../helpers/CollectionHelper';
import { TextField } from 'react-native-material-textfield';
import Container from '../../../Container';
import DatabaseHelper from '../../helpers/DatabseHelper';
import AlertHelper from '../../helpers/AlertHelper';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};


class EditExpensePage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			item: this.props.route.data && this.props.route.data.item || null,
			date: getDateTime(),
			title: '',
			amount: '',
			isUpdate: false,
			displayDate: getDateInStringFormat()
		}

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
		const { item } = this.state;
		if (item) {
			const isUpdate = this.props.route.data.isUpdate || false
			this.setState({
				title: item.title,
				amount: item.amount,
				isUpdate: isUpdate
			})
		}
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
			if (this.props.route.data && this.props.route.data.callback) {
				this.props.route.data.callback();
			}
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
								const { title, amount, displayDate, date } = this.state
								if (title.length > 0 && amount.length > 0 && date.length > 0 && displayDate.length > 0) {
									const item = { title, amount, displayDate, date }
									const stateItem = this.state.item;
									if(stateItem && stateItem._id){
										item['_id'] = stateItem._id;
									}
									DatabaseHelper.addNewItem(item, (results) => {
										Toast.show('New Item added');
										this.popUp();
									})
								} else {
									AlertHelper.showAlert('Something went wrong.', 'All fields are mandatory. Make sure all fields are filled.')
								}
							}}>
								<Avatar icon='done' size={50} iconSize={23} bgcolor={TURQUOISE} />
							</TouchableOpacity>
						</View>
					</View>


					<View style={[style.setting_page_inside_card_view, { flexDirection: 'column' }]}>
						<TextField
							label='Title'
							value={this.state.title}
							onChangeText={(title) => this.setState({ title })} />

						<TextField
							label='Amount'
							keyboardType='numeric'
							value={this.state.amount}
							onChangeText={(amount) => this.setState({ amount })} />
					</View>

				</View>
			</Container>
		)
	}
}

EditExpensePage.propTypes = propTypes;
export default EditExpensePage;