import { useState } from 'react';
import axios from 'axios';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import InfoSquareIcon from 'public/images/icons/info_square.svg';

import { Button, Input, Layout } from '@/components';
import { endpoints } from '@/constant';
import cancelEventDataLocal from '@/constant/data/cancel.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { showFormattedDate } from '@/helpers/misc';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { ShowEventByCode200Response } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const CancelEventPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
	navigationData,
	cancelEventData,
	eventDetail
}) => {
	const router = useRouter();
	const apiClient = useApiClient();

	const [message, setMessage] = useState<string>(`Unfortunately ${ eventDetail?.creator_name } cancelled ${ eventDetail?.title }${ eventDetail?.start_date ? ` on ${ showFormattedDate(new Date(eventDetail?.start_date)) }` : '' }.\nSorry for the inconvenience. Hope to see you soon.`);
	const [loadingCancel, setLoadingCancel] = useState<boolean>(false);

	const isHaveGuests = router?.query?.type === 'notify';

	const data = isHaveGuests
		? cancelEventData?.withRSVP
		: cancelEventData?.default;

	const onClickCancelEvent = async() => {
		try {
			const eventCode = (router?.query?.code ?? '') as string;

			if (eventCode) {
				setLoadingCancel(true);

				const response = await (await apiClient.eventsApi()).editEventStatus(eventCode, {
					status: IEvent.EventStatus.CANCELED,
					...isHaveGuests
						? { message }
						: {}
				});
				const status = response?.status;

				if (status === 200) {
					router.replace('/events');
				}
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoadingCancel(false);
		}
	};

	const renderTextArea = () => {
		if (isHaveGuests) {
			return (
				<>
					<div className='mt-[34px] sm:mt-5 sm:max-w-[532px] w-full sm:mx-auto'>
						<div className='flex items-center gap-9px'>
							<InfoSquareIcon className='flex-shrink-0 w-[13px] h-[13px] text-med-grey' />

							<span className='text-sm leading-126% !text-wording'>
								{ data?.info }
							</span>
						</div>
					</div>

					<div className='sm:max-w-[532px] w-full mx-auto mt-1.5 sm:mt-2'>
						<div className='flex items-end justify-between text-steel'>
							<Input.Label
								text='Message (event updates)'
								className='!text-sm sm:!text-xs !font-normal !leading-120% !mb-0'
							/>
						</div>

						<div className='mt-[17px] sm:mt-6'>
							<Input.TextArea
								value={ message }
								onChange={ (event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value) }
								className='rounded-[7px] bg-super-light-grey placeholder:text-med-grey text-steel text-sm leading-140% px-2.5 py-[11px] sm:py-[13px] border-none appearance-none resize-none'
								rows={ 3 }
								maxLength={ 160 }
							/>
						</div>

						<div className='mt-[5px] flex justify-end'>
							<span className='text-10px leading-120%'>{ message?.length }/160 character</span>
						</div>
					</div>
				</>
			);
		}
	};

	return (
		<Layout
			type='webapp'
			data={ navigationData }
			title='Cancel Event'
			showFooter={ false }
		>
			<div className='container-center w-full mt-60px relative pb-32'>
				<div className='pt-[70px] flex flex-col items-center w-full sm:max-w-3xl sm:mx-auto'>
					<h1 className='text-[26px] font-semibold leading-100% tracking-0.005em text-center'>{ data.title }</h1>

					{ data?.warning?.image && (
						<div className='relative overflow-hidden w-10 h-10 sm:w-30px sm:h-30px mt-18px sm:mt-6'>
							<Image
								src={ data?.warning?.image }
								alt=''
								fill
								className='object-contain'
							/>
						</div>
					) }

					<p className='mt-1 sm:mt-2.5 text-center text-steel text-base sm:text-xl leading-120%'>{ data?.warning?.text }</p>
					<p className='mt-[3px] sm:mt-px text-center text-steel text-xs sm:text-sm leading-140%'>{ data?.warning?.desc }</p>

					{ renderTextArea() }

					<Button
						className={ clsxm(
							'btn btn-primary py-2 sm:!py-1.5 px-10 sm:!px-[60px] text-lg sm:text-sm font-medium leading-[111%] sm:leading-126%',
							isHaveGuests ? 'mt-[49px] sm:mt-10' : 'mt-[71px] sm:mt-[76px]'
						) }
						onClick={ onClickCancelEvent }
						disabled={ loadingCancel }
					>
						{ data?.btnText }
					</Button>
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

	const code = ctx.params?.code ?? '';
	const cancelType = ctx?.query?.type ?? '';
	let eventDetail = null;

	try {
		const [navigation, cancelEvent] = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.cancelEventData)]);

		if (cancelType === 'notify') {
			const resEventDetail = await axios.get<ShowEventByCode200Response>(process.env.NEXT_PUBLIC_BASE_URL_API + `/v1/events/${ code }`,
				{
					httpsAgent: new https.Agent({ rejectUnauthorized: false }),
					headers: {
						Authorization: `${ session?.token ? 'Bearer ' + session?.token : '' }`
					}
				}
			);

			eventDetail = resEventDetail?.data?.data;
		}

		return {
			props: {
				navigationData: navigation?.data,
				cancelEventData: cancelEvent?.data,
				eventDetail
			}
		};
	} catch (error) {
		return {
			props: {
				cancelEventData: cancelEventDataLocal,
				navigationData: navigationDataLocal,
				eventDetail: null
			}
		};
	}
};

export default CancelEventPage;