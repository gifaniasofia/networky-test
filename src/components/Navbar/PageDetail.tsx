import React from 'react';
import { useRouter } from 'next/router';
import ChevronLeftIcon from 'public/images/icons/chevron_left.svg';

import Button from '../Button';

type NavbarPageDetailProps = {
	title?: React.ReactNode;
	children?: React.ReactNode;
};

const NavbarPageDetail: React.FC<NavbarPageDetailProps> = ({ title, children }) => {
	const router = useRouter();

	return (
		<header>
			<nav
				className='flex items-center justify-between container-center h-60px'
				aria-label='Global'>
				<Button
					className='flex items-center gap-x-15px text-steel text-body-5'
					onClick={ () => router.back() }
				>
					<ChevronLeftIcon className='flex-shrink-0 text-primary' />
					{ title }
				</Button>
				<div className='flex'>
					{ children }
				</div>
			</nav>
		</header>
	);
};

export default NavbarPageDetail;