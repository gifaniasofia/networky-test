// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { endpoints } from '@/constant';
import { ITimezone } from '@/interfaces';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ITimezone.ResGoogleTimezone>
) {
	try {
		const response = await axios.get<ITimezone.ResGoogleTimezone>(
			endpoints.googleMapsTimezone,
			{
				params: {
					...req.query,
					key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
				}
			}
		);

		res.status(response.status).json(response.data);
	} catch (error: any) {
		res.status(500).send({ errorMessage: error?.response?.data?.errorMessage ?? error?.message });
	}
}