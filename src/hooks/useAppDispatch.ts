/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { reduxConfig } from '@/configs';

const useAppDispatch = (action: any) => {
	const dispatch = useDispatch();

	return useCallback((param?: any, callback?: any) => dispatch(action(param, callback)), [dispatch, action]);
};

const useAppSelector: TypedUseSelectorHook<reduxConfig.RootState> = useSelector;

export { useAppDispatch, useAppSelector };
