import React, { useState } from 'react';
import { useRouter } from 'next/router';

import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { useApiClient } from '@/hooks';
import { IEvent } from '@/interfaces';
import { ButtonTypes } from '@/typings';

import Button from '../Button';

const ButtonPublish: React.FC<ButtonTypes.ButtonProps> = ({ children, className, ...props }) => {
	const apiClient = useApiClient();
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);

	const onClickPublish = async() => {
		try {
			const eventCode = (router?.query?.code ?? '') as string;

			if (eventCode) {
				setLoading(true);

				const response = await (await apiClient.eventsApi()).editEventStatus(eventCode, { status: IEvent.EventStatus.HOSTED });
				const status = response?.status;

				if (status === 200) {
					router.replace(`/events/${ eventCode }/publish`);
				}
			}
		} catch (error) {
			handleCatchError(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			className={ clsxm('btn !rounded-[5px] px-3 sm:!px-[50px] btn-primary text-lg lg:text-sm font-medium leading-126%', className) }
			onClick={ onClickPublish }
			disabled={ loading }
			{ ...props }
		>
			{ children }
		</Button>
	);
};

export default ButtonPublish;
