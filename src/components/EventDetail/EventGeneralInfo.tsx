import React from 'react';
import { format, isSameDay } from 'date-fns';
import Image from 'next/image';

import { formatTimezoneOffsetToHhMm, showFormattedDate } from '@/helpers/misc';
import { EventRespDetail } from '@/openapi';

const EventGeneralInfo: React.FC<{ eventDetail?: EventRespDetail; }> = ({ eventDetail }) => {
	const renderDateTime = () => {
		if (eventDetail?.start_date && eventDetail?.end_date) {
			const startDate = new Date(eventDetail?.start_date);
			const endDate = new Date(eventDetail?.end_date);
			const startDateFormatted = showFormattedDate(startDate, true);
			const startTimeFormatted = format(startDate, 'h:mm a');
			const endTimeFormatted = format(endDate, 'h:mm a');
			const timezone = eventDetail?.tz_offset !== undefined ? formatTimezoneOffsetToHhMm(eventDetail?.tz_offset) : '';

			return (
				<div className='flex flex-col'>
					<p className='text-xs font-semibold leading-126% !text-steel mb-[3px]'>{ startDateFormatted }</p>
					<p className='text-10px font-normal leading-126% !text-steel'>
						{ startTimeFormatted || endTimeFormatted
							? `${ startTimeFormatted }${ isSameDay(startDate, endDate) ? ` - ${ endTimeFormatted }` : '' } ${ timezone }`
							: 'TBD' }
					</p>
				</div>
			);
		}
	};

	return (
		<div className='sm:max-w-md sm:mx-auto w-full'>
			<div className='bg-super-light-grey rounded-[10px] mt-[15px] py-[15px] px-3.5 grid grid-cols-5'>
				<div className='text-left col-span-3'>
					<p className='text-sm sm:text-base font-semibold !leading-126% !text-steel mb-[3px] line-clamp-1'>
						{ eventDetail?.title }
					</p>
					<p className='!text-steel text-10px leading-[110%] sm:leading-126% flex flex-wrap items-center gap-x-[3px] sm:gap-x-[5px]'>
						<span>hosted by</span>
						<Image
							src='/images/avatars/avatars_yellow.png'
							width={ 15 }
							height={ 15 }
							alt=''
							className='rounded-full overflow-hidden bg-cover'
						/>
						<span>{ eventDetail?.creator_name }</span>
					</p>
				</div>
				<div className='col-span-2 text-left'>
					{ renderDateTime() }
				</div>
			</div>
		</div>
	);
};

export default EventGeneralInfo;