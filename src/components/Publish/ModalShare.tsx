import React from 'react';
import CloseIcon from 'public/images/icons/close.svg';
import InfoSquareIcon from 'public/images/icons/info_square.svg';

import { PublishTypes } from '@/typings';

import CopyLink from '../EventDetail/CopyLink';
import { Sheet, SheetContent, SheetHeader } from '../Sheet';

const ModalShare: React.FC<PublishTypes.ModalShareProps> = ({
	open,
	setOpen,
	eventCode,
	data
}) => {
	const renderContentModal = () => {
		return (
			<div className='flex flex-col items-center justify-center sm:px-5 max-sm:pt-10 sm:py-12 text-center'>
				<h4 className='text-xl sm:text-[26px] font-semibold leading-100% tracking-0.005em text-steel'>{ data?.title }</h4>

				<p className='text-base sm:text-xl leading-120% text-steel mt-2 sm:mt-[26px]'>{ data?.desc }</p>

				<div className='flex gap-2 mt-3 sm:mt-[5px]'>
					{ data?.info?.image && (
						<InfoSquareIcon className='flex-shrink-0 w-[13px] h-[13px] text-med-grey mt-0.5' />
					) }
					<p className='max-sm:max-w-[160px] text-xs sm:text-sm leading-126% !text-steel text-left'>{ data?.info?.text }</p>
				</div>

				<div className='sm:pb-16 mt-[57px] sm:mt-[66px] w-full sm:max-w-lg sm:mx-auto'>
					<p className='text-steel mb-1.5 text-xs sm:text-sm leading-140% text-center'>{ data?.shareCopyLink }</p>
					<CopyLink
						link={ `${ process.env.NEXT_PUBLIC_BASE_URL }/events/${ eventCode }` }
						theme='orange'
					/>
				</div>

				{ /* <div className='mt-[82px]'>
					<Link
						href={ `/events/${ eventCode }` }
						className='btn btn-primary'
					>
						{ data?.viewEvent }
					</Link>
				</div> */ }
			</div>
		);
	};

	const renderModal = () => {
		return (
			<Sheet
				onOpenChange={ () => setOpen(false) }
				open={ open }
			>
				<SheetContent
					side='center'
					className='px-[15px] sm:px-2.5 py-[15px] sm:py-3.5 h-auto bg-white w-full max-w-[calc(100vw-36px)] md:max-w-2xl'
				>
					<SheetHeader>
						<button
							className='absolute p-2 sm:p-5 top-0 right-0 focus:outline-0 focus:ring-0 focus:border-0'
							onClick={ () => setOpen(false) }
						>
							<CloseIcon className='text-steel w-[20px] h-[20px] sm:w-[29px] sm:h-[29px]' />
						</button>
					</SheetHeader>
					{ renderContentModal() }
				</SheetContent>
			</Sheet>
		);
	};

	return renderModal();
};

export default ModalShare;
