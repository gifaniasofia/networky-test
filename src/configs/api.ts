import https from 'https';
import { getSession } from 'next-auth/react';

import {
	AppApi,
	AuthApi,
	EventsApi,
	NotificationApi,
	ProfileApi,
	ProfileCategoryApi,
	UploadApi
} from '../openapi/api';
import { BASE_PATH } from '../openapi/base';
import { Configuration } from '../openapi/configuration';

export class Api {
	private configuration = async() => {
		const session = await getSession();
		const openapiConfig = new Configuration({ basePath: process.env.NEXT_PUBLIC_BASE_URL_API ?? BASE_PATH });
		openapiConfig.baseOptions = {
			headers: {
				Authorization: `${ session?.token ? 'Bearer ' + session?.token : '' }`
			},
			httpsAgent: new https.Agent({ rejectUnauthorized: false })
		};

		return openapiConfig;
	};

	public authApi = async() => {
		const api = new AuthApi(await this.configuration());
		return api;
	};

	public profileApi = async() => {
		const api = new ProfileApi(await this.configuration());
		return api;
	};

	public eventsApi = async() => {
		const api = new EventsApi(await this.configuration());
		return api;
	};

	public notificationApi = async() => {
		const api = new NotificationApi(await this.configuration());
		return api;
	};

	public uploadApi = async() => {
		const api = new UploadApi(await this.configuration());
		return api;
	};

	public appApi = async() => {
		const api = new AppApi(await this.configuration());
		return api;
	};

	public profileCategoryApi = async() => {
		const api = new ProfileCategoryApi(await this.configuration());
		return api;
	};
}