import assert from '../assert';
import createShareButton from '../createShareButton';
import { transformObjectToParams } from '../utils';

type Options = {
	title?: string;
	summary?: string;
	source?: string;
};

const linkedinLink = (url: string, { title, summary, source }: Options) => {
	assert(url, 'linkedin.url');

	return (
		// 'https://www.linkedin.com/shareArticle' +
		'https://linkedin.com/sharing/share-offsite' +
		transformObjectToParams({
			url,
			mini: 'true',
			title,
			summary,
			source
		})
	);
};

const LinkedinShareButton = createShareButton<Options>(
	'linkedin',
	linkedinLink,
	({
		title,
		summary,
		source
	}) => ({
		title,
		summary,
		source
	}),
	{
		windowWidth: 750,
		windowHeight: 600
	}
);

export default LinkedinShareButton;