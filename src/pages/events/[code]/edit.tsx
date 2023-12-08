import { DateRange } from 'react-day-picker';
import axios from 'axios';
import { format } from 'date-fns';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';

import { CreateEventComponent, Layout } from '@/components';
import { Api } from '@/configs/api';
import { endpoints } from '@/constant';
import createEventDataLocal from '@/constant/data/create.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { useAppSelector } from '@/hooks';
import { EventRespDetail } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const BackdropEffect = dynamic(() => import('../../../components/BackdropEffect'), { ssr: false });

const apiInstance = new Api();

const EditEventPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps> & { data?: EventRespDetail; }> = ({
	navigationData,
	createEventData,
	data
}) => {
	const createEventState = useAppSelector(state => state.createEventReducers);

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

	return (
		<div className='relative'>
			<Layout
				type='webapp'
				data={ navigationData }
				title='Edit Event'
			>
				<div className='relative flex-1 h-full mt-60px sm:mt-20'>
					<CreateEventComponent.Form
						// loading={ loading }
						eventCode={ data?.event_code }
						data={ createEventData }
						detailEvent={ data }
						initialValues={ {
							title: data?.title ?? '',
							location: data?.location ?? '',
							addr_detail: data?.addr_detail ?? '',
							addr_ltd: data?.addr_ltd ?? '',
							addr_lng: data?.addr_lng ?? '',
							addr_name: data?.addr_name ?? '',
							addr_note: data?.addr_note ?? '',
							// max_spot: `${ data?.max_spot ?? 0 }`,
							description: data?.description ?? '',
							poster_img: data?.poster_img ?? createEventData?.defaultCover,
							start_date: data?.start_date ?? '',
							end_date: data?.end_date ?? '',
							background_name: data?.background_name ?? '',
							effect_name: data?.effect_name ?? '',
							datetime: {
								date: {
									...data?.start_date ? { from: new Date(data?.start_date) } : {},
									...data?.end_date ? { to: new Date(data?.end_date) } : {}
								} as DateRange,
								time: {
									from: data?.start_date ? format(new Date(data?.start_date), 'h:mm a') : '6:00 AM',
									to: data?.end_date ? format(new Date(data?.end_date), 'h:mm a') : '6:30 AM'
								},
								...data?.tz_name && data?.tz_offset !== undefined
									? {
										timezone: {
											timezone: data?.tz_name ?? '',
											gmt_offset: data?.tz_offset
										}
									} : {}
							}
						} }
					/>
				</div>
			</Layout>

			{ renderBackdropEffect() }
		</div>
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
		const code = (ctx.params?.code ?? '') as string;
		const eventDetail = await (await apiInstance.eventsApi()).showEventByCode(code, {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${ session?.token ? 'Bearer ' + session?.token : '' }`
			}
		});
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.createEventData)]);

		if (res && res?.length === 2) {
			const navigationData = await res[0]?.data;
			const createEventData = await res[1]?.data;

			return {
				props: {
					navigationData,
					createEventData,
					data: eventDetail?.data?.data
				}
			};
		} else {
			return {
				props: {
					createEventData: createEventDataLocal,
					navigationData: navigationDataLocal,
					data: eventDetail?.data?.data
				}
			};
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error?.response) {
				const errResponse = error?.response;
				const status = errResponse?.status;

				if (status === 404) {
					return {
						redirect: {
							destination: '/404',
							permanent: false,
						},
					};
				}
			}
		}

		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal,
				data: {
					event_code: '',
					title: '',
					poster_img: '',
					description: '',
					location: '',
					map_link: '',
					is_host: false,
					max_spot: 0,
					// additional_msg: '',
					start_date: '',
					end_date: '',
					creator_name: '',
					background_name: '',
					effect_name: ''
				}
			}
		};
	}
};

export default EditEventPage;