import React from 'react';
import Image from 'next/image';

import { HomeTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';

const Automation: React.FC<HomeTypes.HomeProps> = ({ data: homeData }) => {
	const automationData = homeData?.automation;

	const renderButtonCTA = () => {
		const dataButtonCTA = automationData.ctaButton;

		return (
			<LinkCTAEvent className='btn btn-primary !py-2.5 !px-5 sm:!px-10 text-base sm:text-sm font-medium leading-126%'>{ dataButtonCTA.text }</LinkCTAEvent>
		);
	};

	return (
		<div className='container-center overflow-hidden lg:max-w-6xl lg:px-10'>
			<div className='flex max-lg:flex-col lg:grid lg:grid-cols-5 gap-[46px] lg:gap-50px'>
				<div className='flex flex-col lg:col-span-2'>
					<h4
						data-aos='zoom-in-right'
						className='text-[22px] lg:text-xl font-medium leading-[83%] lg:leading-[111%] tracking-0.005em lg:tracking-normal text-purple mb-2 lg:mb-1.5'
					>{ automationData.title }</h4>

					<span className='mb-7'>
						{ automationData.subtitle && (
							<span
								data-aos='zoom-in-right'
								dangerouslySetInnerHTML={ { __html: automationData.subtitle } }
								className='text-[34px] lg:text-[44px] font-semibold leading-[104.5%] lg:leading-[102.5%] tracking-0.005em lg:tracking-0.02em !text-wording'
							/>
						) }
					</span>
					{ automationData.desc && (
						<span
							data-aos='zoom-in-right'
							dangerouslySetInnerHTML={ { __html: automationData.desc } }
							className='!text-wording text-xl lg:text-lg leading-120% lg:leading-140%'
						/>
					) }
				</div>

				<div
					data-aos='zoom-in-left'
					className='lg:col-span-3 lg:px-9'
				>
					<div className='relative overflow-hidden w-full h-full xs:max-h-[600px] lg:max-h-none aspect-[434/306] max-sm:hidden'>
						<Image
							src={ automationData.image.web }
							alt={ automationData.title }
							className='object-contain w-full h-full'
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw'
							fill
						/>
					</div>
					<div className='relative overflow-hidden w-full h-full xs:max-h-[600px] aspect-[312/291] sm:hidden'>
						<Image
							src={ automationData.image.mobile }
							alt={ automationData.title }
							className='object-contain w-full h-full'
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw'
							fill
						/>
					</div>
				</div>
			</div>

			<div
				data-aos='zoom-in'
				className='max-sm:hidden mt-[62px] flex justify-center'
			>
				{ renderButtonCTA() }
			</div>
		</div>
	);
};

export default Automation;
