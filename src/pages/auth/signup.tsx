import axios from 'axios';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import { AuthComponent, EventDetailComponent, Layout } from '@/components';
import { endpoints } from '@/constant';
import authDataLocal from '@/constant/data/auth.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { ShowEventByCode200Response } from '@/openapi';

const RegisterFormPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	authData,
	navigationData,
	fname,
	lname,
	email,
	phone,
	type,
	callbackUrl,
	eventDetail
}) => {
	return (
		<Layout
			data={ navigationData }
			title='Sign Up'
		>
			<div className='w-full flex-grow flex flex-col justify-between'>
				<div className='relative overflow-hidden flex-1 h-full mt-60px pb-[160px] sm:pb-[217px]'>
					<div className='container-center'>
						<div className='pt-4 sm:pt-[38px] lg:max-w-md lg:mx-auto'>
							{ eventDetail
								? (
									<>
										<AuthComponent.Hero title={ authDataLocal?.joinEvent } />

										<div className='mb-[50px] md:mb-[38px]'>
											<EventDetailComponent.EventGeneralInfo eventDetail={ eventDetail } />
										</div>
									</>
								)
								: null }

							<AuthComponent.FormSignUp
								phone={ phone }
								fname={ fname }
								lname={ lname }
								email={ email }
								registerType={ type }
								data={ authData }
								callbackUrl={ callbackUrl }
								eventCode={ eventDetail?.event_code }
							/>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async({ query }) => {
	const eventCode = query?.eventCode || query?.code || '';
	const callbackUrl = query?.callbackUrl
		? query?.callbackUrl
		: eventCode
			? `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ eventCode }/questionnaire?attendance_status=1`
			: '';
	let eventDetail = null;

	try {
		const phone = query?.phone ?? '';
		const fname = query?.fname ?? '';
		const lname = query?.lname ?? '';
		const email = query?.email ?? '';
		const type = query?.type ?? '';
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.authData)]);

		if (eventCode) {
			const respEventDetail = await axios.get<ShowEventByCode200Response>(process.env.NEXT_PUBLIC_BASE_URL_API + `/v1/events/${ eventCode }`,
				{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
			);
			eventDetail = respEventDetail?.data?.data;
		}

		if (res && res.length === 2) {
			const navigationData = await res[0]?.data;
			const authData = await res[1]?.data;

			return {
				props: {
					navigationData,
					authData,
					phone,
					fname,
					lname,
					email,
					type,
					callbackUrl,
					eventDetail
				}
			};
		} else {
			return {
				props: {
					navigationData: navigationDataLocal,
					authData: authDataLocal,
					phone,
					fname,
					lname,
					email,
					type,
					callbackUrl,
					eventDetail
				}
			};
		}
	} catch (error) {
		return {
			props: {
				authData: authDataLocal,
				navigationData: navigationDataLocal,
				phone: '',
				fname: '',
				lname: '',
				email: '',
				type: '',
				callbackUrl,
				eventDetail: null
			}
		};
	}
};

export default RegisterFormPage;
