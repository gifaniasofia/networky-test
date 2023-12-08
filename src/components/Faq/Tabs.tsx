import Image from 'next/image';

import clsxm from '@/helpers/clsxm';
import { FaqTypes } from '@/typings';

const Tabs: React.FC<FaqTypes.TabsProps> = ({
	tabs,
	selectedTab,
	setSelectedTab
}) => {
	return (
		<div className='block text-wording'>
			<div className='border-b border-wording/30'>
				<div className='flex items-end'>
					{ tabs.map(tab => (
						<span
							key={ tab.name }
							className={ clsxm(
								selectedTab === tab.name
									? 'border-purple'
									: 'border-transparent hover:border-wording/30',
								'select-none !text-wording border-b-[3px] py-[15px] lg:py-5 px-1 font-normal md:font-bold max-lg:text-center lg:whitespace-nowrap text-sm max-md:leading-[111.5%] md:text-base lg:text-lg xl:text-xl tracking-0.02em flex max-lg:flex-col items-center justify-center gap-9px md:gap-2.5 xl:gap-3 cursor-pointer'
							) }
							style={ { width: `${ 100 / tabs.length }%` } }
							onClick={ () => setSelectedTab(tab.name) }
						>
							{ tab.image && (
								<span className='relative overflow-hidden w-[26px] lg:w-30px h-[26px] lg:h-30px'>
									<Image
										src={ tab.image }
										alt={ tab.name }
										sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
										fill
									/>
								</span>
							) }

							{ tab.name }
						</span>
					)) }
				</div>
			</div>
		</div>
	);
};

export default Tabs;