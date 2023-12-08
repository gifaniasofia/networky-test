import axios from 'axios';
import { InferGetStaticPropsType, NextPage } from 'next';

import { Layout, PrivacyTermsComponent } from '@/components';
import { endpoints } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import privacyDataLocal from '@/constant/data/privacy.json';

const PrivacyPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ privacyData: data, navigationData }) => {
	const privacyData = data ?? privacyDataLocal;

	return (
		<Layout
			type='landing'
			data={ navigationData }
			title='Privacy'
			withFooterCta
		>
			<div className='w-full'>
				<PrivacyTermsComponent.Hero
					title={ privacyData?.title }
					subtitle={ privacyData?.subtitle }
					description={ privacyData?.desc }
					lastUpdated={ privacyData?.lastUpdate }
				/>
				<PrivacyTermsComponent.Content
					title={ privacyData?.importantTitle }
					content={ privacyData?.content }
					details={ privacyData?.details }
					wrapperClassName='mt-[29px] sm:mt-[34px] mb-[99px] sm:mb-[254px]'
				/>
			</div>
		</Layout>
	);
};

export const getStaticProps = async() => {
	try {
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.privacyData)]);

		if (res && res.length === 2) {
			const navigationData = await res[0]?.data;
			const privacyData = await res[1]?.data;

			return {
				props: {
					navigationData,
					privacyData
				},
				revalidate: 10
			};
		} else {
			return {
				props: {
					navigationData: navigationDataLocal,
					privacyData: privacyDataLocal
				},
				revalidate: 10
			};
		}
	} catch (error) {
		return {
			props: {
				privacyData: privacyDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default PrivacyPage;
