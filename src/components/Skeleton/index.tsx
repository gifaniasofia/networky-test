import React from 'react';

import clsxm from '@/helpers/clsxm';
import { SkeletonTypes } from '@/typings';

const Skeleton: React.FC<SkeletonTypes.SkeletonProps> = ({
	loading,
	className,
	children,
	rows = 1,
	...props
}) => {
	const render = () => {
		if (loading) {
			if (rows > 1) {
				return (
					<div className='flex flex-col gap-y-2'>
						{ Array.from(Array(rows).keys()).map(i => (
							<div key={ i }>
								{ i === (rows || 0) - 1 ? (
									<div className={ clsxm(
										'animate-pulse bg-grey-1/20 rounded-md h-3 w-1/2',
										className
									) } />
								) : (
									<div className={ clsxm(
										'animate-pulse bg-grey-1/20 rounded-md h-3 w-full',
										className
									) } />
								) }
							</div>
						)) }
					</div>
				);
			}

			return (
				<div
					className={ clsxm('animate-pulse rounded-md bg-grey-1/20 h-3', className) }
					{ ...props }
				/>
			);
		}

		return (
			<>
				{ children }
			</>
		);
	};

	return render();
};

export default Skeleton;