import React from 'react';
import Image from 'next/image';

import navigationDataLocal from '@/constant/data/navigation.json';
import { FooterTypes } from '@/typings';

import QueryLink from '../QueryLink';

import SocialMediaWrapper from './SocialMediaWrapper';

const PreFooter = dynamic(() => import('./PreFooter'));

import dynamic from 'next/dynamic';

const FooterLanding: React.FC<FooterTypes.FooterProps> = ({ data, withCta }) => {
	const navigationData = data ?? navigationDataLocal;

	const renderMenuList = () => {
		return (
			<div className='flex max-lg:flex-col lg:items-center max-lg:mb-[18px] gap-3 lg:gap-5'>
				{ navigationData.menu.map((menu: NavMenu) => {
					return (
						<QueryLink
							key={ menu.name }
							href={ menu.href }
							className='text-body-4 md:!leading-120% tracking-0.02em !text-wording underline underline-offset-2'
						>
							{ menu.name }
						</QueryLink>
					);
				}) }
			</div>
		);
	};

	const renderSocialMediaList = () => {
		return (
			<div className='flex items-center justify-end gap-x-2 sm:gap-x-9px'>
				{ navigationData.socialMedia.list.map((socmed: FooterTypes.SocialMedia) => (
					<SocialMediaWrapper
						key={ socmed.alt }
						href={ socmed.url }
						className={ socmed.class ?? 'p-1 sm:p-1.5' }
					>
						<div className='relative overflow-hidden w-full h-full'>
							<Image
								src={ socmed.image }
								alt={ socmed.alt }
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								width={ socmed.width ?? 15 }
								height={ socmed.height ?? 15 }
								className='object-contain absolute-center'
							/>
						</div>
					</SocialMediaWrapper>
				)) }
			</div>
		);
	};

	const renderContentPoweredBy = () => {
		return (
			<>
				<p className='text-wording text-[8px] sm:text-xs leading-120% tracking-0.02em font-normal'>{ navigationData.poweredBy.text }</p>

				<QueryLink
					href={ navigationData.poweredBy.href }
					rel='noopener noreferrer'
					target='_blank'
				>
					<Image
						src={ navigationData.poweredBy.logo }
						alt='logo sygnalxyz'
						width={ 94 }
						height={ 8 }
						className='object-contain w-[75px] sm:w-[94px] h-1.5 sm:h-2'
						sizes='100vw'
					/>
				</QueryLink>
			</>
		);
	};

	const renderFooterCta = () => {
		if (withCta) {
			return <PreFooter data={ navigationData } />;
		}

		return null;
	};

	return (
		<div className='container-center w-full pt-5 pb-10 lg:pt-10 text-wording'>
			{ renderFooterCta() }

			<div className='flex max-lg:flex-col lg:items-end lg:justify-between'>
				<div className='flex flex-col gap-8 lg:gap-9'>
					<QueryLink href='/'>
						<div className='relative overflow-hidden w-[118px] h-[27.6px] md:w-[139px] md:h-[31.86px]'>
							<Image
								src={ navigationData.logoNetworkyFull.black }
								alt='logo'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								fill
							/>
						</div>
					</QueryLink>

					{ renderMenuList() }
				</div>

				<div className='hidden lg:flex items-center -mb-2 gap-x-2'>
					{ renderContentPoweredBy() }
				</div>

				<div className='max-lg:flex max-lg:justify-between max-lg:items-end'>
					<span className='lg:hidden flex flex-wrap items-center gap-x-1'>
						{ renderContentPoweredBy() }
					</span>

					<div className='flex flex-col justify-end gap-y-2 sm:gap-y-3'>
						<p className='text-right !text-wording text-xs sm:text-sm md:text-base font-normal leading-120% tracking-0.02em'>
							{ navigationData.socialMedia.title }
						</p>

						{ renderSocialMediaList() }
					</div>
				</div>
			</div>
		</div>
	);
};

export default FooterLanding;