import React from 'react';

import { InputTypes } from '@/typings';

const ErrorMessage: React.FC<InputTypes.ErrorProps> = ({ message = 'Not valid' }) => {
	return (
		<span className='mt-[7px] text-xs text-red inline-flex items-center gap-[5px]'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='12'
				height='12'
				viewBox='0 0 12 12'
				fill='none'
				className='flex-shrink-0'>
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM5 7V2H7V7H5ZM7 9C7 9.55229 6.55228 10 6 10C5.44772 10 5 9.55229 5 9C5 8.44771 5.44772 8 6 8C6.55228 8 7 8.44771 7 9Z'
					fill='#BB0B00' />
			</svg>
			<span>{ message }</span>
		</span>
	);
};

export default ErrorMessage;