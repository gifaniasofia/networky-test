import createEventAction from './createEvent/createEvent.action';
import createEventReducers from './createEvent/createEvent.reducer';
import miscAction from './misc/misc.action';
import miscReducers from './misc/misc.reducer';

const Reducers = {
	miscReducers,
	createEventReducers
};

const Actions = {
	miscAction,
	createEventAction
};

export { Actions, Reducers };
