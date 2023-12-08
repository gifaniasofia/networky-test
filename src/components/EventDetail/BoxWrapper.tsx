import React from 'react';

import clsxm from '@/helpers/clsxm';
import { EventDetailTypes } from '@/typings';

const BoxWrapper: React.FC<EventDetailTypes.BoxWrapperProps> = ({ children, className }) => {
	return (
		<div className={ clsxm('bg-super-light-grey border-[0.5px] border-light-grey rounded-[5px]', className) }>
			{ children }
		</div>
	);
};

export default BoxWrapper;
