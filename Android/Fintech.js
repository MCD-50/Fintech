//import from system.
import React, { Component } from 'react';
import { Navigator } from 'react-native';



//import from app
import { ThemeProvider } from 'react-native-material-component';
import { Page } from './src/enums/Page.js';
import { uiTheme } from './src/constants/AppStyle.js';
import StateHelper from './src/helpers/StateHelper.js';
import Fluxify from 'fluxify';
const UIManager = require('UIManager');


//pages 
import SplashPage from './src/ui/views/SplashPage';
import LoginPage from './src/ui/views/LoginPage';
import HomePage from './src/ui/views/HomePage';
import EditExpensePage from './src/ui/views/EditExpensePage';
import ViewExpensePage from './src/ui/views/ViewExpensePage';
import ProfilePage from './src/ui/views/ProfilePage';
import AboutPage from './src/ui/views/AboutPage';


class Kick extends Component {
	constructor(params) {
		super(params);
	}

	componentDidMount() {
		if (UIManager.setLayoutAnimationEnabledExperimental) {
			UIManager.setLayoutAnimationEnabledExperimental(true);
		}
	}

	renderNavigation(route, navigator) {
		const id = route.id;
		if (id == 1)
			return <SplashPage navigator={navigator} route={route} />
		else if (id == 2)
			return <LoginPage navigator={navigator} route={route} />
		else if (id == 3)
			return <HomePage navigator={navigator} route={route} />
		else if (id == 4)
			return <EditExpensePage navigator={navigator} route={route} />
		else if (id == 5)
			return <ViewExpensePage navigator={navigator} route={route} />
		else if (id == 6)
			return <ProfilePage navigator={navigator} route={route} />
		else if (id == 7)
			return <AboutPage navigator={navigator} route={route} />
	}

	render() {
		return (
			<ThemeProvider uiTheme={uiTheme}>
				<Navigator initialRoute={{ id: 1, name: 'Splash' }}
					renderScene={this.renderNavigation.bind(this)}
					configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottomAndroid} />
			</ThemeProvider>
		);
	}
}

export default Kick;