import React from 'react';

import { CreateEventTypes } from '@/typings';

const ButtonEditCover: React.FC<CreateEventTypes.ButtonEditCoverProps> = ({ onClick }) => {
	return (
		<div
			className='cursor-pointer hover:bg-steel hover:text-white transition duration-200 ease-in rounded-lg text-steel border-[0.5px] border-steel py-1.5 px-5 text-sm font-medium leading-120% sm:leading-126%'
			onClick={ onClick }
		>
			Update Event Cover
		</div>
	);
};

export default ButtonEditCover;
