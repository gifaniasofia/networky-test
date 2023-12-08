import { useContext } from 'react';

import type { Api } from '../configs/api';
import { ApiContext } from '../contexts';

const useApiClient = (): Api => {
	const apiClient = useContext(ApiContext);
	if (!apiClient)
		throw new Error('useApiClient must be inside a Provider with a value');

	return apiClient;
};

export default useApiClient;
