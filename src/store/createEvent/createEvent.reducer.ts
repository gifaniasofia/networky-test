/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatches } from '@/constant';
import { TypeCreateEventState } from '@/typings/store/createEvent';

const initialState: TypeCreateEventState = {
	isEffectActive: false
};

type Actions = { type: string; payload: any; };

const createEventReducers = (
	state = initialState,
	action: Actions,
): TypeCreateEventState => {
	const { type, payload } = action;

	switch (type) {
		case Dispatches.TOGGLE_CREATE_EVENT_EFFECT:
			return {
				...state,
				isEffectActive: payload ?? !state.isEffectActive,
			};
		default:
			return state;
	}
};

export default createEventReducers;
