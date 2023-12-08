import { useEffect, useState } from 'react';
import axios from 'axios';
import { format, isSameDay } from 'date-fns';
import { Plus } from 'lucide-react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';

import { Button, DragScroll, Layout } from '@/components';
import Spinner from '@/components/Spinner';
import { endpoints } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { formatTimezoneOffsetToHhMm, getGreetings, showFormattedDate } from '@/helpers/misc';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventResp } from '@/openapi';

import { authOptions } from '../api/auth/[...nextauth]';

const tabs = [
	{
		name: 'Hosting',
		value: IEvent.EventCategory.HOSTING
	},
	{
		name: 'Attending',
		value: IEvent.EventCategory.ATTENDING
	},
	{
		name: 'Invited',
		value: IEvent.EventCategory.INVITED
	},
	{
		name: 'Cancelled',
		value: IEvent.EventCategory.CANCELED
	},
	{
		name: 'Draft',
		value: IEvent.EventCategory.DRAFT
	}
];

const EventListPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ navigationData }) => {
	const { data: session } = useSession();
	const apiClient = useApiClient();

	const [listData, setListData] = useState<Array<EventResp>>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>(tabs[0].value);
	const [loading, setLoading] = useState<boolean>(false);

	const getEventList = async() => {
		try {
			setLoading(true);

			const response = await (await apiClient.eventsApi()).listEvent(999, 1, undefined, selectedCategory);
			const status = response?.status;

			if (status === 200) {
				setListData(response.data.data ?? []);
			}
			setLoading(false);
		} catch (error) {
			setListData([]);
			setLoading(false);

			if (axios.isAxiosError(error)) {
				if (error && error?.response) {
					const emptyData = error?.response?.data?.stat_msg === 'sql: no rows in result set';

					if (emptyData) {
						return;
					}
				}
			}

			handleCatchError(error);
		}
	};

	useEffect(() => {
		getEventList();
	}, [selectedCategory]);

	const eventStatusClassNames = (isExpired?: boolean) => {
		if (selectedCategory === IEvent.EventCategory.DRAFT) return 'bg-white/90 text-steel';
		if (selectedCategory === IEvent.EventCategory.HOSTING) {
			if (isExpired) return 'bg-red/90 text-white';
			return 'bg-orange/90 text-white';
		}
		if (selectedCategory === IEvent.EventCategory.CANCELED) return 'bg-grey-2/90 text-white';
		if (selectedCategory === IEvent.EventCategory.ATTENDING) return 'bg-[#00CC39]/90 text-white';
		if (selectedCategory === IEvent.EventCategory.INVITED) return 'bg-purple/90 text-white';

		return 'hidden';
	};

	const eventStatusText = (isExpired?: boolean) => {
		if (selectedCategory === IEvent.EventCategory.DRAFT) return 'DRAFT';
		if (selectedCategory === IEvent.EventCategory.HOSTING) {
			if (isExpired) return 'EXPIRED';
			return 'HOSTING';
		}
		if (selectedCategory === IEvent.EventCategory.CANCELED) return 'CANCELLED';
		if (selectedCategory === IEvent.EventCategory.ATTENDING) return 'ATTENDING';
		if (selectedCategory === IEvent.EventCategory.INVITED) return 'INVITED';

		return '-';
	};

	const renderDateTime = (data: EventResp) => {
		if (data?.start_date && data?.end_date) {
			const startDate = new Date(data?.start_date);
			const endDate = new Date(data?.end_date);
			const startDateFormatted = showFormattedDate(startDate);
			const endDateFormatted = format(endDate, 'LLL dd yyyy');
			const startTimeFormatted = format(startDate, 'h:mm a');
			const endTimeFormatted = format(endDate, 'h:mm a');
			const timezone = data?.tz_offset !== undefined ? formatTimezoneOffsetToHhMm(data?.tz_offset) : '';

			return (
				<div className='flex gap-x-[7px] mt-18px sm:mt-2.5'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='13'
						height='13'
						viewBox='0 0 13 13'
						fill='none'
						className='flex-shrink-0 mt-0.5'>
						<path
							d='M11.3261 2.40115H9.86747V0.431457C9.86747 0.18759 9.6619 0 9.41717 0C9.17244 0 8.96687 0.19697 8.96687 0.431457V2.40115H3.59262V0.431457C3.59262 0.18759 3.38705 0 3.14232 0C2.89759 0 2.68223 0.18759 2.68223 0.431457V2.40115H1.67395C0.753765 2.40115 0 3.12338 0 4.00505V11.3961C0 12.2778 0.753765 13 1.67395 13H11.3261C12.2462 13 13 12.2778 13 11.3961V4.00505C13 3.12338 12.2462 2.40115 11.3261 2.40115ZM1.67395 3.24531H11.3261C11.7666 3.24531 12.119 3.58297 12.119 4.00505V5.57143H0.881024V4.00505C0.881024 3.59235 1.23343 3.24531 1.67395 3.24531ZM11.3261 12.1558H1.67395C1.23343 12.1558 0.881024 11.8182 0.881024 11.3961V6.50938H12.119V11.3961C12.119 11.8182 11.7666 12.1558 11.3261 12.1558Z'
							fill='#062A30' />
					</svg>

					<div className='flex flex-col'>
						<p className='text-sm font-semibold leading-140% !text-wording'>{ startDateFormatted }</p>
						<p className='text-xs leading-126% !text-grey-2'>
							{ startTimeFormatted || endTimeFormatted
								? `${ startTimeFormatted } to ${ isSameDay(startDate, endDate) ? '' : `${ endDateFormatted } ` }${ endTimeFormatted } - ${ timezone }`
								: 'TBD' }
						</p>
					</div>
				</div>
			);
		}
	};

	const renderTabs = () => {
		return (
			<div className='relative mt-3.5 mb-[26px] lg:mb-8'>
				<DragScroll
					wrapperId='tabs-events'
					className='gap-x-2 py-1 max-md:px-4 md:pr-4 max-md:-mx-4 md:-mr-3'
				>
					{ tabs.map((tab: SelectOption) => {
						return (
							<Button
								key={ tab.name }
								className={ clsxm(
									'flex items-center justify-center text-sm leading-126% px-4 py-[5px] rounded-[5px] border-[0.5px] cursor-pointer',
									tab.value === selectedCategory ? 'bg-steel text-white border-steel font-medium' : 'bg-white text-steel border-grey-1 hover:opacity-80'
								) }
								onClick={ () => setSelectedCategory(tab.value) }
							>
								{ tab.name }
							</Button>
						);
					}) }
				</DragScroll>
			</div>
		);
	};

	const renderContent = () => {
		if (loading) {
			return (
				<div className='flex mt-20 justify-center h-full min-h-[300px]'>
					<Spinner className='text-steel w-8 h-8' />
				</div>
			);
		}

		if (!loading && !listData?.length) {
			return (
				<div className='flex flex-col items-center justify-center gap-1.5 text-center mt-11 sm:mt-[55px]'>
					<p className='text-base !text-steel leading-140%'>You have no upcoming events yet</p>
					<Link
						href='/create'
						className='underline !text-steel font-medium text-lg leading-[111%]'>Create your first event</Link>
				</div>
			);
		}

		return (
			<div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[25px] sm:gap-x-[23px] sm:gap-y-10'>
				{ listData.map((e: EventResp) => {
					return (
						<Link
							href={ `/events/${ e.event_code }` }
							key={ e.event_code }
							className='flex flex-col max-sm:bg-super-light-grey max-sm:p-[15px] max-sm:rounded-[5px] max-sm:border-[0.5px] max-sm:border-light-grey'
						>
							<div className='relative overflow-hidden w-full h-full aspect-square'>
								<Image
									src={ e.poster_img || '/images/create/default_cover.png' }
									alt=''
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									className='object-cover'
									fill
								/>
								<div className={ clsxm(
									'absolute top-0 right-0 py-[6px] px-2.5 text-lg sm:text-sm font-semibold text-center flex items-center justify-center uppercase',
									eventStatusClassNames(e.is_expired)
								) }>
									{ eventStatusText(e.is_expired) }
								</div>
							</div>
							<div className='mt-[11px] sm:mt-[13px]'>
								<h5 className='text-lg sm:text-base font-semibold sm:leading-126% !text-steel mb-[3px]'>{ e.title }</h5>
								<p className='text-sm sm:text-10px leading-[110%] sm:leading-126% flex items-center gap-[3px] sm:gap-[5px]'>
									<span>Hosted By</span>
									<Image
										src='/images/avatars/avatars_1.png'
										width={ 15 }
										height={ 15 }
										alt=''
										className='rounded-full overflow-hidden bg-cover'
									/>
									<span>{ e.creator_name }</span>
								</p>

								{ renderDateTime(e) }
							</div>
						</Link>
					);
				}) }
			</div>
		);
	};

	return (
		<Layout
			type='webapp'
			data={ navigationData }
			title='Event List'
		>
			<div className='container-center mt-60px pt-[11px] lg:pt-[35px] pb-[100px] w-full'>
				<h4 className='text-2xl md:text-3xl lg:text-[32px] font-semibold leading-100% md:leading-120% -tracking-0.005em text-left'>
					{ getGreetings((session?.user?.fname ?? '') + ' ' + (session?.user?.lname ?? '')) }
				</h4>

				{ renderTabs() }
				{ renderContent() }

				<Link
					href='/create'
					className='w-14 h-14 rounded-full flex items-center justify-center bg-primary hover:bg-opacity-90 text-white fixed bottom-[22px] right-5 lg:right-10 lg:bottom-10'
				>
					<Plus />
				</Link>
			</div>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async({ req, res }) => {
	const session = await getServerSession(req, res, authOptions(req?.cookies));
	if (!session?.user?.is_host) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
	try {
		const response = await axios.get(endpoints.navigationData);
		const navigationData = await response?.data;

		return {
			props: { navigationData },
		};
	} catch (error) {
		return { props: { navigationData: navigationDataLocal } };
	}
};

export default EventListPage;
