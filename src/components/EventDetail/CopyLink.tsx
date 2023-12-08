import React, { useEffect, useState } from 'react';

import clsxm from '@/helpers/clsxm';
import { useTimer } from '@/hooks';
import { EventDetailTypes } from '@/typings';

import CopyToClipboard from '../CopyToClipboard';
import Skeleton from '../Skeleton';

const CopyLink: React.FC<EventDetailTypes.CopyLinkProps> = ({
	loading,
	link,
	wrapperLinkClassName,
	theme = 'grey'
}) => {
	const [successCopied, setSuccessCopied] = useState<boolean>(false);

	const { timerCount, startTimer } = useTimer(3);

	useEffect(() => {
		if (timerCount === 0) {
			setSuccessCopied(false);
		}
	}, [timerCount]);

	return (
		<div className='flex items-center w-full relative'>
			<span className={ clsxm(
				'w-full flex text-left min-w-0 appearance-none rounded-[7px] border-transparent bg-super-light-grey border-[0.5px] border-light-grey px-3.5 !pr-[100px] py-1.5 sm:py-9px !text-steel text-sm leading-126% font-normal',
				wrapperLinkClassName
			) }>
				<Skeleton
					loading={ loading }
					className='w-2/3'>
					{ link ?? '' }
				</Skeleton>
			</span>
			<div className='flex-shrink-0 absolute right-0 inset-y-0'>
				<CopyToClipboard
					disabled={ !link || successCopied }
					text={ link ?? '' }
					className={ clsxm(
						'h-full flex items-center justify-center gap-2.5 px-[15px] py-[11px] text-sm leading-126% rounded-[5px]',
						theme === 'grey'
							? 'bg-light-grey !text-wording'
							: successCopied ? 'bg-dark-purple' : 'bg-primary'
					) }
					onSuccess={ () => {
						setSuccessCopied(true);
						startTimer();
					} }
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='13'
						height='15'
						viewBox='0 0 13 15'
						fill='none'
						className={ theme === 'grey' ? 'text-steel' : 'text-white' }
					>
						<rect
							y='4.21088'
							width='8.89472'
							height='10.2631'
							fill='currentColor' />
						<path
							fillRule='evenodd'
							clipRule='evenodd'
							d='M13.0002 0.105286H4.10547V2.15792H10.948V10.3684H13.0002V0.105286Z'
							fill='currentColor' />
					</svg>

					<span className={ clsxm(theme === 'grey' ? '!text-steel' : '!text-white') }>{ successCopied ? 'Copied' : 'Copy' }</span>
				</CopyToClipboard>
			</div>
		</div>
	);
};

export default CopyLink;