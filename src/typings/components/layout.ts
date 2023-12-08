import { PropsWithChildren } from 'react';

export type LayoutProps = {
	title?: string;
	desc?: string;
	og_image?: string;
	canonical?: string;
	type?: 'landing' | 'webapp';
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	showFooter?: boolean;
	showNavbar?: boolean;
	showNavbarWebApp?: boolean;
	withFooterCta?: boolean;
	navbarWithQueryLink?: boolean;
} & PropsWithChildren;