import { ReactNode } from 'react';

export type AccordionProps = {
	title?: ReactNode;
	content?: ReactNode;
	accordionKey?: string;
	children?: ReactNode;
};