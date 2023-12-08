import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

import { formatTimezoneOffsetToHhMm, showFormattedDate } from '@/helpers/misc';
import { ProfileHistory } from '@/openapi';
import { MutualsTypes } from '@/typings';

type BoxEventItemProps = {
	eventData: ProfileHistory;
};

export const BoxEventItem: React.FC<BoxEventItemProps> = ({ eventData }) => {
	const startDate = eventData?.start_date;
	const monthDate = startDate
		? format(new Date(startDate), 'MMM-dd')
		: '';
	const startDateFormatted = startDate
		? showFormattedDate(new Date(startDate))
		: '';
	const startTimeFormatted = startDate
		? `, ${ format(new Date(startDate), 'h:mm a') }`
		: '';
	const timezone = eventData?.tz_offset !== undefined ? formatTimezoneOffsetToHhMm(eventData?.tz_offset) : '';

	return (
		<>
			<div className='rounded-[5px] w-[33px] md:w-[45px] max-md:min-h-[36px] md:h-[50px] border-[0.5px] border-light-grey flex-shrink-0 mr-3 md:mr-5'>
				<div className='bg-light-grey p-0.5 flex items-center justify-center rounded-t-[5px]'>
					<p className='text-[8px] md:text-xs font-semibold text-grey-2 uppercase'>
						{ monthDate?.split('-')?.[0] }
					</p>
				</div>
				<div className='flex items-center justify-center'>
					<p className='text-base md:text-lg text-grey-2'>
						{ monthDate?.split('-')?.[1] }
					</p>
				</div>
			</div>
			<div className='flex'>
				<div className='relative overflow-hidden w-20 h-20 bg-grey-1 mr-[15px] flex-shrink-0'>
					{ eventData.poster_img && (
						<Image
							src={ eventData.poster_img }
							alt={ eventData.title ?? '' }
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							fill
							className='object-cover w-full h-full'
						/>
					) }
				</div>

				<div className='flex flex-col w-full'>
					<span className='text-base font-medium !text-steel whitespace-normal'>
						{ eventData.title }
					</span>
					<span className='mt-0.5 md:mt-1 text-sm !text-steel'>
						{ startDateFormatted }{ startTimeFormatted } { timezone }
					</span>
				</div>
			</div>
		</>
	);
};

const BoxEventDetail: React.FC<MutualsTypes.BoxEventDetailProps> = ({ eventDetail }) => {
	return (
		<div className='flex flex-col gap-y-4'>
			<p className='text-lg font-semibold tracking-0.005em max-md:hidden'>Events</p>

			<div className='flex items-center'>
				<BoxEventItem eventData={ eventDetail } />
			</div>
		</div>
	);
};

export default BoxEventDetail;