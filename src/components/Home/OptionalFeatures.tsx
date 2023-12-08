import React from 'react';
import Image from 'next/image';

import clsxm from '@/helpers/clsxm';
import { getNumofCols } from '@/helpers/style';
import { HomeTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';

const OptionalFeatures: React.FC<HomeTypes.HomeProps> = ({ data: homeData }) => {
	const optionalFeaturesData = homeData?.optionalFeatures;

	const renderButtonCTA = (text: string) => {
		return (
			<LinkCTAEvent className='btn btn-primary !py-2.5 !px-5 sm:!px-10 text-base sm:text-sm font-medium leading-126%'>{ text }</LinkCTAEvent>
		);
	};

	const renderTitleOptionalFeature = (feature: HomeTypes.DetailData) => {
		return (
			<div className='mb-2 md:mb-4 flex md:h-full'>
				{ feature.title && (
					<span
						dangerouslySetInnerHTML={ { __html: feature.title } }
						className='text-lg sm:text-xl leading-[111%] font-medium !text-wording'
					/>
				) }
			</div>
		);
	};

	const renderOptionalFeatures = () => {
		const optionalFeaturesList = optionalFeaturesData.list;
		const gridColList = getNumofCols(optionalFeaturesList?.length);

		return (
			<>
				<div className='max-lg:px-4 max-w-[859px] mx-auto'>
					<div className='flex flex-col items-center justify-center h-full w-full bg-[#F6F6F6] rounded-10px py-30px md:py-10 px-6 md:px-60px'>
						<h3
							data-aos='zoom-in'
							className='text-heading-3 sm:text-heading-4'
						>{ optionalFeaturesData.title }</h3>

						<div data-aos='zoom-in-up'>
							<div className={ clsxm(
								'grid max-md:grid-cols-1 gap-30px md:gap-10 w-full mt-[38px] sm:mt-[43px]',
								gridColList
							) }>
								{ optionalFeaturesList?.map((feature: HomeTypes.DetailData) => (
									<div
										key={ feature.title }
										className='flex max-md:gap-18px'
									>
										<div className='flex-shrink-0 w-[62px] md:w-[100px] h-[62px] md:h-[100px] flex items-center justify-center bg-[#F4F4F4] rounded-full shadow-[-2px_8px_12px_rgba(123,123,123,0.25)]'>
											<div className='relative overflow-hidden w-30px md:w-[52px] h-full'>
												<Image
													src={ feature.image }
													alt={ feature.title }
													sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw'
													className='object-contain'
													fill
												/>
											</div>
										</div>

										<div className='md:hidden'>
											{ renderTitleOptionalFeature(feature) }
											<p className='text-body-4'>{ feature.desc }</p>
										</div>
									</div>
								)) }
							</div>
							<div className={ clsxm(
								'hidden md:grid md:gap-10 w-full mt-[25px]',
								gridColList
							) }>
								{ optionalFeaturesList?.map((feature: HomeTypes.DetailData) => (
									<div
										key={ `feature-title-${ feature.title }` }
										className='flex flex-col'
									>
										{ renderTitleOptionalFeature(feature) }

										<div className='h-full flex'>
											<p className='text-body-4 !text-wording'>{ feature.desc }</p>
										</div>
									</div>
								)) }
							</div>
						</div>
					</div>
				</div>

				<div
					data-aos='zoom-in'
					className='mt-[57px] md:mt-[55px] container-center flex justify-center'
				>
					{ renderButtonCTA(optionalFeaturesData.ctaButton.text) }
				</div>
			</>
		);
	};

	return (
		<div className='container-center text-wording overflow-hidden'>
			{ renderOptionalFeatures() }
		</div>
	);
};

export default OptionalFeatures;
