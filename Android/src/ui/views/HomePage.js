//import from system
import React, { Component, PropTypes } from 'react';
import { View, Text, ScrollView, ListView } from 'react-native';

//import from app
import {
	Toolbar, BottomNavigationBar,
	Avatar, ListItem, FloatingActionButton
} from 'react-native-material-component';
import { Page } from '../../enums/Page.js';
import { getTextColor, getAvatarText, getDateTime } from '../../helpers/CollectionHelper';
import { style } from '../../constants/AppStyle.js';
import { STATUS_BAR_COLOR, } from '../../constants/AppColor'
import { APP_INFO, INCOME_INFO } from '../../constants/AppConstant'
import { setData, getData } from '../../helpers/AsyncStore.js';

import Container from '../../../Container';
import DatabaseHelper from '../../helpers/DatabseHelper';


const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};


const menuItems = ['Profile', 'Share this app', 'Rate this app'];
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });

class HomePage extends Component {
	constructor(params) {
		super(params);
		this.socket = null;
		this.state = {
			active: 'dashboard',

			appInfo: null,
			monthlyExpense: '0',

			currency: '$',
			expenses: [],
			tips: [],
			dataSource: ds.cloneWithRows([]),


			currentIncome: '',
			targetSaving: '',
		};

		this.renderListItem = this.renderListItem.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
		this.callback = this.callback.bind(this);
		this.setStateData = this.setStateData.bind(this);
		this.renderView = this.renderView.bind(this);
		this.renderAddButton = this.renderAddButton.bind(this);

	}

	componentDidMount() {
		getData(INCOME_INFO)
			.then(res => {
				if (res) {
					res = JSON.parse(res);
					this.setState({ targetSaving: res.targetSaving, currentIncome: res.currentIncome });
				}
			})

		getData(APP_INFO).then(res => {
			if (res) {
				const __res = JSON.parse(res);
				this.setState({ appInfo: __res })
			}
			DatabaseHelper.getAllItems((results) => {
				let items = Object.keys(results.rows).map(key => results.rows[key]);
				this.setStateData(items);
				this.setState({ expenses: items });
			})
		})

		//now load expenses from databas
	}

	renderListItem(item) {
		const title = item.title;
		return (
			<ListItem
				divider
				leftElement={<Avatar bgcolor={getTextColor(title)} text={getAvatarText(title)} />}
				centerElement={{
					primaryElement: {
						primaryText: title
					},
					secondaryText: item.displayDate,
				}}
				rightElement={{
					upperElement: '$ ' + item.amount
				}}
				onPress={() => {
					const page = Page.VIEW_EXPENSE_PAGE;
					this.props.navigator.push({
						id: page.id, name: page.name,
						data: {
							item: item,
							callback: this.callback,
							appInfo: this.state.appInfo
						}
					})
				}} />
		);
	}

	onRightElementPress(action) {
		let page = Page.PROFILE_PAGE;
		if (action.action == 'menu') {
			switch (action.index) {
				case 0: page = Page.PROFILE_PAGE;
					this.props.navigator.push({ id: page.id, name: page.name });
					break;
				case 2: break;
				case 3: break;
			}
		} else {
			switch (action.index) {
				case 1: page = Page.ABOUT_PAGE;
					this.props.navigator.push({ id: page.id, name: page.name });
					break;
			}
		}
	}

	callback() {
		DatabaseHelper.getAllItems((results) => {
			let items = Object.keys(results.rows).map(key => results.rows[key]);
			this.setStateData(items);
		});

		getData(INCOME_INFO)
			.then(res => {
				if (res) {
					res = JSON.parse(res);
					this.setState({ targetSaving: res.targetSaving, currentIncome: res.currentIncome });
				}
			})
	}

	setStateData(results) {
		const sortedResult = results.sort((a, b) => {
			return a.date > b.date ? -1 : 1
		}).filter(x => {
			return x.date.split('-')[1] == getDateTime().split('-')[1];
		}).slice();

		let amount = 0;
		sortedResult.forEach(x => {
			amount = amount + parseInt(x.amount);
		})

		this.setState({
			dataSource: ds.cloneWithRows(sortedResult),
			expenses: sortedResult,
			monthlyExpense: amount.toString(),
		})
	}

	renderView() {
		if (this.state.active == 'dashboard') {
			return (
				<ScrollView style={[style.container_with_flex_1]} keyboardDismissMode='interactive'>
					<View style={{ flexDirection: 'row', padding: 10 }}>
						<View style={{ marginRight: 10 }}>
							<Avatar icon='person' size={70} iconSize={23} bgcolor={STATUS_BAR_COLOR} />
						</View>
						<View style={[{ flex: 1 }]}>
							<Text style={style.text_with_black_color_and_font_size_15}>Total Monthly Expense</Text>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ fontSize: 50 }}>{this.state.currency} </Text>
								<Text style={{ fontSize: 50 }}>{this.state.monthlyExpense}</Text>
							</View>
						</View>
					</View>
					<Text style={[{ marginLeft: 15, marginBottom: 10 }, style.text_with_black_color_and_font_size_17]}>Most Recent Expenses</Text>

					<ListView
						dataSource={this.state.dataSource}
						keyboardShouldPersistTaps='always'
						keyboardDismissMode='interactive'
						enableEmptySections={true}
						ref={'LISTVIEW'}
						renderRow={(item) => this.renderListItem(item)} />
				</ScrollView>
			);
		} else if (this.state.active == 'analysis') {

			let avgExpense = 0, avgExpensePerMonth = 0, distinctDates = 1, diff = 0, __diff = 0, message = '';

			let { targetSaving, currentIncome } = this.state;
			if (currentIncome.length > 0 && targetSaving.length > 0) {

				targetSaving = parseInt(targetSaving);
				currentIncome = parseInt(currentIncome);

				const __ = this.state.expenses.filter(x => {
					return x.date.split('-')[1] == getDateTime().split('-')[1];
				});
				if (__.length > 0) {
					const length = __.length;
					__.forEach(item => {
						avgExpense = avgExpense + parseInt(item.amount)
					})

					__array = [];
					__obj = {};
					__.forEach(item => {
						__array.push(item.displayDate.replace(' ', '-'))
					})

					__array.forEach((item, index) => {
						__obj[item] = index
					})

					const counts = Object.keys(__obj).length

					avgExpense = avgExpense / counts;
					avgExpensePerMonth = avgExpense * 30;


					diff = currentIncome - avgExpensePerMonth - targetSaving;
					if (diff < 1) {
						message = 'Your current expense is high'
					} else {
						message = 'You are running cool'
					}

					return (
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ fontSize: 19 }}>Average expense per day is {avgExpense}</Text>
							<Text>{message}</Text>
						</View>);
				} else {
					return (
						<View style={{ flex: 1 }}>
							<Text>{avgExpense}</Text>
						</View>);
				}
				//now get avg exprense per day
			} else {
				return (
					<View style={{ flex: 1 }}>
						<Text>{avgExpense}</Text>
					</View>);
			}

		} else {
			return null
		}
	}

	renderAddButton() {
		if (this.state.active == 'dashboard') {
			return (
				<View>
					<FloatingActionButton
						icon='add'
						onPress={() => {
							const page = Page.EDIT_EXPENSE_PAGE;
							this.props.navigator.push({
								id: page.id, name: page.name,
								data: {
									callback: this.callback,
									appInfo: this.state.appInfo
								}
							})
						}} />
				</View>);
		}
		return null;
	}

	render() {
		return (
			<Container>
				<Toolbar
					rightElement={{ menu: { labels: menuItems }, }}
					onRightElementPress={(action) => this.onRightElementPress(action)}
					centerElement={this.props.route.name} />

				{this.renderView()}
				{this.renderAddButton()}

				<BottomNavigationBar active={this.state.active} hidden={false}>

					<BottomNavigationBar.Action
						key="dashboard"
						icon="dashboard"
						label="Dashboard"
						onPress={() => this.setState({ active: 'dashboard' })} />

					<BottomNavigationBar.Action
						key="analysis"
						icon="people"
						label="Analysis"
						onPress={() => this.setState({ active: 'analysis' })} />

				</BottomNavigationBar>

			</Container>
		)
	}
}

HomePage.propTypes = propTypes;
export default HomePage;

