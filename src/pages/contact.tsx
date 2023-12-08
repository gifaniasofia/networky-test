import axios from 'axios';
import { InferGetStaticPropsType, NextPage } from 'next';
import Link from 'next/link';

import { Layout } from '@/components';
import FooterLanding from '@/components/Footer/Landing';
import FooterWebApp from '@/components/Footer/WebApp';
import { endpoints } from '@/constant';
import contactDataLocal from '@/constant/data/contact.json';
import navigationDataLocal from '@/constant/data/navigation.json';
import { ContactTypes } from '@/typings';

const ContactPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ contactData: data, navigationData }) => {
	const contactData = data ?? contactDataLocal;

	return (
		<Layout
			type='landing'
			data={ navigationData }
			showFooter={ false }
			title='Contact Us'
		>
			<div className='w-full h-screen flex flex-col justify-between'>
				<div className='flex flex-col items-center justify-center gap-10 text-wording w-full h-full'>
					<h1 className='text-heading-4'>{ contactData.title }</h1>

					<div className='flex flex-col items-center gap-y-4'>
						{ contactData.list.map((contact: ContactTypes.ContactItem, contactIdx: number) => {
							return (
								<div
									key={ contactIdx }
									className='flex items-center gap-5 text-body-3'
								>
									<p className='!text-wording'>{ contact.name }</p>

									{ contact.href
										? (
											<Link
												href={ contact.href }
												target='_blank'
												rel='noopener noreferrer'
												className='!text-wording'
											>{ contact.value }</Link>
										)
										: <p className='!text-wording'>{ contact.value }</p> }
								</div>
							);
						}) }
					</div>
				</div>

				<div className='max-lg:hidden'>
					<FooterLanding data={ navigationData } />
				</div>
				<div className='lg:hidden'>
					<FooterWebApp data={ navigationData } />
				</div>
			</div>
		</Layout>
	);
};

export const getStaticProps = async() => {
	try {
		const res = await Promise.all([axios.get(endpoints.navigationData), axios.get(endpoints.contactData)]);

		if (res && res?.length === 2) {
			const navigationData = await res[0]?.data;
			const contactData = await res[1]?.data;

			return {
				props: {
					navigationData,
					contactData
				},
				revalidate: 10
			};
		} else {
			return {
				props: {
					contactData: contactDataLocal,
					navigationData: navigationDataLocal
				},
				revalidate: 10
			};
		}
	} catch (error) {
		return {
			props: {
				contactData: contactDataLocal,
				navigationData: navigationDataLocal
			}
		};
	}
};

export default ContactPage;
