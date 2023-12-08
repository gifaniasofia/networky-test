export interface ReqParamGoogleTimezone {
	location: string;
	timestamp: number;
	language?: string;
}

export interface ResGoogleTimezone {
	status?: string;
	errorMessage?: string;
	dstOffset?: number;
	rawOffset?: number;
	timeZoneId?: string;
	timeZoneName?: string;
}