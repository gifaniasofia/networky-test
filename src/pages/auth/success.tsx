import { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { CountUp } from 'use-count-up';

import { CopyToClipboard, Layout, SharedButton } from '@/components';
import { Api } from '@/configs/api';
import { endpoints } from '@/constant';
import authDataLocal from '@/constant/data/auth.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { useApiClient } from '@/hooks';
import { AuthTypes } from '@/typings';

import { authOptions } from '../api/auth/[...nextauth]';

const apiInstance = new Api();

const SuccessPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	authData: data,
	navigationData,
	totalRegistered
}) => {
	const authData = data ?? authDataLocal;
	const successData = authData.success;
	const apiClient = useApiClient();

	const [endCounter, setEndCounter] = useState(0);

	useEffect(() => {
		const getTotalRegistered = async() => {
			try {
				const response = await (await apiClient.profileApi()).showTotalRegistered();
				const status = response?.status;

				if (status === 200) {
					const totalRegisteredData = response?.data?.data?.total;

					setEndCounter(totalRegisteredData ?? 10000);
				} else {
					setEndCounter(10000);
				}
			} catch (error) {
				setEndCounter(10000);
			}
		};

		if (+ totalRegistered === 0) {
			getTotalRegistered();
		} else {
			setEndCounter(+ totalRegistered);
		}
	}, [totalRegistered]);

	const getWrapperSharedButton = (id: string) => {
		switch (id?.toLowerCase()) {
			case 'twitter': return SharedButton.Twitter;
			case 'email': return SharedButton.Email;
			case 'linkedin': return SharedButton.Linkedin;
			default:
				return SharedButton.Twitter;
		}
	};

	const getPropsSharedButton = (id: string, title?: string) => {
		switch (id?.toLowerCase()) {
			case 'email':
				return { body: title };
			case 'twitter':
				return { title };
			default: return {};
		}
	};

	const renderContentSharedButton = (method: AuthTypes.Method) => {
		return (
			<div className='btn btn-primary select-none !px-[15px] flex items-center gap-9px font-medium md:font-normal text-base md:text-sm md:leading-126% text-center'>
				{ method.image && (
					<Image
						src={ method.image }
						alt={ method.id ?? '' }
						width={ method.width ?? 15 }
						height={ method.height ?? 15 }
					/>
				) }

				<span>{ method.text }</span>
			</div>
		);
	};

	const renderSharedButton = (method: AuthTypes.Method) => {
		const id = method.id ?? '';

		if (id) {
			const WrapperButton = getWrapperSharedButton(id);
			const shareData = method?.shareData;
			const props = getPropsSharedButton(id, shareData?.title);

			return (
				<WrapperButton
					key={ method.text }
					url={ shareData?.url ?? process.env.NEXT_PUBLIC_BASE_URL }
					{ ...props }
				>
					{ renderContentSharedButton(method) }
				</WrapperButton>
			);
		}

		return renderContentSharedButton(method);
	};

	return (
		<Layout
			data={ navigationData }
			showNavbarWebApp={ false }
			title='Waitlist'
		>
			<div className='w-full flex-grow flex flex-col justify-between'>
				<div className='flex-1 h-full mt-60px pb-32 lg:pb-40'>
					<div className='container-center w-full'>
						<div className='pt-10 sm:pt-[59px] lg:max-w-5xl lg:mx-auto flex flex-col items-center text-center'>
							<Image
								src={ successData.headlineImage }
								alt='Success'
								width={ 149 }
								height={ 30 }
								className='w-[149px] sm:w-[119px] select-none mb-2.5 sm:mb-2'
							/>

							{ successData.desc && (
								<span
									dangerouslySetInnerHTML={ { __html: successData.desc } }
									className='text-base md:text-sm leading-[132.5%] md:leading-140% text-steel'
								/>
							) }

							<div className='select-none mt-[38px] sm:mt-5 border border-purple sm:border-steel py-3 px-6 text-center rounded-10px'>
								<span className='text-[22px] md:text-xl font-bold md:font-medium leading-[83%] md:leading-[111%] max-md:tracking-0.02em !text-wording'>
									<CountUp
										start={ 0 }
										end={ endCounter }
										duration={ 3.2 }
										thousandsSeparator=','
										isCounting={ endCounter > 0 }
									/>
									{ ' ' }{ successData.people }
								</span>
							</div>

							<div className='mt-11 sm:mt-[57px] text-center w-full flex flex-col items-center'>
								<h3 className='text-primary font-bold text-[22px] md:text-xl tracking-0.02em leading-[83%] mb-2 sm:mb-1.5'>
									{ successData.priorityAccess.title }
								</h3>

								{ successData.priorityAccess.desc && (
									<div className='max-sm:max-w-[286px]'>
										<span
											dangerouslySetInnerHTML={ { __html: successData.priorityAccess.desc } }
											className='text-base md:text-sm leading-[132.5%] md:leading-140% text-steel'
										/>
									</div>
								) }

								<div className='flex items-center justify-center gap-3.5 sm:gap-5 mt-[23px] sm:mt-9px'>
									{ successData.priorityAccess.methods.map((method: AuthTypes.Method) => renderSharedButton(method)) }
								</div>

								<div className='mt-[52px] sm:mt-[35px] w-full flex flex-col items-center gap-y-3 sm:gap-y-18px text-steel'>
									<p className='text-sm leading-140% !text-steel'>{ successData.uniqueLink.title }</p>

									<div className='flex items-center sm:max-w-md relative'>
										<span className='w-full flex min-w-0 appearance-none rounded-[7px] border-transparent bg-light-grey bg-opacity-40 px-3.5 !pr-[100px] py-1.5 sm:py-9px !text-steel sm:w-[437px] text-body-3 md:text-body-4'>
											{ successData.uniqueLink.link ?? process.env.NEXT_PUBLIC_BASE_URL }
										</span>
										<div className='sm:flex-shrink-0 absolute right-0 inset-y-0'>
											<CopyToClipboard
												disabled={ !successData.uniqueLink.link }
												text={ successData.uniqueLink.link }
												className='bg-purple text-white h-full flex items-center justify-center gap-2 px-4 py-[11px] rounded-[7px]'
											>
												<Image
													src={ successData.uniqueLink.button.icon }
													alt={ successData.uniqueLink.button.text }
													width={ 11 }
													height={ 12 }
												/>

												<span className='text-base md:text-sm leading-140% md:leading-126%'>{ successData.uniqueLink.button.text }</span>
											</CopyToClipboard>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async ctx => {
	const session = await getServerSession(ctx.req, ctx.res, authOptions(ctx.req?.cookies));

	if (!session?.token) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	try {
		const res = await Promise.all([
			axios.get(endpoints.navigationData),
			axios.get(endpoints.authData),
			(await apiInstance.profileApi()).showTotalRegistered()
		]);

		if (res && res.length === 3) {
			const navigationData = await res[0]?.data;
			const authData = await res[1]?.data;
			const totalRegistered = res[2]?.data?.data?.total;

			return {
				props: {
					navigationData,
					authData,
					totalRegistered: totalRegistered ?? 0
				}
			};
		} else {
			return {
				props: {
					authData: authDataLocal,
					navigationData: navigationDataLocal,
					totalRegistered: 0
				}
			};
		}
	} catch (error) {
		return {
			props: {
				authData: authDataLocal,
				navigationData: navigationDataLocal,
				totalRegistered: 0
			}
		};
	}
};

export default SuccessPage;
