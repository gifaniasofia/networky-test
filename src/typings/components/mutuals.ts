import { IEvent } from '@/interfaces';
import { ProfileHistory } from '@/openapi';

import { RSVPOption } from './createEvent';

{ /* eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any */ }

export type MutualDetailProps = {
	eventDetail?: any;
	personDetail: any;
	onClickEventDetail?: (eventData: ProfileHistory, focus: string, person: any) => void;
	detailType: 'modal' | 'page' | 'content-modal';
	focus?: string;
	openModalDetail?: boolean;
	setOpenModalDetail?: React.Dispatch<React.SetStateAction<boolean>>;
	baseUrl?: string;
};

export type TableContactsProps = {
	data: IEvent.ContactRespExt[];
	loading?: boolean;
	onClickRow: (person: IEvent.ContactRespExt, focus: string) => void;
};

export type BoxEventDetailProps = {
	eventDetail: ProfileHistory;
	rsvpOptions?: RSVPOption[];
};

export type BoxEventListProps = {
	onClickDetail?: (eventData: ProfileHistory, focus: string, person: any) => void;
	personDetail: any;
};

export type BoxProfileDetailProps = { personDetail: IEvent.EventAttendanceRespExt; };

export type BoxSocialMediaProps = { personDetail: ObjectKey<PropertyValues<IEvent.EventAttendanceRespExt>>; };