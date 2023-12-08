import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';

import { CreateEventComponent, Layout } from '@/components';
import { emptyInitialValuesFormik } from '@/components/CreateEvent/Form';
import { endpoints } from '@/constant';
import createEventDataLocal from '@/constant/data/create.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import timezoneList from '@/constant/data/timezoneList.json';
import { toastify } from '@/helpers/toast';
import { useAppSelector } from '@/hooks/useAppDispatch';
import useGetLocation from '@/hooks/useGetLocation';
import { ITimezone } from '@/interfaces';
import { CreateEventTypes } from '@/typings';

import { authOptions } from './api/auth/[...nextauth]';

const BackdropEffect = dynamic(() => import('../components/BackdropEffect'), { ssr: false });

const CreateEventPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	navigationData,
	createEventData
}) => {
	const createEventState = useAppSelector(state => state.createEventReducers);
	const location = useGetLocation();

	const [currentTimezone, setCurrentTimezone] = useState<string>('');

	const getUserTimezone = async(currentLoc: CreateEventTypes.LocationState) => {
		try {
			const response = await axios.get<ITimezone.ResGoogleTimezone>(endpoints.urlApiTimezone, {
				params: {
					language: 'en',
					location: `${ currentLoc?.latitude },${ currentLoc?.longitude }`,
					timestamp: Math.round(+ new Date() / 1000)
				}
			});
			const data = response?.data;

			if (data?.status === 'OK') {
				if (data?.timeZoneId) {
					if (data?.timeZoneId === 'Asia/Calcutta') {
						setCurrentTimezone('Asia/Kolkata');
					} else {
						setCurrentTimezone(data?.timeZoneId);
					}
				}
			} else {
				if (data?.errorMessage) toastify('error', data?.errorMessage);
			}
		} catch (error) {
			toastify('error-default');
		}
	};

	useEffect(() => {
		// Fetch data from API if `location` object is set
		if (location) {
			getUserTimezone(location);
		}
	}, [location]);

	const renderBackdropEffect = () => {
		if (createEventState?.isEffectActive) {
			return (
				<BackdropEffect
					source_type={ createEventData?.defaultEffect?.source_type }
					source_url={ createEventData?.defaultEffect?.source_url }
				/>
			);
		}

		return null;
	};

	const findClientTimezoneData = () => {
		if (currentTimezone && timezoneList?.data) {
			const foundData = timezoneList?.data?.find(timezoneItem => timezoneItem?.zoneName?.toLowerCase() === currentTimezone?.toLowerCase());

			if (foundData) {
				return {
					timezone: foundData.zoneName,
					gmt_offset: foundData.gmtOffset
				};
			}
		}
	};

	return (
		<div className='relative'>
			<Layout
				type='webapp'
				data={ navigationData }
				title='Create Event'
			>
				<div className='relative flex-1 h-full mt-60px'>
					<CreateEventComponent.Form
						data={ createEventData }
						initialValues={ {
							...emptyInitialValuesFormik,
							datetime: {
								...emptyInitialValuesFormik.datetime,
								timezone: findClientTimezoneData()
									? findClientTimezoneData()
									: undefined
							},
							poster_img: createEventData?.defaultCover
						} }
					/>
				</div>
			</Layout>

			{ renderBackdropEffect() }
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async({ req, res }) => {
	const session = await getServerSession(req, res, authOptions(req?.cookies));
	if (!session?.user?.is_host) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	try {
		const response = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.createEventData)]);

		if (response && response?.length === 2) {
			const navigationData = await response[0]?.data;
			const createEventData = await response[1]?.data;

			return {
				props: {
					navigationData,
					createEventData
				}
			};
		} else {
			return {
				props: {
					createEventData: createEventDataLocal,
					navigationData: navigationDataLocal
				}
			};
		}
	} catch (error) {
		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default CreateEventPage;