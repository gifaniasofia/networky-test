import React from 'react';
import Image from 'next/image';

import { HomeTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';

const ManageGuest: React.FC<HomeTypes.HomeProps> = ({ data: homeData }) => {
	const manageGuestData = homeData?.manageGuest;

	const renderButtonCTA = (text: string) => {
		return (
			<LinkCTAEvent className='btn btn-primary !py-2.5 !px-5 sm:!px-10 text-base sm:text-sm font-medium leading-126%'>{ text }</LinkCTAEvent>
		);
	};

	const renderCardManageGuestStep = (step: HomeTypes.ManageGuestStep, stepIdx: number) => {
		return (
			<div
				key={ stepIdx }
				className='pr-6 xs:pr-10 md:pr-0'
			>
				<div className='sm:max-w-[360px] md:max-w-[254px] w-full bg-[#EFEFEF] rounded-10px py-2 sm:py-9px px-2.5 sm:px-2 flex flex-col items-center'>
					<div className='rounded-lg w-full'>
						<div
							className='relative overflow-hidden w-full h-full rounded-[5px]'
							style={ { aspectRatio: step.aspectRatio } }
						>
							<Image
								src={ step.image }
								alt=''
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								className='object-cover'
								fill
							/>
						</div>
					</div>
					<p className='text-body-3 md:text-body-4 p-3 md:p-2 lg:p-3 text-center !text-wording'>{ step.desc }</p>
				</div>
			</div>
		);
	};

	const renderHorizontalSteps = () => {
		return (
			<>
				<div
					data-aos='zoom-in-down'
					className='hidden md:flex items-center'
				>
					{ manageGuestData.list.map((step: HomeTypes.ManageGuestStep, stepIdx: number) => (
						<div
							key={ `nav-${ step.title }` }
							className='relative w-full'
						>
							{ stepIdx < manageGuestData.list.length - 1
								? (
									<div
										className='absolute left-0 right-0 inset-y-0 flex items-center z-0'
										aria-hidden='true'
									>
										<div className='h-[0.5px] w-full bg-primary' />
									</div>
								) : null }
							<div className='flex items-center'>
								<span className='relative flex h-2 w-2 items-center justify-center rounded-full bg-primary' />

								<span className='pl-2 lg:pl-2.5 lg:pr-1.5 max-w-[120px] lg:max-w-[175px] relative bg-base'>
									{ step.title && (
										<span
											dangerouslySetInnerHTML={ { __html: step.title } }
											className='text-heading-5 !text-wording'
										/>
									) }
								</span>
							</div>
						</div>
					)) }
				</div>

				<div
					data-aos='zoom-in-up'
					className='hidden md:grid grid-cols-5 gap-4 lg:gap-5 mt-7'
				>
					{ manageGuestData.list.map((step: HomeTypes.ManageGuestStep, stepIdx: number) => renderCardManageGuestStep(step, stepIdx)) }
				</div>
			</>
		);
	};

	const renderVerticalSteps = () => {
		return (
			<div className='md:hidden space-y-6'>
				{ manageGuestData.list.map((step: HomeTypes.ManageGuestStep, stepIdx: number) => (
					<div
						key={ step.title }
						data-aos='zoom-in-up'
						className='relative flex gap-x-3'
					>
						{ stepIdx !== manageGuestData.list.length - 1 && (
							<div className='absolute left-0 top-1 flex w-[11px] justify-center -bottom-7'>
								<div
									className='w-[0.5px] bg-primary'
								/>
							</div>
						) }

						<div className='relative flex h-[11px] w-[11px] mt-1 flex-none items-center justify-center rounded-full bg-primary' />

						<div className='flex-auto -mt-1'>
							{ step.title && (
								<span
									dangerouslySetInnerHTML={ { __html: step.title } }
									className='text-heading-3 !tracking-0.02em !leading-[112%]'
								/>
							) }

							<div className='mt-[21px] mb-[43px]'>
								{ renderCardManageGuestStep(step, stepIdx) }
							</div>
						</div>
					</div>
				)) }
			</div>
		);
	};

	const renderManageGuestSteps = () => {
		return (
			<>
				{ renderHorizontalSteps() }

				{ renderVerticalSteps() }
			</>
		);
	};

	const renderManageGuest = () => {
		return (
			<div className='mt-[65px] sm:mt-[93px] container-center text-wording overflow-hidden'>
				<div className='flex md:justify-center md:text-center mb-[49px] sm:mb-[67px]'>
					{ manageGuestData.title && (
						<span
							data-aos='zoom-in'
							dangerouslySetInnerHTML={ { __html: manageGuestData.title } }
							className='text-heading-1 sm:text-heading-2'
						/>
					) }
				</div>

				{ renderManageGuestSteps() }

				<div
					data-aos='zoom-in'
					className='sm:mt-12 flex justify-center'
				>
					{ renderButtonCTA(manageGuestData.ctaButton.text) }
				</div>
			</div>
		);
	};

	return renderManageGuest();
};

export default ManageGuest;
