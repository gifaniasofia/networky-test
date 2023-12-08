import React from 'react';
import { Popover } from '@headlessui/react';

import clsxm from '@/helpers/clsxm';
import { classNames } from '@/helpers/style';
import { DropdownTypes } from '@/typings';

import PortalSelect from '../PortalSelect';

const MenuDropdown: React.FC<DropdownTypes.MenuDropdownProps> = ({
	items,
	children,
	wrapperItemClassName,
	itemClassName,
	buttonClassName = 'flex justify-center',
	withPortal = true
}) => {
	const renderPopoverButton = () => {
		return (
			<Popover.Button className={ clsxm(buttonClassName, 'focus:outline-none focus:border-0 focus:ring-0 cursor-pointer') }>
				{ children }
			</Popover.Button>
		);
	};

	const renderPopoverPanel = () => {
		return (
			<Popover.Panel className={ clsxm(
				'absolute right-0 z-[999] divide-y divide-light-grey rounded-[5px] bg-super-light-grey focus:outline-none focus:border-0 focus:ring-0',
				wrapperItemClassName
			) }>
				{ items?.map((menuItem: DropdownTypes.MenuDropdownItem, itemIdx: number) => {
					return (
						<div key={ itemIdx }>
							<div
								className={ classNames(
									'group cursor-pointer w-full text-steel',
									items.length === 1 ? 'rounded-[5px]' : '',
									itemIdx === 0 ? 'rounded-t-[5px]'
										: itemIdx === items.length - 1
											? 'rounded-b-[5px]'
											: '',
									itemClassName
								) }
								onClick={ menuItem.onClick }
							>
								{ menuItem.item }
							</div>
						</div>
					);
				}) }
			</Popover.Panel>
		);
	};

	return (
		<Popover className='relative'>
			{ ({ open }) => (
				<>
					{ withPortal
						? (
							<PortalSelect
								open={ open }
								renderTargetElement={ renderPopoverButton }
							>
								{ renderPopoverPanel() }
							</PortalSelect>
						) : (
							<>
								{ renderPopoverButton() }
								{ renderPopoverPanel() }
							</>
						) }
				</>
			) }
		</Popover>
	);
};

export default MenuDropdown;