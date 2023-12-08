import { PropsWithChildren } from 'react';

export type MenuDropdownItem = {
	item: string | React.ReactNode;
	onClick?: () => void;
};

export type MenuDropdownProps = PropsWithChildren & {
	items: MenuDropdownItem[];
	wrapperItemClassName?: string;
	itemClassName?: string;
	buttonClassName?: string;
	withPortal?: boolean;
};