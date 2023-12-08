/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from 'react';
import { createWrapper } from 'next-redux-wrapper';
import {
	applyMiddleware,
	combineReducers,
	compose,
	legacy_createStore as createStore,
} from 'redux';
import thunk from 'redux-thunk';

import { Reducers } from '@/store';

const rootReducer = combineReducers({ ...Reducers });

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

const makeStore = () => store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch | Dispatch<any>;

export const wrapper = createWrapper(makeStore);

export { store };
