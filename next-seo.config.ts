import { DefaultSeoProps } from 'next-seo';

const config: DefaultSeoProps = {
	title: 'Networky — Fruitful Meetups Start Here',
	description: 'From simple event pages to effortless invites and guestlist management, Networky is all you need to host a fruitful meetup.',
	openGraph: {
		url: process.env.NEXT_PUBLIC_BASE_URL,
		title: 'Networky — Fruitful Meetups Start Here',
		description: 'From simple event pages to effortless invites and guestlist management, Networky is all you need to host a fruitful meetup.',
		images: [
			{
				url: (process.env.NEXT_PUBLIC_BASE_URL_S3 ?? process.env.NEXT_PUBLIC_BASE_URL) + '/meta/networky_thumbnail.jpg'
			},
		],
	},
	twitter: {
		handle: process.env.NEXT_PUBLIC_BASE_URL,
		site: process.env.NEXT_PUBLIC_BASE_URL,
		cardType: 'summary_large_image',
	},
	titleTemplate: '%s — Networky'
};

export default config;