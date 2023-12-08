import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import EventsIcon from 'public/images/icons/events.svg';
import GroupPeopleIcon from 'public/images/icons/group_people.svg';
import LogoutIcon from 'public/images/icons/logout.svg';
import NotificationIcon from 'public/images/icons/notification.svg';

import clsxm from '@/helpers/clsxm';
import { NavbarTypes } from '@/typings';

import MenuDropdown from '../MenuDropdown';

const NavbarProfile: React.FC<NavbarTypes.NavbarProfileProps> = ({ data }) => {
	const router = useRouter();

	const currentRoute = router.pathname;
	const { data: session } = useSession();

	const resolveIcon = (iconName: string) => {
		switch (iconName?.toLowerCase()) {
			case 'logout': return LogoutIcon;
			case 'events': return EventsIcon;
			case 'group_people': return GroupPeopleIcon;
			case 'notification': return NotificationIcon;
			default:
				return EventsIcon;
		}
	};

	const renderIcon = (iconName?: string, className?: string) => {
		if (iconName) {
			const Icon = resolveIcon(iconName);

			return <Icon className={ clsxm(className, 'flex-shrink-0') } />;
		}
	};

	const onClickLogout = () => {
		signOut({ redirect: false }).then(() => {
			router.replace('/');
		});
	};

	const isRouteActive = (href: string) => {
		const isActive = href === '/events'
			? currentRoute?.includes(href)
			: currentRoute === href;

		return isActive;
	};

	const renderMenuList = () => {
		return (
			<>
				{ data?.menuWebAppAuth?.map((menu: NavMenu) => {
					const isActive = isRouteActive(menu.href);

					return (
						<Link
							className={ clsxm(
								'relative group flex-shrink-0 flex items-center gap-1.5',
								isActive ? 'opacity-100' : 'opacity-30 hover:opacity-50'
							) }
							key={ menu.icon }
							href={ menu.href }
						>
							{ renderIcon(menu.icon, clsxm(
								'text-steel',
								'w-[12px] h-[12px] sm:w-[15px] sm:h-[15px]'
							)) }
							<span className='text-xs font-medium leading-126% text-black max-xxs:hidden'>{ menu.name }</span>
						</Link>
					);
				}) }
			</>
		);
	};

	const renderContentMenuDropdown = (profile: NavMenu) => {
		if (profile.id === 'profile') {
			return (
				<div className='flex flex-col items-start'>
					<p className='line-clamp-2 text-steel font-semibold text-base leading-[111%]'>{ (session?.user?.fname ?? '') + ' ' + (session?.user?.lname ?? '') }</p>
					{ session?.user?.email && (
						<p className='line-clamp-1 text-grey-2 text-xs leading-[111%] mt-[3px]'>{ session?.user?.email }</p>
					) }
				</div>
			);
		}

		return (
			<span className='text-sm font-medium leading-126%'>{ profile.name }</span>
		);
	};

	return (
		<div className='ml-2.5 xxs:ml-6 flex items-center gap-2.5 sm:gap-6'>
			{
				session?.user?.is_host && (
					<Link
						href={ data?.menuButtonCreateEvent?.href ?? '/create' }
						className={ clsxm(
							'border !rounded !px-2.5 !py-1 text-xs font-medium leading-126%',
							isRouteActive(data?.menuButtonCreateEvent?.href ?? '/create')
								? 'bg-steel text-white border-transparent'
								: 'bg-transparent text-steel border-steel hover:opacity-80'
						) }
					>
						{ data?.menuButtonCreateEvent?.text ?? 'Create' }
					</Link>
				)
			}

			<div className='flex gap-2.5 sm:gap-6 items-center'>
				{ session?.user?.is_host && renderMenuList() }

				<MenuDropdown
					wrapperItemClassName='mt-1 min-w-[208px] w-full rounded-[5px] !bg-white shadow-blur-1'
					itemClassName='text-xs font-normal leading-[111%] text-grey-2 !rounded-[5px]'
					items={ data?.menuProfile?.map((profile: any, profileIdx: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
						return {
							item: (
								<div className={ clsxm(
									'flex items-center gap-2.5 px-3.5 py-[15px]',
									profile.id !== 'profile' ? 'hover:bg-super-light-grey' : 'hover:!bg-transparent !cursor-default',
									profileIdx === 0 ? 'rounded-t-[5px]' : '',
									profileIdx === data?.menuProfile?.length - 1 ? 'rounded-b-[5px]' : ''
								) }>
									<div className='w-30px flex justify-center'>
										{ profile.id === 'profile'
											? (
												<div className='relative overflow-hidden w-30px h-30px flex-shrink-0'>
													<Image
														src='/images/avatars/avatars_yellow.png'
														alt='avatar'
														className='w-full h-full object-cover'
														sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
														fill
													/>
												</div>
											)
											: (
												<>
													{ profile.icon && renderIcon(profile.icon, 'w-4 h-4 text-steel') }
												</>
											) }
									</div>

									{ renderContentMenuDropdown(profile) }
								</div>
							),
							onClick: () => {
								if (profile.id === 'logout') {
									return onClickLogout();
								}
							}
						};
					}) }
				>
					<div className='relative overflow-hidden w-5 h-5 rounded-full'>
						<Image
							src='/images/avatars/avatars_yellow.png'
							alt='avatar'
							className='w-full h-full object-cover'
							sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							fill
						/>
					</div>
				</MenuDropdown>
			</div>
		</div>
	);
};

export default NavbarProfile;
