import { useEffect, useState } from 'react';

{ /* eslint-disable no-console */ }

const useGetLocation = (isGetLocation?: boolean) => {
	const [location, setLocation] = useState<LocationState>(null);

	useEffect(() => {
		if (isGetLocation) {
			if ('geolocation' in navigator) {
				// Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
				navigator.geolocation.getCurrentPosition(
					({ coords }) => {
						const { latitude, longitude } = coords;
						setLocation({ latitude, longitude });
					},
					(error: GeolocationPositionError) => {
						switch (error.code) {
							case error.PERMISSION_DENIED:
								console.log('[Navigator Geolocation]', 'Location service is blocked on this device');
								break;
							case error.POSITION_UNAVAILABLE:
								console.log('[Navigator Geolocation]', 'Location information is unavailable');
								break;
							case error.TIMEOUT:
								console.log('[Navigator Geolocation]', 'The request to get user location timed out');
								break;
							default:
								console.log('[Navigator Geolocation]', 'Unknown error');
								break;
						}
					}
				);
			} else {
				console.log('[Navigator Geolocation]', 'Geolocation is not supported by this browser');
			}
		}
	}, [isGetLocation]);

	return location;
};

export default useGetLocation;