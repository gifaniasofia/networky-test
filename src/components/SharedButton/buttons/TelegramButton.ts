import createShareButton from '../createShareButton';
import { transformObjectToParams } from '../utils';

const telegramLink = (url: string, { title }: { title?: string; }) => {
	return (
		'https://telegram.me/share/' +
		transformObjectToParams({
			url,
			text: title,
		})
	);
};

const TelegramShareButton = createShareButton<{ title?: string; }>(
	'telegram',
	telegramLink,
	props => ({ title: props.title }),
	{
		windowWidth: 550,
		windowHeight: 400,
	},
);

export default TelegramShareButton;