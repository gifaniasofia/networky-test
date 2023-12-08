/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { handleCatchError } from '@/helpers/handleError';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventDetailTypes } from '@/typings';

import Button from '../Button';
import CopyToClipboard from '../CopyToClipboard';
import { TextArea } from '../Input';
import NavbarPageDetail from '../Navbar/PageDetail';

const CustomizeMessage: React.FC<EventDetailTypes.CustomizeMessageProps> = ({
	data,
	contacts,
	selectedOptions,
	setSelectedOptions
}) => {
	const router = useRouter();
	const apiClient = useApiClient();

	const eventCode = (router?.query?.code ?? '') as string;

	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setMessage(`Hi {{guest_name}}, ${ data?.creator_name } invited you to ${ data?.title }${ data?.start_date ? ` on ${ format(new Date(data?.start_date), 'eeee, LLL dd') }` : '' }.\nAccept invite: {{event_link}}\nSee you there?`);
	}, [data?.event_code]);

	const selectedContacts = contacts?.filter((contact: IEvent.ContactRespExt) => {
		return selectedOptions?.some((selectedId: number) => {
			return selectedId === contact.profile_id;
		});
	});

	const handleRemoveInviteContact = (value?: number) => {
		if (value) {
			const updatedSelectedOptions = selectedOptions.filter(item => item !== value);

			setSelectedOptions(updatedSelectedOptions);

			if (!updatedSelectedOptions.length) {
				router.back();
			}
		}
	};

	const onClickSendText = async() => {
		try {
			setLoading(true);

			const response = await ((await apiClient.eventsApi()).eventInvite(eventCode, {
				message,
				profile_ids: (selectedOptions ?? [])
			}));

			if (response?.status === 200) {
				if (window) {
					window.localStorage.removeItem('tempInvited');
				}

				router.replace({
					pathname: `/events/${ eventCode }/publish`,
					query: {
						invitation: 'sent'
					}
				});
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoading(false);
		}
	};

	const renderTitle = () => {
		return (
			<h2 className='text-steel text-lg md:text-xl font-medium leading-[130%] md:leading-[101.5%]'>
				Invite Past Guests
			</h2>
		);
	};

	const renderInputMessage = () => {
		return (
			<div className='px-18px md:px-5'>
				<div className='flex items-center gap-2 md:border-t md:border-light-grey md:pt-[13px] mt-4'>
					<span className='text-sm !font-medium leading-[101.5%] !text-steel'>Invitation Message</span>
				</div>

				<div className='mt-1.5'>
					<p className='text-xs leading-120% mb-3'>Guests will receive an Email or SMS invitation.</p>

					<TextArea
						rows={ 4 }
						onChange={ e => setMessage(e.target.value) }
						maxLength={ 160 }
						className='bg-super-light-grey md:bg-white rounded border-[0.5px] max-md:border-light-grey md:border-none w-full text-base md:text-sm px-4 py-3 !text-steel whitespace-pre-wrap resize-none'
						value={ message }
						autoSize={ false }
					/>
					<div className='flex justify-end mt-[11px] md:mt-[7px] text-right'>
						<p className='!text-steel text-[10px] leading-120%'>{ message.length }/160 character</p>
					</div>
				</div>
			</div>
		);
	};

	const renderDisclosureSelectedOptions = () => {
		return (
			<Disclosure
				as='div'
				className='max-md:hidden px-18px md:px-5'>
				{ ({ open }) => (
					<>
						<Disclosure.Button className='focus:ring-0 focus:outline-0 focus:border-0'>
							<div className='text-sm text-steel hidden md:flex items-center gap-1'>
								<span className='underline'>Invitees ({ selectedOptions?.length || '0' })</span>
								<svg
									width='11'
									height='6'
									viewBox='0 0 11 6'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									className={ open ? 'rotate-180 transform' : '' }
								>
									<path
										d='M1 1L5.5 5L10 1'
										stroke='#062A30'
									/>
								</svg>
							</div>
						</Disclosure.Button>

						<Disclosure.Panel className='flex flex-wrap gap-x-7 gap-y-2 mt-18px'>
							{ selectedContacts?.map((contact: IEvent.ContactRespExt, contactIdx: number) => (
								<div
									className='flex items-center gap-2.5'
									key={ contactIdx }
								>
									<div className='flex items-center gap-[7px]'>
										<div className='relative overflow-hidden flex-shrink-0 w-5 h-5 rounded-full bg-grey-1'>
											{ contact.avatar && (
												<Image
													src={ contact.avatar }
													alt=''
													fill
												/>
											) }
										</div>
										<p className='text-sm leading-140%'>{ contact.fname } { contact.lname }</p>
									</div>

									<Button onClick={ () => handleRemoveInviteContact(contact.profile_id) }>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='18'
											height='18'
											viewBox='0 0 18 18'
											fill='none'>
											<line
												x1='13.1114'
												y1='5.21098'
												x2='4.62608'
												y2='13.6963'
												stroke='#062A30' />
											<line
												x1='13.1738'
												y1='13.6954'
												x2='4.68851'
												y2='5.21007'
												stroke='#062A30' />
										</svg>
									</Button>
								</div>
							)) }
						</Disclosure.Panel>
					</>
				) }
			</Disclosure>
		);
	};

	return (
		<div className='flex flex-col justify-between w-full col-span-12 md:col-span-7 md:bg-super-light-grey md:border-[0.5px] md:border-light-grey md:rounded-[5px]'>
			<div className='md:hidden'>
				<NavbarPageDetail title={ renderTitle() } />
			</div>
			<div className='flex-1 flex flex-col py-3'>
				<div className='hidden md:flex items-center justify-between px-18px md:px-5'>
					{ renderTitle() }

					<CopyToClipboard
						text={ `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ eventCode }` }
						className='btn btn-purple !px-5 md:!px-15px !py-2 text-xs leading-120% !translate-y-0'
					>
						Copy Event Link
					</CopyToClipboard>
				</div>
				{ renderDisclosureSelectedOptions() }
				<div className='md:hidden flex flex-col border-b border-light-grey pb-[22px] px-18px md:px-5'>
					<div className='flex justify-between gap-2 text-sm leading-[120%]'>
						<p className='font-semibold'>Send to</p>
						<p>{ selectedOptions?.length || '0' } Contacts</p>
					</div>

					<span className='text-base leading-140% mt-1.5 !text-steel'>{ selectedContacts?.map((contact: IEvent.ContactRespExt) => `${ contact.fname } ${ contact.lname }`)?.join(', ') }</span>
				</div>

				{ renderInputMessage() }

				<div className='flex flex-col items-center justify-center mt-[62px] md:mt-20 px-18px md:px-5'>
					<Button
						onClick={ onClickSendText }
						className='btn btn-primary text-sm'
						disabled={ loading }
					>Send Invites</Button>
					<Button
						onClick={ () => router.back() }
						className='btn text-sm max-md:hidden'
					>Cancel</Button>
				</div>
			</div>
		</div>
	);
};

export default CustomizeMessage;