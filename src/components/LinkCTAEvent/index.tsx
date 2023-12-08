import React from 'react';

import { gtagEvent } from '@/helpers/gtag';
import useIsAuthenticated from '@/hooks/useIsAuthenticated';
import { QueryLinkTypes } from '@/typings';

import QueryLink from '../QueryLink';

const LinkCTAEvent: React.FC<Omit<QueryLinkTypes.QueryLinkProps, 'href'> & { href?: string; }> = ({ href, children, ...props }) => {
	const isAuthenticated = useIsAuthenticated();
	const finalHref = href ?? '/create';

	const onEnterEvent = () => {
		if (finalHref === '/auth' && !isAuthenticated) {
			gtagEvent({ action: 'Enter' });
		}
	};

	return (
		<QueryLink
			href={ finalHref }
			onClick={ onEnterEvent }
			{ ...props }
		>{ children }</QueryLink>
	);
};

export default LinkCTAEvent;
