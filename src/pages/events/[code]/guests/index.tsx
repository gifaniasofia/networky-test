import { useEffect, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';

import { EventDetailComponent, Layout, Navbar } from '@/components';
import Spinner from '@/components/Spinner';
import { handleCatchError } from '@/helpers/handleError';
import { getRandomIntInclusive } from '@/helpers/misc';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const GuestListPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
	const router = useRouter();
	const apiClient = useApiClient();

	const eventCode = (router.query?.code ?? '') as string;
	// const rsvpOptions = createEventData?.rsvp?.options ?? [];

	const [attendancesList, setAttendancesList] = useState<IEvent.EventAttendanceRespExt[]>([]);
	const [loadingGuestList, setLoadingGuestList] = useState<boolean>(false);

	const setRandomAvatar = (list: IEvent.EventAttendanceRespExt[]) => {
		return list.map(person => ({
			...person,
			avatar: `/images/avatars/avatars_${ [getRandomIntInclusive(1, 12)] }.png`
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

	useEffect(() => {
		getListOfAttendances();
	}, []);

	const renderContentPage = () => {
		if (loadingGuestList) {
			return (
				<div className='flex justify-center container-center mt-[19px]'>
					<Spinner className='text-purple w-5 h-5' />
				</div>
			);
		}

		return (
			<div className='container-center mt-2'>
				<EventDetailComponent.GuestList
					data={ attendancesList }
					onClick={ (person: any) => {
						router.push(`/events/${ eventCode }/guests/${ person.profile_id }`);
					} } />
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
				<Navbar.PageDetail title='Guest List'>
					<p className='text-base leading-[130%] text-steel'>
						{ attendancesList?.length } Guests
					</p>
				</Navbar.PageDetail>

				{ renderContentPage() }
			</div>
		</Layout>
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

	return { props: {} };
	// try {
	// 	const res = await axios.get(endpoints.createEventData);

	// 	const createEventData = res?.data;
	// 	return {
	// 		props: {
	// 			createEventData
	// 		}
	// 	};

	// } catch (error) {
	// 	return {
	// 		props: {
	// 			createEventData: createEventDataLocal
	// 		}
	// 	};
	// }
};

export default GuestListPage;
