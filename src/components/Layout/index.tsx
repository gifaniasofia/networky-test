import React from 'react';
import dynamic from 'next/dynamic';

import { LayoutTypes } from '@/typings';

import SEO from '../SEO';

const NavbarLanding = dynamic(() => import('../Navbar/Landing'), { ssr: false });
const NavbarWebApp = dynamic(() => import('../Navbar/WebApp'), { ssr: false });
const FooterLanding = dynamic(() => import('../Footer/Landing'), { ssr: false });
const FooterWebApp = dynamic(() => import('../Footer/WebApp'), { ssr: false });

const Layout: React.FC<LayoutTypes.LayoutProps> = ({
	children,
	desc,
	canonical,
	og_image,
	title,
	type = 'webapp',
	data,
	showNavbar = true,
	showFooter = true,
	showNavbarWebApp,
	withFooterCta,
	navbarWithQueryLink
}) => {
	const renderNavbar = () => {
		if (showNavbar) {
			if (type === 'landing') return <NavbarLanding data={ data } />;

			if (type === 'webapp') return (
				<NavbarWebApp
					data={ data }
					showNavbar={ showNavbarWebApp }
					withQueryLink={ navbarWithQueryLink }
				/>
			);
		}

		return null;
	};

	const renderFooter = () => {
		if (showFooter) {
			if (type === 'landing') {
				return (
					<FooterLanding
						data={ data }
						withCta={ withFooterCta }
					/>
				);
			}

			if (type === 'webapp') return <FooterWebApp data={ data } />;
		}

		return null;
	};

	return (
		<React.Fragment>
			{ renderNavbar() }

			{ (title || desc || og_image || canonical)
				? (
					<SEO
						title={ title }
						description={ desc }
						og_images={ og_image }
						canonical={ canonical }
					/>
				) : null }

			<div className='min-h-screen flex flex-grow flex-col justify-between'>
				{ children }

				{ renderFooter() }
			</div>
		</React.Fragment>
	);
};

export default Layout;