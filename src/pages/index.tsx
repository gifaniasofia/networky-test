import React from 'react';
import axios from 'axios';
import { InferGetStaticPropsType, NextPage } from 'next';

import { HomeComponent, Layout } from '@/components';
import { endpoints } from '@/constant';
import homeDataLocal from '@/constant/data/home.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { useWindowDimensions } from '@/hooks';

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ homeData: data, navigationData }) => {
	const dimensions = useWindowDimensions();

	const homeData = data ?? homeDataLocal;

	return (
		<Layout
			type='landing'
			data={ navigationData }
			title='Homepage'
			withFooterCta
		>
			<div className='mb-[121px] sm:mb-[87px]'>
				<HomeComponent.Hero
					width={ dimensions?.width }
					data={ homeData }
				/>
				<HomeComponent.RunningKeywords data={ homeData } />
				<HomeComponent.Features
					data={ homeData }
					width={ dimensions?.width }
				/>
				<HomeComponent.RunningKeywords data={ homeData } />
				<HomeComponent.Event
					width={ dimensions?.width }
					data={ homeData }
				/>
				<HomeComponent.OptionalFeatures data={ homeData } />
				<HomeComponent.ManageGuest data={ homeData } />
				<HomeComponent.Contacts
					width={ dimensions?.width }
					data={ homeData }
				/>
				<HomeComponent.Automation data={ homeData } />
			</div>
		</Layout>
	);
};

export const getStaticProps = async() => {
	try {
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.homeData)]);

		if (res && res.length === 2) {
			const navigationData = await res[0]?.data;
			const homeData = await res[1]?.data;

			return {
				props: {
					navigationData,
					homeData
				},
				revalidate: 10
			};
		} else {
			return {
				props: {
					homeData: homeDataLocal,
					navigationData: navigationDataLocal
				},
				revalidate: 10
			};
		}
	} catch (error) {
		return {
			props: {
				homeData: homeDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default HomePage;