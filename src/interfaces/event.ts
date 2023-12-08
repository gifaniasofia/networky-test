import { ContactResp, EventAttendanceResp, EventReq, EventSetQuestion } from '@/openapi';
import { InputTypes } from '@/typings';

{ /* eslint-disable no-unused-vars */ }

export interface FormEventReq extends Omit<EventReq, 'max_spot'> {
	max_spot?: string;
	datetime: InputTypes.DateTimeChangeValue;
}

export interface FormCover {
	poster_img: File | null;
}

export enum EventStatus {
	DRAFT = 0,
	HOSTED = 1,
	CANCELED = 2
}

export enum EventCategory {
	HOSTING = 'hosting',
	INVITED = 'invited',
	DRAFT = 'draft',
	ATTENDING = 'attending',
	CANCELED = 'canceled'
}

export interface ContactRespExt extends ContactResp {
	avatar?: string;
}

export interface EventAttendanceRespExt extends EventAttendanceResp {
	avatar?: string;
}

export interface ListMasterQuestionnaire200Response {
	stat_code?: string;
	stat_msg?: string;
	data?: {
		questionnaires: Array<EventSetQuestion>;
	};
}