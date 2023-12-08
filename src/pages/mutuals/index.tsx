import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';

import { Layout, MutualsComponent } from '@/components';
import { endpoints } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import { handleCatchError } from '@/helpers/handleError';
import { getRandomIntInclusive } from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useApiClient, useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { ProfileHistory } from '@/openapi';

import { authOptions } from '../api/auth/[...nextauth]';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const MutulasPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ navigationData }) => {
	const router = useRouter();
	const apiClient = useApiClient();

	const [people, setPeople] = useState<IEvent.ContactRespExt[]>([]);
	const [personDetail, setPersonDetail] = useState<IEvent.ContactRespExt>({
		fname: '',
		lname: '',
		email: '',
		phone: ''
	});
	const [eventDetail, setEventDetail] = useState<ProfileHistory>({
		event_code: '',
		title: '',
		poster_img: '',
		questionnaire_answers: []
	});
	const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
	const [loadingContacts, setLoadingContacts] = useState<boolean>(false);

	const windowDimensions = useWindowDimensions();
	const isMobile = windowDimensions.width < screens.md;
	const pageFocus = router?.query?.focus;
	const profileId = (router?.query?.guest ?? '') as string;
	const eventCodeGuest = (router?.query?.event ?? '') as string;

	const getMyContacts = async() => {
		try {
			setLoadingContacts(true);

			const response = await ((await apiClient.eventsApi()).myContactList());

			if (response?.status === 200) {
				const data = response?.data?.data;

				if (data) {
					const updatedData = data?.map(person => ({
						...person,
						avatar: `/images/avatars/avatars_${ [getRandomIntInclusive(1, 12)] }.png`
					}));

					setPeople(updatedData);

					return updatedData;
				}
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingContacts(false);
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

	const getPersonDetail = async() => {
		try {
			const response = await ((await apiClient.profileApi()).getProfileByID(+ profileId));

			if (response?.status === 200) {
				const personData = response?.data?.data;

				if (personData) {
					setPersonDetail({
						...personData,
						avatar: personDetail?.avatar || `/images/avatars/avatars_${ [getRandomIntInclusive(1, 12)] }.png`,
						profile_id: + profileId
					});
				}

				if (!isMobile) {
					setOpenModalDetail(true);
				}
			}
		} catch (error) {
			handleCatchError(error);
		}
	};

	useEffect(() => {
		getMyContacts();
	}, []);

	useEffect(() => {
		if (eventCodeGuest) {
			getEventListHistory();
		}
	}, [eventCodeGuest]);

	useEffect(() => {
		if (profileId) {
			getPersonDetail();
		}
	}, [profileId]);

	const onClickDetail = (person: IEvent.ContactRespExt, focus: string, eventData?: ProfileHistory) => {
		const params: ObjectKey = {
			focus,
			guest: person.profile_id ?? '',
			...eventData?.event_code ? { event: `${ eventData?.event_code }` } : {}
		};

		const query = Object.keys(params)
			.map((key: string) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
			.join('&');

		if (person) setPersonDetail(person);

		router.push(`/mutuals?${ query }`).then(() => {
			if (eventData) setEventDetail(eventData);
			if (!isMobile) setOpenModalDetail(true);
		});
	};

	const onClickEventDetail = (eventData: ProfileHistory, focus: string, person: any) => onClickDetail(person, focus, eventData);

	const renderMutualDetail = (detailType: 'modal' | 'page') => {
		return (
			<MutualsComponent.Detail
				eventDetail={ eventDetail }
				personDetail={ personDetail }
				openModalDetail={ openModalDetail }
				setOpenModalDetail={ setOpenModalDetail }
				onClickEventDetail={ onClickEventDetail }
				detailType={ detailType }
				baseUrl='/mutuals'
			/>
		);
	};

	const renderContent = () => {
		if (isMobile && pageFocus) {
			return renderMutualDetail('page');
		}

		return (
			<>
				<MutualsComponent.TableContacts
					data={ people }
					onClickRow={ onClickDetail }
					loading={ loadingContacts }
				/>

				{ renderMutualDetail('modal') }
			</>
		);
	};

	return (
		<Layout
			type='webapp'
			data={ navigationData }
			title='My Contacts'
			showNavbar={ isMobile ? !pageFocus : true }
			showFooter={ false }
		>
			{ renderContent() }
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(context.req, context.res, authOptions(context.req?.cookies));
	if (!session?.token) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
	try {
		const res = await axios.get(endpoints.navigationData);
		const navigationData = await res?.data;

		return {
			props: { navigationData },
		};
	} catch (error) {
		return {
			props: { navigationData: navigationDataLocal }
		};
	}
};

export default MutulasPage;
