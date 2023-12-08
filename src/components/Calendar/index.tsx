'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

import clsxm from '@/helpers/clsxm';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const ChevronLeft = ({ className }: { className?: string; }) => {
	return (
		<svg
			width='14'
			height='23'
			viewBox='0 0 14 23'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className={ className }
		>
			<path
				d='M13 1L2 11.5L13 22'
				stroke='currentColor'
				strokeWidth='2' />
		</svg>
	);
};

const Calendar = ({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) => {
	return (
		<DayPicker
			showOutsideDays={ showOutsideDays }
			className={ clsxm('px-0 py-3', className) }
			formatters={ { formatWeekdayName: (date: Date) => format(date, 'eee')[0] } }
			classNames={ {
				months: 'flex flex-col space-y-7',
				month: 'space-y-4',
				caption: 'flex pt-1 relative items-center justify-center',
				caption_label: 'px-4 text-sm sm:text-base leading-126% font-bold !text-wording',
				nav: 'flex items-center',
				nav_button: 'h-5 w-5 bg-transparent p-0 opacity-100 hover:opacity-75',
				nav_button_previous: 'absolute left-2 flex items-center justify-center',
				nav_button_next: 'absolute right-2 flex justify-center items-center',
				table: 'w-full border-collapse space-y-1',
				head_row: 'grid items-center grid-cols-7 h-[30px] text-center',
				head_cell: 'text-steel font-bold text-xs sm:text-sm leading-126% w-full',
				row: 'grid grid-cols-7 w-full mt-2 sm:mt-3',
				cell: clsxm(
					'text-xs sm:text-sm font-medium leading-126% flex items-center justify-center select-none p-0 relative focus-within:relative focus-within:z-20',
					props.mode === 'single' ? '' : '[&:has([aria-selected])]:bg-soft-blue-2 sm:[&:has([aria-selected])]:bg-[#E1E1E1]'
				),
				day: clsxm(
					props.mode === 'single' ? 'w-[25px] rounded-full' : 'w-full',
					'h-[25px] p-0 font-medium text-wording aria-selected:text-white hover:[&:not([aria-selected]):not([disabled])]:bg-soft-blue-2 sm:hover:[&:not([aria-selected]):not([disabled])]:bg-[#E1E1E1] hover:[&:not([aria-selected])]:text-steel'
				),
				day_today: 'text-steel !font-bold border-0 ring-0 focus:ring-0 focus:outline-0 focus:border-0',
				...props.mode === 'single' ? { day_selected: 'bg-purple hover:bg-purple w-[25px] h-[25px] text-white hover:text-white rounded-full' } : {},
				day_outside: 'text-steel opacity-50',
				day_disabled: 'text-steel opacity-50 hover:cursor-default',
				day_range_start: 'bg-purple hover:bg-purple w-full text-wording hover:text-wording',
				day_range_end: 'bg-primary hover:bg-primary w-full text-wording hover:text-wording',
				day_range_middle: 'aria-selected:bg-soft-blue-2 sm:aria-selected:bg-[#E1E1E1] aria-selected:text-steel',
				day_hidden: 'invisible',
				...classNames,
			} }
			components={ {
				IconLeft: () => <ChevronLeft className='w-3 h-3 sm:h-4 sm:w-4 text-steel' />,
				IconRight: () => <ChevronLeft className='w-3 h-3 sm:h-4 sm:w-4 rotate-180 text-steel' />,
			} }
			{ ...props }
		/>
	);
};

Calendar.displayName = 'Calendar';

export { Calendar };
