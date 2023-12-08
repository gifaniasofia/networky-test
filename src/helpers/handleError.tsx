import axios from 'axios';

import { toastify } from './toast';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const handleCatchError = (error: any) => {
	if (axios.isAxiosError(error)) {
		if (error && error?.response) {
			const message = error?.response?.data?.stat_msg ?? error?.message;

			if (message) toastify('error', message);
		} else {
			toastify('error-default');
		}
	} else {
		toastify('error-default');
	}
};