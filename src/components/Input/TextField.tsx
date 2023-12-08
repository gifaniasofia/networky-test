import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import clsxm from '@/helpers/clsxm';
import { InputTypes } from '@/typings';

const Label = dynamic(() => import('./Label'), { ssr: false });
const ErrorMessage = dynamic(() => import('./ErrorMessage'), { ssr: false });

const TextField: React.FC<InputTypes.TextFieldProps> = ({
	id,
	label,
	errorMessage,
	valid = true,
	type = 'text',
	className,
	value,
	name,
	required,
	leadingIcon,
	trailingIcon,
	inputMode,
	pattern,
	labelClassName,
	overlappingLabel,
	overlappingLabelOnFocus,
	placeholder,
	...props
}) => {
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const placeholderInput = overlappingLabelOnFocus
		? !isFocused ? placeholder : undefined
		: placeholder;

	const renderInput = () => {
		return (
			<input
				id={ id }
				name={ name }
				type={ type }
				value={ value }
				className={ clsxm(
					'block w-full focus:ring-0 border-0 transform transition-colors duration-300',
					overlappingLabelOnFocus && value ? '!ring-steel focus:!ring-steel' : '',
					className
				) }
				autoComplete='off'
				inputMode={ inputMode }
				// required={ required }
				pattern={ inputMode === 'numeric' ? '[-0-9]*' : pattern }
				onFocus={ () => setIsFocused(true) }
				onBlur={ () => setIsFocused(false) }
				placeholder={ placeholderInput }
				{ ...props }
			/>
		);
	};

	return (
		<div className={ overlappingLabel ? 'relative' : '' }>
			{ label && (
				<Label
					id={ id }
					text={ label }
					className={ clsxm(labelClassName,
						'transform transition-all duration-100',
						overlappingLabelOnFocus && !isFocused && !value && valid
							? 'opacity-0'
							: 'opacity-100'
					) }
					required={ required }
					overlappingLabel={ overlappingLabel }
					isValid={ valid }
				/>
			) }

			<div className='relative'>
				{ leadingIcon
					? (
						<div className='absolute inset-y-0 left-0 pl-15px flex items-center select-none'>
							{ leadingIcon }
						</div>
					) : null }

				{ renderInput() }

				{ trailingIcon ? (
					<div className='absolute inset-y-0 right-0 pr-15px flex items-center select-none'>
						{ trailingIcon }
					</div>
				) : null }
			</div>

			{ !valid && (
				<ErrorMessage message={ errorMessage } />
			) }
		</div>
	);
};

export default TextField;