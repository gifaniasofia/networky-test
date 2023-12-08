import { useSession } from 'next-auth/react';

const useIsAuthenticated = () => {
	const { status } = useSession();

	return  status === 'authenticated';
};

export default useIsAuthenticated;
