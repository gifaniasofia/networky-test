import axios from 'axios';
import { InferGetStaticPropsType, NextPage } from 'next';

import { Layout, PrivacyTermsComponent } from '@/components';
import { endpoints } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import termsDataLocal from '@/constant/data/terms.json';

const TermsPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ termsData: data, navigationData }) => {
	const termsData = data ?? termsDataLocal;

	return (
		<Layout
			type='landing'
			data={ navigationData }
			title='Terms'
			withFooterCta
		>
			<div className='w-full'>
				<PrivacyTermsComponent.Hero
					title={ termsData?.title }
					subtitle={ termsData?.subtitle }
					lastUpdated={ termsData?.lastUpdate }
				/>
				<PrivacyTermsComponent.Content
					title={ termsData?.importantTitle }
					content={ termsData?.content }
					details={ termsData?.details }
					wrapperClassName='mt-[21px] sm:mt-12 mb-[99px] sm:mb-[82px]'
				/>
			</div>
		</Layout>
	);
};

export const getStaticProps = async() => {
	try {
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.termsData)]);

		if (res && res?.length === 2) {
			const navigationData = await res[0]?.data;
			const termsData = await res[1]?.data;

			return {
				props: {
					navigationData,
					termsData
				},
				revalidate: 10
			};
		} else {
			return {
				props: {
					termsData: termsDataLocal,
					navigationData: navigationDataLocal
				},
				revalidate: 10
			};
		}
	} catch (error) {
		return {
			props: {
				termsData: termsDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default TermsPage;
