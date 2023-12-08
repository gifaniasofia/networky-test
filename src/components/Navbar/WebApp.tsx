import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import navigationDataLocal from '@/constant/data/navigation.json';
import useIsAuthenticated from '@/hooks/useIsAuthenticated';
import { NavbarTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';
import QueryLink from '../QueryLink';

import NavbarProfile from './Profile';

const NavbarWebApp: React.FC<NavbarTypes.NavbarWebAppProps> = ({
	data,
	showNavbar = true,
	withQueryLink = true
}) => {
	const navigationData = data ?? navigationDataLocal;

	const isAuthenticated = useIsAuthenticated();

	const renderLogo = () => {
		return (
			<>
				<div className='relative overflow-hidden w-[85.517px] h-5 lg:w-[119px] lg:h-[27.28px] max-xxs:hidden'>
					<Image
						src={ navigationData?.logoNetworkyFull?.black ?? '/images/logo/networky_full_black.png' }
						alt='logo'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>

				<div className='xxs:hidden relative overflow-hidden w-5 h-5'>
					<Image
						src={ navigationData?.logoNetworkyIcon?.black }
						alt='logo'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						fill
					/>
				</div>
			</>
		);
	};

	const renderAuthenticatedNavbar = () => {
		return (
			<div className='flex items-center justify-between h-60px'>
				<Link href='/'>
					{ renderLogo() }
				</Link>

				<NavbarProfile data={ navigationData } />
			</div>
		);
	};

	const renderUnauthenticatedNavbar = () => {
		const btnLoginClassName = 'btn btn-primary !py-2 !px-3 flex-shrink-0 text-base sm:text-sm font-medium leading-126% tracking-0.02em';

		return (
			<div className='flex items-center justify-between h-60px'>
				{ withQueryLink
					? (
						<LinkCTAEvent href='/'>
							{ renderLogo() }
						</LinkCTAEvent>
					)
					: (
						<Link href='/'>
							{ renderLogo() }
						</Link>
					) }

				{ withQueryLink
					? (
						<LinkCTAEvent
							className={ btnLoginClassName }
							href='/auth'
						>
							Log In
						</LinkCTAEvent>
					)
					: (
						<Link
							href='/auth'
							className={ btnLoginClassName }>
							Log In
						</Link>
					) }
			</div>
		);
	};

	const renderContentNavbar = () => {
		if (isAuthenticated && showNavbar) {
			return renderAuthenticatedNavbar();
		}

		if (!isAuthenticated && showNavbar) {
			return renderUnauthenticatedNavbar();
		}

		return (
			<div className='flex items-center h-60px'>
				<QueryLink href='/'>
					{ renderLogo() }
				</QueryLink>
			</div>
		);
	};

	return (
		<header className='inset-x-0 top-0 z-[60] absolute'>
			<nav
				className='w-full container-center'
				aria-label='Global'
			>
				{ renderContentNavbar() }
			</nav>
		</header>
	);
};

export default NavbarWebApp;