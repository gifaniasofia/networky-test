import React from 'react';
import { setCookie } from 'cookies-next';
import { signIn } from 'next-auth/react';

import { AuthTypes } from '@/typings';

import Button from '../Button';

const listSSO = [
	{
		provider: 'google',
		text: 'Sign in with Google',
		icon: (props?: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='15'
				height='15'
				viewBox='0 0 15 15'
				fill='none'
				{ ...props }>
				<path
					d='M14.6616 7.67953C14.6616 7.17437 14.6127 6.65292 14.5312 6.16406H7.47534V9.04833H11.5166C11.3536 9.97717 10.8159 10.7919 10.0174 11.3134L12.4291 13.1873C13.8468 11.8674 14.6616 9.94458 14.6616 7.67953Z'
					fill='#626262' />
				<path
					d='M7.47552 14.98C9.49614 14.98 11.1909 14.3118 12.4293 13.1712L10.0176 11.3135C9.34948 11.7698 8.48583 12.0305 7.47552 12.0305C5.52008 12.0305 3.87425 10.7106 3.27132 8.95068L0.794434 10.8572C2.06547 13.383 4.64013 14.98 7.47552 14.98Z'
					fill='#626262' />
				<path
					d='M3.27129 8.93438C2.96168 8.00555 2.96168 6.99524 3.27129 6.0664L0.794397 4.14355C-0.264799 6.26195 -0.264799 8.75513 0.794397 10.8572L3.27129 8.93438Z'
					fill='#626262' />
				<path
					d='M7.47552 2.98654C8.53471 2.97025 9.57761 3.37763 10.3435 4.11092L12.4782 1.95994C11.1257 0.688901 9.33319 0.00449689 7.47552 0.0207922C4.64013 0.0207922 2.06547 1.61773 0.794434 4.14351L3.27132 6.06636C3.87425 4.29017 5.52008 2.98654 7.47552 2.98654Z'
					fill='#626262' />
			</svg>
		)
	}
];

const FormSSO: React.FC<AuthTypes.FormSSOProps> = ({ callbackUrl, eventCode }) => {
	const onClickBtnSignIn = async(provider: string) => {
		setCookie(
			'additionalAuthParams',
			JSON.stringify({
				callbackUrl,
				eventCode: eventCode ?? ''
			})
		);

		signIn(provider, { callbackUrl: `/auth/sso-success?callbackUrl=${ callbackUrl }` });
	};

	return (
		<div className='flex flex-col gap-y-[7px]'>
			{ listSSO.map((dataSSO, dataSSOIdx) => {
				const Icon = dataSSO.icon;

				return (
					<Button
						key={ dataSSOIdx }
						className='w-full btn bg-super-light-grey text-base md:text-sm font-medium leading-126% inline-flex items-center justify-center gap-2 !text-grey-2'
						onClick={ () => onClickBtnSignIn(dataSSO.provider) }
					>
						<Icon />
						<span>{ dataSSO.text }</span>
					</Button>
				);
			}) }
		</div>
	);
};

export default FormSSO;