import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import navigationDataLocal from '@/constant/data/navigation.json';
import clsxm from '@/helpers/clsxm';
import useIsAuthenticated from '@/hooks/useIsAuthenticated';
import { NavbarTypes } from '@/typings';

import LinkCTAEvent from '../LinkCTAEvent';
import QueryLink from '../QueryLink';

import NavbarProfile from './Profile';

const NavbarLanding: React.FC<NavbarTypes.NavbarProps> = ({ data }) => {
	const navigationData = data ?? navigationDataLocal;

	const router = useRouter();

	const isAuthenticated = useIsAuthenticated();
	const currentRoute = router.pathname;

	const renderMainMenuList = () => {
		return (
			<>
				{ navigationData.menu.map((menu: NavMenu) => {
					if (menu.showInNavbar) {
						const isActive = currentRoute === menu.href;

						return (
							<QueryLink
								href={ menu.href }
								key={ menu.name }
								className={ clsxm(
									'text-sm leading-126%',
									isActive ? 'text-primary font-bold' : 'text-wording font-medium'
								) }
							>
								{ menu.name }
							</QueryLink>
						);
					}

					return null;
				}) }
			</>
		);
	};

	const setListMenuDesktop = () => {
		// const isHost = session?.user?.is_host;

		// if (isAuthenticated && isHost) {
		// 	// show button create event
		// 	return navigationData.authMenu.slice(1);
		// }

		// show button login & button create event
		return navigationData.authMenu;
	};

	const resolveStyleBtnAuthMenu = (menuIdx: number) => {
		if (menuIdx % 2 === 1) {
			return 'btn-primary !font-medium';
		}

		return 'border border-steel rounded-md !text-wording lg:hover:bg-super-light-grey !font-medium';
	};

	const renderAuthMenuList = () => {
		if (!isAuthenticated) {
			const listMenu = setListMenuDesktop();

			return (
				<>
					{ listMenu.map((menu: NavMenu, menuIdx: number) => (
						<LinkCTAEvent
							key={ menu.name }
							className={ clsxm(
								'btn !py-2 px-3 lg:!px-5 flex-shrink-0 text-sm xxs:text-base lg:text-sm leading-120% lg:leading-126%',
								resolveStyleBtnAuthMenu(menuIdx)
							) }
							href={ menu.href }
						>
							{ menu.name && <span dangerouslySetInnerHTML={ { __html: menu.name } } /> }
						</LinkCTAEvent>
					)) }
				</>
			);
		}

		return (
			<NavbarProfile data={ navigationData } />
		);
	};

	return (
		<header className='inset-x-0 top-0 z-[60] fixed bg-base'>
			<nav
				className='w-full h-60px'
				aria-label='Global'
			>
				<div className='flex max-lg:justify-between container-center lg:grid lg:grid-cols-3 items-center h-full w-full'>
					<div className='flex'>
						<QueryLink href='/'>
							<div className='relative overflow-hidden w-[85.517px] h-5 lg:w-[119px] lg:h-[27.28px]'>
								<Image
									src={ navigationData.logoNetworkyFull.black }
									alt='logo'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
									fill
								/>
							</div>
						</QueryLink>
					</div>
					<div className='hidden lg:flex lg:items-center lg:justify-center lg:gap-x-9'>
						{ renderMainMenuList() }
					</div>
					<div className='flex justify-end gap-x-2 xxs:gap-x-[15px] lg:gap-x-4'>
						{ renderAuthMenuList() }
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavbarLanding;
