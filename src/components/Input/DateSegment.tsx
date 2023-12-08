import { useRef } from 'react';
import { useDateSegment } from '@react-aria/datepicker';
import { DateFieldState, DateSegment as IDateSegment } from '@react-stately/datepicker';

import clsxm from '@/helpers/clsxm';

interface DateSegmentProps {
	segment: IDateSegment;
	state: DateFieldState;
}

const DateSegment = ({ segment, state }: DateSegmentProps) => {
	const ref = useRef(null);
	const { segmentProps } = useDateSegment(segment, state, ref);

	return (
		<div
			{ ...segmentProps }
			ref={ ref }
			style={ {
				...segmentProps.style,
				minWidth:
					segment.maxValue != null ? String(segment.maxValue).length + 'ch' : '' // eslint-disable-line eqeqeq
			} }
			className='xxs:px-px sm:px-0.5 box-content tabular-nums text-right outline-none focus:text-grey-1 group'
		>
			{ /* Always reserve space for the placeholder, to prevent layout shift when editing. */ }
			<span
				aria-hidden='true'
				className={ clsxm(
					'block w-full text-center group-focus:text-grey-1 pointer-events-none',
					segment.isPlaceholder ? 'visible' : 'hidden h-0'
				) }
			>
				{ segment.placeholder }
			</span>
			{ segment.isPlaceholder ? '' : segment.text }
		</div>
	);
};

export default DateSegment;
