import React from 'react';
import { Disclosure } from '@headlessui/react';
import ChevronDownIcon from 'public/images/icons/chevron_down.svg';

import clsxm from '@/helpers/clsxm';
import { AccordionTypes } from '@/typings';

const Accordion: React.FC<AccordionTypes.AccordionProps> = ({
	title,
	content,
	children,
	accordionKey
}) => {
	return (
		<Disclosure
			as='div'
			key={ accordionKey }
			className='w-full xxs:pl-18px pl-4'
		>
			{ ({ open }) => (
				<>
					<Disclosure.Button className='flex items-center text-left justify-between gap-2.5 w-full border-b-0.5px border-primary pr-5 pt-6 pb-2.5 focus:outline-none'>
						{ title }
						<ChevronDownIcon
							className={ clsxm('w-3.5 h-3.5 !text-wording flex-shrink-0 transform transition-all duration-500', open ? '-rotate-180' : '') }
						/>
					</Disclosure.Button>
					<Disclosure.Panel className='pr-5 pt-3.5 pb-6'>
						{ content }
						{ children }
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

export default Accordion;
