import React from 'react';

import { IEvent } from '@/interfaces';
import { EventRespDetail } from '@/openapi';

{ /* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */ }

export type FormProps = {
	data?: any;
	initialValues?: IEvent.FormEventReq;
	eventCode?: string;
	detailEvent?: EventRespDetail;
	loading?: boolean;
};

export type RSVPOption = {
	id?: string;
	image: string;
	text: string;
};

export type GeneralSettingsProps = {
	detailEvent?: EventRespDetail;
	data?: any;
	onSaveDraft?: () => Promise<string>;
	eventCode?: string;
	isEffectActive?: boolean;
	loadingSave?: boolean;
};

export type GeneralSettingOption = {
	id: string;
	name: string;
};

export type ChooseCoverOption = {
	name: string;
	type: string;
	icon?: (props?: any) => React.JSX.Element;
};

export type CoverProps = {
	imageSrc?: string;
	onClickButtonEdit?: () => void;
	renderInputCover?: () => React.JSX.Element;
	isMobile?: boolean;
	loading?: boolean;
};

export type ButtonEditCoverProps = { onClick?: () => void; };

export type LocationState = null | {
	latitude?: number;
	longitude?: number;
};