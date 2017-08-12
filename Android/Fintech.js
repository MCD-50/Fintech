//import from system.
import React, { Component } from 'react';
import { Navigator } from 'react-native';
import Fluxify from 'fluxify';
const UIManager = require('UIManager');

//import from app
import { ThemeProvider } from 'react-native-material-component';
import { Page } from './src/enums/Page.js';
import { uiTheme } from './src/constants/AppStyle.js';
import StateHelper from './src/helpers/StateHelper.js';


//pages 
import SplashPage from './src/ui/views/SplashPage';
import ChatPage from './src/ui/views/ChatPage';
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
		Fluxify.doAction('updateCurrentPageId', id);
		if (id == 1)
			return <SplashPage navigator={navigator} route={route}/>
		else if (id == 2)
			return <ChatPage navigator={navigator} route={route}/>
		else if (id == 3)
			return <AboutPage navigator={navigator} route={route}/>
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