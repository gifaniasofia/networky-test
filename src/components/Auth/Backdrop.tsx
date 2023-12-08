import React from 'react';
import Image from 'next/image';

import authDataLocal from '@/constant/data/auth.json';
import { classNames } from '@/helpers/style';
import { AuthTypes } from '@/typings';

const Backdrop: React.FC<AuthTypes.AuthProps> = ({ data, pageName }) => {
	const authData = data ?? authDataLocal;

	return (
		<>
			<div className='absolute bottom-20 left-0 max-md:hidden -z-10'>
				<div className='relative overflow-hidden h-[296px] w-[379px]'>
					<Image
						src={ authData.backdrop.left }
						alt=''
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>
			</div>

			<div className='absolute -bottom-5 right-0 max-md:hidden -z-10'>
				<div className='relative overflow-hidden h-[296px] w-[405px]'>
					<Image
						src={ authData.backdrop.right }
						alt=''
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>
			</div>

			<div className={ classNames(pageName === 'signup' ? 'hidden' : 'absolute bottom-0 left-1/2 -translate-x-1/2 sm:hidden -z-10 w-full') }>
				<div className='relative overflow-hidden max-sm:max-h-[172px] h-full w-full aspect-[3/1]'>
					<Image
						src={ authData.backdrop.bottom }
						alt=''
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>
			</div>
		</>
	);
};

export default Backdrop;
