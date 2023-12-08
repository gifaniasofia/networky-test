import React from 'react';
import debounce from 'lodash/debounce';

import { ButtonTypes } from '@/typings';

const Button: React.FC<ButtonTypes.ButtonProps> = ({
	children,
	onClick,
	type = 'button',
	...props
}) => {
	const debouncedOnClick = debounce(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onClick ? onClick(e) : null,
		800,
		{
			leading: true,
			trailing: false
		}
	);

	return (
		<button
			onClick={ debouncedOnClick }
			type={ type }
			{ ...props }
		>{ children }</button>
	);
};

export default Button;
