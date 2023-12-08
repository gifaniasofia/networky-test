import React, { PropsWithChildren } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

const QueryLink: React.FC<Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps & PropsWithChildren & React.RefAttributes<HTMLAnchorElement>> = ({ href, ...props }) => {
	const router = useRouter();

	const pathname = typeof href === 'object' ? href.pathname : href;

	const query =
		typeof href === 'object' && typeof href.query === 'object'
			? href.query
			: {};

	return (
		<Link
			{ ...props }
			href={ {
				pathname,
				query: {
					...router.query,
					...query
				},
			} }
		/>
	);
};

export default QueryLink;