import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import clsxm from '@/helpers/clsxm';
import { screens } from '@/helpers/style';
import useIsAuthenticated from '@/hooks/useIsAuthenticated';
import { HomeTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';

const Hero: React.FC<HomeTypes.HomeProps> = ({ width = 0, data: homeData }) => {
	const heroData = homeData?.hero;

	const videoRef = useRef<HTMLVideoElement>(null);
	const isAuthenticated = useIsAuthenticated();

	useEffect(() => {
		if (heroData?.video?.web) {
			videoRef.current?.load();
		}
	}, [heroData?.video?.web]);

	const isMobile = width < screens.xs;

	const renderImage = () => {
		const image = isMobile && width > 0
			? heroData.image.mobile
			: heroData.image.web;
		const video = heroData.video.web;

		if (video) {
			return (
				<div className='w-full md:w-[760.8px] lg:w-[865px] h-auto aspect-[1/2] xs:aspect-[2.2/1] max-h-[413px] md:h-[350px] lg:h-[386px] relative overflow-hidden'>
					<video
						ref={ videoRef }
						className='w-full object-cover h-full'
						autoPlay
						playsInline
						loop
						muted
					>
						<source
							src={ video }
							type={ heroData.video.type ?? 'video/mp4' }
						/>
						Your browser does not support video
					</video>
				</div>
			);
		}

		if (image) {
			return (
				<div
					data-aos='zoom-in'
					className='w-full md:w-[760.8px] lg:w-[865px] h-auto aspect-[1/2] xs:aspect-[2.2/1] max-h-[413px] md:h-[350px] lg:h-[386px] relative overflow-hidden'
				>
					<Image
						src={ image }
						alt='hero'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						className='w-full object-cover h-full'
						priority
						fill
					/>
				</div>
			);
		}

		return null;
	};

	const renderFeatures = () => {
		const features = heroData.features ?? [];

		if (features?.length) {
			const middleIndex = Math.ceil(features.length / 2);

			const leftFeatures = features.slice().splice(0, middleIndex);
			const rightFeatures = features.slice().splice(-middleIndex);

			const defaultClassName = 'absolute bottom-0 flex flex-col gap-y-2px max-md:hidden';

			return (
				<>
					<div
						data-aos='zoom-in-right'
						className={ clsxm(defaultClassName, 'left-0') }
					>
						{ leftFeatures.map((feature: string) => <p key={ feature }>{ feature }</p>) }
					</div>

					<div
						data-aos='zoom-in-left'
						className={ clsxm(defaultClassName, 'right-0') }
					>
						{ rightFeatures.map((feature: string) => <p key={ feature }>{ feature }</p>) }
					</div>
				</>
			);
		}

		return null;
	};

	return (
		<div className='mt-[65px] lg:mt-[144px] mb-[50px] lg:mb-[87px] overflow-hidden text-wording'>
			<div className='flex flex-col items-center'>
				<div className='flex flex-col items-center text-center container-center'>
					{ heroData.title && (
						<h1
							data-aos='zoom-in-down'
							className='text-heading-1 mb-2.5 sm:mb-3.5'
						>
							<span dangerouslySetInnerHTML={ { __html: heroData.title } } />
						</h1>
					) }

					{ heroData.tagline && (
						<h2
							data-aos='zoom-in'
							className='text-xl lg:text-2xl leading-120%'
						>
							<span dangerouslySetInnerHTML={ { __html: heroData.tagline } } />
						</h2>
					) }

					{ heroData.desc && (
						<p
							data-aos='zoom-in'
							className='text-body-4 sm:text-body-3 mt-[11px] sm:mt-[5px]'
						>{ heroData.desc }</p>
					) }
				</div>

				<div
					data-aos='zoom-in-up'
					className='mt-[35px] sm:mt-[31px] mb-[56px] sm:mb-[51px] flex flex-col items-center gap-y-2 sm:gap-y-3 container-center'
				>
					<LinkCTAEvent className='btn btn-primary !py-2.5 !px-5 sm:!px-10 text-base sm:text-sm font-medium leading-126%'>{ heroData.ctaButton.text }</LinkCTAEvent>

					{ !isAuthenticated && (
						<span className='text-sm font-medium leading-126% !text-wording'>
							{ heroData.ctaSignIn.preText }{ ' ' }

							<LinkCTAEvent
								href='/events'
								className='underline underline-offset-2'
							>{ heroData.ctaSignIn.textAction }</LinkCTAEvent>
						</span>
					) }
				</div>

				<div className='md:container-center w-full'>
					<div className='flex flex-col items-center w-full relative text-body-3'>
						{ renderImage() }

						{ renderFeatures() }
					</div>
				</div>
			</div>
		</div>
	);
};

export default Hero;