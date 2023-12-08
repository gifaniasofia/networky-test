import { useState } from 'react';
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';

import {
	Button,
	ConfettiScreen,
	EventDetailComponent,
	Layout,
	PublishComponent
} from '@/components';
import { endpoints } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import publishDataLocal from '@/constant/data/publish.json';
import { useApiClient } from '@/hooks';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const EventDetailPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ navigationData, publishData }) => {
	const router = useRouter();
	const apiClient = useApiClient();

	const [openModalShare, setOpenModalShare] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [showConfetti, setShowConfetti] = useState<boolean>(true);

	const eventCode = (router?.query?.code ?? '') as string;
	const isInvitationSent = router?.query?.invitation && router?.query?.invitation === 'sent';

	const onClickEventGuest = async() => {
		try {
			setLoading(true);

			const response = await (await apiClient.eventsApi()).invitationList(eventCode);
			const status = response?.status;

			if (status === 200) {
				const dataContacts = response?.data?.data?.contacts ?? [];
				const contactsLength = dataContacts.length;

				if (contactsLength > 0) {
					return router.push(`/events/${ eventCode }/invite`);
				}
			}

			return setOpenModalShare(true);
		} catch (error) {
			setOpenModalShare(true);
		} finally {
			setLoading(false);
		}
	};

	const renderContentPage = () => {
		const btnClassName = 'btn btn-primary px-10 sm:!px-[60px] !py-2 text-base sm:text-sm font-medium leading-[111%] sm:leading-126%';

		if (isInvitationSent) {
			const invitationSentData = publishData?.invitationSent;

			return (
				<PublishComponent.Hero>
					<p className='text-base sm:text-xl leading-[115.5%] sm:leading-120% text-steel'>{ invitationSentData?.title }</p>

					<div className='mt-[3px] mb-[71px] sm:mb-[76px] sm:mt-px'>
						<p className='text-xs sm:text-sm leading-140% !text-steel'>{ invitationSentData?.desc }</p>
					</div>

					<Button
						className={ btnClassName }
						onClick={ () => router.push(`/events/${ eventCode }`) }
					>
						{ invitationSentData?.btnAction }
					</Button>
				</PublishComponent.Hero>
			);
		}

		const publishedData = publishData?.published;

		return (
			<PublishComponent.Hero>
				<p className='text-base sm:text-xl leading-[115.5%] sm:leading-120% text-steel'>{ publishedData?.title }</p>

				<div className='mt-[61px] sm:mt-[70px] flex justify-center items-center'>
					<p className='text-sm leading-140% !text-wording'>{ publishedData?.link?.text }</p>
				</div>

				<div className='mt-5 sm:mt-[22px] mb-[92px] sm:mb-[78px] w-full'>
					<EventDetailComponent.CopyLink link={ `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ eventCode ?? '' }` } />
				</div>

				<Button
					className={ btnClassName }
					onClick={ onClickEventGuest }
					disabled={ loading }
				>
					{ publishedData?.btnAction }
				</Button>
			</PublishComponent.Hero>
		);
	};

	return (
		<Layout
			type='webapp'
			data={ navigationData }
			title='Success'
			showFooter={ false }
		>
			<div className='w-full relative overflow-hidden flex-1 h-full pt-60px sm:pt-20'>
				{ renderContentPage() }

				<PublishComponent.ModalShare
					open={ openModalShare }
					setOpen={ setOpenModalShare }
					eventCode={ eventCode }
					data={ publishData?.share }
				/>
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
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.publishData)]);

		if (res && res?.length === 2) {
			const navigationData = await res[0]?.data;
			const publishData = await res[1]?.data;

			return {
				props: {
					navigationData,
					publishData
				}
			};
		} else {
			return {
				props: {
					publishData: publishDataLocal,
					navigationData: navigationDataLocal
				}
			};
		}
	} catch (error) {
		return {
			props: {
				publishData: publishDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default EventDetailPage;
