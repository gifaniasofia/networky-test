import React from 'react';

import clsxm from '@/helpers/clsxm';
import { PrivacyTermsTypes } from '@/typings';

const Hero: React.FC<PrivacyTermsTypes.HeroProps> = ({
	title,
	subtitle,
	description,
	lastUpdated
}) => {
	return (
		<div className='container-center mt-20 lg:mt-[108px] text-wording'>
			<div className='flex max-sm:flex-col sm:justify-end'>
				<h1 className='sm:text-right text-page-title !text-wording'>{ title }</h1>
				{ lastUpdated &&
					<span className='text-[10px] leading-3 font-normal mt-[5px] sm:hidden !text-wording'>{ lastUpdated }</span> }
			</div>

			{ (subtitle || description)
				? (
					<div className='lg:max-w-[902px] lg:mx-auto'>
						<div className={ clsxm('mt-30px sm:mt-6', description ? 'mb-[21px]' : '') }>
							<span className='!text-wording back-underline-purple text-heading-4 before:!h-1 before:!bottom-[1px] sm:before:!h-1.5 sm:before:!bottom-0.5'>
								{ subtitle }
							</span>
						</div>

						{ description && (
							<span
								dangerouslySetInnerHTML={ { __html: description } }
								className='text-body-4 !text-wording'
							/>
						) }
					</div>
				)
				: null }
		</div>
	);
};

export default Hero;
