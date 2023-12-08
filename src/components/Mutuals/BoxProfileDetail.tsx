import React from 'react';
import Image from 'next/image';

import { MutualsTypes } from '@/typings';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const BoxProfileDetail: React.FC<MutualsTypes.BoxProfileDetailProps> = ({ personDetail }) => {
	const getCategories = () => {
		return (personDetail?.categories ?? [])?.map(category => category?.cat_name)?.join(', ');
	};

	return (
		<div className='flex flex-col items-center text-center bg-super-light-grey relative rounded-10px'>
			<div className='absolute left-1/2 -translate-x-1/2 -top-[50px]'>
				<div className='relative overflow-hidden w-[100px] h-[100px] rounded-full bg-grey-1'>
					{ personDetail.avatar && (
						<Image
							src={ personDetail.avatar }
							alt=''
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							fill
						/>
					) }
				</div>
			</div>

			<div className='pt-[55px] pb-[27px] px-3.5'>
				<h2 className='text-[26px] md:text-2xl font-semibold leading-100% tracking-0.005em'>{ personDetail.fname } { personDetail.lname }</h2>
				<p className='mt-[21px] md:mt-[15px] text-base md:text-sm leading-[136%] !text-steel'>{ getCategories() }</p>
				{ /* <p className='mt-px text-sm'>{ personDetail.company }</p> */ }
			</div>
		</div>
	);
};

export default BoxProfileDetail;
