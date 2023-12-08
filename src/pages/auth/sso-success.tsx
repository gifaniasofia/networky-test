import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { getServerSession } from 'next-auth';

import { authOptions } from '../api/auth/[...nextauth]';

const SSOSuccessPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
	return null;
};

export const getServerSideProps: GetServerSideProps = async({ req, res, query }) => {
	const session = await getServerSession(req, res, authOptions(req?.cookies));
	const callbackUrl = (query?.callbackUrl ?? '') as string;

	if (callbackUrl) {
		return {
			redirect: {
				destination: callbackUrl.split(process.env.NEXT_PUBLIC_BASE_URL)[1],
				permanent: false,
			},
		};
	}

	if (session?.user?.is_host) {
		return {
			redirect: {
				destination: '/events',
				permanent: false,
			},
		};
	}

	if (!session?.user?.is_host) {
		return {
			redirect: {
				destination: '/auth/success',
				permanent: false,
			},
		};
	}

	return { props: {} };
};

export default SSOSuccessPage;