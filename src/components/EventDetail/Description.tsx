import React from 'react';
import dynamic from 'next/dynamic';
import InfoSquareIcon from 'public/images/icons/info_square.svg';

import { EventDetailTypes } from '@/typings';

import Skeleton from '../Skeleton';

const BoxWrapper = dynamic(() => import('./BoxWrapper'), { ssr: false });

const Description: React.FC<EventDetailTypes.DescriptionProps> = ({ loading, text }) => {
	const renderDescription = () => {
		if (loading) {
			return (
				<div className='w-full'>
					<Skeleton
						loading={ loading }
						rows={ 5 } />
				</div>
			);
		}

		if (text) {
			const htmlStr = text
				? text.replace(/(?:\r\n|\r|\n)/g, '<br/>')
				: '';

			return (
				<>
					{ htmlStr && (
						<span
							dangerouslySetInnerHTML={ { __html: htmlStr } }
							className='html-str' />
					) }
				</>
			);
		}

		return null;
	};

	const renderBoxDescription = () => {
		if (!loading && !text) {
			return null;
		}

		return (
			<BoxWrapper className='mt-[9px] md:mt-[13px]'>
				<div className='border-b-[0.5px] border-light-grey py-3 px-3.5'>
					<div className='flex items-center gap-3'>
						<InfoSquareIcon className='flex-shrink-0 text-wording' />

						<span className='text-base font-semibold leading-126% !text-wording'>About Event</span>
					</div>
				</div>
				<div className='py-3 px-3.5 lg:px-15px lg:py-15px text-sm leading-[124%] text-steel'>
					{ renderDescription() }
				</div>
			</BoxWrapper>
		);
	};

	return renderBoxDescription();
};

export default Description;
