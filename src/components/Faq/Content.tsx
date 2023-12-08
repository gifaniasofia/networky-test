import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import faqDataLocal from '@/constant/data/faq.json';
import clsxm from '@/helpers/clsxm';
import { FaqTypes } from '@/typings';

import Accordion from '../Accordion';

const Content: React.FC<FaqTypes.ContentProps> = ({ data, selectedTab }) => {
	const faqData = data ?? faqDataLocal;
	const contentData = faqData.list?.find((faq: FaqTypes.FaqList) => faq.name === selectedTab)?.data;
	const titles = contentData?.map((faqItem: FaqTypes.FaqItem) => faqItem?.question);

	const onClickScrollDown = (id: string) => {
		if (window) {
			window.scrollTo({
				top: (document?.getElementById(id)?.offsetTop ?? 80) - 120,
				left: 0,
				behavior: 'smooth'
			});
		}
	};

	const convertTitle = (title: string) => title?.toLowerCase()?.replace(/[^a-zA-Z0-9]/g, '_');

	const renderQuestion = (question: string) => {
		return (
			<p
				id={ convertTitle(question) }
				className='font-bold max-lg:text-base max-lg:leading-[121%] max-lg:font-medium !text-wording'
			>{ question }</p>
		);
	};

	const renderAnswer = (answer: string) => {
		if (answer) {
			return (
				<span
					dangerouslySetInnerHTML={ { __html: answer } }
					className='font-normal max-lg:text-body-5 !text-wording'
				/>
			);
		}

		return null;
	};

	const renderImage = (images?: string[]) => {
		if (images && images?.length) {
			return (
				<div className='mt-5 flex flex-wrap max-md:flex-col gap-10 lg:gap-50px items-center justify-center w-full'>
					{ images?.map((image, imageIdx) => {
						return (
							<div
								key={ imageIdx }
								className={ clsxm(
									'relative overflow-hidden w-full h-auto',
									images?.length > 1 ? 'max-w-[250px]' : 'max-w-[350px]'
								) }
							>
								<Image
									alt=''
									src={ image }
									className='w-full h-auto object-contain'
									width={ 0 }
									height={ 0 }
									sizes='100vw'
									style={ { width: '100%', height: 'auto' } }
								/>
							</div>
						);
					}) }
				</div>
			);
		}

		return null;
	};

	return (
		<div className='flex lg:gap-10 lg:text-lg -tracking-0.01em lg:container-center mt-2 lg:mt-[62px] mb-[130px]'>
			<div className='hidden lg:block lg:w-[30%]'>
				<div className='flex flex-col gap-y-6 w-full sticky top-[120px] max-h-[420px] overflow-y-auto custom-scrollbar pr-4'>
					{ titles?.map((title: string, titleIdx: number) => {
						return (
							<Link
								key={ titleIdx }
								href={ `#${ convertTitle(title) }` }
								className='text-wording font-light leading-[121%] cursor-pointer hover:text-wording/80'
								onClick={ (e: React.MouseEvent<HTMLAnchorElement>) => {
									e.preventDefault();
									onClickScrollDown(convertTitle(title));
								} }
							>{ title }</Link>
						);
					}) }
				</div>
			</div>

			<div className='w-full lg:w-[70%] text-wording'>
				<div className='hidden lg:flex flex-col gap-y-10'>
					{ contentData?.map((content: FaqTypes.FaqItem, contentIdx: number) => (
						<div
							key={ contentIdx }
							className='flex flex-col gap-y-3 leading-[139.5%]'
						>
							{ renderQuestion(content.question) }
							{ renderAnswer(content.answer) }
							{ renderImage(content.images) }
						</div>
					)) }
				</div>

				<div className='lg:hidden'>
					{ contentData?.map((content: FaqTypes.FaqItem, contentIdx: number) => (
						<Accordion
							key={ contentIdx }
							title={ renderQuestion(content.question) }
							accordionKey={ selectedTab }
						>
							{ renderAnswer(content.answer) }
							{ renderImage(content.images) }
						</Accordion>
					)) }
				</div>
			</div>
		</div>
	);
};

export default Content;
