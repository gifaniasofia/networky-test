import React, { useState } from 'react';
import Image from 'next/image';

import clsxm from '@/helpers/clsxm';
import { CreateEventTypes } from '@/typings';

import ButtonEditCover from './ButtonEditCover';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const Cover: React.FC<CreateEventTypes.CoverProps> = ({
	imageSrc,
	renderInputCover,
	onClickButtonEdit,
	isMobile,
	loading
}) => {
	const [isImageReady, setIsImageReady] = useState<boolean>(false);

	const onLoadImage = () => {
		setIsImageReady(true);
	};

	const renderButtonEdit = () => {
		const wrapperClassName = 'absolute bottom-0 inset-x-0 py-[18px] sm:py-[27px] px-3 bg-white bg-opacity-90 justify-center';

		return (
			<>
				<div className='max-sm:hidden'>
					<div className={ clsxm(wrapperClassName, 'group-hover:flex hidden') }>
						<ButtonEditCover onClick={ onClickButtonEdit } />
					</div>
				</div>

				<div className='sm:hidden'>
					<div className={ clsxm(wrapperClassName, 'flex') }>
						{ renderInputCover && isMobile
							? renderInputCover()
							: null }
					</div>
				</div>
			</>
		);
	};

	return (
		<div className='p-[13px] bg-super-light-grey border-[0.5px] border-light-grey rounded-[5px] w-full h-auto'>
			<p className='!text-wording mb-2.5 text-sm leading-126%'>Event Cover</p>
			<div className='flex-shrink-0 w-full h-full lg:h-auto aspect-square'>
				<div className={ clsxm('relative overflow-hidden w-full h-full group', loading || !isImageReady ? 'bg-grey-1/20' : '') }>
					{ !loading && (
						<>
							{ imageSrc && (
								<Image
									src={ imageSrc }
									alt=''
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									className='object-cover'
									onLoadingComplete={ onLoadImage }
									fill
								/>
							) }

							<div className='absolute top-0 right-0'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='36'
									height='33'
									viewBox='0 0 36 33'
									fill='none'
									className='w-30px h-7 sm:w-9 sm:h-[33px]'
								>
									<rect
										width='36'
										height='33'
										fill='white' />
									<path
										d='M26.5325 6H10.9175C9.30499 6 8 7.3125 8 8.91751V24.0825C8 25.6875 9.30499 27 10.9175 27H26.5325C28.145 27 29.45 25.6875 29.45 24.0825V8.91751C29.45 7.3125 28.145 6 26.5325 6ZM9.49999 8.91751C9.49999 8.13748 10.1375 7.5 10.9175 7.5H26.5325C27.3125 7.5 27.95 8.13749 27.95 8.91751V19.1325L18.5 14.235C17.495 13.7175 16.265 13.8225 15.365 14.49L9.49999 18.87L9.49999 8.91751Z'
										fill='#062A30' />
									<path
										d='M23.6781 14.1238C26.7441 14.0434 26.7435 9.6288 23.6781 9.54883C20.6122 9.62926 20.6128 14.0438 23.6781 14.1238Z'
										fill='#062A30' />
								</svg>
							</div>

							{ renderButtonEdit() }
						</>
					) }
				</div>
			</div>
		</div>
	);
};

export default Cover;