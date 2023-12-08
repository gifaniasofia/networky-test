import React from 'react';
import { useRouter } from 'next/router';
import PreviewIcon from 'public/images/create/preview.svg';

import clsxm from '@/helpers/clsxm';
import { IEvent } from '@/interfaces';
import { EventDetailTypes } from '@/typings';

import Button from '../Button';
import MenuDropdown from '../MenuDropdown';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const EditIcon = (props?: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='10'
		height='13'
		viewBox='0 0 10 13'
		fill='none'
		{ ...props }>
		<path
			d='M3.79698 11.5154L8.29638 5.42295L4.7054 2.96484L0.243344 9.00128C0.0589385 9.24747 -0.0255523 9.55417 0.00674354 9.86006L0.181147 11.671H0.181252C0.204068 11.9016 0.311377 12.1157 0.482447 12.2719C0.653621 12.4282 0.876564 12.5156 1.10828 12.5173C1.19475 12.5167 1.2806 12.5042 1.36353 12.48L3.13726 11.9759C3.4023 11.9003 3.63454 11.7382 3.79683 11.5154L3.79698 11.5154Z'
			fill='currentColor' />
		<path
			d='M9.75173 3.45707C9.95573 3.1862 10.0393 2.84332 9.98271 2.509C9.92624 2.17467 9.73465 1.87836 9.45294 1.68958L7.91592 0.63784C7.65026 0.454374 7.32364 0.381653 7.00524 0.435098C6.68685 0.488544 6.40192 0.663989 6.21074 0.924137L5.44531 1.96337L9.03602 4.42158L9.75173 3.45707Z'
			fill='currentColor' />
	</svg>
);

const menuList: EventDetailTypes.MenuItem[] = [
	{
		name: 'Edit',
		id: 'edit',
		icon: (props?: React.SVGProps<SVGSVGElement>) => <EditIcon
			className='text-white'
			{ ...props } />
	},
	{
		name: 'Invite',
		id: 'invite',
		icon: (props?: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='14'
				height='12'
				viewBox='0 0 14 12'
				fill='none'
				{ ...props }>
				<path
					d='M4.5 0C3.115 0 2 1.115 2 2.5C2 3.885 3.115 5 4.5 5C5.885 5 7 3.885 7 2.5C7 1.115 5.885 0 4.5 0ZM11 2C9.892 2 9 2.892 9 4C9 5.108 9.892 6 11 6C12.108 6 13 5.108 13 4C13 2.892 12.108 2 11 2ZM4.5 6C2.00701 6 0 8.00701 0 10.5V12H9V10.5C9 8.00701 6.99299 6 4.5 6ZM11 7C10.3107 7 9.68519 7.23897 9.17969 7.62695C9.6964 8.46465 10 9.44686 10 10.5V11H14V10C14 8.33801 12.662 7 11 7Z'
					fill='white' />
			</svg>
		)
	},
	{
		name: 'More',
		id: 'more',
		icon: (props?: React.SVGProps<SVGSVGElement>) => (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='15'
				height='4'
				viewBox='0 0 15 4'
				fill='none'
				{ ...props }>
				<circle
					cx='1.73077'
					cy='2.19171'
					r='1.73077'
					fill='white' />
				<circle
					cx='7.50421'
					cy='2.19171'
					r='1.73077'
					fill='white' />
				<circle
					cx='13.2698'
					cy='2.19171'
					r='1.73077'
					fill='white' />
			</svg>
		)
	}
];

const dropdownListMore: EventDetailTypes.MenuItem[] = [
	{
		name: 'Event Settings',
		id: 'settings',
		icon: () => (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='16'
				height='16'
				viewBox='0 0 16 16'
				fill='none'>
				<path
					d='M14.9021 9.54685C14.7983 9.36569 14.7133 9.21379 14.6441 9.08854C14.6016 9.01396 14.5669 8.94736 14.5323 8.8861C14.5722 8.59301 14.5909 8.29993 14.5909 7.99613C14.5909 7.69233 14.5722 7.39924 14.5323 7.1089C14.5722 7.03968 14.6147 6.96236 14.6653 6.87172C14.7318 6.75182 14.8063 6.61064 14.9021 6.44542C15.0005 6.27223 15.0857 6.13105 15.1574 6.01376C15.6016 5.27844 15.6016 5.17449 15.1574 4.43915C15.0856 4.31925 15.0004 4.17806 14.9021 4.00748C14.8037 3.83691 14.7266 3.69312 14.6601 3.5732C14.2399 2.80851 14.1494 2.75522 13.277 2.77388C13.1414 2.77388 12.9791 2.77924 12.7903 2.77924C12.5616 2.77924 12.378 2.77924 12.2264 2.77388H12.0322C11.5615 2.40885 11.0455 2.10779 10.4975 1.88392C10.4576 1.81195 10.4098 1.73202 10.3539 1.63877C10.2847 1.52422 10.205 1.38827 10.1119 1.23113C10.0162 1.0633 9.93898 0.922122 9.87248 0.802209C9.45226 0.0375123 9.35916 -0.0157756 8.50009 0.00289038C8.36176 0.00550721 8.19683 0.00824296 7.99734 0.00824296C7.79786 0.00824296 7.63567 0.00562612 7.4946 0.00289038C6.6355 -0.0157841 6.54242 0.0348875 6.12221 0.802209C6.05571 0.922106 5.97853 1.06329 5.88283 1.23113C5.78973 1.39099 5.70994 1.52421 5.64083 1.63877C5.58503 1.73202 5.53705 1.81195 5.49716 1.88392C4.9386 2.11301 4.41993 2.41144 3.95448 2.77388H3.7709C3.61927 2.77388 3.43309 2.77924 3.20438 2.77924C3.01285 2.77924 2.85065 2.77662 2.71492 2.77388C1.84254 2.75795 1.75205 2.8085 1.33718 3.56522C1.27068 3.68774 1.19089 3.83428 1.08984 4.01019C0.991406 4.18338 0.906269 4.32456 0.834552 4.44186C0.390351 5.17717 0.390351 5.28112 0.834552 6.01647C0.90639 6.13636 0.991528 6.27755 1.08984 6.45075C1.18555 6.61596 1.26273 6.75714 1.32661 6.87705C1.3772 6.96769 1.41971 7.04762 1.4596 7.11423C1.42232 7.4047 1.40106 7.70302 1.40106 8.00146C1.40106 8.2999 1.41971 8.59834 1.4596 8.89143C1.42505 8.95007 1.3905 9.01668 1.34787 9.09387C1.27876 9.22174 1.19623 9.37102 1.08984 9.5548C0.991406 9.72263 0.909001 9.86381 0.837163 9.9811C0.387612 10.7271 0.387612 10.8311 0.837163 11.5744C0.909001 11.6917 0.991406 11.8328 1.08984 12.0007C1.18828 12.1713 1.26807 12.3178 1.33457 12.4377C1.74943 13.1945 1.83993 13.245 2.70176 13.2263C2.84271 13.2237 3.00762 13.2209 3.20712 13.2209C3.38535 13.2209 3.53426 13.2236 3.66464 13.2263C3.77898 13.2263 3.87742 13.2289 3.96256 13.2289C4.44393 13.6019 4.95996 13.9004 5.50262 14.1161C5.54786 14.1961 5.60106 14.284 5.66221 14.3852C5.7287 14.4944 5.80315 14.6196 5.88829 14.7689C5.984 14.9368 6.06118 15.0779 6.12767 15.1979C6.54789 15.9626 6.641 16.0158 7.50006 15.9972C7.6384 15.9946 7.80333 15.9918 8.00281 15.9918C8.20229 15.9918 8.36448 15.9944 8.50556 15.9972C8.58535 15.9972 8.6598 15.9998 8.72629 15.9998C9.38863 15.9998 9.49763 15.8932 9.87797 15.1979C9.94446 15.078 10.0216 14.9368 10.1173 14.7689C10.2025 14.6198 10.2795 14.4945 10.3434 14.3852C10.4046 14.284 10.4578 14.1933 10.503 14.1161C11.0376 13.903 11.551 13.6046 12.035 13.2289C12.1227 13.2289 12.2238 13.2289 12.3409 13.2263C12.4712 13.2263 12.6201 13.2209 12.7956 13.2209C12.9925 13.2209 13.1573 13.2236 13.2984 13.2263C14.1602 13.245 14.2533 13.1917 14.6708 12.427C14.7373 12.3071 14.8145 12.1659 14.9102 11.9981C15.0086 11.8302 15.091 11.689 15.1628 11.5718C15.6124 10.8257 15.6124 10.7218 15.1628 9.97848C15.091 9.8612 15.0086 9.72001 14.9102 9.54956L14.9021 9.54685ZM7.99212 11.5559C6.03184 11.5559 4.43864 9.95985 4.43864 7.99623C4.43864 6.03256 6.0319 4.4366 7.99212 4.4366C9.9524 4.4366 11.5456 6.03262 11.5456 7.99623C11.5456 9.95991 9.95234 11.5559 7.99212 11.5559Z'
					fill='#062A30' />
			</svg>
		)
	},
	{
		name: 'Cancel Event',
		id: 'cancel',
		icon: () => (
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='15'
				height='19'
				viewBox='0 0 15 19'
				fill='none'>
				<path
					d='M1.23103 17.0363C1.23103 18.1208 2.11025 19 3.19474 19H11.4588C12.5433 19 13.4225 18.1208 13.4225 17.0363V4.69148H1.23112L1.23103 17.0363ZM10.2898 1.66752L9.64324 0H5.01021L4.36369 1.66752H0.5V4.04746H14.1536V1.66752H10.2898Z'
					fill='#FF4600' />
			</svg>
		)
	}
];

const Menu: React.FC<EventDetailTypes.MenuProps> = ({
	eventStatus,
	attendanceCount,
	isExpired,
	onClickCounterGuests
}) => {
	const router = useRouter();

	const onClickMenu = (menuId: string) => {
		if (menuId === 'edit') {
			router.push(`${ router.asPath }/edit`);
		} else if (menuId === 'invite') {
			router.push(`${ router.asPath }/invite`);
		} else if (menuId === 'preview') {
			router.push(`${ router.asPath }/preview?from=detail`);
		}
	};

	const onClickDropdownItem = (dropdownId: string) => {
		const eventCode = router?.query?.code;

		if (dropdownId === 'settings') {
			router.push(`/events/${ eventCode }/edit?state=settings`);
		} else if (dropdownId === 'cancel') {
			if (attendanceCount && attendanceCount > 0) {
				router.push(`/events/${ eventCode }/cancel?type=notify`);
			} else {
				router.push(`/events/${ eventCode }/cancel`);
			}
		}
	};

	const renderDropdownItemMore = () => {
		return dropdownListMore.map((dropdown: EventDetailTypes.MenuItem) => {
			const Icon = dropdown.icon;

			return {
				item: (
					<div className='flex gap-3.5 items-center'>
						{ Icon && <Icon className='flex-shrink-0' /> }
						<span className={ clsxm('text-base leading-140% font-medium', dropdown.id === 'cancel' ? 'text-orange' : 'text-steel') }>{ dropdown.name }</span>
					</div>
				),
				onClick: () => onClickDropdownItem(dropdown.id)
			};
		});
	};

	const resolveButtonClassName = (menuIdx: number) => {
		return clsxm(
			'group w-full h-full cursor-pointer relative hover:bg-dark-purple-2 py-4 px-2 text-white text-sm sm:text-xs flex max-sm:flex-col items-center justify-center sm:gap-2',
			menuIdx === 0 ? 'rounded-l-[5px]' : '',
			menuIdx === menuList.length - 1 ? 'rounded-r-[5px]' : '',
		);
	};

	const resolveMenuIconClassName = (menuId: string) => {
		switch (menuId) {
			case 'edit': return 'w-[18px] h-[21px] sm:w-3.5 sm:h-[17px]';
			case 'invite': return 'w-[23px] h-5 sm:w-[18px] sm:h-4';
			case 'more': return 'w-[26px] h-1.5 sm:w-[19px] sm:h-[5px]';
			default:
				return '';
		}
	};

	const renderMenuItem = (menu: EventDetailTypes.MenuItem) => {
		const Icon = menu.icon;
		const iconClassName = resolveMenuIconClassName(menu.id);

		return (
			<>
				<div className='max-sm:h-full max-sm:w-full flex flex-shrink-0 items-center justify-center'>
					<Icon className={ iconClassName } />
				</div>

				<p className='text-center'>{ menu.name }</p>
			</>
		);
	};

	const renderDropdownMore = (menu: EventDetailTypes.MenuItem, menuIdx: number) => {
		return (
			<MenuDropdown
				key={ menu.id }
				items={ renderDropdownItemMore() }
				buttonClassName={ resolveButtonClassName(menuIdx) }
				wrapperItemClassName='w-[175px] bottom-full'
				itemClassName='px-4 py-[11px] hover:bg-grey-1 hover:bg-opacity-40'
				withPortal={ false }
			>
				{ renderMenuItem(menu) }
			</MenuDropdown>
		);
	};

	const renderMenuBox = () => {
		const isNotPublished = typeof eventStatus === 'number' && (eventStatus === IEvent.EventStatus.DRAFT || eventStatus === IEvent.EventStatus.CANCELED);

		if (isNotPublished) {
			const btnClassName = 'md:rounded-[5px] md:bg-super-light-grey text-steel w-full h-full flex items-center justify-center space-x-2.5 text-sm md:leading-126% py-2 px-3 sm:px-5 text-center focus:outline-0 focus:ring-0';

			return (
				<div className='flex max-md:rounded-[5px] items-center justify-center md:gap-2 w-full max-md:drop-shadow-super-light-grey max-md:bg-super-light-grey'>
					<Button
						className={ btnClassName }
						onClick={ () => onClickMenu('edit') }
					>
						<EditIcon className='text-steel w-4 h-[19px]' />
						<span>Edit<span className='max-xxs:hidden'> Event</span></span>
					</Button>

					<Button
						className={ btnClassName }
						onClick={ () => onClickMenu('preview') }
					>
						<PreviewIcon className='text-steel w-4 h-4' />
						<span>Preview<span className='max-xxs:hidden'> Event</span></span>
					</Button>
				</div>
			);
		}

		if (!isExpired) {
			return (
				<div className='grid grid-cols-10 gap-2 w-full'>
					<Button
						className='relative col-span-3 bg-super-light-grey border-[0.5px] border-light-grey rounded-[5px] w-full h-full text-steel py-2.5'
						onClick={ onClickCounterGuests }
					>
						<div className='absolute-center flex max-sm:flex-col gap-px sm:gap-x-[5px] items-center sm:items-end justify-center text-center'>
							<p className='text-2xl leading-120%'>{ attendanceCount ?? '0' }</p>
							<p className='text-sm sm:text-xs'>Guests</p>
						</div>
					</Button>

					<div className='w-full h-full bg-purple grid grid-cols-3 rounded-[5px] col-span-7 relative'>
						{ menuList.map((menu: EventDetailTypes.MenuItem, menuIdx: number) => {
							return menu.id === 'more'
								? renderDropdownMore(menu, menuIdx)
								: (
									<Button
										key={ menu.id }
										className={ resolveButtonClassName(menuIdx) }
										onClick={ () => onClickMenu(menu.id) }
									>
										{ renderMenuItem(menu) }
									</Button>
								);
						}) }
					</div>
				</div >
			);
		}

		return null;
	};

	return renderMenuBox();
};

export default Menu;
