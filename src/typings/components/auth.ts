import React from 'react';

import { PhoneProps } from './input';

export type AuthProps = {
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	pageName?: string;
};

export type PhoneInputProps = AuthProps & {
	value?: PhoneProps['value'];
	onChange: PhoneProps['onChange']; // eslint-disable-line no-unused-vars
	disabled?: boolean;
};

export type FormLoginProps = AuthProps & {
	onSubmit?: () => (void | Promise<void>);
	loading?: boolean;
	children?: React.ReactNode;
	type?: 'phone' | 'email';
};

export type FormSignUpProps = AuthProps & {
	fname?: string;
	lname?: string;
	phone?: string;
	email?: string;
	callbackUrl?: string;
	registerType?: 'phone' | 'email';
	eventCode?: string;
};

export type VerificationProps = AuthProps & {
	loading?: boolean;
	value?: PhoneInputProps['value'] | string;
	type?: 'phone' | 'email';
	onSubmit?: (otpCode: string) => (void | Promise<void>); // eslint-disable-line no-unused-vars
};

export type HeroProps = { title?: string; };

export type ShareDataLink = {
	url?: string;
	title?: string;
};

export type Method = {
	image?: string;
	text?: string;
	id?: string;
	width?: number;
	height?: number;
	shareData?: ShareDataLink;
};

export type FormSSOProps = {
	callbackUrl?: string;
	eventCode?: string;
};

export type ContainerProps = {
	navigationData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	title: string;
	children?: React.ReactNode;
};