import React from 'react';

import { classNames } from '@/helpers/style';

type ProgressBarProps = {
	progress: number;
	className?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = 'h-[3px] w-full' }) => {
	return (
		<div className={ classNames('relative rounded-full overflow-hidden', className) }>
			<div className='w-full h-full bg-[#D9D9D9] absolute' />
			<div
				id='bar'
				className='h-full bg-purple relative transition-all ease-out duration-1000'
				style={ { width: `${ progress }%` } }
			/>
		</div>
	);
};

export default ProgressBar;
