export type HeroProps = {
	title: string;
	subtitle?: string;
	description?: string;
	lastUpdated?: string;
};

export type DetailContent = {
	title?: string;
	content?: string;
};

export type ContentProps = {
	title: string;
	content?: string;
	wrapperClassName?: string;
	details?: DetailContent[];
};