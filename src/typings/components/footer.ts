import { ReactNode } from 'react';

export type FooterProps = {
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	withCta?: boolean;
};

export type SocialMediaWrapperProps = {
	children: ReactNode,
	href?: string;
	className?: string;
};

export type SocialMedia = {
	alt: string;
	url: string;
	image: string;
	class?: string;
	width?: number;
	height?: number;
};