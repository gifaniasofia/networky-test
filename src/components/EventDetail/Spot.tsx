import React from 'react';
import UserIcon from 'public/images/icons/user.svg';

import { EventDetailTypes } from '@/typings';

import Skeleton from '../Skeleton';

import BoxWrapper from './BoxWrapper';

const Spot: React.FC<EventDetailTypes.SpotProps> = ({
	loading,
	count,
	attendanceCount
}) => {
	return (
		<BoxWrapper className='flex flex-col justify-between flex-grow mt-[9px] md:mt-[13px]'>
			<div className='flex-1 h-full flex flex-col'>
				<div className='border-b-[0.5px] border-light-grey py-3 px-3.5 flex justify-between gap-2 w-full'>
					<div className='flex items-center gap-3'>
						<UserIcon className='flex-shrink-0 text-wording' />

						<span className='text-base font-semibold leading-126% !text-wording'>Capacity</span>
					</div>
					<p className='text-steel text-sm leading-126%'>
						{ count && count > 0 ? count : 'Max' } spots
					</p>
				</div>
				<div className='w-full py-3 px-3.5'>
					<Skeleton
						loading={ loading }
						rows={ 2 }
					>
						<div className='flex justify-between gap-2 w-full'>
							<p className='text-steel text-sm leading-126%'>
								{ attendanceCount ?? '0' } people has registered to this event.
							</p>
						</div>
					</Skeleton>
				</div>
			</div>

			{ /* { !loading && (
				<div className='mt-3.5 sm:mt-3 pb-3 px-4'>
					<Button className='py-2 px-3 bg-white bg-opacity-80 rounded-lg cursor-default w-full flex items-center justify-center text-steel text-lg sm:text-sm font-medium leading-126%'>
						<div className='flex items-center'>
							<div className='flex-shrink-0 mr-2'>
								<InfoSquareIcon className='flex-shrink-0 text-steel w-[18px] h-[18px] sm:w-[14px] sm:h-[14px]' />
							</div>
							<span className='!text-wording'>RSVP to Save Your Spot</span>
						</div>
					</Button>
				</div>
			) } */ }
		</BoxWrapper>
	);
};

export default Spot;
