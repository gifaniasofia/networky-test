import { useState } from 'react';
import axios from 'axios';
import { InferGetStaticPropsType, NextPage } from 'next';

import { FaqComponent, Layout } from '@/components';
import { endpoints } from '@/constant';
import faqDataLocal from '@/constant/data/faq.json';
import navigationDataLocal from '@/constant/data/navigation.json';

const FaqPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ faqData, navigationData }) => {
	const [selectedTab, setSelectedTab] = useState<string>(faqData?.list?.length ? faqData.list[0]?.name : '');

	return (
		<Layout
			type='landing'
			data={ navigationData }
			title='FAQ'
		>
			<FaqComponent.Hero
				data={ faqData }
				selectedTab={ selectedTab }
				setSelectedTab={ setSelectedTab }
			/>
			<FaqComponent.Content
				data={ faqData }
				selectedTab={ selectedTab }
			/>
		</Layout>
	);
};

export const getStaticProps = async() => {
	try {
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.faqData)]);

		if (res && res.length === 2) {
			const navigationData = await res[0]?.data;
			const faqData = await res[1]?.data;

			return {
				props: {
					navigationData,
					faqData
				},
				revalidate: 10
			};
		} else {
			return {
				props: {
					faqData: faqDataLocal,
					navigationData: navigationDataLocal
				},
				revalidate: 10
			};
		}
	} catch (error) {
		return {
			props: {
				faqData: faqDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default FaqPage;
