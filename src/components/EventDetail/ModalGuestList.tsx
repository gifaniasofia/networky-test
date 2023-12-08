import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import CloseIcon from 'public/images/icons/close.svg';

import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { joinCategoriesData } from '@/helpers/misc';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { ProfileHistory } from '@/openapi';
import { EventDetailTypes } from '@/typings';

import { QuestionnaireList } from '../Mutuals';
import { resolveIconSocialMedia } from '../Mutuals/BoxSocialMedia';
import { Sheet, SheetContent } from '../Sheet';
import Spinner from '../Spinner';

import GuestList from './GuestList';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const initPersonDetail: IEvent.EventAttendanceRespExt = {
	fname: '',
	lname: '',
	phone: '',
	avatar: ''
};

const initEventDetail: ProfileHistory = {
	event_code: '',
	title: '',
	poster_img: '',
	questionnaire_answers: []
};

const ModalGuestList: React.FC<EventDetailTypes.ModalGuestListProps> = ({
	open,
	onClose,
	// rsvpOptions,
	attendancesList,
	eventCode,
	loadingGuestList
}) => {
	const apiClient = useApiClient();
	// const [activeTab, setActiveTab] = useState<string>('all');
	const [focusModal, setFocusModal] = useState<string>('list');
	const [personDetail, setPersonDetail] = useState<IEvent.EventAttendanceRespExt>(initPersonDetail);
	const [eventDetail, setEventDetail] = useState<ProfileHistory>(initEventDetail);
	const [loadingEvent, setLoadingEvent] = useState<boolean>(false);
	// const [tabs, setTabs] = useState<EventDetailTypes.TabGuestList[]>([
	// 	{
	// 		id: 'all',
	// 		text: 'All',
	// 		image: '/images/emoji/people.png',
	// 		count: 0
	// 	},
	// 	...rsvpOptions
	// ]);
	// const [data, setData] = useState<ObjectKey<IEvent.EventAttendanceRespExt[]>>({
	// 	'0': [],
	// 	'1': [],
	// 	'2': [],
	// 	all: []
	// });

	// useEffect(() => {
	// 	if (attendancesList?.length) {
	// 		const groupAttendancesByStatus = attendancesList?.reduce((group: ObjectKey<IEvent.EventAttendanceRespExt[]>, attendance: IEvent.EventAttendanceRespExt) => {
	// 			const attendance_status = `${ (attendance.attendance_status ?? 0) }`;

	// 			group[attendance_status] = group[attendance_status] ?? [];
	// 			group[attendance_status].push(attendance);
	// 			return group;
	// 		}, {});

	// 		const extendedGroupAttendances: ObjectKey<IEvent.EventAttendanceRespExt[]> = {
	// 			...groupAttendancesByStatus,
	// 			all: attendancesList ?? []
	// 		};

	// 		const modifiedRSVPOptions = rsvpOptions?.map((option: CreateEventTypes.RSVPOption) => {
	// 			if (option.id) {
	// 				const people = extendedGroupAttendances[`${ option.id }`];

	// 				return {
	// 					...option,
	// 					count: people?.length || 0
	// 				};
	// 			}

	// 			return {
	// 				...option,
	// 				count: 0
	// 			};
	// 		});
	// 		const countAll = modifiedRSVPOptions.reduce((acc, curr) => acc + (curr.count || 0), 0);
	// 		const tabGuestList: EventDetailTypes.TabGuestList[] = [
	// 			{
	// 				id: 'all',
	// 				text: 'All',
	// 				image: '/images/emoji/people.png',
	// 				count: countAll
	// 			},
	// 			...modifiedRSVPOptions
	// 		];

	// 		setData(extendedGroupAttendances);
	// 		setTabs(tabGuestList);
	// 	}
	// }, [attendancesList]);

	useEffect(() => {
		const getEventListHistory = async(profileId: number) => {
			try {
				setLoadingEvent(true);
				const response = await ((await apiClient.profileApi()).profileHistories(profileId));

				if (response?.status === 200) {
					const data: ProfileHistory[] = response?.data?.data ?? [];
					const foundEventHistory = data?.find(eventHistory => eventHistory.event_code === eventCode);
					if (foundEventHistory) {
						setEventDetail(foundEventHistory);
					}
				}
			} catch (error) {
				setEventDetail(initEventDetail);
				handleCatchError(error);
			} finally {
				setLoadingEvent(false);
			}
		};

		if (personDetail?.profile_id) {
			getEventListHistory(personDetail?.profile_id);
		}
	}, [personDetail?.profile_id]);

	const onBackToGuestList = () => {
		// if (focusModal === 'event') {
		// 	setEventDetail(initEventDetail);
		// 	setFocusModal('guest');
		// 	return;
		// }

		setPersonDetail(initPersonDetail);
		setFocusModal('list');
	};

	const onClickGuest = (person: IEvent.EventAttendanceRespExt) => {
		setPersonDetail(person);
		setFocusModal('guest');
	};

	// const onClickEventDetail = (eventData: ProfileHistory, focus: string) => {
	// 	if (eventData) {
	// 		setEventDetail(eventData);
	// 		setFocusModal(focus);
	// 	}
	// };

	const onCloseSheet = () => {
		onClose();

		setTimeout(() => {
			setEventDetail(initEventDetail);
			setPersonDetail(initPersonDetail);
			setFocusModal('list');
			// setActiveTab('all');
		}, 300);
	};

	const renderHeaderModal = () => {
		// if (focusModal === 'guest' || focusModal === 'event') {
		// 	return (
		// 		<div>
		// 			<Button
		// 				className='flex items-center gap-x-4 text-steel text-body-5 focus:outline-0'
		// 				onClick={ onBackToGuestList }
		// 			>
		// 				<ChevronLeftIcon className='flex-shrink-0 text-primary' />
		// 				<span>{ focusModal === 'guest' ? 'Guest List' : 'My Contact' }</span>
		// 			</Button>
		// 		</div>
		// 	);
		// }

		return (
			<div className='flex items-center justify-between relative'>
				<div className='flex items-baseline gap-x-3'>
					<h5 className='text-steel text-xl font-semibold leading-120%'>Guest List</h5>
					<p className='text-steel leading-120% text-xs'>{ attendancesList?.length ?? '0' } Guest</p>
				</div>
				<button
					className='absolute top-0 right-0 focus:outline-0 focus:ring-0 focus:border-0'
					onClick={ onCloseSheet }
				>
					<CloseIcon className='text-steel w-[30px] h-[30px]' />
				</button>
			</div>
		);
	};

	const renderContentGuestList = () => {
		// if (focusModal === 'list') {
		if (loadingGuestList) {
			return (
				<div className='flex justify-center h-[65vh] mt-[19px] pt-5'>
					<Spinner className='text-purple w-5 h-5' />
				</div>
			);
		}

		return (
			<div className='h-[65vh] overflow-y-auto custom-scrollbar mt-[19px] pr-[15px]'>
				<GuestList
					data={ attendancesList ?? [] }
					onClick={ onClickGuest }
				/>
			</div>
		);
		// return (
		// 	<div className='h-full'>
		// 		<div className='grid grid-cols-9 py-6 h-full'>
		// 			<div className='flex flex-col col-span-2'>
		// 				{ tabs.map((tab: EventDetailTypes.TabGuestList) => (
		// 					<div
		// 						key={ tab.text }
		// 						className={ clsxm(
		// 							'h-9 w-full flex items-center gap-9px px-3 py-1.5 cursor-pointer border-r border-light-grey',
		// 							activeTab === tab.id ? 'bg-grey-1 bg-opacity-30' : 'hover:bg-grey-1 hover:bg-opacity-10'
		// 						) }
		// 						onClick={ () => setActiveTab(tab.id || 'all') }
		// 					>
		// 						<div className='relative overflow-hidden w-5 h-5'>
		// 							<Image
		// 								src={ tab.image }
		// 								alt={ tab.text }
		// 								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
		// 								fill
		// 								className='object-contain'
		// 							/>
		// 						</div>

		// 						<span className='!text-steel text-xs leading-120%'>{ tab.text } { !tab.count ? '' : `(${ tab.count })` }</span>
		// 					</div>
		// 				)) }
		// 			</div>

		// 			<div className='h-full overflow-y-auto overflow-x-hidden col-span-7 pl-4'>
		// 				<GuestList
		// 					data={ data[activeTab] }
		// 					onClick={ onClickGuest }
		// 				/>
		// 			</div>
		// 		</div>
		// 	</div>
		// );
		// }

		// if (focusModal === 'guest' || focusModal === 'event') {
		// 	return (
		// 		<MutualDetail
		// 			personDetail={ personDetail }
		// 			eventDetail={ eventDetail }
		// 			detailType='content-modal'
		// 			focus={ focusModal }
		// 			onClickEventDetail={ onClickEventDetail }
		// 		/>
		// 	);
		// }

		// return null;
	};

	const renderSocialMedia = (key: string) => {
		const iconSocialMedia = resolveIconSocialMedia(key);
		const data = personDetail as ObjectKey<string | number>;

		if (data[key]) {
			return (
				<div className='flex items-center gap-[7px] text-left'>
					<div className='w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-super-light-grey'>
						{ iconSocialMedia }
					</div>
					<div>
						<p className={ clsxm(
							key === 'email' ? 'break-all' : '',
							'!text-steel text-base md:text-xs leading-126%'
						) }>{ data[key] ? data[key] : '-' }</p>
					</div>
				</div>
			);
		}

		return null;
	};

	const renderContentGuestDetail = () => {
		return (
			<div className='bg-super-light-grey h-full col-span-4 px-5 py-3 relative'>
				<button
					className='absolute top-[5px] right-[3px] focus:outline-0 focus:ring-0 focus:border-0'
					onClick={ onBackToGuestList }
				>
					<CloseIcon className='text-steel w-[30px] h-[30px]' />
				</button>

				<div className='mt-[43px]'>
					<div className='rounded-[5px] bg-white py-3 px-[13px] flex gap-x-[7px] mb-1.5'>
						<div className='relative overflow-hidden w-[50px] h-[50px] rounded-full bg-grey-1 flex-shrink-0'>
							{ personDetail?.avatar && (
								<Image
									src={ personDetail?.avatar }
									alt=''
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									fill
								/>
							) }
						</div>
						<div>
							<p className='text-steel text-xl font-semibold tracking-0.005em'>
								{ personDetail?.fname } { personDetail?.lname }
							</p>

							<p className='text-steel mt-3.5 text-xs leading-[136%]'>
								{ joinCategoriesData(personDetail?.categories ?? []) }
							</p>
						</div>
					</div>
					<div className='rounded-[5px] bg-white p-2'>
						<div className='flex flex-col gap-y-[9px]'>
							{ renderSocialMedia('email') }
							{ renderSocialMedia('whatsapp') }
							{ renderSocialMedia('phone') }
							{ renderSocialMedia('linkedin') }
						</div>
					</div>
					<div className='mt-3'>
						{ !loadingEvent && (
							<QuestionnaireList eventDetail={ eventDetail } />
						) }
					</div>
				</div>
			</div>
		);
	};

	const renderModalGuestList = () => {
		return (
			<Sheet
				onOpenChange={ onCloseSheet }
				open={ open }
			>
				<SheetContent
					side='center'
					className={ clsxm(
						'w-full !h-auto !p-0',
						focusModal === 'guest' ? 'max-w-[1039px]' : 'max-w-[630px]'
					) }
				>
					<div className='grid grid-cols-10'>
						<div className={ clsxm('bg-base py-3 px-5', focusModal === 'guest' ? 'col-span-6' : 'col-span-10') }>
							{ renderHeaderModal() }
							{ renderContentGuestList() }
						</div>
						{ focusModal === 'guest'
							? renderContentGuestDetail()
							: null }
					</div>
				</SheetContent>
			</Sheet>
		);
	};

	return renderModalGuestList();
};

export default ModalGuestList;