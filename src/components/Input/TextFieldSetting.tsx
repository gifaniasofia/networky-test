import React from 'react';

import clsxm from '@/helpers/clsxm';
import { InputTypes } from '@/typings';

import Button from '../Button';
import { Switch } from '../Switch';

{ /* eslint-disable no-unused-vars */ }

const TextFieldSetting: React.FC<InputTypes.TextFieldProps & {
	showCheckbox?: boolean,
	isError?: boolean,
	isChecked?: boolean,
	isRequired?: boolean,
	onToggleRequired?: (e: boolean) => void;
	onChecked?: (e: boolean) => void;
	showRemove?: boolean;
	onRemove?: () => void;
	renderSelect?: () => React.JSX.Element;
	inputDisabled?: boolean;
}> = ({
	label,
	showCheckbox,
	isError,
	disabled,
	isChecked,
	onChecked,
	isRequired,
	onToggleRequired,
	showRemove,
	onRemove,
	name,
	renderSelect,
	inputDisabled = false,
	...restProps
}) => {
	const renderRemoveIcon = () => {
		return (
			<Button
				className='lg:pb-18px flex-shrink-0'
				onClick={ onRemove }>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='12'
					height='14'
					viewBox='0 0 12 14'
					fill='none'>
					<path
						d='M10.5 1.5H8C8 1.10218 7.84196 0.720644 7.56066 0.43934C7.27936 0.158035 6.89782 0 6.5 0H5.5C5.10218 0 4.72064 0.158035 4.43934 0.43934C4.15804 0.720644 4 1.10218 4 1.5H1.5C1.10218 1.5 0.720644 1.65804 0.43934 1.93934C0.158035 2.22064 0 2.60217 0 3C0 3.39782 0.158035 3.77936 0.43934 4.06066C0.720644 4.34196 1.10218 4.5 1.5 4.5V12.5C1.5 12.8978 1.65804 13.2794 1.93934 13.5607C2.22064 13.842 2.60218 14 3 14H9C9.39782 14 9.77936 13.842 10.0607 13.5607C10.342 13.2794 10.5 12.8978 10.5 12.5V4.5C10.8978 4.5 11.2794 4.34196 11.5607 4.06066C11.842 3.77936 12 3.39782 12 3C12 2.60217 11.842 2.22064 11.5607 1.93934C11.2794 1.65804 10.8978 1.5 10.5 1.5ZM5.5 1H6.5C6.63261 1 6.75979 1.05268 6.85355 1.14645C6.94732 1.24021 7 1.36739 7 1.5H5C5 1.36739 5.05268 1.24021 5.14645 1.14645C5.24021 1.05268 5.36739 1 5.5 1ZM9.5 12.5C9.5 12.6326 9.44732 12.7598 9.35355 12.8536C9.25979 12.9473 9.13261 13 9 13H3C2.86739 13 2.74021 12.9473 2.64645 12.8536C2.55268 12.7598 2.5 12.6326 2.5 12.5V4.5H9.5V12.5ZM10.5 3.5H1.5C1.36739 3.5 1.24021 3.44732 1.14645 3.35355C1.05268 3.25978 1 3.13261 1 3C1 2.86739 1.05268 2.74021 1.14645 2.64645C1.24021 2.55268 1.36739 2.5 1.5 2.5H10.5C10.6326 2.5 10.7598 2.55268 10.8536 2.64645C10.9473 2.74021 11 2.86739 11 3C11 3.13261 10.9473 3.25978 10.8536 3.35355C10.7598 3.44732 10.6326 3.5 10.5 3.5ZM4 11V6.5C4 6.36739 4.05268 6.24021 4.14645 6.14645C4.24021 6.05268 4.36739 6 4.5 6C4.63261 6 4.75979 6.05268 4.85355 6.14645C4.94732 6.24021 5 6.36739 5 6.5V11C5 11.1326 4.94732 11.2598 4.85355 11.3536C4.75979 11.4473 4.63261 11.5 4.5 11.5C4.36739 11.5 4.24021 11.4473 4.14645 11.3536C4.05268 11.2598 4 11.1326 4 11ZM7 11V6.5C7 6.36739 7.05268 6.24021 7.14645 6.14645C7.24021 6.05268 7.36739 6 7.5 6C7.63261 6 7.75979 6.05268 7.85355 6.14645C7.94732 6.24021 8 6.36739 8 6.5V11C8 11.1326 7.94732 11.2598 7.85355 11.3536C7.75979 11.4473 7.63261 11.5 7.5 11.5C7.36739 11.5 7.24021 11.4473 7.14645 11.3536C7.05268 11.2598 7 11.1326 7 11Z'
						fill='#062A30' />
				</svg>
			</Button>
		);
	};

	const renderToggleRequired = () => {
		return (
			<div className='flex items-center gap-2'>
				<p className='text-xs !text-steel leading-120% whitespace-nowrap'>Required Answers</p>

				<Switch
					checked={ isRequired }
					onCheckedChange={ onToggleRequired }
					disabled={ !isChecked }
				/>
			</div>
		);
	};

	return (
		<label
			htmlFor={ name }
			className='flex flex-col max-lg:pb-5 max-lg:border-b max-lg:border-grey-1'
		>
			<div className={ clsxm(
				'flex max-lg:items-center gap-3 w-full',
				showCheckbox ? 'max-lg:items-center' : 'items-center'
			) }>
				{ showCheckbox && (
					<div className='lg:pt-1.5 max-lg:flex max-lg:items-center'>
						<input
							type='checkbox'
							disabled={ disabled }
							checked={ isChecked }
							onChange={ e => onChecked && onChecked(e.target.checked) }
							className='w-4 h-4 text-purple' />
					</div>
				) }

				{ showRemove && (
					<div className='max-lg:hidden'>
						{ renderRemoveIcon() }
					</div>
				) }

				<div className='lg:pb-18px w-full lg:border-b lg:border-grey-1/40'>
					<div className='flex items-center lg:justify-between w-full lg:gap-8'>
						<input
							type='text'
							className={ clsxm(
								'px-3 py-3 rounded w-full disabled:bg-light-grey/40 disabled:cursor-not-allowed bg-base !border-[0.5px] !border-steel focus:!border-[0.5px] focus:!border-steel disabled:!border-none placeholder:text-med-grey text-xs outline-none ring-0 focus:ring-0',
								isError && 'bg-red/20 border-red',
								!isChecked ? 'text-grey-1 disabled:text-grey-1' : 'text-steel disabled:text-steel'
							) }
							disabled={ inputDisabled || !isChecked }
							name={ name }
							{ ...restProps }
						/>

						<div className='max-lg:hidden'>
							{ renderToggleRequired() }
						</div>
					</div>

					<div className='max-lg:hidden'>
						{ renderSelect && renderSelect() }
					</div>
				</div>
			</div>

			<div className='lg:hidden max-lg:w-full'>
				<div className={ clsxm(
					'max-lg:pt-18px max-lg:w-full max-lg:flex lg:hidden',
					showRemove
						? 'max-lg:items-center max-lg:justify-between'
						: 'max-lg:justify-end'
				) }>
					{ showRemove && (
						<div className='lg:hidden'>
							{ renderRemoveIcon() }
						</div>
					) }

					{ renderToggleRequired() }
				</div>

				{ renderSelect && renderSelect() }
			</div>

			<span className='text-xs text-grey-1 mt-[2px]'>{ label }</span>
		</label>
	);
};

export default TextFieldSetting;