import React from 'react';
import dynamic from 'next/dynamic';

import clsxm from '@/helpers/clsxm';
import { EventDetailTypes } from '@/typings';

import Layout from '../Layout';

const BackdropEffect = dynamic(() => import('../BackdropEffect'), { ssr: false });

const Container: React.FC<EventDetailTypes.ContainerProps> = ({
	showEffect,
	createEventData,
	navigationData,
	children,
	pageTitle,
	floatingElement,
	showNavbar = true,
	showFooter = false,
	og_image,
	pageDesc,
	navbarWithQueryLink
}) => {
	const renderBackdropEffect = () => {
		if (showEffect) {
			return (
				<BackdropEffect
					source_type={ createEventData?.defaultEffect?.source_type }
					source_url={ createEventData?.defaultEffect?.source_url }
				/>
			);
		}

		return null;
	};

	return (
		<div className='relative'>
			<Layout
				type='webapp'
				data={ navigationData }
				title={ pageTitle }
				showNavbar={ showNavbar }
				showFooter={ showFooter }
				og_image={ og_image }
				desc={ pageDesc }
				navbarWithQueryLink={ navbarWithQueryLink }
			>
				<div className={ clsxm(
					'w-full',
					pageTitle === 'Invite' ? 'md:container-center' : 'container-center',
					showNavbar ? 'mt-60px sm:mt-20' : ''
				) }>
					{ children }
				</div>

				{ floatingElement }
			</Layout>

			{ renderBackdropEffect() }
		</div>
	);
};

export default Container;
