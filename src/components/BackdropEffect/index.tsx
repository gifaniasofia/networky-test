import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { classNames } from '@/helpers/style';
import { BackdropEffectTypes } from '@/typings';

const EffectVideo = dynamic(() => import('../EffectVideo'), { ssr: false });

const BackdropEffect: React.FC<BackdropEffectTypes.EffectDataProps> = ({
	source_type,
	source_url
}) => {
	const renderComponent = () => {
		if (source_url) {
			const defaultWrapperClassName = 'absolute inset-0 pointer-events-none w-full h-full overflow-hidden';

			if (source_type === 'gif') {
				return (
					<div className={ classNames(defaultWrapperClassName, 'z-[99]') }>
						<div className='relative overflow-hidden w-full h-full'>
							<Image
								src={ source_url }
								alt=''
								className='object-cover'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								fill
							/>
						</div>
					</div>
				);
			}

			if (source_type === 'video') {
				return (
					<div className={ defaultWrapperClassName }>
						<EffectVideo url={ source_url } />
					</div>
				);
			}
		}

		return null;
	};

	return renderComponent();
};

export default BackdropEffect;
