export interface ReqParamGoogleGeocode {
	location: string;
}

export interface ResGoogleGeocode {
	status?: `${ google.maps.places.PlacesServiceStatus }` | '';
	results?: google.maps.GeocoderResult[];
	errorMessage?: string;
}