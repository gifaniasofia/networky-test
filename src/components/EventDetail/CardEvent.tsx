import React from 'react';
import { format, isSameDay } from 'date-fns';
import Image from 'next/image';
import EventsOutlineIcon from 'public/images/icons/events_outline.svg';

import clsxm from '@/helpers/clsxm';
import { formatTimezoneOffsetToHhMm, showFormattedDate } from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventDetailTypes } from '@/typings';

import Skeleton from '../Skeleton';

import BoxWrapper from './BoxWrapper';

const CardEvent: React.FC<EventDetailTypes.CardEventProps> = ({
	data,
	loading,
	defaultCover
}) => {
	const windowDimensions = useWindowDimensions();
	const isMobile = windowDimensions.width < screens.sm;

	const renderClockEmoji = () => {
		return (
			<EventsOutlineIcon className='w-18px h-18px flex-shrink-0 text-wording mt-0.5' />
		);
	};

	const renderDateTime = () => {
		if (loading) {
			return (
				<div className='flex flex-col gap-y-2 pt-[11px] border-t-0.5px border-light-grey'>
					<Skeleton
						loading={ loading }
						className='w-full'
						rows={ 2 }
					/>
				</div>
			);
		}

		if (data?.start_date && data?.end_date) {
			const startDate = new Date(data?.start_date);
			const endDate = new Date(data?.end_date);
			const startDateFormatted = showFormattedDate(startDate, isMobile);
			const endDateFormatted = format(endDate, 'LLL dd yyyy');
			const startTimeFormatted = format(startDate, 'h:mm a');
			const endTimeFormatted = format(endDate, 'h:mm a');
			const timezone = data?.tz_offset !== undefined ? formatTimezoneOffsetToHhMm(data?.tz_offset) : '';

			const dateClassName = 'text-base leading-120% lg:leading-140% !text-wording';
			const timeClassName = 'text-sm lg:leading-126% !text-wording';

			return (
				<div className='flex gap-x-2.5 pt-[11px] border-t-0.5px border-light-grey'>
					<div>
						{ renderClockEmoji() }
					</div>

					<div className='flex flex-col gap-1'>
						<p className={ clsxm(dateClassName, 'font-semibold') }>{ startDateFormatted }</p>
						<p className={ timeClassName }>
							{ isSameDay(startDate, endDate)
								? (
									<>
										{ startTimeFormatted || endTimeFormatted
											? `${ startTimeFormatted } - ${ endTimeFormatted } ${ timezone }`
											: 'TBD' }
									</>
								)
								: (
									<>
										{ startTimeFormatted } to { endDateFormatted }, { endTimeFormatted } { timezone }
									</>
								) }
						</p>
					</div>
				</div>
			);
		}

		return null;
	};

	const renderCover = () => {
		return (
			<Skeleton
				loading={ loading }
				className='w-full h-full aspect-square'
			>
				<div className='relative overflow-hidden w-full h-full aspect-square flex-shrink-0'>
					{ data?.is_expired
						&& data?.event_status === IEvent.EventStatus.HOSTED
						&& (
							<div className='absolute inset-0 flex items-center justify-center bg-base bg-opacity-95 z-10'>
								<span className='text-lg font-semibold leading-126% text-center'>This event has ended</span>
							</div>
						) }
					<Image
						src={ data?.poster_img ? data?.poster_img : (defaultCover || '/images/create/default_cover.png') }
						alt=''
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						className='object-cover'
						fill
					/>
				</div>
			</Skeleton>
		);
	};

	return (
		<BoxWrapper className='px-18px lg:px-3.5 py-4 lg:py-[17px]'>
			{ renderCover() }

			<div className='mt-[11px] flex flex-col gap-[5px] pb-[22px]'>
				<Skeleton loading={ loading }>
					<h1 className='!text-wording text-[26px] lg:text-3xl font-medium sm:font-bold leading-100% lg:leading-[104.5%] tracking-0.005em'>
						{ data?.title || 'Untitled Event' }
					</h1>
				</Skeleton>

				<Skeleton
					loading={ loading }
					className='w-1/2'>
					<div className='flex items-center gap-1 lg:gap-1.5 text-xs md:text-sm lg:text-base leading-126%'>
						<p className='!text-wording'>hosted by</p>
						<div className='relative overflow-hidden w-15px h-15px lg:w-18px lg:h-18px'>
							<Image
								src='/images/avatars/avatars_yellow.png'
								alt=''
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								fill
							/>
						</div>
						<p className='!text-wording'>{ data?.creator_name }</p>
					</div>
				</Skeleton>
			</div>

			{ renderDateTime() }
		</BoxWrapper>
	);
};

export default CardEvent;
