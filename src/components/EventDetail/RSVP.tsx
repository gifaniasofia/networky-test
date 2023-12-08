import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import TicketIcon from 'public/images/icons/ticket.svg';

import clsxm from '@/helpers/clsxm';
import { IEvent } from '@/interfaces';
import { EventDetailTypes } from '@/typings';

import Button from '../Button';

const RSVP: React.FC<EventDetailTypes.RSVPProps> = ({
	isPreview,
	isHost,
	detailEvent,
	render = 'detail'
}) => {
	const router = useRouter();

	const session = useSession();

	const isRegistered = typeof detailEvent?.attendance_status !== 'undefined';

	const handleJoinEvent = () => {
		if (session.status === 'authenticated') {
			router.push({
				pathname: `/events/${ router?.query?.code ?? '' }/questionnaire`,
				query: {
					attendance_status: 1
				}
			});
		} else {
			router.push({
				pathname: '/auth',
				query: {
					callbackUrl: `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ detailEvent?.event_code }/questionnaire?attendance_status=1`,
					eventCode: detailEvent?.event_code ?? ''
				}
			});
		}
	};

	const renderJoinText = () => {
		if (isHost) {
			return 'You are hosting this event.';
		}

		return isRegistered
			? 'You’re on the Guest List!'
			: 'Please register below to join this event.';
	};

	const renderButtonRegister = () => {
		const disabled = isPreview
			|| isHost
			|| isRegistered
			|| detailEvent?.is_expired
			|| detailEvent?.event_status === IEvent.EventStatus.DRAFT
			|| detailEvent?.event_status === IEvent.EventStatus.CANCELED;

		return (
			<div className={ clsxm('w-full flex justify-center', session?.status === 'authenticated' ? 'mt-[13px]' : '') }>
				<Button
					onClick={ handleJoinEvent }
					disabled={ disabled }
					className='py-2 px-5 w-full bg-primary disabled:bg-med-grey text-white text-sm font-medium leading-126% rounded-lg'
				>
					Register
				</Button>
			</div>
		);
	};

	const renderContent = () => {
		if (render === 'button') {
			return renderButtonRegister();
		}

		return (
			<div className='flex'>
				<div className='bg-super-light-grey border-[0.5px] border-light-grey w-full rounded-[5px] flex flex-col'>
					<div className='border-b-[0.5px] border-light-grey py-3 px-3.5 flex items-center justify-between gap-3'>
						<div className='flex items-center gap-3'>
							<TicketIcon className='flex-shrink-0 text-wording' />

							<span className='text-base font-semibold leading-126% !text-wording'>Registration</span>
						</div>

						<p className='leading-126% text-wording text-xs text-right max-lg:hidden'>
							{ renderJoinText() }
						</p>
					</div>

					<div className='w-full py-3 px-3.5'>
						<p className='leading-126% text-wording text-xs text-left lg:hidden'>
							{ renderJoinText() }
						</p>

						{ session?.status === 'authenticated' && (
							<div className='flex items-center gap-1 lg:gap-[5px] max-lg:mt-[6px]'>
								<div className='relative overflow-hidden w-15px h-15px'>
									<Image
										src='/images/avatars/avatars_yellow.png'
										alt=''
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										fill
									/>
								</div>
								<p className='!text-wording text-xs font-semibold leading-126%'>
									{ session?.data?.user?.fname } { session?.data?.user?.lname }
								</p>
							</div>
						) }
						{ !isHost && (
							<div className={ clsxm(
								'w-full lg:mt-0',
								isPreview ? '' : 'max-md:hidden md:mt-[22px]'
							) }>
								{ renderButtonRegister() }
							</div>
						) }
					</div>
				</div>
			</div>
		);
	};

	return renderContent();
};

export default RSVP;