export type HomeProps = {
	width?: number;
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type DetailData = {
	title: string;
	image: string;
	desc?: string;
};

export type ManageGuestStep = DetailData & {
	bulletColor: string;
	aspectRatio: string;
};

export type StepCreateEventType = 'background' | 'effect';

export type StepCreateEvent = {
	badge?: string;
	title?: string;
	data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
	dataType?: string; // css-background || thumbnail-video
	id?: StepCreateEventType;
	indexDefaultSelect?: number;
};

export type Feature = {
	id: string;
	icon: string;
	iconMobile?: string;
	title: string;
	desc: string;
	image: string;
	imageMobile?: string;
};

export type Keyword = {
	icon: string;
	text: string;
	color: string;
};