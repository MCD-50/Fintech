//import from system
import Fluxify from 'fluxify';

const StateClient = Fluxify.createStore({
	id: 'StateClient',
	initialState: {
		appData: null,
	},
	actionCallbacks: {
		updateAppData: (updater, appData) => {
			const obj = Object.assign({}, appData);
			updater.set({ appData: obj });
		}
	}
});

export default StateClient;