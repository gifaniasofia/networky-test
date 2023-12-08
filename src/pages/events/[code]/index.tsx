import { useState } from 'react';
import axios from 'axios';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import { EventDetailComponent } from '@/components';
import { Api } from '@/configs/api';
import { endpoints } from '@/constant';
import createEventDataLocal from '@/constant/data/create.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { getRandomIntInclusive, removeTags } from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useApiClient, useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventRespDetail } from '@/openapi';

const apiInstance = new Api();

const EventDetailPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps> & { data?: EventRespDetail; }> = ({
	navigationData,
	createEventData,
	data
}) => {
	const apiClient = useApiClient();
	const router = useRouter();
	const windowDimensions = useWindowDimensions();

	const [openModalGuestList, setOpenModalGuestList] = useState<boolean>(false);
	const [attendancesList, setAttendancesList] = useState<IEvent.EventAttendanceRespExt[]>([]);
	const [loadingGuestList, setLoadingGuestList] = useState<boolean>(false);

	const eventCode = (router.query?.code ?? '') as string;

	const setRandomAvatar = (list: IEvent.EventAttendanceRespExt[]) => {
		return list.map(person => ({
			...person,
			avatar: `/images/avatars/avatars_${ [getRandomIntInclusive(1, 8)] }.png`
		}));
	};

	const getListOfAttendances = async() => {
		try {
			setLoadingGuestList(true);
			const res = await (await apiClient.eventsApi()).eventAttendanceList(eventCode);

			if (res.status === 200) {
				const dataAttendances = res.data?.data ?? [];

				setAttendancesList(setRandomAvatar(dataAttendances));
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingGuestList(false);
		}
	};

	const onClickCounterGuests = () => {
		const isMobile = windowDimensions.width < screens.md;

		if (!isMobile) {
			getListOfAttendances();
			setOpenModalGuestList(true);
		} else {
			router.push(`/events/${ data?.event_code }/guests`);
		}
	};

	const renderButtonPublish = () => {
		return (
			<EventDetailComponent.ButtonPublish
				className={ clsxm('w-full', !data?.is_host ? 'hidden' : '') }
				disabled={ data?.is_expired }
			>
				{ createEventData.publishEvent }
			</EventDetailComponent.ButtonPublish>
		);
	};

	const renderMenuModifyEventDetail = () => {
		return (
			<EventDetailComponent.Menu
				eventStatus={ data?.event_status }
				attendanceCount={ data?.attendance_count }
				isExpired={ data?.is_expired }
				onClickCounterGuests={ onClickCounterGuests }
			/>
		);
	};

	const renderFloatingMobile = () => {
		if (data?.event_status === IEvent.EventStatus.DRAFT || data?.event_status === IEvent.EventStatus.CANCELED) {
			return (
				<div className='flex flex-col gap-2 w-full'>
					{ renderMenuModifyEventDetail() }
					{ renderButtonPublish() }
				</div>
			);
		}

		if (data?.event_status === IEvent.EventStatus.HOSTED) {
			return renderMenuModifyEventDetail();
		}

		return null;
	};

	const renderModalGuestList = () => {
		if (data?.is_host) {
			return (
				<EventDetailComponent.ModalGuestList
					rsvpOptions={ createEventData?.rsvp?.options }
					open={ openModalGuestList }
					onClose={ () => setOpenModalGuestList(false) }
					attendancesList={ attendancesList }
					eventCode={ data?.event_code }
					loadingGuestList={ loadingGuestList }
				/>
			);
		}

		return null;
	};

	const renderRSVP = (render?: 'button' | 'detail') => {
		return (
			<EventDetailComponent.RSVP
				detailEvent={ data }
				isHost={ data?.is_host }
				rsvpData={ createEventData.rsvp }
				render={ render }
			/>
		);
	};

	const setMetaDescription = () => {
		if (data && data?.description) {
			return removeTags(data?.description ?? '')?.substring(0, 160);
		}
	};

	const isNavbarWithQueryLink = () => {
		return !data?.is_expired
			&& data?.event_status !== IEvent.EventStatus.DRAFT
			&& data?.event_status !== IEvent.EventStatus.CANCELED;
	};

	return (
		<EventDetailComponent.Container
			showEffect={ !!data?.effect_name }
			navigationData={ navigationData }
			createEventData={ createEventData }
			pageTitle={ data?.title || 'Event' }
			og_image={ data?.poster_img }
			pageDesc={ setMetaDescription() }
			navbarWithQueryLink={ isNavbarWithQueryLink() }
		>
			<div className='max-w-5xl mx-auto pb-[98px] lg:pb-[189px] max-lg:pt-6'>
				<div className='flex max-md:flex-col md:grid md:grid-cols-10 gap-[9px] md:gap-[13px]'>
					<div className='w-full md:col-span-5 lg:col-span-4'>
						<EventDetailComponent.CardEvent
							data={ data }
							defaultCover={ createEventData.defaultCover }
						/>

						<div className='mt-[9px] md:mt-[13px]'>
							<EventDetailComponent.CopyLink link={ `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ data?.event_code ?? '' }` } />
						</div>

						{ data?.is_host && (
							<div className={ clsxm(
								'max-md:hidden',
								(data?.event_status === IEvent.EventStatus.DRAFT || data?.event_status === IEvent.EventStatus.CANCELED)
									? 'md:mt-9'
									: 'md:mt-[29px]'
							) }>
								{ renderMenuModifyEventDetail() }
							</div>
						) }

						{ (data?.event_status === IEvent.EventStatus.DRAFT || data?.event_status === IEvent.EventStatus.CANCELED) && (
							<div className='hidden md:flex justify-center w-full md:mt-2'>
								{ renderButtonPublish() }
							</div>
						) }
					</div>
					<div className='flex flex-col w-full md:col-span-5 lg:col-span-6'>
						<div className='flex flex-col gap-[9px] md:gap-[13px]'>
							<div>
								{ renderRSVP('detail') }
							</div>
							<EventDetailComponent.Location
								addr_lng={ data?.addr_lng }
								addr_ltd={ data?.addr_ltd }
								addr_name={ data?.addr_name }
								addr_detail={ data?.addr_detail ?? data?.location }
								addr_note={ data?.addr_note }
							/>
						</div>

						{ /* <EventDetailComponent.Message text={ data?.additional_msg } /> */ }
						<EventDetailComponent.Description text={ data?.description ?? '' } />
					</div>
				</div>
			</div>

			{ data?.is_host
				&& (
					<div className='md:hidden w-full sticky bottom-0 z-[70] pb-[76px]'>
						{ renderFloatingMobile() }
					</div>
				) }

			{ !data?.is_host && typeof data?.attendance_status === 'undefined'
				&& (
					<div className='md:hidden w-full sticky bottom-0 z-[70] pb-[76px]'>
						{ renderRSVP('button') }
					</div>
				) }

			{ renderModalGuestList() }
		</EventDetailComponent.Container>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	try {
		const code = (context.params?.code ?? '') as string;

		const [navigation, createEvent, session] = await Promise.all([
			axios.get(endpoints.navigationData),
			axios.get(endpoints.createEventData),
			getSession({ req: context.req })
		]);

		const eventDetail = await (await apiInstance.eventsApi()).showEventByCode(code, {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${ session?.token ? 'Bearer ' + session?.token : '' }`
			}
		});

		return {
			props: {
				navigationData: navigation?.data,
				createEventData: createEvent?.data,
				data: eventDetail?.data?.data
			}
		};

	} catch (error) {
		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal,
				data: {
					event_code: '',
					title: '',
					poster_img: '',
					description: '',
					location: '',
					map_link: '',
					is_host: false,
					max_spot: 0,
					// additional_msg: '',
					start_date: '',
					end_date: '',
					creator_name: '',
					background_name: '',
					effect_name: ''
				}
			}
		};
	}
};

export default EventDetailPage;
