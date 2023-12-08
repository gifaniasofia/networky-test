import React from 'react';
import Image from 'next/image';

import toastData from '@/constant/data/toast.json';
import { ToastContentTypes } from '@/typings';

const CustomToastContent: React.FC<ToastContentTypes.CustomToastContentProps> = ({ type, content }) => {
	const renderContent = () => {
		if (type === 'error-default') {
			return (
				<div className='flex items-start gap-2.5 select-none'>
					<div className='mt-[2px] sm:mt-1 flex-shrink-0 flex w-4 h-4'>
						<Image
							src={ toastData.errorIcon }
							alt={ type }
							width={ 16 }
							height={ 16 }
						/>
					</div>

					{ content
						? <div>{ content }</div>
						: <div dangerouslySetInnerHTML={ { __html: toastData.errorDefault } } /> }
				</div>
			);
		}

		return (
			<>
				{ content }
			</>
		);
	};

	return renderContent();
};

export default CustomToastContent;
