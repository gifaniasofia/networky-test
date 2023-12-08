import React from 'react';

import navigationDataLocal from '@/constant/data/navigation.json';
import { FooterTypes } from '@/typings';

import QueryLink from '../QueryLink';

const FooterWebApp: React.FC<FooterTypes.FooterProps> = ({ data }) => {
	const navigationData = data ?? navigationDataLocal;

	return (
		<div className='container-center py-2.5 text-grey-2 text-10px !leading-120% tracking-0.02em'>
			<div className='flex items-center gap-6'>
				<p className='underline underline-offset-2'>{ navigationData.copyRight }</p>

				<div className='flex items-center gap-4 xxs:gap-18px'>
					{ navigationData.menuWebApp?.map((menu: NavMenu) => {
						return (
							<QueryLink
								key={ menu.name }
								href={ menu.href }
								className='underline underline-offset-2 text-center'
							>
								{ menu.name }
							</QueryLink>
						);
					}) }
				</div>
			</div>
		</div>
	);
};

export default FooterWebApp;