import { Dispatches } from '@/constant';

export default {
	startLoader: () => {
		return {
			type: Dispatches.API_LOADING_START,
		};
	},
	endLoader: () => {
		return {
			type: Dispatches.API_LOADING_END,
		};
	},
	setCounter: (e:number) => {
		return {
			type: Dispatches.SET_COUNTER,
			payload: e
		};
	},
};
