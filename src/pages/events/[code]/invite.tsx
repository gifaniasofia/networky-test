import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';

import { EventDetailComponent } from '@/components';
import { endpoints } from '@/constant';
import createEventDataLocal from '@/constant/data/create.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { handleCatchError } from '@/helpers/handleError';
import { getRandomIntInclusive } from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useApiClient, useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventRespDetail } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const InviteEventPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	navigationData,
	createEventData
}) => {
	const router = useRouter();
	const apiClient = useApiClient();
	const windowDimensions = useWindowDimensions();

	const [data, setData] = useState<EventRespDetail>({
		event_code: '',
		title: '',
		poster_img: '',
		description: '',
		location: '',
		map_link: '',
		max_spot: 0,
		// additional_msg: '',
		start_date: '',
		end_date: '',
		creator_name: '',
		background_name: '',
		effect_name: ''
	});
	const [invited, setInvited] = useState<IEvent.ContactRespExt[]>([]);
	const [contacts, setContacts] = useState<IEvent.ContactRespExt[]>([]);
	const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
	const [loadingInvitationList, setLoadingInvitationList] = useState<boolean>(false);
	const [loadingEventData, setLoadingEventData] = useState<boolean>(false);

	const eventCode = (router.query?.code ?? '') as string;
	const isSendPage = router.query?.send === 'message';

	const setRandomAvatar = (list: IEvent.ContactRespExt[]) => {
		return list.map(person => ({
			...person,
			avatar: `/images/avatars/avatars_${ [getRandomIntInclusive(1, 8)] }.png`
		}));
	};

	const getInvitationListData = async() => {
		try {
			setLoadingInvitationList(true);

			const response = await (await apiClient.eventsApi()).invitationList(eventCode);
			const status = response?.status;

			if (status === 200) {
				const dataInvitations = response?.data?.data;
				setInvited(setRandomAvatar(dataInvitations?.invited ?? []));
				setContacts(setRandomAvatar(dataInvitations?.contacts ?? []));
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingInvitationList(false);
		}
	};

	const getEventDetailData = async() => {
		try {
			setLoadingEventData(true);

			const res = await (await apiClient.eventsApi()).showEventByCode(eventCode);

			if (res.status === 200) {
				const eventDetailData = res?.data?.data;

				setData(prevData => ({
					...prevData,
					...eventDetailData
				}));
				setLoadingEventData(false);
			} else {
				setLoadingEventData(false);
			}
		} catch (error) {
			setLoadingEventData(false);

			if (axios.isAxiosError(error)) {
				if (error?.response) {
					const errResponse = error?.response;
					const status = errResponse?.status;

					if (status === 404) {
						router.replace('/404');
					}
				}
			}
		}
	};

	const getInitialSelectedOptions = () => {
		if (isSendPage) {
			if (window) {
				const itemTempInvited = window.localStorage.getItem('tempInvited');

				if (itemTempInvited) {
					const tempInvited = JSON.parse(itemTempInvited);

					setSelectedOptions(tempInvited);
				}
			}
		}
	};

	useEffect(() => {
		getEventDetailData();
		getInvitationListData();
		getInitialSelectedOptions();
	}, []);

	return (
		<EventDetailComponent.Container
			showEffect={ false }
			navigationData={ navigationData }
			createEventData={ createEventData }
			pageTitle='Invite'
			showNavbar={ windowDimensions.width >= screens.md }
			showFooter={ windowDimensions.width >= screens.md }
		>
			<div className='max-w-5xl mx-auto md:pb-[98px] md:pt-6'>
				<div className='grid grid-cols-12 gap-3'>
					<div className='w-full max-md:hidden col-span-5 flex flex-col'>
						<div className={ !isSendPage ? 'md:mb-[87px]' : '' }>
							<EventDetailComponent.CardEvent
								loading={ loadingEventData }
								data={ data }
								defaultCover={ createEventData.defaultCover }
							/>
						</div>
					</div>
					{
						!isSendPage ? (
							<EventDetailComponent.Invite
								loading={ loadingInvitationList }
								invited={ invited }
								contacts={ contacts }
								selectedOptions={ selectedOptions }
								setSelectedOptions={ setSelectedOptions }
							/>
						) : (
							<EventDetailComponent.CustomizeMessage
								data={ data }
								contacts={ contacts }
								selectedOptions={ selectedOptions }
								setSelectedOptions={ setSelectedOptions }
							/>
						)
					}
				</div>
			</div>
		</EventDetailComponent.Container>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerSession(ctx.req, ctx.res, authOptions(ctx.req?.cookies));
	if (!session?.token) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
	try {
		const res = await Promise.all([
			axios.get(endpoints.navigationData),
			axios.get(endpoints.createEventData)
		]);

		if (res && res?.length === 2) {
			const navigationData = res[0]?.data;
			const createEventData = res[1]?.data;

			return {
				props: {
					navigationData,
					createEventData
				}
			};
		}

		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal
			}
		};
	} catch (error) {
		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default InviteEventPage;
