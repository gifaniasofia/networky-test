import { useCallback, useState } from 'react';
import axios from 'axios';
import https from 'https';
import {
	GetServerSideProps,
	InferGetServerSidePropsType,
	NextPage
} from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn, signOut } from 'next-auth/react';

import { AuthComponent, EventDetailComponent } from '@/components';
import { endpoints } from '@/constant';
import authDataLocal from '@/constant/data/auth.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { gtagEvent } from '@/helpers/gtag';
import { handleCatchError } from '@/helpers/handleError';
import { filterObject } from '@/helpers/misc';
import { toastify } from '@/helpers/toast';
import { useApiClient } from '@/hooks';
import { ShowEventByCode200Response } from '@/openapi';

const AuthPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	authData,
	navigationData,
	phone = '',
	token = '',
	callbackUrl = '',
	eventDetail
}) => {
	const router = useRouter();
	const apiClient = useApiClient();

	const [phoneValue, setPhoneValue] = useState<string>(phone);
	const [phoneSubmitted, setPhoneSubmitted] = useState<string>(phone);
	const [tokenValidation, setTokenValidation] = useState<string>(token);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

	const {
		utm_source,
		utm_medium,
		utm_campaign,
		utm_id,
		utm_term,
		utm_content
	} = router.query;
	const queryData = filterObject({
		utm_source,
		utm_medium,
		utm_campaign,
		utm_id,
		utm_term,
		utm_content,
		callbackUrl,
		eventCode: eventDetail?.event_code
	});

	const onChangePhoneInput = useCallback((value?: E164Number) => setPhoneValue(value ?? ''), []);

	const onSubmitPhone = async() => {
		try {
			setLoadingSubmit(true);
			setPhoneSubmitted(phoneValue);

			const response = await (await apiClient.authApi()).getProviderToken(undefined, { provider_value: phoneValue, provider: 'phone' });
			const result = response?.data;
			const resultData = result?.data;

			if (resultData) {
				const dataToken = resultData?.token ?? '';

				setTokenValidation(dataToken);

				gtagEvent({ action: 'PhoneNumber' });

				router.push({
					pathname: '/auth/phone',
					query: {
						...queryData,
						phone: phoneValue,
						token: dataToken
					}
				});
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error && error?.response && error?.response?.status === 403) {
					router.push({
						pathname: '/auth/signup',
						query: {
							...queryData,
							phone: phoneValue,
							type: 'phone'
						}
					});

					return;
				}
			}

			handleCatchError(error);
		} finally {
			setLoadingSubmit(false);
		}
	};

	const onSubmitVerification = async(otpCode: string) => {
		setLoadingSubmit(true);
		await signOut({
			redirect: false
		});
		signIn('validate', {
			token: tokenValidation,
			otp: otpCode,
			redirect: false,
			provider: 'phone'
		}).then(async response => {
			if (response?.error === 'register') {
				gtagEvent({ action: 'OTP' });
				router.push({
					pathname: '/auth/signup',
					query: {
						...queryData,
						phone: phoneSubmitted,
						type: 'phone'
					}
				});
				return;
			}
			if (response?.ok) {
				gtagEvent({ action: 'OTP' });
				if (callbackUrl) {
					gtagEvent({ action: 'LoginSuccess' });
					window.location.href = callbackUrl;
				} else {
					const session = await getSession();
					router.push({
						pathname: session?.user?.is_host === true ? '/events' : '/auth/success'
					}).then(() => gtagEvent({ action: 'LoginSuccess' }));
				}
			} else {
				toastify('error', response?.error ?? 'error-default');
			}
		})
			.finally(() => {
				setLoadingSubmit(false);
			});
	};

	const renderForm = () => {
		const wrapperClassName = 'xs:px-4 sm:px-[25px]';

		if (phone) {
			return (
				<div className={ wrapperClassName }>
					<AuthComponent.Verification
						value={ phoneSubmitted }
						onSubmit={ onSubmitVerification }
						loading={ loadingSubmit }
						data={ authData }
					/>
				</div>
			);
		}

		return (
			<>
				{ eventDetail
					? (
						<div className='md:mb-6'>
							<EventDetailComponent.EventGeneralInfo eventDetail={ eventDetail } />
						</div>
					)
					: null }

				<div className={ wrapperClassName }>
					<AuthComponent.FormLogin
						onSubmit={ onSubmitPhone }
						loading={ loadingSubmit }
						data={ authData?.phoneInput }
						type='phone'
					>
						<AuthComponent.PhoneInput
							value={ phoneValue }
							onChange={ onChangePhoneInput }
							data={ authData }
						/>
					</AuthComponent.FormLogin>
				</div>

				<div className='pt-18px mt-18px border-t border-light-grey'>
					<div className={ wrapperClassName }>
						<AuthComponent.FormSSO
							callbackUrl={ callbackUrl }
							eventCode={ eventDetail?.event_code } />
					</div>
				</div>
			</>
		);
	};

	const renderTitle = () => {
		if (eventDetail) return authDataLocal?.joinEvent;
		if (phone) return authData?.verification?.title;
		return authData?.title;
	};

	return (
		<AuthComponent.Container
			navigationData={ navigationData }
			title={ renderTitle() }
		>
			{ renderForm() }
		</AuthComponent.Container>
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
		const token = query?.token ?? '';
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
					token,
					callbackUrl,
					eventDetail
				}
			};
		} else {
			return {
				props: {
					authData: authDataLocal,
					navigationData: navigationDataLocal,
					phone,
					token,
					callbackUrl,
					eventDetail
				}
			};
		}
	} catch (error) {
		return {
			props: {
				phone: '',
				token: '',
				callbackUrl: callbackUrl,
				authData: authDataLocal,
				navigationData: navigationDataLocal,
				eventDetail: null
			}
		};
	}
};

export default AuthPage;
