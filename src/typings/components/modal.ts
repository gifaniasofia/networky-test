import React, { PropsWithChildren } from 'react';

export type DefaultProps = PropsWithChildren & {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onClose?: () => void; // eslint-disable-line no-unused-vars
};

export type ModalFullScreenProps = DefaultProps & {
	dialogTitle?: React.ReactNode;
	closeIcon?: boolean;
	dialogDescriptionClassName?: string;
};

export type ModalCenterProps = DefaultProps & {
	closeIcon?: boolean;
	panelClassName?: string;
};