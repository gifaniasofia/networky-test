import React, { useRef } from 'react';
import dynamic from 'next/dynamic';

import { classNames } from '@/helpers/style';
import { useAutoSizeTextArea } from '@/hooks';
import { InputTypes } from '@/typings';

const Label = dynamic(() => import('./Label'), { ssr: false });
const ErrorMessage = dynamic(() => import('./ErrorMessage'), { ssr: false });

const TextArea: React.FC<InputTypes.TextAreaProps> = ({
	label,
	valid = true,
	errorMessage,
	id,
	rows = 3,
	className,
	leadingIcon,
	trailingIcon,
	autoSize = true,
	value,
	overlappingLabel,
	labelClassName,
	...props
}) => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	useAutoSizeTextArea(autoSize, textAreaRef.current, value);

	return (
		<div className={ overlappingLabel ? 'relative' : '' }>
			{ label && (
				<Label
					id={ id }
					text={ label }
					className={ labelClassName }
					overlappingLabel={ overlappingLabel }
				/>
			) }

			<div className='relative'>
				{ leadingIcon }

				<textarea
					ref={ textAreaRef }
					value={ value }
					rows={ rows }
					className={ classNames(
						'block w-full focus:ring-0 border-0',
						className
					) }
					{ ...props }
				/>

				{ trailingIcon }
			</div>

			{ !valid && (
				<ErrorMessage message={ errorMessage } />
			) }
		</div>
	);
};

export default TextArea;