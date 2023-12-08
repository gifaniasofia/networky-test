import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';

import clsxm from '@/helpers/clsxm';
import { DescribeTagsTypes } from '@/typings';

import PortalSelect from '../PortalSelect';

const DescribeTags: React.FC<DescribeTagsTypes.DescribeTagsProps> = ({
	tags = [],
	maxShowLength,
	withPortal,
	tagClassName,
	wrapperTagClassName,
	className
}) => {
	const renderTag = (text: string, idx: number) => {
		return (
			<div
				key={ idx }
				className={ clsxm('px-5 sm:px-3.5 py-[3px] bg-light-grey/50 rounded-[5px]', wrapperTagClassName) }
			>
				<p className={ clsxm('text-xs leading-120% text-grey-2 whitespace-nowrap', tagClassName) }>{ text }</p>
			</div>
		);
	};

	const getTagList = () => {
		if (maxShowLength) {
			return tags.length > maxShowLength
				? tags.slice(0, maxShowLength)
				: tags;
		}

		return tags;
	};

	const renderTagList = () => {
		const tagList = getTagList();

		return (
			<>
				{ tagList.map(renderTag) }
				{ renderPopoverMoreTags() }
			</>
		);
	};

	const renderTriggerPopoverMoreTags = (moreTagLength: number) => {
		return (
			<Popover.Button className='focus:outline-none focus:border-none focus:ring-0'>
				<span className='text-xs sm:text-10px leading-120% text-grey-2'>
					+{ moreTagLength }<span className='max-sm:hidden'> more</span>
				</span>
			</Popover.Button>
		);
	};

	const renderPopoverPanelMoreTags = (tagList: string[]) => {
		return (
			<Popover.Panel className='absolute right-0 z-[999] py-1.5 px-2 max-h-44 overflow-y-auto custom-scrollbar bg-base rounded-[5px] shadow-[8px_24px_25px_-1px_rgba(188,187,187,0.25)]'>
				<div className='flex flex-wrap items-center gap-1.5 sm:gap-[5px]'>
					{ tagList.map(renderTag) }
				</div>
			</Popover.Panel>
		);
	};

	const renderPopoverMoreTags = () => {
		if (maxShowLength) {
			const moreTagLength = tags.length - maxShowLength;

			if (moreTagLength > 0) {
				const tagList = tags.slice(maxShowLength);

				return (
					<Popover className='relative'>
						{ ({ open }) => (
							<>
								{ withPortal
									? (
										<PortalSelect
											open={ open }
											renderTargetElement={ () => renderTriggerPopoverMoreTags(moreTagLength) }
										>
											{ renderPopoverPanelMoreTags(tagList) }
										</PortalSelect>
									)
									: (
										<>
											{ renderTriggerPopoverMoreTags(moreTagLength) }
											<Transition
												show={ open }
												as={ Fragment }
												enter='transition duration-100 ease-out'
												enterFrom='transform scale-95 opacity-0'
												enterTo='transform scale-100 opacity-100'
												leave='transition duration-75 ease-out'
												leaveFrom='transform scale-100 opacity-100'
												leaveTo='transform scale-95 opacity-0'
											>
												{ renderPopoverPanelMoreTags(tagList) }
											</Transition>
										</>
									) }
							</>
						) }
					</Popover>
				);
			}
		}

		return null;
	};

	const render = () => {
		if (tags?.length) {
			return (
				<div className={ clsxm('flex flex-wrap items-center gap-1.5 sm:gap-[5px] justify-end', className) }>
					{ renderTagList() }
				</div>
			);
		}

		return null;
	};

	return render();
};

export default DescribeTags;
