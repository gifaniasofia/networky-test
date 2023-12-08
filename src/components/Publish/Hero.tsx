import React, { PropsWithChildren } from 'react';

const Hero: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<div className='container-center text-steel pb-72 pt-[69px] sm:pt-[59px] sm:max-w-[630px] sm:mx-auto flex flex-col items-center text-center'>
			<h2 className='text-[26px] font-semibold leading-100% tracking-0.005em mb-1 lg:mb-2.5'>Success</h2>

			{ children }
		</div>
	);
};

export default Hero;
