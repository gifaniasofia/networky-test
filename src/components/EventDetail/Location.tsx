import React from 'react';
import Link from 'next/link';
import PinIcon from 'public/images/icons/pin.svg';

import clsxm from '@/helpers/clsxm';
import { EventDetailTypes } from '@/typings';

import GoogleMaps from '../GoogleMaps';
import Skeleton from '../Skeleton';

import BoxWrapper from './BoxWrapper';

const Location: React.FC<EventDetailTypes.LocationProps> = ({
	addr_name,
	addr_detail,
	addr_note,
	addr_ltd,
	addr_lng,
	loading
}) => {
	const isLatLngExists = addr_ltd && addr_lng;

	const renderAddress = () => {
		if (!addr_name && !addr_detail && !addr_note) {
			return (
				<p className='text-sm font-medium leading-126% text-steel'>
					No location set
				</p>
			);
		}

		const details = addr_detail + (addr_note ? `, ${ addr_note }` : '');

		return (
			<>
				<p className='text-steel text-sm font-semibold leading-126%'>
					{ addr_name }
				</p>
				<p className='text-xs leading-126% text-grey-2 mt-px'>
					{ details }
				</p>
			</>
		);
	};

	return (
		<BoxWrapper className='flex flex-col justify-between flex-grow'>
			<div className={ isLatLngExists ? 'md:grid md:grid-cols-10' : '' }>
				<div className='flex-1 h-full flex flex-col md:col-span-4'>
					<div className='border-b-[0.5px] border-light-grey py-3 px-3.5 flex items-center gap-3'>
						<PinIcon className='flex-shrink-0 text-wording' />

						<span className='text-base font-semibold leading-126% !text-wording'>Location</span>
					</div>
					<div className={ clsxm(
						'w-full py-3 px-3.5',
						isLatLngExists ? 'max-md:hidden' : ''
					) }>
						<Skeleton
							loading={ loading }
							rows={ 2 }
						>
							{ renderAddress() }
						</Skeleton>
					</div>
				</div>

				{ isLatLngExists && (
					<>
						<div className='w-full max-md:h-[151px] md:min-h-[95px] md:col-span-6 relative'>
							<GoogleMaps.Wrapper>
								<GoogleMaps.Maps
									mapId='detail-event-maps'
									center={ { lat: + addr_ltd, lng: + addr_lng } }
									className='md:rounded-r-[5px]' />
							</GoogleMaps.Wrapper>
							<div className='absolute right-0 bottom-0 pr-[7px] pb-3'>
								<Link
									href={ `https://www.google.com/maps/search/?api=1&query=${ addr_ltd },${ addr_lng }` }
									className='bg-white py-1 px-2 border-[0.5px] border-steel shadow-blur-1 rounded-sm text-[10px] font-medium leading-[126%] text-[#0063F6]'
									target='_blank'
									rel='noopener noreferrer'
								>
									View Larger Map
								</Link>
							</div>
						</div>

						<div className='md:hidden w-full py-3 px-3.5'>
							<Skeleton
								loading={ loading }
								rows={ 2 }
							>
								{ renderAddress() }
							</Skeleton>
						</div>
					</>
				) }
			</div>
		</BoxWrapper>
	);
};

export default Location;
