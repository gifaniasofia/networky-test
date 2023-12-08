import React from 'react';

import clsxm from '@/helpers/clsxm';
import { FooterTypes } from '@/typings';

const SocialMediaWrapper: React.FC<FooterTypes.SocialMediaWrapperProps> = ({
	href,
	children,
	className
}) => {
	return (
		<a
			href={ href }
			target='_blank'
			className={ clsxm('flex flex-shrink-0 cursor-pointer items-center justify-center w-[27px] sm:w-30px h-[27px] sm:h-30px rounded-full bg-[#F1F1F1] sm:bg-white shadow-[13px_11px_18px_rgba(197,197,197,0.25)]', className) }
			rel='noreferrer'
		>
			{ children }
		</a>
	);
};

export default SocialMediaWrapper;
