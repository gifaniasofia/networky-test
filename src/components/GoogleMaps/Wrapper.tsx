import React, { PropsWithChildren } from 'react';
import { Status, Wrapper } from '@googlemaps/react-wrapper';

const GoogleMaps: React.FC<PropsWithChildren> = ({ children }) => {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

	const render = (status: Status) => {
		if (status === Status.FAILURE) return <div>Cannot display the map</div>;
		return <></>;
	};

	return (
		<Wrapper
			apiKey={ apiKey }
			libraries={ ['places'] }
			render={ render }
		>
			{ children }
		</Wrapper>
	);
};

export default GoogleMaps;