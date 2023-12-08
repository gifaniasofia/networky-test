import React from 'react';
import { useRouter } from 'next/router';
import CloseIcon from 'public/images/icons/close.svg';

import { MutualsTypes } from '@/typings';

import Button from '../Button';
import NavbarPageDetail from '../Navbar/PageDetail';
import { Sheet, SheetContent } from '../Sheet';

import BoxEventDetail from './BoxEventDetail';
import BoxEventList from './BoxEventList';
import BoxProfileDetail from './BoxProfileDetail';
import BoxSocialMedia from './BoxSocialMedia';
import QuestionnaireList from './QuestionnaireList';

const MutualDetail: React.FC<MutualsTypes.MutualDetailProps> = ({
	eventDetail,
	personDetail,
	onClickEventDetail,
	detailType,
	focus,
	openModalDetail,
	setOpenModalDetail,
	baseUrl
}) => {
	const router = useRouter();
	const pageFocus = focus
		? focus
		: router?.query?.focus;

	const onCloseModalDetail = () => {
		if (pageFocus === 'guest') {
			if (setOpenModalDetail) setOpenModalDetail(false);
		}

		router.back();
	};

	const renderBoxProfileDetail = () => {
		return <BoxProfileDetail personDetail={ personDetail } />;
	};

	const renderBoxEventList = () => {
		return (
			<BoxEventList
				personDetail={ personDetail }
				onClickDetail={ onClickEventDetail }
			/>
		);
	};

	const renderBoxSocialMedia = () => {
		return <BoxSocialMedia personDetail={ personDetail } />;
	};

	const renderHeaderModal = () => {
		return (
			<Button
				className='absolute p-2 sm:p-5 top-0 right-0 focus:outline-0 focus:ring-0 focus:border-0'
				onClick={ onCloseModalDetail }
			>
				<CloseIcon className='text-steel w-[20px] h-[20px] sm:w-[29px] sm:h-[29px]' />
			</Button>
		);
	};

	const renderBoxEventDetail = () => {
		if (eventDetail) {
			return <BoxEventDetail eventDetail={ eventDetail } />;
		}

		return null;
	};

	const renderQuestionnaire = () => {
		if (eventDetail) {
			return <QuestionnaireList eventDetail={ eventDetail } />;
		}

		return null;
	};

	const renderContentModalEventDetail = () => {
		return (
			<div className='grid grid-cols-10 gap-x-[17px] mt-[90px]'>
				<div className='col-span-4 flex flex-col gap-y-[7px]'>
					{ renderBoxProfileDetail() }
					{ renderBoxSocialMedia() }
				</div>

				<div className='col-span-6 flex flex-col gap-y-[30px]'>
					{ renderBoxEventDetail() }
					{ renderQuestionnaire() }
				</div>
			</div>
		);
	};

	const renderContentModalGuestDetail = () => {
		return (
			<div className='grid grid-cols-10 gap-x-[17px] mt-[90px]'>
				<div className='col-span-4 flex flex-col gap-y-[7px]'>
					{ renderBoxProfileDetail() }
					{ renderBoxSocialMedia() }
				</div>
				<div className='col-span-6'>
					{ renderBoxEventList() }
				</div>
			</div>
		);
	};

	const renderModalDetail = () => {
		return (
			<Sheet
				onOpenChange={ () => {
					if (setOpenModalDetail) {
						setOpenModalDetail(false);
					}

					if (baseUrl) {
						router.replace(baseUrl);
					}
				} }
				open={ openModalDetail }
			>
				<SheetContent
					side='center'
					className='!h-auto w-full max-w-2xl lg:max-w-[795px]'
				>
					{ renderHeaderModal() }

					{ pageFocus === 'event'
						? renderContentModalEventDetail()
						: renderContentModalGuestDetail() }
				</SheetContent>
			</Sheet>
		);
	};

	const renderContentMobileGuestDetail = () => {
		return (
			<div className='mt-[54px] container-center flex flex-col gap-y-[9px] pb-[100px]'>
				{ renderBoxProfileDetail() }
				{ renderBoxSocialMedia() }
				<div className='mt-[13px]'>
					{ renderBoxEventList() }
				</div>
			</div>
		);
	};

	const renderContentMobileEventDetail = () => {
		return (
			<div className='mt-3.5 container-center flex flex-col gap-y-[18px] pb-[100px]'>
				{ renderBoxEventDetail() }
				<div>
					{ renderQuestionnaire() }
				</div>
			</div>
		);
	};

	const renderPageDetail = () => {
		return (
			<div>
				<NavbarPageDetail title={ pageFocus === 'guest' ? 'Guest List' : `${ personDetail.fname } ${ [personDetail.lname] }` } />

				{ pageFocus === 'event'
					? renderContentMobileEventDetail()
					: renderContentMobileGuestDetail() }
			</div>
		);
	};

	const renderContent = () => {
		if (detailType === 'page') return renderPageDetail();
		if (detailType === 'modal') return renderModalDetail();
		if (detailType === 'content-modal') {
			return pageFocus === 'event'
				? renderContentModalEventDetail()
				: renderContentModalGuestDetail();
		}

		return null;
	};

	return renderContent();
};

export default MutualDetail;
