import { useState } from 'react';
import axios from 'axios';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { ConfettiScreen, EventDetailComponent, Layout } from '@/components';
import { endpoints } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import { EventRespDetail, ShowEventByCode200Response } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const GuestSuccess: NextPage<
	InferGetServerSidePropsType<typeof getServerSideProps> & {
		eventDetail: EventRespDetail;
	}
> = ({ navigationData, eventDetail }) => {
	const [showConfetti, setShowConfetti] = useState<boolean>(true);

	return (
		<Layout
			type='webapp'
			data={ navigationData }
			title='Success'
			showFooter={ false }
		>
			<div className='overflow-hidden w-full h-full flex-1'>
				<div className='container-center mt-60px w-full h-full'>
					<div className='text-center pt-[74px] sm:pt-[72px]'>
						<span className='inline-flex items-center gap-0.5'>
							<h2 className='text-2xl lg:text-lg font-semibold max-sm:tracking-0.005em leading-[100%] sm:leading-126% !text-steel'>Thank you!</h2>

							<div className='relative overflow-hidden w-6 lg:w-[18px] h-6 lg:h-[18px]'>
								<Image
									src='/images/emoji/confetti.png'
									className='object-contain'
									alt=''
									quality={ 100 }
									fill
								/>
							</div>
						</span>
						<p className='text-base leading-[115.5%] sm:leading-126% max-sm:-tracking-[0.01em] font-normal mt-2 sm:mt-1.5 !text-steel'>You&apos;re on the Guest List</p>

						<EventDetailComponent.EventGeneralInfo eventDetail={ eventDetail } />

						<div className='mt-[69px] lg:mt-[137px]'>
							<Link
								href={ `/events/${ eventDetail.event_code }` }
								className='btn btn-primary text-base font-medium leading-[111%]'>Back to Event Page</Link>
						</div>
					</div>
				</div>
				<ConfettiScreen
					numberOfPieces={ showConfetti ? 500 : 0 }
					recycle={ false }
					onConfettiComplete={ confetti => {
						setShowConfetti(false);
						if (confetti) confetti.reset();
					} }
				/>
			</div>
		</Layout>
	);

};

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(context.req, context.res, authOptions(context.req?.cookies));
	if (!session?.token) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}
	try {
		const code = context.params?.code ?? '';

		const navigation = await axios.get(endpoints.navigationData);

		const eventDetail = await axios.get<ShowEventByCode200Response>(process.env.NEXT_PUBLIC_BASE_URL_API + `/v1/events/${ code }`,
			{
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
				headers: {
					Authorization: `Bearer ${ session?.token }`
				}
			}
		);

		return {
			props: {
				navigationData: navigation.data,
				eventDetail: eventDetail.data.data,
			}
		};
	} catch (error) {
		return {
			props: {
				navigationData: navigationDataLocal,
			}
		};
	}
};

export default GuestSuccess;