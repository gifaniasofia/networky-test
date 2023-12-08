import React, { useEffect, useRef } from 'react';

import { addSingleMarkers } from './markers';

const DEFAULT_CENTER = { lat: 48.8566, lng: 2.3522 };
const DEFAULT_ZOOM = 15;

type MapsProps = {
	mapId?: string;
	className?: string;
	style?: React.CSSProperties;
	center?: google.maps.LatLngLiteral;
};

const Maps: React.FC<MapsProps> = ({
	mapId,
	className,
	style,
	center = DEFAULT_CENTER
}) => {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// Display the map
		if (ref?.current) {
			const map = new window.google.maps.Map(ref.current, {
				center,
				zoom: DEFAULT_ZOOM,
				mapId,
				disableDefaultUI: true,
			});

			// Displays markers on map when called
			addSingleMarkers({ locations: [center], map });
		}
	}, [ref, mapId, center?.lat, center?.lng]);

	return (
		<div
			className={ className }
			ref={ ref }
			style={ {
				width: '100%',
				height: '100%',
				...style
			} }
		/>
	);
};

export default Maps;