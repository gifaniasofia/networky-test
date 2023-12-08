import React from 'react';

import authData from '@/constant/data/auth.json';
import { AuthTypes } from '@/typings';

const Hero: React.FC<AuthTypes.HeroProps> = ({ title }) => {
	return (
		<h1 className='text-lg md:text-xl leading-[130%] md:leading-[111%] font-semibold !text-wording text-center'>
			{ title ?? authData.title }
		</h1>
	);
};

export default Hero;
