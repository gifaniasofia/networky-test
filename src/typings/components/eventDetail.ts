import { PropsWithChildren, SVGProps } from 'react';

import { IEvent } from '@/interfaces';
import { EventRespDetail } from '@/openapi';

import { RSVPOption } from './createEvent';

{ /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */ }

export type EventDetailPageProps = {
	navigationData: any;
	createEventData: any;
	data?: EventRespDetail;
};

export type LocationProps = {
	loading?: boolean;
	addr_name?: string;
	addr_detail?: string;
	addr_note?: string;
	addr_ltd?: string;
	addr_lng?: string;
};

export type DescriptionProps = {
	loading?: boolean;
	text?: string;
};

export type BoxWrapperProps = PropsWithChildren & {
	className?: string;
};

export type CardEventProps = {
	loading?: boolean;
	data?: EventRespDetail;
	defaultCover?: string;
};

export type CopyLinkProps = {
	link?: string;
	wrapperLinkClassName?: string;
	loading?: boolean;
	theme?: 'orange' | 'grey';
};

export type SpotProps = {
	loading?: boolean;
	count?: number;
	attendanceCount?: number;
};

export type MessageProps = {
	text?: string;
};

export type MenuItem = {
	name: string;
	id: string;
	icon: (props?: SVGProps<SVGSVGElement>) => JSX.Element;
};

export type MenuProps = {
	eventStatus?: number;
	attendanceCount?: number;
	isExpired?: boolean;
	onClickCounterGuests?: () => void;
};

export type RSVPProps = {
	rsvpData?: any;
	isPreview?: boolean;
	isHost?: boolean;
	detailEvent?: EventRespDetail;
	render?: 'button' | 'detail';
};

export type ContainerProps = PropsWithChildren & {
	showEffect: boolean;
	createEventData: any;
	navigationData: any;
	pageTitle?: string;
	floatingElement?: React.ReactNode;
	showNavbar?: boolean;
	showFooter?: boolean;
	og_image?: string;
	pageDesc?: string;
	navbarWithQueryLink?: boolean;
};

export type ModalGuestListProps = {
	open: boolean;
	onClose: () => void;
	rsvpOptions: RSVPOption[];
	attendancesList?: IEvent.EventAttendanceRespExt[];
	eventCode?: string;
	loadingGuestList?: boolean;
};

export type GuestListProps = {
	data: IEvent.EventAttendanceRespExt[];
	onClick: (person: IEvent.EventAttendanceRespExt) => void;
};

export type InviteProps = {
	loading?: boolean;
	invited: IEvent.ContactRespExt[];
	contacts: IEvent.ContactRespExt[];
	selectedOptions: number[];
	setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
};

export type CustomizeMessageProps = {
	data?: EventRespDetail;
	contacts: IEvent.ContactRespExt[];
	selectedOptions: number[];
	setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
};

export type TabGuestList = RSVPOption & { count?: number; };