import React from 'react';
import Image from 'next/image';

import { HomeTypes } from '@/typings';

const CRM: React.FC<HomeTypes.HomeProps> = ({ data: homeData }) => {
	const crmData = homeData?.crm;

	const renderImage = () => {
		return (
			<>
				<div className='relative overflow-hidden w-full h-full aspect-[2/5] xs:max-h-[800px] lg:max-h-none sm:aspect-[573/340] max-sm:hidden'>
					<Image
						src={ crmData.image.web }
						alt=''
						className='object-contain w-full h-full'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw'
						fill
					/>
				</div>

				<div className='relative overflow-hidden w-full h-full aspect-[319/682] xs:max-h-[800px] lg:max-h-none sm:hidden'>
					<Image
						src={ crmData.image.mobile }
						alt=''
						className='object-contain w-full h-full'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw'
						fill
					/>
				</div>
			</>
		);
	};

	return (
		<div className='pt-[82px] sm:pt-[106px] pb-[84px] sm:pb-[99px] container-center lg:max-w-6xl lg:px-10 overflow-hidden'>
			<div className='flex max-lg:flex-col lg:grid lg:grid-cols-5 gap-[46px] lg:gap-50px'>
				<div className='flex flex-col lg:col-span-2'>
					<h4
						data-aos='zoom-in-right'
						className='text-[22px] lg:text-xl font-medium leading-[83%] lg:leading-[111%] tracking-0.005em lg:tracking-normal text-purple mb-2 lg:mb-1.5'
					>{ crmData.title }</h4>
					<span className='mb-7'>
						{ crmData.subtitle && (
							<span
								data-aos='zoom-in-right'
								dangerouslySetInnerHTML={ { __html: crmData.subtitle } }
								className='text-[34px] lg:text-[44px] font-semibold leading-[104.5%] lg:leading-[102.5%] tracking-0.005em lg:tracking-0.02em !text-wording'
							/>
						) }
					</span>
					{ crmData.desc && (
						<span
							data-aos='zoom-in-right'
							dangerouslySetInnerHTML={ { __html: crmData.desc } }
							className='!text-wording text-xl lg:text-lg leading-120% lg:leading-140%'
						/>
					) }
				</div>

				<div
					data-aos='zoom-in-left'
					className='lg:col-span-3'
				>
					{ renderImage() }
				</div>
			</div>
		</div>
	);
};

export default CRM;
