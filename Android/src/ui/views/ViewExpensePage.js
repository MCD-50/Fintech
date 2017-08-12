//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, BackAndroid, Button, TouchableOpacity } from 'react-native';

//import from app
import { Toolbar, Card, Avatar, Toast } from 'react-native-material-component';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR, TURQUOISE } from '../../constants/AppColor';
import { getDateInStringFormat, getDateTime } from '../../helpers/CollectionHelper';
import { TextField } from 'react-native-material-textfield';
import { Page } from '../../enums/Page';
import Container from '../../../Container';
import DatabaseHelper from '../../helpers/DatabseHelper';
import AlertHelper from '../../helpers/AlertHelper';

const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};


class ViewExpensePage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			item: this.props.route.data && this.props.route.data.item || null,
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
		const { item } = this.state;
		return (
			<Container>
				<Toolbar
					leftElement="arrow-back"
					onLeftElementPress={() => this.popUp()}
					translucent={true} />
				<View style={style.container_with_flex_1}>
					<View style={{ height: 80 }}>
						<View style={{ height: 50, backgroundColor: STATUS_BAR_COLOR }}>
							<Text style={[style.text_with_margin_bottom_and_font_size_19, { marginLeft: 15 }]}>{this.state.item.displayDate}</Text>
						</View>

						<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
							<View style={{ marginRight: 10, marginTop: -25 }}>
								<TouchableOpacity onPress={() => {
									const page = Page.EDIT_EXPENSE_PAGE;
									this.props.navigator.replace({
										id: page.id, name: page.name,
										data: {
											item: this.state.item,
											isUpdate: true,
											callback: this.props.route.data.callback,
											appInfo: this.props.route.data.appInfo
										}
									})
								}}>
									<Avatar icon='edit' size={50} iconSize={23} bgcolor={TURQUOISE} />
								</TouchableOpacity>
							</View>
						</View>

					</View>

					<View style={[style.setting_page_inside_card_view, { flexDirection: 'column' }]}>
						<Text style={[style.text_with_black_color_and_font_size_17, { fontSize: 35 }]}>{item.title}</Text>
						<View style={{ alignItems: 'flex-end' }}>
							<Text style={[style.text_with_black_color_and_font_size_17, { fontSize: 20 }]}>Amount</Text>
							<Text style={[style.text_with_black_color_and_font_size_17, { fontSize: 15 }]}>{item.amount}</Text>
						</View>

						<View style={{ marginTop: 20 }} />
						<Button title='Delete' onPress={() => {

							AlertHelper.showAlert('Delete', 'Are you sure you want to delete this?', (res) => {
								if (res.Ok) {
									const { item } = this.state
									DatabaseHelper.removeItemByQuery({ _id: item._id }, (results) => {
										Toast.show('Item deleted');
										this.popUp();
									})
								}
							})

						}} />
					</View>

				</View>


			</Container>
		)
	}
}

ViewExpensePage.propTypes = propTypes;
export default ViewExpensePage;