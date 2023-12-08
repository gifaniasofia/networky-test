import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Layout, MutualsComponent, Navbar } from '@/components';
import { handleCatchError } from '@/helpers/handleError';
import { useApiClient } from '@/hooks';
import { ProfileHistory } from '@/openapi';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const GuestListPage: NextPage = () => {
	const router = useRouter();
	const apiClient = useApiClient();

	const eventCodeGuest = (router.query?.event_guest ?? '') as string;
	const profileId = (router.query?.profile_id ?? '') as string;

	const [eventDetail, setEventDetail] = useState<ProfileHistory>({
		event_code: '',
		title: '',
		poster_img: '',
		questionnaire_answers: []
	});

	useEffect(() => {
		const getEventListHistory = async(id: number) => {
			try {
				const response = await ((await apiClient.profileApi()).profileHistories(id));

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

		if (profileId) {
			getEventListHistory(+ profileId);
		}
	}, [profileId]);

	const renderBoxEventDetail = () => {
		return <MutualsComponent.BoxEventDetail eventDetail={ eventDetail } />;
	};

	const renderQuestionnaire = () => {
		return <MutualsComponent.QuestionnaireList eventDetail={ eventDetail } />;
	};

	const renderContentMobileEventDetail = () => {
		return (
			<div className='mt-3.5 container-center flex flex-col gap-y-[18px] pb-[100px]'>
				{ renderBoxEventDetail() }
				<div>
					{ renderQuestionnaire() }
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

				{ renderContentMobileEventDetail() }
			</div>
		</Layout>
	);
};

export default GuestListPage;
