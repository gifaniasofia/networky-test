export type NavbarProps = {
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type NavbarProfileProps = NavbarProps & {
	iconClassName?: string;
	theme?: 'dark' | 'light';
};

export type NavbarWebAppProps = {
	logo?: string;
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	showNavbar?: boolean;
	withQueryLink?: boolean;
};