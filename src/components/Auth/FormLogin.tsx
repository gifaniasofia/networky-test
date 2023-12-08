import React from 'react';
import { useRouter } from 'next/router';

import clsxm from '@/helpers/clsxm';
import { AuthTypes } from '@/typings';

import Button from '../Button';

const otherOption = {
	email: {
		icon: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='14'
				height='10'
				viewBox='0 0 14 10'
				fill='none'>
				<path
					d='M12.4131 0H1.6368C0.739466 0 0 0.733945 0 1.64304V8.35696C0 9.25772 0.731157 10 1.6368 10H12.3632C13.2605 10 14 9.26606 14 8.35696V1.58465C13.9917 0.708924 13.2855 0 12.4131 0ZM12.4131 0.834028C12.4297 0.834028 12.4546 0.834028 12.4712 0.834028L7.8184 4.6789C7.37804 5.04587 6.72997 5.04587 6.28131 4.68724L1.53709 0.842369C1.57033 0.842369 1.60356 0.834028 1.6368 0.834028H12.4131ZM13.1608 8.34862C13.1608 8.79066 12.8036 9.15763 12.3549 9.15763H1.6368C1.19644 9.15763 0.83086 8.799 0.83086 8.34862V1.64304C0.83086 1.55129 0.847478 1.45955 0.872403 1.38449L5.75786 5.34612C6.13175 5.64637 6.58872 5.7965 7.0457 5.7965C7.51098 5.7965 7.96795 5.63803 8.35015 5.32944L13.1276 1.37615C13.1442 1.44287 13.1608 1.51793 13.1608 1.58465V8.34862Z'
					fill='#AEAEAE' />
			</svg>
		),
		text: 'Use Email'
	},
	phone: {
		icon: (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='9'
				height='15'
				viewBox='0 0 9 15'
				fill='none'>
				<path
					d='M7.33201 0H1.65907C0.740337 0 0 0.749257 0 1.65907V12.3627C0 13.2815 0.749257 14.0218 1.65907 14.0218H7.34093C8.25966 14.0218 9 13.2725 9 12.3627V1.65907C9 0.749257 8.25074 0 7.33201 0ZM1.65907 0.820615H7.34093C7.80476 0.820615 8.17939 1.19524 8.17939 1.65907V2.10505H0.820615V1.65907C0.820615 1.20416 1.19524 0.820615 1.65907 0.820615ZM7.33201 13.2012H1.65907C1.19524 13.2012 0.820615 12.8266 0.820615 12.3627V2.92567H8.17047V12.3627C8.17047 12.8176 7.79584 13.2012 7.33201 13.2012Z'
					fill='#AEAEAE' />
				<path
					d='M4.49393 12.4605C5.07523 12.4605 5.54646 11.9893 5.54646 11.408C5.54646 10.8267 5.07523 10.3555 4.49393 10.3555C3.91264 10.3555 3.44141 10.8267 3.44141 11.408C3.44141 11.9893 3.91264 12.4605 4.49393 12.4605Z'
					fill='#AEAEAE' />
			</svg>
		),
		text: 'Use Phone Number'
	}
};

const FormLogin: React.FC<AuthTypes.FormLoginProps> = ({
	loading,
	onSubmit,
	data,
	children,
	type = 'phone'
}) => {
	const router = useRouter();

	const onSubmitLogin = (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (onSubmit) onSubmit();
	};

	const onClickOtherOption = () => {
		const path = type === 'phone' ? '/auth' : '/auth/phone';

		router.replace({
			pathname: path,
			query: { ...router.query }
		});
	};

	const renderOtherOption = () => {
		const otherType = type === 'phone' ? 'email' : 'phone';
		const option = otherOption[otherType];

		return (
			<Button
				className='flex items-center gap-1.5'
				onClick={ onClickOtherOption }>
				{ option.icon }

				<p className='text-sm font-semibold leading-126% text-med-grey'>{ option.text }</p>
			</Button>
		);
	};

	return (
		<form
			className='flex flex-col items-center mt-[53px] md:mt-[37px]'
			onSubmit={ onSubmitLogin }
		>
			<div className='w-full'>
				<div className='mb-[15px] flex items-center justify-between'>
					<p className='!text-wording text-sm font-semibold leading-126%'>
						{ data?.label }
					</p>
					{ renderOtherOption() }
				</div>

				{ children }
			</div>

			<div className='mt-5 md:mt-10 flex items-center justify-center w-full'>
				<Button
					type='submit'
					className={ clsxm(
						'btn py-2 px-5 w-full text-base md:text-sm font-medium leading-126% rounded-lg',
						loading ? 'bg-light-grey text-grey-2' : 'bg-primary text-white'
					) }
					disabled={ loading }
				>
					{ loading
						? data?.loadingText
						: data?.btnText }
				</Button>
			</div>
		</form>
	);
};

export default FormLogin;
