import React from 'react';

import clsxm from '@/helpers/clsxm';
import { PrivacyTermsTypes } from '@/typings';

const Content: React.FC<PrivacyTermsTypes.ContentProps> = ({
	title,
	content,
	wrapperClassName,
	details
}) => {
	return (
		<div className={ clsxm('container-center', wrapperClassName) }>
			<div className='lg:max-w-[902px] lg:mx-auto'>
				<h2 className={ clsxm(
					'!text-primary text-heading-4 md:text-heading-5',
					content ? 'mb-5' : ''
				) }>{ title }</h2>

				{ content && (
					<span
						dangerouslySetInnerHTML={ { __html: content } }
						className='text-body-4 !text-wording'
					/>
				) }

				{ details && (
					<div className='flex flex-col gap-y-[21px] mt-[21px]'>
						{ details?.map((detail: PrivacyTermsTypes.DetailContent, detailIdx: number) => {
							return (
								<div key={ detailIdx }>
									{ detail?.title &&
										<h4 className='text-lg leading-[111%] font-medium text-primary mb-18px'>{ detail.title }</h4> }

									{ detail?.content &&
										<span
											dangerouslySetInnerHTML={ { __html: detail.content } }
											className='text-body-4 !text-wording'
										/> }
								</div>
							);
						}) }
					</div>
				) }
			</div>
		</div>
	);
};

export default Content;
