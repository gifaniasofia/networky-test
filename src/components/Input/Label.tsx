import React from 'react';

import clsxm from '@/helpers/clsxm';
import { InputTypes } from '@/typings';

const Label: React.FC<InputTypes.LabelProps> = ({
	id,
	text,
	required,
	className,
	overlappingLabel,
	isValid = true
}) => {
	return (
		<label
			htmlFor={ id }
			className={ clsxm(
				'text-sm !font-medium leading-126%',
				isValid ? '!text-steel' : 'text-red',
				overlappingLabel ? 'absolute -top-2 left-[9.5px] inline-block bg-base z-10 px-1' : 'block mb-9px sm:mb-3',
				className
			) }
		>
			{ text }{ required && <span>*</span> }
		</label>
	);
};

export default Label;