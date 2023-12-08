import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import AOS from 'aos';
import type { AppProps } from 'next/app';
import { Barlow } from 'next/font/google';
import Head from 'next/head';
import { Router } from 'next/router';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import NProgress from 'nprogress';

import Analytics from '@/components/Analytics';
import { wrapper } from '@/configs/reduxConfig';

import SEO from '../../next-seo.config';
import { Api } from '../configs/api';
import { ApiContext } from '../contexts';

import '@/styles/globals.css';
import 'aos/dist/aos.css';
import 'nprogress/nprogress.css';
import 'react-phone-number-input/style.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

const apiClient = new Api();

const barlow = Barlow({
	weight: ['400', '500', '600', '700', '800', '900'],
	fallback: ['sans-serif'],
	subsets: ['latin'],
	variable: '--font-barlow'
});

const App = ({ Component, pageProps: { session, ...pageProps }, ...rest }: AppProps) => {
	useEffect(() => {
		AOS.init({ once: true });
		AOS.refresh();
	}, []);

	const { store } = wrapper.useWrappedStore(rest);

	useEffect(() => {
		NProgress.configure({ showSpinner: false });
		const handleRouteStart = () => NProgress.start();
		const handleRouteDone = () => NProgress.done();

		Router.events.on('routeChangeStart', handleRouteStart);
		Router.events.on('routeChangeComplete', handleRouteDone);
		Router.events.on('routeChangeError', handleRouteDone);

		return () => {
			// Make sure to remove the event handler on unmount!
			Router.events.off('routeChangeStart', handleRouteStart);
			Router.events.off('routeChangeComplete', handleRouteDone);
			Router.events.off('routeChangeError', handleRouteDone);
		};
	}, []);

	return (
		<React.Fragment>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
				/>

				{ /* <link
					rel='icon'
					href='/favicon/favicon.ico'
				/>
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/favicon/apple-touch-icon.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='32x32'
					href='/favicon/favicon-32x32.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/favicon/favicon-16x16.png'
				/> */ }
			</Head>

			<SessionProvider session={ session }>
				<Provider store={ store }>
					<ApiContext.Provider value={ apiClient }>
						<div className={ `${ barlow.variable }` }>
							<DefaultSeo { ...SEO } />
							<Analytics />
							<div className='font-barlow'>
								<Component { ...pageProps } />
							</div>
							<Script
								type='text/javascript'
								id='hs-script-loader'
								async
								defer
								src='//js.hs-scripts.com/39541661.js'
							/>

							<ToastContainer
								toastClassName={ () => 'relative overflow-hidden flex justify-between p-4 sm:p-5 rounded-[20px] mb-3 bg-white cursor-pointer shadow-[0px_2px_16px_rgba(16,12,65,0.08)]' }
								bodyClassName={ () => 'text-body-4 text-black font-barlow p-0 flex flex-1 items-center' }
								style={ { zIndex: 100000000000 } }
								newestOnTop
							/>
						</div>
					</ApiContext.Provider>
				</Provider>
			</SessionProvider>
		</React.Fragment>
	);
};

export default App;
