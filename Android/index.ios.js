//import from system
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';


//import from app
import Fintech from './Fintech.js';
import Container from './Container.js';

class FintechApp extends Component {
	render() {
		return (<Container><Fintech /></Container>);
	}
}
AppRegistry.registerComponent('kick', () => FintechApp);