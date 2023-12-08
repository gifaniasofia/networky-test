import { PropsWithChildren } from 'react';
import { LinkProps } from 'next/link';

export type QueryLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & PropsWithChildren & React.RefAttributes<HTMLAnchorElement>;