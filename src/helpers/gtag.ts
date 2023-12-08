{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

type GTagEvent = {
	action: string;
	params?: any;
};

declare const window: Window &
	typeof globalThis & {
		gtag: any;
	};

// https://developers.google.com/tag-platform/gtagjs/reference#event
export const gtagEvent = ({ action, params }: GTagEvent): void => {
	if (window) {
		window.gtag('event', action, params);
	}
};