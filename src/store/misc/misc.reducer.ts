/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatches } from '@/constant';
import { TypeMiscState } from '@/typings/store/misc';

const initialState: TypeMiscState = {
	loading: false,
	counter: 0,
};

type Actions = { type: string; payload: any };

const miscReducers = (
	state = initialState,
	action: Actions,
): TypeMiscState => {
	const { payload, type } = action;
	switch (type) {
		case Dispatches.API_LOADING_START:
			return {
				...state,
				loading: true,
			};
		case Dispatches.API_LOADING_END:
			return {
				...state,
				loading: false,
			};
		case Dispatches.SET_COUNTER:
			return {
				...state,
				counter: payload,
			};
		default:
			return state;
	}
};

export default miscReducers;
