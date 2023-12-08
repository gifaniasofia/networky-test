import { useSession } from 'next-auth/react';

const useToken = () => {
	const { data } = useSession();

	return data;
};

export default useToken;
