import React from 'react';
import dynamic from 'next/dynamic';
import InfoSquareIcon from 'public/images/icons/info_square.svg';

import { EventDetailTypes } from '@/typings';

const BoxWrapper = dynamic(() => import('./BoxWrapper'), { ssr: false });

const Message: React.FC<EventDetailTypes.MessageProps> = ({ text }) => {
	const renderBoxMessage = () => {
		if (text) {
			return (
				<BoxWrapper className='mt-[9px] md:mt-[13px]'>
					<div className='flex-1 h-full flex flex-col'>
						<div className='border-b-[0.5px] border-light-grey py-3.5 px-4'>
							<div className='flex items-center gap-3'>
								<InfoSquareIcon className='flex-shrink-0 text-wording' />

								<span className='text-base font-semibold leading-126% !text-wording'>Additional Message</span>
							</div>
						</div>
						<div className='px-4 lg:px-3 py-3'>
							<p className='text-steel text-body-2 md:text-dtp-btn md:font-medium'>
								{ text }
							</p>
						</div>
					</div>
				</BoxWrapper>
			);
		}

		return null;
	};

	return renderBoxMessage();
};

export default Message;
