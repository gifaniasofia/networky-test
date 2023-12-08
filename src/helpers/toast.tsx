import { toast, ToastOptions, TypeOptions } from 'react-toastify';

import { CustomToastContent } from '@/components';

const defaultConfig: ToastOptions = {
	position: toast.POSITION.TOP_RIGHT,
	hideProgressBar: true,
	draggable: true,
	draggablePercent: 60,
	draggableDirection: 'x',
	autoClose: 4000,
	closeButton: false
};

export const toastify = (type: TypeOptions | 'error-default', message?: string) => {
	toast(
		<CustomToastContent
			type={ type }
			content={ message }
		/>,
		{
			...defaultConfig,
			type: type === 'error-default' ? 'default' : type
		}
	);
};