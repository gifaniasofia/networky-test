import React from 'react';

import { FooterTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';

const CTA: React.FC<FooterTypes.FooterProps> = ({ data: navigationData }) => {
	const renderCTA = () => {
		return (
			<div className='flex flex-col gap-y-9px sm:gap-y-2.5 mb-[55px] sm:mb-[154px]'>
				<h3 className='text-[22px] md:text-2xl lg:text-[32px] font-bold lg:font-semibold leading-[83%] md:leading-[100%] tracking-0.005em !text-wording'>
					{ navigationData.ctaBottom?.title }
				</h3>
				<div className='flex'>
					<LinkCTAEvent>
						<p className='text-sm sm:text-base !text-wording font-medium sm:font-normal leading-120% underline cursor-pointer hover:opacity-80'>
							{ navigationData.ctaBottom?.textAction }
						</p>
					</LinkCTAEvent>
				</div>
			</div>
		);
	};

	return renderCTA();
};

export default CTA;