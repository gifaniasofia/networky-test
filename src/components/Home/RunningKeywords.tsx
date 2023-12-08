import React from 'react';
import AsteriskIcon from 'public/images/home/keywords/asterisk.svg';
import BlinkIcon from 'public/images/home/keywords/blink.svg';
import CircleIcon from 'public/images/home/keywords/circle.svg';
import DiamondIcon from 'public/images/home/keywords/diamond.svg';
import DonutIcon from 'public/images/home/keywords/donut.svg';
import SquareIcon from 'public/images/home/keywords/square.svg';
import StarIcon from 'public/images/home/keywords/star.svg';

import { HomeTypes } from '@/typings';

const RunningKeywords: React.FC<HomeTypes.HomeProps> = ({ data: homeData }) => {
	const keywordsData = homeData.runningKeywords;

	const resolveIcon = (iconName: string) => {
		switch (iconName?.toLowerCase()) {
			case 'donut': return DonutIcon;
			case 'circle': return CircleIcon;
			case 'square': return SquareIcon;
			case 'asterisk': return AsteriskIcon;
			case 'blink': return BlinkIcon;
			case 'diamond': return DiamondIcon;
			case 'star':
			default:
				return StarIcon;
		}
	};

	const resolveSizeIcon = (iconName: string) => {
		if (iconName === 'blink' || iconName === 'star') return 'w-[11px] h-[11px] sm:w-6 sm:h-6';

		return 'w-2 h-2 sm:w-4 sm:h-4';
	};

	const renderIcon = (iconName: string, color: string) => {
		const Icon = resolveIcon(iconName);

		return (
			<Icon
				color={ color }
				className={ resolveSizeIcon(iconName) }
			/>
		);
	};

	const renderKeyword = (
		keyword: HomeTypes.Keyword,
		keywordIdx: number,
		section: number
	) => {
		return (
			<span
				key={ `keyword-${ section }-${ keywordIdx }` }
				className='pl-2 sm:pl-4 inline-flex items-center gap-x-1.5 sm:gap-x-3'
			>
				<span className='flex items-center justify-center'>
					{ renderIcon(keyword.icon, keyword.color) }
				</span>

				<span className='text-xs sm:text-sm md:text-base font-normal leading-120% !text-wording'>{ keyword.text }</span>
			</span>
		);
	};

	return (
		<div className='relative flex justify-center overflow-x-hidden border-y-[0.5px] border-steel select-none'>
			<div className='h-7 sm:h-10 animate-marquee whitespace-nowrap flex justify-center'>
				{ keywordsData.map((keyword: HomeTypes.Keyword, keywordIdx: number) => renderKeyword(keyword, keywordIdx, 1)) }
			</div>

			<div className='absolute top-0 h-7 sm:h-10 animate-marquee2 whitespace-nowrap flex justify-center'>
				{ keywordsData.map((keyword: HomeTypes.Keyword, keywordIdx: number) => renderKeyword(keyword, keywordIdx, 2)) }
			</div>
		</div>
	);
};

export default RunningKeywords;
