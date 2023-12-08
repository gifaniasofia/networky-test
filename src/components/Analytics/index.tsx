import React from 'react';
import Script from 'next/script';

const Analytics: React.FC = () => {
	return (
		<React.Fragment>
			<Script
				async
				id='google-analytics-gtm'
				src={ `https://www.googletagmanager.com/gtag/js?id=${ process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string }` }
			/>

			<Script
				id='google-analytics'
				strategy='afterInteractive'
			>
				{ `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string }');
        ` }
			</Script>
		</React.Fragment>
	);
};

export default Analytics;