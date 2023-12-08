import React from 'react';

import { AuthTypes } from '@/typings';

import Layout from '../Layout';

import Hero from './Hero';

const Container: React.FC<AuthTypes.ContainerProps> = ({
	navigationData,
	title,
	children
}) => {
	return (
		<Layout
			data={ navigationData }
			showNavbarWebApp={ false }
			title='Auth (Log in / Sign up)'
		>
			<div className='w-full flex-grow flex flex-col justify-between'>
				<div className='relative overflow-hidden flex-1 h-full mt-60px pb-[217px] sm:pb-[90px]'>
					<div className='container-center'>
						<div className='pt-4 sm:pt-[38px] lg:max-w-md lg:mx-auto flex flex-col'>
							<Hero title={ title } />

							{ children }
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Container;
