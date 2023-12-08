import { ReactQuillProps } from 'react-quill';
import dynamic from 'next/dynamic';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
	ssr: false,
	loading: () => null,
});

const modules = {
	toolbar: [
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' }
		],
		['link']
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'link'
];

const Editor: React.FC<ReactQuillProps> = ({
	value,
	onChange,
	placeholder,
	...props
}) => {
	return (
		<QuillNoSSRWrapper
			modules={ modules }
			formats={ formats }
			value={ value }
			onChange={ onChange }
			theme='snow'
			placeholder={ placeholder }
			style={ { fontFamily: 'Barlow' } }
			{ ...props }
		/>
	);
};

export default Editor;