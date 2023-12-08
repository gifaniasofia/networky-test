import React from 'react';

import { toastify } from '@/helpers/toast';
import { ButtonTypes } from '@/typings';

import Button from '../Button';

const CopyToClipboard: React.FC<ButtonTypes.ButtonProps & { text: string; onSuccess?: () => void; }> = ({
	children,
	text,
	onSuccess,
	...buttonProps
}) => {
	const handleSuccess = () => {
		if (onSuccess) return onSuccess();

		toastify('success', 'Successfully copied');
	};

	const handleError = () => toastify('error', 'Sorry, unable to copy');

	const fallbackCopyTextToClipboard = () => {
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Avoid scrolling to bottom
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.position = 'fixed';

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');

			if (successful) {
				handleSuccess();
			} else {
				handleError();
			}
		} catch (err) {
			handleError();
		}

		document.body.removeChild(textArea);
	};

	const handleCopyLink = () => {
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard();
			return;
		}

		navigator.clipboard.writeText(text).then(handleSuccess, handleError);
	};

	return (
		<Button
			{ ...buttonProps }
			onClick={ handleCopyLink }
		>
			{ children }
		</Button>
	);
};

export default CopyToClipboard;
