import React from 'react';

import faqDataLocal from '@/constant/data/faq.json';
import { FaqTypes } from '@/typings';

import Tabs from './Tabs';

const Hero: React.FC<FaqTypes.HeroProps> = ({
	data,
	selectedTab,
	setSelectedTab
}) => {
	const faqData = data ?? faqDataLocal;
	const tabs = faqData.list?.map((faq: FaqTypes.FaqList) => ({
		name: faq.name,
		image: faq.image ?? ''
	}));

	return (
		<>
			<div className='container-center w-full mt-16 sm:mt-20 lg:mt-[102px] text-wording'>
				<div className='pt-7 lg:pt-11 w-full'>
					<div className='w-full flex max-sm:flex-wrap max-sm:gap-4 max-sm:items-center justify-between sm:justify-end'>
						<span className='sm:hidden font-bold text-xl leading-89% tracking-0.02em !text-wording'>FAQ</span>

						<h1 className='sm:text-right text-page-title !text-wording'>{ faqData.title }</h1>
					</div>
				</div>
			</div>

			<div className='mt-[67px] w-full sticky lg:pt-7 top-0 min-h-64 sm:min-h-20 lg:min-h-[102px] bg-base z-[70]'>
				<div className='lg:container-center'>
					<Tabs
						tabs={ tabs }
						selectedTab={ selectedTab }
						setSelectedTab={ setSelectedTab }
					/>
				</div>
			</div>
		</>
	);
};

export default Hero;
