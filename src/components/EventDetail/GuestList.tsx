import React from 'react';
import Image from 'next/image';

import { screens } from '@/helpers/style';
import { useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventDetailTypes } from '@/typings';

import DescribeTags from '../DescribeTags';

const GuestList: React.FC<EventDetailTypes.GuestListProps> = ({ data, onClick }) => {
	const windowDimensions = useWindowDimensions();
	const isMobile = windowDimensions?.width < screens.md;

	return (
		<div className='flex flex-col max-md:gap-y-[15px] md:divide-y-[0.5px] md:divide-light-grey/50'>
			{ data?.map((person: IEvent.EventAttendanceRespExt, personIdx: number) => (
				<div
					key={ personIdx }
					className='relative flex items-center space-x-4 text-steel cursor-pointer md:py-[7px]'
					onClick={ () => onClick(person) }
				>
					<div className='min-w-0 flex-auto'>
						<div className='flex items-center gap-x-2.5'>
							<div className='w-[25px] h-[25px] md:w-5 md:h-5 flex-shrink-0 rounded-full relative overflow-hidden bg-grey-1'>
								{ person.avatar && (
									<Image
										src={ person.avatar }
										alt=''
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										fill
										className='w-full h-full object-cover'
									/>
								) }
							</div>
							<div className='min-w-0'>
								<span className='line-clamp-1 !text-steel text-lg md:text-sm leading-120%'>
									{ person.fname } { person.lname }
								</span>
							</div>
						</div>
					</div>

					<DescribeTags
						tags={ (person?.categories ?? [])?.map(category => category?.cat_name ?? '') }
						maxShowLength={ isMobile ? 1 : 3 }
					/>

					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='8'
						height='13'
						viewBox='0 0 8 13'
						fill='none'>
						<path
							d='M0.999999 12L7 6.5L1 1'
							stroke='#626262'
							strokeWidth='0.5' />
					</svg>
				</div>
			)) }
		</div>
	);
};

export default GuestList;