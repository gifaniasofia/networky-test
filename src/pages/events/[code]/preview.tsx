import axios from 'axios';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import PreviewIcon from 'public/images/create/preview.svg';

import { Button, EventDetailComponent } from '@/components';
import { Api } from '@/configs/api';
import { endpoints } from '@/constant';
import createEventDataLocal from '@/constant/data/create.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { IEvent } from '@/interfaces';
import { EventRespDetail } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const apiInstance = new Api();

const PreviewEventDetailPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps> & { data?: EventRespDetail; from?: string; }> = ({
	navigationData,
	createEventData,
	data,
	from
}) => {
	const router = useRouter();

	const isNotPublished = data?.event_status === IEvent.EventStatus.DRAFT || data?.event_status === IEvent.EventStatus.CANCELED;

	const onClickExitPreview = () => {
		if (from && from === 'detail') {
			router.back();
		} else {
			router.replace(`/events/${ data?.event_code }/edit`);
		}
	};

	const renderButtonPublish = () => {
		return (
			<EventDetailComponent.ButtonPublish
				disabled={ data?.is_expired }
				className='!px-10 w-full'>
				{ createEventData.publishEvent }
			</EventDetailComponent.ButtonPublish>
		);
	};

	const renderFloatingElement = () => {
		return (
			<div className='w-full max-md:container-center max-md:sticky max-md:bottom-0 max-md:z-[70] max-md:h-full flex flex-col items-center gap-2.5 max-md:pb-[76px]'>
				{ isNotPublished && (
					<div className='md:hidden w-full'>
						{ renderButtonPublish() }
					</div>
				) }
			</div>
		);
	};

	const renderPreviewEventInfo = () => {
		return (
			<div className='fixed top-60px md:top-0 left-1/2 -translate-x-1/2 z-[70] bg-light-grey bg-opacity-50 py-2 md:px-4 max-md:w-full'>
				<div className='max-md:container-center flex items-center justify-between gap-2.5 md:gap-10'>
					<div className='flex'>
						<div className='flex-shrink-0 mr-3'>
							<PreviewIcon className='text-steel w-[21px] h-[21px]' />
						</div>

						<p className='text-steel text-sm'>Previewing Event</p>
					</div>

					<Button
						className='text-white bg-purple rounded-lg text-base md:text-sm font-medium leading-120% md:leading-126% py-2 px-6 hover:bg-dark-purple-2'
						onClick={ onClickExitPreview }
					>Exit Preview</Button>
				</div>
			</div>
		);
	};

	return (
		<EventDetailComponent.Container
			showEffect={ !!data?.effect_name }
			navigationData={ navigationData }
			createEventData={ createEventData }
			pageTitle={ data?.title || 'Event' }
			floatingElement={ renderFloatingElement() }
		>
			{ renderPreviewEventInfo() }
			<div className='max-w-5xl mx-auto pb-[98px] lg:pb-[189px] pt-[67.2px] sm:pt-[47.2px] md:pt-0'>
				<div className='flex max-md:flex-col md:grid md:grid-cols-10 gap-[9px] md:gap-[13px]'>
					<div className='w-full md:col-span-5 lg:col-span-4'>
						<EventDetailComponent.CardEvent
							// loading={ loadingEventData }
							data={ data }
							defaultCover={ createEventData.defaultCover }
						/>

						<div className='mt-[13px]'>
							<EventDetailComponent.CopyLink
								link={ `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ data?.event_code ?? '' }` }
							// loading={ loadingEventData }
							/>
						</div>

						{ isNotPublished && (
							<div className='hidden md:flex justify-center w-full mt-9'>
								{ renderButtonPublish() }
							</div>
						) }
					</div>
					<div className='flex flex-col w-full md:col-span-5 lg:col-span-6'>
						<div className='flex flex-col gap-[9px] md:gap-[13px]'>
							<div>
								<EventDetailComponent.RSVP
									rsvpData={ createEventData.rsvp }
									isPreview
								/>
							</div>
							<EventDetailComponent.Location
								// loading={ loadingEventData }
								addr_lng={ data?.addr_lng }
								addr_ltd={ data?.addr_ltd }
								addr_name={ data?.addr_name }
								addr_detail={ data?.addr_detail ?? data?.location }
								addr_note={ data?.addr_note }
							/>
						</div>

						{ /* <EventDetailComponent.Message text={ data?.additional_msg } /> */ }
						<EventDetailComponent.Description
							text={ data?.description ?? '' }
						// loading={ loadingEventData }
						/>
					</div>
				</div>
			</div>
		</EventDetailComponent.Container>
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

	const from = (ctx.query?.from ?? '') as string;
	const code = (ctx.params?.code ?? '') as string;

	try {
		const res = await Promise.all([
			axios.get(endpoints.navigationData),
			axios.get(endpoints.createEventData)
		]);
		const eventDetail = await (await apiInstance.eventsApi()).showEventByCode(code, {
			httpsAgent: new https.Agent({ rejectUnauthorized: false }),
			headers: {
				Authorization: `${ session?.token ? 'Bearer ' + session?.token : '' }`
			}
		});

		if (res && res?.length === 2) {
			const navigationData = res[0]?.data;
			const createEventData = res[1]?.data;

			return {
				props: {
					navigationData,
					createEventData,
					from,
					data: eventDetail?.data?.data
				}
			};
		}

		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal,
				from,
				data: eventDetail?.data?.data
			}
		};
	} catch (error) {
		return {
			props: {
				createEventData: createEventDataLocal,
				navigationData: navigationDataLocal,
				from,
				data: {
					event_code: '',
					title: '',
					poster_img: '',
					description: '',
					location: '',
					map_link: '',
					is_host: false,
					max_spot: 0,
					// additional_msg: '',
					start_date: '',
					end_date: '',
					creator_name: '',
					background_name: '',
					effect_name: ''
				}
			}
		};
	}
};

export default PreviewEventDetailPage;
