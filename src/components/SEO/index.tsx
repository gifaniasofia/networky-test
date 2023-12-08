import React from 'react';
import { NextSeo } from 'next-seo';

import { SeoTypes } from '@/typings';

import DefaultSEOConfig from '../../../next-seo.config';

const SEO: React.FC<SeoTypes.SEOProps> = ({
	title,
	description,
	canonical = '',
	og_images
}) => {
	return (
		<NextSeo
			titleTemplate={ DefaultSEOConfig.titleTemplate }
			title={ title }
			description={ description }
			canonical={ process.env.NEXT_PUBLIC_BASE_URL + canonical }
			openGraph={ {
				...DefaultSEOConfig.openGraph,
				title: title ?? DefaultSEOConfig.openGraph?.title,
				description,
				images: [
					{
						url: og_images ?? (process.env.NEXT_PUBLIC_BASE_URL_S3 + '/meta/networky_thumbnail.jpg')
					},
				],
			} }
			twitter={ DefaultSEOConfig.twitter }
		/>
	);
};
export default SEO;