import React, { useEffect, useRef } from 'react';

import clsxm from '@/helpers/clsxm';
import { EffectVideoTypes } from '@/typings';

const EffectVideo: React.FC<EffectVideoTypes.EffectVideoProps> = ({ url, className }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		videoRef.current?.load();
	}, [url]);

	return (
		<video
			ref={ videoRef }
			className={ clsxm('w-full object-cover h-full', className) }
			autoPlay
			playsInline
			loop
		>
			<source
				src={ url }
				type='video/mp4'
			/>
			Your browser does not support HTML5 video
		</video>
	);
};

export default EffectVideo;
