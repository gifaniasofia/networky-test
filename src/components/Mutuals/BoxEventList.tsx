import React, { useEffect, useState } from 'react';

import { handleCatchError } from '@/helpers/handleError';
import { useApiClient } from '@/hooks';
import { ProfileHistory } from '@/openapi';
import { MutualsTypes } from '@/typings';

import Spinner from '../Spinner';

import { BoxEventItem } from './BoxEventDetail';

{ /* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */ }

const BoxEventList: React.FC<MutualsTypes.BoxEventListProps> = ({ personDetail, onClickDetail }) => {
	const apiClient = useApiClient();

	const [loading, setLoading] = useState<boolean>(false);
	const [eventHistories, setEventHistories] = useState<ProfileHistory[]>([]);

	useEffect(() => {
		const getEventListHistory = async(profileId: number) => {
			try {
				setLoading(true);
				const response = await ((await apiClient.profileApi()).profileHistories(profileId));

				if (response?.status === 200) {
					const data: ProfileHistory[] = response?.data?.data ?? [];

					setEventHistories(data);
				}
			} catch (error) {
				setEventHistories([]);
				handleCatchError(error);
			} finally {
				setLoading(false);
			}
		};

		if (personDetail?.profile_id) {
			getEventListHistory(personDetail?.profile_id);
		}
	}, [personDetail?.profile_id]);

	const renderEventList = () => {
		if (loading) {
			return (
				<div className='flex flex-col items-center justify-center h-full'>
					<Spinner className='text-purple w-5 h-5' />
				</div>
			);
		}

		if (!eventHistories?.length && !loading) {
			return (
				<div className='flex flex-col items-center justify-center h-full'>
					<p className='!text-steel'>No events yet</p>
				</div>
			);
		}

		if (eventHistories?.length) {
			return (
				<div className='flex flex-col gap-y-4 md:max-h-[45vh] md:overflow-y-auto custom-scrollbar pr-[15px]'>
					{ eventHistories.map((eventData: ProfileHistory, eventDataIdx: number) => {
						return (
							<div
								key={ eventDataIdx }
								className='flex items-center hover:opacity-80 cursor-pointer'
								onClick={ () => onClickDetail && onClickDetail(eventData, 'event', personDetail) }
							>
								<BoxEventItem eventData={ eventData } />
							</div>
						);
					}) }
				</div>
			);
			// return (
			// 	<div className='relative -mt-1'>
			// 		<DragScroll
			// 			wrapperId='cover-event'
			// 			className='gap-x-2 py-1 max-md:px-4 md:pr-4 max-md:-mx-4 md:-mr-3'
			// 		>
			// 			{ eventHistories.map((eventData: ProfileHistory, eventDataIdx: number) => {
			// 				return (
			// 					<div
			// 						key={ eventDataIdx }
			// 						className='flex flex-col gap-y-1 cursor-pointer hover:opacity-80'
			// 						onClick={ () => onClickDetail && onClickDetail(eventData, 'event', personDetail) }
			// 					>
			// 						<div className='relative overflow-hidden w-[100px] h-[100px] bg-grey-1'>
			// 							{ eventData.poster_img && (
			// 								<Image
			// 									src={ eventData.poster_img }
			// 									alt={ eventData.title ?? '' }
			// 									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
			// 									fill
			// 									className='object-cover w-full h-full'
			// 								/>
			// 							) }
			// 						</div>

			// 						<span className='text-10px whitespace-normal'>{ eventData.title }</span>
			// 					</div>
			// 				);
			// 			}) }
			// 		</DragScroll>
			// 	</div>
			// );
		}
	};

	return (
		<div className='text-left flex flex-col gap-y-4'>
			<p className='text-lg font-semibold tracking-0.005em'>Events</p>

			{ renderEventList() }
		</div>
	);
};

export default BoxEventList;