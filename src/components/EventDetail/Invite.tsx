/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { getRandomIntInclusive } from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useApiClient, useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { ProfileHistory } from '@/openapi';
import { EventDetailTypes } from '@/typings';

import Button from '../Button';
import CopyToClipboard from '../CopyToClipboard';
import DescribeTags from '../DescribeTags';
import { BoxEventList, BoxProfileDetail, BoxSocialMedia, Detail as MutualDetail } from '../Mutuals';
import NavbarPageDetail from '../Navbar/PageDetail';
import Spinner from '../Spinner';

const initEventDetail: ProfileHistory = {
	event_code: '',
	title: '',
	poster_img: '',
	questionnaire_answers: []
};

const Invite: React.FC<EventDetailTypes.InviteProps> = ({
	invited,
	contacts,
	selectedOptions,
	setSelectedOptions,
	loading
}) => {
	const router = useRouter();
	const windowDimensions = useWindowDimensions();
	const apiClient = useApiClient();

	const [showInvited, setShowInvited] = useState<boolean>(false);
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [personDetail, setPersonDetail] = useState<IEvent.ContactRespExt>({
		fname: '',
		lname: '',
		phone: '',
		avatar: ''
	});
	const [eventDetail, setEventDetail] = useState<ProfileHistory>(initEventDetail);
	const [openModalContactDetail, setOpenModalContactDetail] = useState<boolean>(false);

	const eventCode = (router?.query?.code ?? '') as string;
	const pageFocus = (router?.query?.focus ?? '') as string;
	const profileId = (router?.query?.guest ?? '') as string;
	const eventCodeGuest = (router?.query?.event ?? '') as string;

	const isPreviousInvitedExist = !!invited?.length;
	const isMobile = windowDimensions.width < screens.md;

	const handleCheckboxChange = (value?: number) => {
		if (value) {
			setSelectedOptions(prevSelected =>
				prevSelected.includes(value)
					? prevSelected.filter(item => item !== value)
					: [...prevSelected, value]
			);
		}
	};

	const getPersonDetail = async() => {
		try {
			const response = await ((await apiClient.profileApi()).getProfileByID(+ profileId));

			if (response?.status === 200) {
				const personData = response?.data?.data;

				if (personData) {
					setPersonDetail({
						...personData,
						avatar: personDetail?.avatar || `/images/avatars/avatars_${ [getRandomIntInclusive(1, 8)] }.png`,
						profile_id: + profileId
					});
				}

				if (!isMobile) {
					setOpenModalContactDetail(true);
				}
			}
		} catch (error) {
			handleCatchError(error);
		}
	};

	const getEventListHistory = async() => {
		try {
			const response = await ((await apiClient.profileApi()).profileHistories(+ profileId));

			if (response?.status === 200) {
				const data: ProfileHistory[] = response?.data?.data ?? [];

				const foundEvent = data?.find(item => item.event_code === eventCodeGuest);
				if (foundEvent) {
					setEventDetail(foundEvent);
				}
			}
		} catch (error) {
			handleCatchError(error);
		}
	};

	useEffect(() => {
		if (selectedOptions.length && (selectedOptions.length === contacts?.length)) {
			setSelectAll(true);
		} else {
			setSelectAll(false);
		}
	}, [selectedOptions?.length, contacts?.length]);

	useEffect(() => {
		if (profileId && !isMobile) {
			getPersonDetail();
		}
	}, [profileId, isMobile]);

	useEffect(() => {
		if (eventCodeGuest) {
			getEventListHistory();
		}
	}, [eventCodeGuest]);

	const onClickProfileDetail = (profile: IEvent.ContactRespExt) => {
		if (!isMobile) {
			if (profile) setPersonDetail(profile);

			router.push({
				pathname: router.pathname,
				query: {
					code: eventCode,
					focus: 'guest',
					guest: profile.profile_id
				}
			}).then(() => {
				setOpenModalContactDetail(true);
			});
		} else {
			router.push(`/events/${ eventCode }/guests/${ profile.profile_id }`);
		}
	};

	const onClickEventDetail = (eventData: ProfileHistory, focus: string) => {
		router.push({
			pathname: router.pathname,
			query: {
				code: eventCode,
				focus,
				guest: profileId,
				event: eventData?.event_code ?? ''
			}
		}).then(() => {
			if (eventData) {
				setEventDetail(eventData);
			}
		});
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedOptions([]);
		} else {
			if (contacts?.length) {
				const allValues = contacts?.map(option => option.profile_id ?? 0);
				setSelectedOptions(allValues);
			}
		}
		setSelectAll(prev => !prev);
	};

	const renderButtonCopyLink = (text?: string) => {
		return (
			<CopyToClipboard
				text={ `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ eventCode }` }
				className={ clsxm(
					'btn btn-purple md:!px-15px !py-2 !translate-y-0 leading-120%',
					isPreviousInvitedExist ? '!px-5' : 'px-2 h-full max-sm:w-full'
				) }
			>
				<span className='flex items-center justify-center'>
					<span className={ isPreviousInvitedExist ? 'text-xs' : 'text-lg max-md:font-medium leading-120% md:text-xs' }>
						{ text ? text : 'Copy Event Link' }
					</span>
				</span>
			</CopyToClipboard>
		);
	};

	const renderTitle = (customText?: string) => {
		return (
			<h2 className='!text-steel text-lg md:text-base !font-medium leading-[130%] md:leading-[101.5%]'>
				{ customText
					? customText
					: isPreviousInvitedExist
						? 'Invite'
						: 'Invite Past Guests' }
			</h2>
		);
	};

	const renderSelectAllCheckbox = () => {
		return (
			<div>
				<span className='mr-2 text-sm'>Select All</span>
				<input
					checked={ selectAll }
					onChange={ handleSelectAll }
					type='checkbox'
					className='text-purple cursor-pointer bg-light-grey bg-opacity-50 border-0 rounded-sm focus:ring-purple'
				/>
			</div>
		);
	};

	const renderContactsLengthText = () => {
		return <p className='text-sm'>{ contacts?.length || 0 } people</p>;
	};

	const onClickButtonSend = () => {
		if (window) {
			window.localStorage.setItem('tempInvited', JSON.stringify(selectedOptions));
		}

		router.push({
			pathname: `/events/${ eventCode }/invite`,
			query: { send: 'message' }
		});
	};

	const renderButtonSend = (text: string) => {
		return (
			<Button
				onClick={ onClickButtonSend }
				disabled={ !selectedOptions.length }
				className={ clsxm(
					'btn max-md:btn-primary disabled:text-grey-2 md:text-primary m-0 !py-2 md:!p-0 text-lg md:text-sm font-medium leading-[111%] md:leading-[120%]',
					isPreviousInvitedExist ? '' : 'max-md:h-full max-sm:w-full'
				) }
			>{ text }</Button>
		);
	};

	const renderButtonArrowRight = (profile: IEvent.ContactRespExt) => {
		return (
			<Button onClick={ () => onClickProfileDetail(profile) }>
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
			</Button>
		);
	};

	const renderContactItem = (contactItem: IEvent.ContactRespExt, isInvited?: boolean) => {
		return (
			<div className='flex items-center justify-between space-x-2'>
				<div className='flex items-start gap-2.5'>
					{ contactItem.avatar
						? (
							<Image
								alt='avatar'
								width={ 20 }
								height={ 20 }
								src={ contactItem.avatar }
								className='flex-shrink-0 mt-0.5 md:mt-px'
							/>
						)
						: <div className='flex w-5 h-5 bg-grey-1 rounded-full' /> }
					<p className='text-steel text-lg md:text-sm leading-120%'>{ contactItem.fname } { contactItem.lname }</p>
				</div>
				<div className='flex items-center flex-shrink-0 gap-2 sm:gap-3.5'>
					<DescribeTags
						tags={ (contactItem?.categories ?? [])?.map(category => category.cat_name ?? '') }
						maxShowLength={ 1 }
						withPortal
					/>
					<div className='flex items-center gap-2.5 md:gap-5'>
						{ isInvited
							? (
								<input
									type='checkbox'
									checked
									readOnly
									className='text-dark-purple bg-transparent rounded-sm focus:ring-0 focus:outline-none focus:border-none'
								/>
							)
							: (
								<input
									type='checkbox'
									checked={ selectedOptions.findIndex(option => option === contactItem.profile_id) > -1 }
									onChange={ () => handleCheckboxChange(contactItem.profile_id) }
									className='text-purple cursor-pointer bg-light-grey bg-opacity-50 border-0 rounded-sm focus:ring-purple'
								/>
							) }

						{ renderButtonArrowRight(contactItem) }
					</div>
				</div>
			</div>
		);
	};

	const renderModalProfileDetail = () => {
		if (!isMobile) {
			return (
				<MutualDetail
					eventDetail={ eventDetail }
					personDetail={ personDetail }
					detailType='modal'
					openModalDetail={ openModalContactDetail }
					setOpenModalDetail={ setOpenModalContactDetail }
					onClickEventDetail={ onClickEventDetail }
					baseUrl={ `/events/${ eventCode }/invite` }
				/>
			);
		}

		return null;
	};

	const renderData = () => {
		if (pageFocus && pageFocus === 'guest' && isMobile) {
			return (
				<div className='mt-[98px] flex flex-col gap-y-[7px] pb-[100px] w-full container-center'>
					<BoxProfileDetail personDetail={ personDetail } />
					<BoxSocialMedia personDetail={ personDetail } />
					<BoxEventList personDetail={ personDetail } />
				</div>
			);
		}

		if (loading) {
			return (
				<div className='flex items-center justify-center h-full'>
					<Spinner className='text-purple w-8 h-8' />
				</div>
			);
		}

		return (
			<>
				{ isPreviousInvitedExist && (
					<div className={ clsxm(showInvited ? 'border-b-[0.5px] border-light-grey' : '') }>
						<button
							onClick={ () => setShowInvited(prev => !prev) }
							className='bg-light-grey/50 w-full flex items-center justify-between py-2 md:py-3 px-5'
						>
							<div className='flex text-base md:text-xs leading-120% items-center gap-2 text-steel'>
								<p>Invited People</p>
								<p>({ invited?.length || 0 })</p>
							</div>
							<svg
								width='13'
								height='6'
								viewBox='0 0 13 6'
								fill='none'
								className={ clsxm(
									'transform transition-all',
									showInvited ? 'rotate-180' : 'rotate-0'
								) }
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M13 0L0 0L6.70968 6L13 0Z'
									fill='#062A30' />
							</svg>
						</button>
						<div className={ clsxm(
							'flex flex-col gap-3 px-5 transition-all',
							showInvited ? 'pt-4 pb-5' : 'max-h-0 overflow-hidden'
						) }>
							{ invited?.map((contactInvited, idx) => {
								return (
									<div key={ idx }>
										{ renderContactItem(contactInvited, true) }
									</div>
								);
							}) }
						</div>
					</div>
				) }

				<div className='flex-1'>
					{ isPreviousInvitedExist && (
						<div className='w-full flex items-center justify-between py-3 px-5'>
							<div className='flex items-end gap-2 text-steel'>
								<p className='text-lg font-medium leading-[130%]'>My Contacts</p>
								{ renderContactsLengthText() }
							</div>

							{ renderSelectAllCheckbox() }
						</div>
					) }
					<div className='flex flex-col gap-[15px] px-5 transition-all pt-2 pb-5 md:overflow-y-auto md:max-h-[610px] custom-scrollbar'>
						{ !contacts?.length
							? (
								<div className='flex flex-col items-center justify-center gap-2 mt-16'>
									<p>You have no contacts yet</p>
								</div>
							)
							: (
								<>
									{ contacts?.map((contact, idx) => {
										return (
											<div key={ idx }>
												{ renderContactItem(contact) }
											</div>
										);
									}) }
								</>
							) }
					</div>
				</div>
			</>
		);
	};

	const renderActions = () => {
		if (isMobile && pageFocus) return null;

		return (
			<div className='w-full pt-3 pb-6 px-5 border-t border-light-grey relative max-md:z-[70] max-md:bg-base'>
				{ !isPreviousInvitedExist
					? (
						<div className='md:hidden'>
							<div className={ isPreviousInvitedExist ? 'flex items-center justify-between' : 'flex flex-col gap-y-[5px]' }>
								<div className='flex items-center gap-2'>
									<p className='md:underline text-xs md:text-sm leading-140% !text-steel'>{ selectedOptions.length }<span className='md:hidden'> Contacts</span> Selected</p>
								</div>

								<div className='grid grid-cols-5 gap-18px w-full'>
									<div className='col-span-3'>
										{ !isPreviousInvitedExist && renderButtonCopyLink('Share Event Link') }
									</div>
									<div className='col-span-2 flex justify-end'>
										{ renderButtonSend('Send') }
									</div>
								</div>
							</div>
						</div>
					) : null }

				<div className={ !isPreviousInvitedExist ? 'max-md:hidden' : '' }>
					<div className='flex items-center justify-between gap-2'>
						<span className='text-base md:text-sm !text-wording !font-medium leading-[101.5%]'>{ selectedOptions.length } selected</span>

						{ renderButtonSend('Next') }
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<div
				className='flex flex-grow flex-col justify-between w-full col-span-12 md:col-span-7 md:bg-super-light-grey md:border-[0.5px] md:border-light-grey md:rounded-10px'
				style={ { height: isMobile ? (windowDimensions.height ?? '100vh') : '' } }
			>
				<div className='flex-1 flex flex-col h-full max-md:overflow-y-auto max-md:pb-12'>
					<div className='md:hidden'>
						<NavbarPageDetail title={ (
							<>
								{ pageFocus && pageFocus === 'guest'
									? renderTitle('Contacts')
									: (
										<div className='flex items-center gap-x-3.5'>
											{ renderTitle('My Contacts') }
											{ renderContactsLengthText() }
										</div>
									) }
							</>
						) }>
							{ !pageFocus && (
								<>
									{ isPreviousInvitedExist
										? renderButtonCopyLink()
										: renderSelectAllCheckbox() }
								</>
							) }
						</NavbarPageDetail>
					</div>
					<div className='hidden md:flex border-b-[0.5px] border-light-grey items-center justify-between py-3 px-5'>
						{ renderTitle() }
						{ isPreviousInvitedExist
							? renderButtonCopyLink()
							: (
								<div className='flex items-center gap-x-5'>
									{ renderButtonCopyLink() }
									{ renderSelectAllCheckbox() }
								</div>
							) }
					</div>

					{ renderData() }
				</div>

				{ renderActions() }
			</div>

			{ renderModalProfileDetail() }
		</>
	);
};

export default Invite;