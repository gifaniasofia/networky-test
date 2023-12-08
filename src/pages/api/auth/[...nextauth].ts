/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
import axios from 'axios';
import https from 'https';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { transformObjectToParams } from '@/helpers/misc';
import { GetProviderToken200Response, ValidateProviderToken200Response } from '@/openapi';

export const jwt = async({ token, user }: { token: JWT; user?: User; }) => {
	return { ...token, ...user };
};

export const session = ({ session, token }: { session: Session; token: JWT; }): Promise<Session> => {
	session.user = token.user;
	session.token = token.token;

	return Promise.resolve(session);
};

export const authOptions = (cookies?: Partial<{
	[key: string]: string;
}>): NextAuthOptions => ({
	providers: [
		CredentialsProvider({
			name: 'validate',
			id: 'validate',
			credentials: {
				token: { label: 'token', type: 'text', placeholder: 'token' },
				otp: { label: 'otp', type: 'text', placeholder: 'otp' },
				provider: { label: 'provider', type: 'text', placeholder: 'provider' },
			},
			async authorize(credentials) {
				try {
					const response = await axios.post<ValidateProviderToken200Response>(process.env.NEXT_PUBLIC_BASE_URL_API + '/v1/auth/provider-validation',
						{
							token: credentials?.otp,
							provider: credentials?.provider
						},
						{
							headers: { 'X-Validation': credentials?.token },
							httpsAgent: new https.Agent({ rejectUnauthorized: false })
						}
					);
					if (response.status === 200) {
						const nextAction = response.headers['x-next'];

						if (nextAction === 'login') {
							return {
								token: response.data.data.token,
								user: {
									fname: response.data.data.fname,
									lname: response.data.data.lname,
									is_host: response.data.data.is_host,
								}
							} as any;
						} else {
							return Promise.reject(new Error('register'));
						}
					} else {
						return Promise.reject(new Error(response.data?.stat_msg ?? 'it seems something wrong has happened. Please try again in a few minutes.'));
					}
				} catch (error) {
					if (axios.isAxiosError(error)) {
						if (error && error?.response) {
							const message = error?.response?.data?.stat_msg ?? error?.message;
							return Promise.reject(new Error(message));
						} else {
							return Promise.reject(new Error(error?.message));
						}
					} else {
						return Promise.reject(new Error('it seems something wrong has happened. Please try again in a few minutes.'));
					}
				}

			}
		}),
		CredentialsProvider({
			name: 'register',
			id: 'register',
			credentials: {},
			async authorize(_, req) {
				try {
					const response = await axios.post(process.env.NEXT_PUBLIC_BASE_URL_API + '/v1/auth/register',
						{
							...req.query
						},
						{
							httpsAgent: new https.Agent({ rejectUnauthorized: false })
						}
					);

					return {
						token: response.data.data.token,
						user: {
							fname: response.data.data.fname,
							lname: response.data.data.lname,
							is_host: response.data.data.is_host,
						}
					} as any;
				} catch (error) {
					if (axios.isAxiosError(error)) {
						if (error && error?.response) {
							const message = error?.response?.data?.stat_msg ?? error?.message;
							return Promise.reject(new Error(message));
						} else {
							return Promise.reject(new Error(error?.message));
						}
					} else {
						return Promise.reject(new Error('it seems something wrong has happened. Please try again in a few minutes.'));
					}
				}
			}
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code'
				}
			}
		})
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async signIn({ user, account, profile }: any) {
			if (account.provider === 'google') {
				let callbackUrl = '';
				let eventCode = '';
				if (cookies && cookies?.additionalAuthParams) {
					callbackUrl = JSON.parse(cookies?.additionalAuthParams)?.callbackUrl;
					eventCode = JSON.parse(cookies?.additionalAuthParams)?.eventCode;
				}

				const signupProps = {
					fname: profile.given_name ?? profile.name,
					...profile.family_name
						? { lname: profile.family_name }
						: {},
					email: profile.email,
					type: 'gmail',
					...callbackUrl
						? { callbackUrl }
						: {},
					...eventCode
						? { eventCode }
						: {}
				};
				// first axios request to ascertain if our user exists in our custom DB
				try {
					const response = await axios.post<GetProviderToken200Response>(
						process.env.NEXT_PUBLIC_BASE_URL_API + '/v1/auth/getprovidertoken',
						{
							provider_value: profile.email,
							provider: 'gmail', // ['email','gmail','linkedin','phone']
							provider_id: account.providerAccountId,
							provider_token: account.id_token,
							fname: profile.given_name,
							lname: profile.family_name
						},
						{ httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
					);

					if (response.status === 200) {
						const nextAction = response.headers['x-next'];
						if (nextAction === 'login') {
							user.token = response?.data?.data?.token;
							user.user = {
								fname: response?.data?.data?.fname,
								lname: response?.data?.data?.lname,
								is_host: response?.data?.data?.is_host
							};
							// user exists return true & passing data user from login API to the next callback
							return true;
						}
					}

					return `/auth/signup${ transformObjectToParams(signupProps) }`;
				} catch (error) {
					return `/auth/signup${ transformObjectToParams(signupProps) }`;
				}
			}

			return true;
		},
		session,
		jwt,
	},
	pages: {
		signIn: '/auth',
	},
});

export default async(req: NextApiRequest, res: NextApiResponse) => {
	return await NextAuth(req, res, authOptions(req?.cookies));
};