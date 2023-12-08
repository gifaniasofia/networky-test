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

import { AuthComponent, EventDetailComponent, Input } from '@/components';
import { endpoints } from '@/constant';
import authDataLocal from '@/constant/data/auth.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { gtagEvent } from '@/helpers/gtag';
import { handleCatchError } from '@/helpers/handleError';
import { filterObject } from '@/helpers/misc';
import { toastify } from '@/helpers/toast';
import { useApiClient } from '@/hooks';
import { ShowEventByCode200Response } from '@/openapi';

const AuthEmailPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	authData,
	navigationData,
	email = '',
	token = '',
	callbackUrl = '',
	eventDetail = null
}) => {
	const apiClient = useApiClient();
	const router = useRouter();

	const [emailValue, setEmailValue] = useState<string>(email);
	const [emailSubmitted, setEmailSubmitted] = useState<string>(email);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const [tokenValidation, setTokenValidation] = useState<string>(token);

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

	const onChangeEmailInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEmailValue(e.target.value ?? ''), []);

	const onSubmitEmail = async() => {
		try {
			setLoadingSubmit(true);
			setEmailSubmitted(emailValue);

			const response = await (await apiClient.authApi()).getProviderToken(undefined, { provider_value: emailValue, provider: 'email' });
			const resultData = response?.data?.data;

			if (resultData) {
				const dataToken = resultData?.token ?? '';

				setTokenValidation(dataToken);

				router.push({
					pathname: '/auth',
					query: {
						...queryData,
						email: emailValue,
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
							email: emailValue,
							type: 'email'
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
			provider: 'email'
		}).then(async response => {
			if (response?.error === 'register') {
				router.push({
					pathname: '/auth/signup',
					query: {
						...queryData,
						email: emailSubmitted,
						type: 'email'
					}
				});
				return;
			}
			if (response?.ok) {
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

		if (email) {
			return (
				<div className={ wrapperClassName }>
					<AuthComponent.Verification
						value={ emailSubmitted }
						onSubmit={ onSubmitVerification }
						loading={ loadingSubmit }
						data={ authData }
						type='email'
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
						onSubmit={ onSubmitEmail }
						loading={ loadingSubmit }
						data={ authData?.emailInput }
						type='email'
					>
						<Input.TextField
							type='email'
							value={ emailValue }
							onChange={ onChangeEmailInput }
							placeholder={ authData?.emailInput?.placeholder }
							className='!ring-1 !ring-inset !ring-grey-1/50 focus:!ring-steel rounded-[7px] py-3.5 md:py-3 px-4 md:px-[15px] text-steel placeholder:text-light-grey tracking-[0.004em] md:-tracking-0.01em text-base md:text-xl leading-100%'
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
		if (email) return authData?.verification?.title;
		return authData?.title;
	};

	return (
		<AuthComponent.Container
			title={ renderTitle() }
			navigationData={ navigationData }
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
		const email = query?.email ?? '';
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
					email,
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
					email,
					token,
					callbackUrl,
					eventDetail
				}
			};
		}
	} catch (error) {
		return {
			props: {
				email: '',
				token: '',
				callbackUrl: callbackUrl,
				authData: authDataLocal,
				navigationData: navigationDataLocal,
				eventDetail: null
			}
		};
	}
};

export default AuthEmailPage;
