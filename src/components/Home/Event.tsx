import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import clsxm from '@/helpers/clsxm';
import { screens } from '@/helpers/style';
import { HomeTypes } from '@/typings';

import Button from '../Button';
import DragScroll from '../DragScroll';
import LinkCTAEvent from '../LinkCTAEvent';

const EffectVideo = dynamic(() => import('../EffectVideo'), { ssr: false });

/* eslint-disable @typescript-eslint/no-explicit-any */

const Event: React.FC<HomeTypes.HomeProps> = ({ width = 0, data: homeData }) => {
	const eventData = homeData?.event;

	const [activeBgEventIdx, setActiveBgEventIdx] = useState<number>(-1);
	const [activeEffectIdx, setActiveEffectIdx] = useState<number>(-1);

	useEffect(() => {
		const steps = eventData?.createEvent?.steps ?? [];

		if (steps?.length) {
			const bgIndexDefaultSelect = steps[1]?.indexDefaultSelect;
			const effectIndexDefaultSelect = steps[2]?.indexDefaultSelect;

			if (+ bgIndexDefaultSelect > -1 && + bgIndexDefaultSelect <= steps[1]?.data?.length - 1) {
				setActiveBgEventIdx(bgIndexDefaultSelect);
			}

			if (+ effectIndexDefaultSelect > -1 && + effectIndexDefaultSelect <= steps[2]?.data?.length - 1) {
				setActiveEffectIdx(effectIndexDefaultSelect);
			}
		}
	}, []);

	const onClickSelectStep = (stepDataIdx: number, id?: HomeTypes.StepCreateEventType) => {
		if (id === 'background') setActiveBgEventIdx(stepDataIdx);
		else if (id === 'effect') setActiveEffectIdx(stepDataIdx);
	};

	const renderCoverOptions = () => {
		const coverOptions = eventData.coverOption.list;
		const updatedCoverOptions = width < screens.sm
			? coverOptions.slice(0, 6)
			: coverOptions;

		return (
			<div className='mt-14 sm:mt-[31px]'>
				<div className='relative mb-[62px] sm:mb-[34px] max-sm:max-w-[257px] mx-auto'>
					<DragScroll
						wrapperId='cover-event'
						className='gap-x-[17px] max-sm:gap-y-3.5 sm:py-4 xl:px-3 xl:-mx-3 sm:px-4 sm:-mx-4 max-sm:overflow-hidden max-sm:grid max-sm:grid-cols-2 max-sm:!cursor-default'
					>
						{ updatedCoverOptions.map((cover: HomeTypes.DetailData) => (
							<div
								key={ cover.title }
								data-aos='zoom-in'
								className='sm:flex-none w-full sm:w-[12%] lg:w-[11.08%] h-full'
							>
								<div className='relative overflow-hidden w-full h-full aspect-square'>
									<Image
										src={ cover.image }
										alt={ cover.title }
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										className='object-cover w-full h-full'
										fill
									/>
								</div>
							</div>
						)) }
					</DragScroll>
				</div>

				<div
					data-aos='zoom-in-down'
					className='flex justify-center'
				>
					<LinkCTAEvent>
						<span className='text-sm sm:text-base text-center sm:leading-[153.5%] sm:tracking-wide underline hover:opacity-80 !text-wording'>
							{ eventData.coverOption.ctaMore.text }
						</span>
					</LinkCTAEvent>
				</div>
			</div>
		);
	};

	const renderDetailEvent = (
		text: string,
		src?: string,
		textClassName?: string
	) => {
		return (
			<div className='flex items-center gap-x-2.5'>
				{ src && (
					<Image
						src={ src }
						alt='emoji'
						width={ 18 }
						height={ 18 }
					/>
				) }

				<p className={ clsxm('!font-light !text-wording', textClassName) }>{ text }</p>
			</div>
		);
	};

	const renderStepEventData = (stepEvent: HomeTypes.StepCreateEvent, stepDataIdx: number, stepData: any) => {
		const activeClassName = 'border-4 border-green';
		const nonActiveClassName = 'border-4 border-transparent';
		const defaultClassName = 'rounded-full relative w-14 h-14 sm:w-16 sm:h-16 overflow-hidden cursor-pointer';
		const typeData = stepEvent?.dataType ?? '';
		const stepId = stepEvent?.id;
		const activeStepEventData = stepId === 'background' ? activeBgEventIdx : activeEffectIdx;
		const wrapperClassNames = clsxm(defaultClassName, stepDataIdx === activeStepEventData ? activeClassName : nonActiveClassName);

		if (typeData === 'css-background' && typeof stepData === 'string') {
			return (
				<Button
					key={ stepDataIdx }
					className={ wrapperClassNames }
					onClick={ () => onClickSelectStep(stepDataIdx, stepId) }
				>
					<div
						className='w-full h-full'
						style={ { background: stepData } }
					/>
				</Button>
			);
		}

		if (typeData === 'thumbnail-video') {
			return (
				<Button
					key={ stepDataIdx }
					className={ wrapperClassNames }
					onClick={ () => onClickSelectStep(stepDataIdx, stepId) }
				>
					<div className='absolute -inset-0.5'>
						<div className='rounded-full relative overflow-hidden w-[58px] h-[58px] sm:w-[66px] sm:h-[66px]'>
							<Image
								src={ stepData.thumbnail }
								alt=''
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								className='w-full h-full object-cover'
								fill
							/>
						</div>
					</div>
				</Button>
			);
		}
	};

	const renderCardEvent = () => {
		const createEventData = eventData.createEvent;

		if (createEventData?.previewEventImage) {
			return (
				<div className='flex flex-col h-full w-full rounded-[5px] overflow-hidden relative bg-white'>
					<Image
						src={ eventData.createEvent?.previewEventImage }
						alt=''
						className='w-full h-full'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>
			);
		}

		return (
			<div className='flex flex-col h-full w-full rounded-[5px] py-[17px] px-4 relative bg-white'>
				<div className='relative overflow-hidden w-full h-full'>
					<Image
						src={ createEventData.data.cover }
						alt={ createEventData.data.title }
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						className='object-cover'
						fill
					/>
				</div>

				<div className='mt-2.5 sm:mt-3'>
					<p className='text-[27px] sm:text-[28px] font-semibold sm:font-bold leading-120%'>{ createEventData.data.title }</p>

					<span className='flex items-end mt-1.5 sm:mt-2 gap-2 text-sm'>
						hosted by { ' ' }

						<span className='flex items-center justify-center mb-0.5 w-4 h-4 bg-primary rounded-full text-[10px] flex-shrink-0 capitalize'>
							{ createEventData.data.host?.charAt(0) }
						</span>

						{ ' ' }{ createEventData.data.host }
					</span>
				</div>

				<div className='flex flex-col gap-y-1 pt-4 border-t border-grey-3 mt-4'>
					{ renderDetailEvent(createEventData.data.date, '/images/emoji/clock.png', 'text-heading-5') }
					{ renderDetailEvent(createEventData.data.time, '', 'ml-7 text-body-4') }
				</div>
			</div>
		);
	};

	const renderAnimationEffect = (src: string) => {
		const isGIFImage = src?.toLowerCase()?.includes('.gif');

		if (isGIFImage) {
			return (
				<div className='relative overflow-hidden w-full h-full'>
					<Image
						src={ src }
						alt=''
						className='object-cover w-full h-full'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>
			);
		}

		return (
			<EffectVideo
				url={ src }
				className='rounded-[10px]'
			/>
		);
	};

	const renderContentTryCreateEvent = () => {
		const createEventData = eventData.createEvent;
		const dataTypeBackground = createEventData.steps[1]?.dataType;
		const activeEffectVideo = activeEffectIdx > -1
			? (eventData.createEvent.steps[2].data[activeEffectIdx] as { thumbnail: string; video: string; })?.video ?? ''
			: null;

		if (dataTypeBackground === 'css-background') {
			const activeBgEvent = activeBgEventIdx > -1
				? (createEventData.steps[1].data[activeBgEventIdx] as string) ?? '#0F0F0F'
				: '#0F0F0F';

			return (
				<div
					className='w-full h-full rounded-[10px] bg-black py-[17px] px-[15px] relative'
					style={ { background: activeBgEvent } }
				>
					{ renderCardEvent() }

					{ activeEffectVideo && (
						<div className='absolute inset-0 w-full h-full overflow-hidden'>
							{ renderAnimationEffect(activeEffectVideo) }
						</div>
					) }
				</div>
			);
		}

		if (dataTypeBackground === 'thumbnail-video') {
			const activeBgVideo = activeBgEventIdx > -1
				? (eventData.createEvent.steps[1].data[activeBgEventIdx] as { thumbnail: string; video: string; })?.video ?? ''
				: null;

			return (
				<div className='rounded-[10px] w-full h-full relative bg-black'>
					{ activeBgVideo && (
						<EffectVideo
							url={ activeBgVideo }
							className='rounded-[10px]'
						/>
					) }

					<div className='w-full h-full rounded-[10px] bg-transparent py-[17px] px-[15px] absolute inset-0'>
						{ renderCardEvent() }
					</div>

					{ activeEffectVideo && (
						<div className='absolute inset-0 w-full h-full overflow-hidden rounded-[10px]'>
							{ renderAnimationEffect(activeEffectVideo) }
						</div>
					) }
				</div>
			);
		}

		return null;
	};

	const renderTryCreateEvent = () => {
		const createEventData = eventData.createEvent;

		return (
			<div className='pt-20 sm:pt-[104px] sm:max-w-5xl px-3 sm:px-10 md:px-0 lg:px-10 mx-auto pb-[66px] sm:pb-[124px]'>
				<div className='flex max-md:flex-col md:grid md:grid-cols-6 lg:grid-cols-5 gap-54px md:gap-8 lg:gap-11'>
					<div className='md:col-span-3 lg:col-span-2'>
						<div
							data-aos='zoom-in-right'
							className='w-full h-[450px] lg:h-[458px] shadow-blur-1 rounded-[10px]'
						>
							{ renderContentTryCreateEvent() }
						</div>
					</div>

					<div className='md:col-span-3 h-full w-full flex flex-col'>
						<div className='space-y-6'>
							{ createEventData.steps.map((step: HomeTypes.StepCreateEvent, stepIdx: number) => (
								<div
									key={ step.title }
									data-aos='zoom-in-left'
									className='relative flex gap-x-5 md:gap-x-8'
								>
									{ stepIdx !== createEventData.steps.length - 1 && (
										<div className='absolute left-0 top-0 flex w-9px sm:w-3 justify-center -bottom-6'>
											<div className='w-px bg-primary' />
										</div>
									) }
									<div className='relative flex h-9px sm:h-3 w-9px sm:w-3 flex-none items-center justify-center rounded-full bg-primary' />

									<div className='flex-auto -mt-2'>
										<span className='text-body-2 inline-flex items-center select-none'>
											{ step.title }
											{ step.badge
												? (
													<span className='ml-3.5 lg:ml-[22px] bg-primary rounded-[14.5px] py-1 px-3 sm:px-5 text-white text-[10px] sm:text-xs leading-120% font-medium sm:font-normal'>{ step.badge }</span>
												) : null }
										</span>

										<div className={ clsxm(step.data && step.data?.length ? 'mt-2 sm:mt-[22px] mb-3.5 sm:mb-[43px]' : 'mb-[23px] sm:mb-11', 'flex') }>
											<div className='grid grid-cols-4 lg:grid-cols-6 gap-y-4 sm:gap-y-5 gap-x-4 sm:gap-x-6 items-center'>
												{ step.data?.map((stepData: any, stepDataIdx: number) => renderStepEventData(step, stepDataIdx, stepData)) }
											</div>
										</div>
									</div>
								</div>
							)) }
						</div>

						<div className='mt-8 lg:mt-30px sm:ml-11 flex max-md:justify-center'>
							<LinkCTAEvent>
								<p className='text-sm font-medium leading-126% underline !text-wording'>{ createEventData.ctaMore.title }</p>
							</LinkCTAEvent>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='mt-[49px] sm:mt-14 container-center text-wording overflow-hidden'>
			{ eventData.title && (
				<span
					data-aos='zoom-in-right'
					className='text-heading-1 md:text-heading-2'
					dangerouslySetInnerHTML={ { __html: eventData.title } }
				/>
			) }

			{ renderCoverOptions() }

			{ renderTryCreateEvent() }
		</div>
	);
};

export default Event;
