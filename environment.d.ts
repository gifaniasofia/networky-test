declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			NEXT_PUBLIC_BASE_URL: string;
			NEXT_PUBLIC_BASE_URL_JSON_DATA: string;
			NEXT_PUBLIC_BASE_URL_API: string;
			NEXT_PUBLIC_BASE_URL_S3: string;
			NEXT_PUBLIC_GA_MEASUREMENT_ID: string;
			NEXTAUTH_URL: string;
			NEXTAUTH_SECRET: string;
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			NEXT_PUBLIC_GOOGLE_API_KEY: string;
		}
	}
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { };