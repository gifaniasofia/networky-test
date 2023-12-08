import React from 'react';
import Image from 'next/image';

import clsxm from '@/helpers/clsxm';
import { screens } from '@/helpers/style';
import { HomeTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';

const Features: React.FC<HomeTypes.HomeProps> = ({ data: homeData, width = 0 }) => {
	const featuresData = homeData?.features;

	const isMobile = width < screens.lg;

	const renderFeatureTitle = (feature: HomeTypes.Feature, renderOnMobile?: boolean) => {
		return (
			<div className='flex max-lg:items-center justify-between h-full'>
				{ feature.title && (
					<span
						dangerouslySetInnerHTML={ { __html: feature.title } }
						className='text-heading-2 lg:text-heading-4 pr-[25px]'
					/>
				) }
				{ feature.icon && (
					<div className='lg:absolute lg:right-0 lg:top-0 max-lg:-mr-[10px]'>
						<div className='relative overflow-hidden w-[74px] h-[77px] sm:w-[80px] sm:h-[83px]'>
							<Image
								src={ renderOnMobile
									? (feature.iconMobile ?? feature.icon)
									: feature.icon }
								alt={ feature.id }
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								fill
							/>
						</div>
					</div>
				) }
			</div>
		);
	};

	const renderFeatures = (dataAos?: string, renderOnMobile?: boolean) => {
		return (
			<div className='grid lg:grid-cols-3 gap-[55px] lg:gap-20'>
				{ featuresData.list.map((feature: HomeTypes.Feature, featureIdx: number) => (
					<div
						key={ `content-${ feature.id }` }
						{ ...dataAos ? { 'data-aos': dataAos } : {} }
						className='relative flex flex-col'
					>
						<div>
							<div className='lg:hidden max-lg:mb-7'>
								{ renderFeatureTitle(feature, renderOnMobile) }
							</div>
							<p className='text-body-3 md:text-body-4 !text-wording'>{ feature.desc }</p>
						</div>
						<div className={ clsxm(featureIdx > 0 ? 'lg:-mx-5' : 'lg:-mx-0.5') }>
							<div className='mt-6 lg:mt-[25px] w-full'>
								<div className='relative overflow-hidden w-full h-full aspect-[8/10] max-lg:max-h-[355px]'>
									<Image
										src={ renderOnMobile
											? (feature.imageMobile ?? feature.image)
											: feature.image }
										alt={ feature.title }
										className='object-contain w-full h-full'
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										fill
									/>
								</div>
							</div>
						</div>
					</div>
				)) }
			</div>
		);
	};

	return (
		<div className='mt-50px sm:mt-[59px] mb-54px sm:mb-[82px] container-center lg:max-w-6xl lg:px-10 text-wording overflow-hidden'>
			{ isMobile && width > 0
				? (
					<div className='lg:hidden'>
						{ renderFeatures('zoom-in-up', true) }
					</div>
				)
				: (
					<div
						data-aos='zoom-in-up'
						className='max-lg:hidden'
					>
						<div className='grid grid-cols-3 gap-[55px] lg:gap-20 mb-8'>
							{ featuresData.list.map((feature: HomeTypes.Feature) => (
								<div
									key={ `title-${ feature.id }` }
									className='relative flex flex-col'
								>
									{ renderFeatureTitle(feature) }
								</div>
							)) }
						</div>
						{ renderFeatures() }
					</div>
				) }

			<div
				data-aos='zoom-in'
				className='flex items-center justify-center mt-11 sm:mt-[68px]'
			>
				<LinkCTAEvent className='btn btn-primary !py-2.5 !px-5 sm:!px-10 text-base sm:text-sm font-medium leading-126%'>{ featuresData.ctaButton.text }</LinkCTAEvent>
			</div>
		</div>
	);
};

export default Features;
