import React from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { Actions } from '@/store';

const Redux = () => {

	const miscState = useAppSelector(state => state.miscReducers);
	const setCounter = useAppDispatch(Actions.miscAction.setCounter);
	
	const increase = () => {
		setCounter(miscState.counter + 1);
	};
	const decrease = () => {
		setCounter(miscState.counter - 1);
	};

	return (
		<div className='h-screen w-screen flex flex-col items-center justify-center'>
			<h1 className='text-center pb-4'>{ miscState.counter }</h1>
			<div className='flex items-center justify-center gap-4'>
				<button
					onClick={ decrease }
					className='py-2 w-20 cursor-pointer border hover:-translate-y-1 active:translate-y-0 border-solid border-gray-200 rounded font-bold'>-</button>
				<button
					onClick={ increase }
					className='py-2 w-20 cursor-pointer border hover:-translate-y-1 active:translate-y-0 border-solid border-gray-200 rounded font-bold'>+</button>
			</div>
		</div>
	);
};

export default Redux;