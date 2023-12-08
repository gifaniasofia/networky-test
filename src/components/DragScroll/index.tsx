import React, { useRef, useState } from 'react';

import { classNames } from '@/helpers/style';
import { DragScrollTypes } from '@/typings';

const activeClass = 'cursor-grabbing';

const DragScroll: React.FC<DragScrollTypes.DragScrollProps> = ({
	wrapperId,
	className = 'gap-x-5',
	children,
	scrollbar = 'no-scrollbar',
	onScroll
}) => {
	const sliderRef = useRef<HTMLDivElement | null>(null);
	const [isDown, setIsDown] = useState<boolean>(false);
	const [startX, setStartX] = useState<number>(0);
	const [scrollLeft, setScrollLeft] = useState<number>(0);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const slider = sliderRef?.current;

		if (slider) {
			setIsDown(true);

			slider.classList.add(activeClass);
			const startXUpdate = e.pageX - slider.offsetLeft;
			setStartX(startXUpdate);
			setScrollLeft(slider.scrollLeft);
		}
	};

	const handleSnap = () => {
		const slider = sliderRef?.current;

		if (slider) {
			setIsDown(false);
			slider.classList.remove(activeClass);
		}
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const slider = sliderRef?.current;

		if (!isDown) return;

		if (slider) {
			e.preventDefault();
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 1.25; // 1.25 => scroll-fast (drag speed)
			slider.scrollLeft = scrollLeft - walk;
		}
	};

	const renderComponent = () => {
		return (
			<div
				id={ wrapperId }
				ref={ sliderRef }
				onMouseDown={ handleMouseDown }
				onMouseLeave={ handleSnap }
				onMouseUp={ handleSnap }
				onMouseMove={ handleMouseMove }
				onScroll={ onScroll }
				className={ classNames(
					'whitespace-nowrap overflow-y-hidden transition-all select-none transform flex flex-no-wrap overflow-x-auto scrolling-touch scroll-smooth',
					typeof scrollbar === 'string' ? scrollbar : '',
					className
				) }
			>
				{ children }
			</div>
		);
	};

	return renderComponent();
};

export default DragScroll;
