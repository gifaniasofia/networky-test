import React, {
	useCallback,
	useEffect,
	useState
} from 'react';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import { useRouter } from 'next/router';

import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { toastify } from '@/helpers/toast';
import { useApiClient, useTimer } from '@/hooks';
import { AuthTypes } from '@/typings';

import Button from '../Button';
import InputOTP from '../Input/OTP';

const Verification: React.FC<AuthTypes.VerificationProps> = ({
	loading,
	onSubmit,
	data: authData,
	value,
	type = 'phone'
}) => {
	const verificationData = authData.verification;

	const { timerCount, startTimer } = useTimer(60);
	const apiClient = useApiClient();
	const router = useRouter();

	const [otp, setOtp] = useState<string>('');
	const [loadingResend, setLoadingResend] = useState<boolean>(false);

	useEffect(() => {
		startTimer();
	}, []);

	const onChangeOtp = useCallback((otpVal: string) => setOtp(otpVal), []);

	const onSubmitVerification = (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (onSubmit) onSubmit(otp);
	};

	const callbackSuccess = (token: string) => {
		const path = type === 'email' ? '/auth' : '/auth/phone';

		router.replace({
			pathname: path,
			query: {
				...router.query,
				token
			}
		}).then(() => {
			startTimer();
			setLoadingResend(false);
			setOtp('');
		})
			.catch(() => {
				toastify('error-default');
				setLoadingResend(false);
			});
	};

	const onClickResendOtp = async() => {
		try {
			setLoadingResend(true);
			const reqBody = value ?? '';

			const response = await (await apiClient.authApi()).getProviderToken('force', { provider_value: reqBody, provider: type });
			const result = response?.data;
			const resultData = result?.data;

			if (resultData) {
				const dataToken = resultData?.token ?? '';

				callbackSuccess(dataToken);
			}
		} catch (error) {
			handleCatchError(error);
			setLoadingResend(false);
		}
	};

	return (
		<div className='flex flex-col items-center'>
			<h3 className='!text-wording text-center text-sm leading-126% w-full mt-[13px] md:mt-[7px]'>
				Please enter verification code<span className='sm:hidden'><br /></span> we sent to <span className='font-semibold'>
					{ type === 'phone'
						? formatPhoneNumberIntl(value ?? '')
						: value }
				</span>
			</h3>

			<form
				className='mt-[35px] md:mt-5 flex flex-col items-center text-steel'
				onSubmit={ onSubmitVerification }
			>
				<div className='flex flex-col sm:flex-row sm:items-center justify-center'>
					<InputOTP
						value={ otp }
						valueLength={ 6 }
						onChange={ onChangeOtp }
					/>
				</div>

				<span className='mt-[23px] sm:mt-[17px] mb-8 sm:mb-[45px] text-sm'>
					{ timerCount > 0
						? (
							<p className='!text-med-grey leading-126%'>{ verificationData.resend.text } { timerCount }s</p>
						)
						: (
							<Button
								className='text-primary font-semibold leading-126% hover:underline cursor-pointer disabled:text-grey-1 disabled:hover:no-underline disabled:cursor-default'
								onClick={ onClickResendOtp }
								disabled={ (timerCount > 0) || loadingResend }
							>{ verificationData.resend.actionText }</Button>
						) }
				</span>

				{ verificationData.statement && (
					<span
						dangerouslySetInnerHTML={ { __html: verificationData.statement } }
						className='text-center text-base leading-126% !text-wording'
					/>
				) }

				<div className='mt-5 lg:mt-[15px]'>
					<Button
						type='submit'
						className={ clsxm(
							'btn btn-primary !py-2 !px-[37px] leading-126% text-base md:text-sm font-medium',
							loading ? '!text-white !bg-dark-purple' : ''
						) }
						disabled={ otp.length < 6 || loading }
					>{ loading ? verificationData.loadingText : verificationData.btnText }</Button>
				</div>
			</form>
		</div>
	);
};

export default Verification;
