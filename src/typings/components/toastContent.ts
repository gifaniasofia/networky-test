import { TypeOptions } from 'react-toastify';

export type CustomToastContentProps = {
	type: TypeOptions | 'error-default';
	content?: string;
};