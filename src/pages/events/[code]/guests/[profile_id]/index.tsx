import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Layout, MutualsComponent, Navbar } from '@/components';
import { handleCatchError } from '@/helpers/handleError';
import { getRandomIntInclusive } from '@/helpers/misc';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { ProfileHistory } from '@/openapi';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const GuestDetailPage: NextPage = () => {
	const router = useRouter();
	const apiClient = useApiClient();

	const eventCode = (router.query?.code ?? '') as string;
	const profileId = (router.query?.profile_id ?? '') as string;

	const [personDetail, setPersonDetail] = useState<IEvent.ContactRespExt>({
		fname: '',
		lname: '',
		email: '',
		phone: '',
		avatar: ''
	});
	const [eventDetail, setEventDetail] = useState<ProfileHistory>({
		event_code: '',
		title: '',
		poster_img: '',
		questionnaire_answers: []
	});
	const [loadingEvent, setLoadingEvent] = useState<boolean>(false);

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
			}
		} catch (error) {
			handleCatchError(error);
		}
	};

	const getEventListHistory = async() => {
		try {
			setLoadingEvent(true);
			const response = await ((await apiClient.profileApi()).profileHistories(+ profileId));

			if (response?.status === 200) {
				const data: ProfileHistory[] = response?.data?.data ?? [];

				const foundEvent = data?.find(item => item.event_code === eventCode);
				if (foundEvent) {
					setEventDetail(foundEvent);
				}
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingEvent(false);
		}
	};

	useEffect(() => {
		if (profileId) {
			getPersonDetail();
			getEventListHistory();
		}
	}, [profileId]);

	// const onClickDetail = (eventData: ProfileHistory, focus: string, person: any) => {
	// 	if (eventData) {
	// 		router.push(`/events/${ eventCode }/guests/${ person?.profile_id }/${ eventData?.event_code }`);
	// 	}
	// };

	const renderBoxProfileDetail = () => {
		return <MutualsComponent.BoxProfileDetail personDetail={ personDetail } />;
	};

	// const renderBoxEventList = () => {
	// 	return (
	// 		<MutualsComponent.BoxEventList
	// 			personDetail={ personDetail }
	// 			onClickDetail={ onClickDetail }
	// 		/>
	// 	);
	// };

	const renderBoxSocialMedia = () => {
		return <MutualsComponent.BoxSocialMedia personDetail={ personDetail } />;
	};

	const renderBoxQuestionnaireList = () => {
		if (!loadingEvent) {
			return <MutualsComponent.QuestionnaireList eventDetail={ eventDetail } />;
		}
	};

	const renderContentMobileGuestDetail = () => {
		return (
			<div className='mt-[54px] container-center flex flex-col gap-y-[9px] pb-[100px]'>
				{ renderBoxProfileDetail() }
				{ renderBoxSocialMedia() }
				<div className='mt-0.5'>
					{ renderBoxQuestionnaireList() }
				</div>
			</div>
		);
	};

	return (
		<Layout
			type='webapp'
			title='Guest List'
			showNavbar={ false }
			showFooter={ false }
		>
			<div>
				<Navbar.PageDetail title='Guest List' />

				{ renderContentMobileGuestDetail() }
			</div>
		</Layout>
	);
};

export default GuestDetailPage;
