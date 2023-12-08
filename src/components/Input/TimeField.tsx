import { useRef } from 'react';
import { AriaTimeFieldProps, TimeValue, useTimeField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { useTimeFieldState } from '@react-stately/datepicker';

import DateSegment from './DateSegment';

const TimeField = (props: AriaTimeFieldProps<TimeValue>) => {
	const ref = useRef<HTMLDivElement | null>(null);

	const { locale } = useLocale();
	const state = useTimeFieldState<TimeValue>({
		...props,
		locale
	});

	const { labelProps, fieldProps } = useTimeField<TimeValue>(props, state, ref);

	return (
		<div className='flex flex-col items-start'>
			<span { ...labelProps } />
			<div
				{ ...fieldProps }
				ref={ ref }
				className='flex'
			>
				{ state.segments.map((segment, i) => (
					<DateSegment
						key={ i }
						segment={ segment }
						state={ state } />
				)) }
			</div>
		</div>
	);
};

export default TimeField;
