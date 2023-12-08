import { useEffect } from 'react';

import { InputTypes } from '@/typings';

// Updates the height of a <textarea> when the value changes.
const useAutoSizeTextArea = (
	autoSize: boolean,
	textAreaRef: HTMLTextAreaElement | null,
	value: InputTypes.TextAreaProps['value']
) => {
	useEffect(() => {
		if (textAreaRef && autoSize) {
			textAreaRef.style.height = '80px';
			const scrollHeight = textAreaRef.scrollHeight;

			textAreaRef.style.height = scrollHeight + 'px';
		}
	}, [autoSize, textAreaRef, value]);
};

export default useAutoSizeTextArea;
