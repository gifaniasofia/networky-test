import React, { useMemo, useState } from 'react';
import { Popover } from '@headlessui/react';
import debounce from 'lodash/debounce';

import clsxm from '@/helpers/clsxm';
import { isIncludeOtherOption } from '@/helpers/misc';
import { InputTypes } from '@/typings';

import { Label, TextField } from '../Input';
import ErrorMessage from '../Input/ErrorMessage';

const MultipleSelect: React.FC<InputTypes.MultipleSelectProps> = ({
	label,
	required,
	overlappingLabel,
	valid,
	className,
	placeholder,
	options,
	value,
	onChange,
	errorMessage,
	disabled
}) => {
	const [otherValue, setOtherValue] = useState<string>('');

	const isInputOtherSelected = (name: string) => {
		const showInputTextField = isIncludeOtherOption(name) &&
			((value?.findIndex(selectedItem => isIncludeOtherOption(selectedItem.name)) > -1)
				|| disabled);

		return showInputTextField;
	};

	const onSelect = (item: SelectOption, prevIsSelected: boolean) => {
		if (!prevIsSelected) {
			onChange(([...value, item]));
		} else {
			onChange(value.filter((selectedItem: SelectOption) => selectedItem.name !== item.name));
			if (isIncludeOtherOption(item.name)) {
				setOtherValue('');
			}
		}
	};

	const handleDebounceOtherInput = (inputValue: string) => {
		onChange(value.map((selectedItem: SelectOption) => {
			if (isIncludeOtherOption(selectedItem.name)) {
				return {
					...selectedItem,
					value: inputValue
				};
			}

			return selectedItem;
		}));
	};

	const debounceOtherInputFn = useMemo(() => debounce(handleDebounceOtherInput, 400), [value]);

	const renderOptionName = (item: SelectOption) => {
		if (isInputOtherSelected(item.name)) {
			return (
				<div className='flex max-sm:flex-col sm:items-center gap-2.5 sm:gap-1.5'>
					{ item.name }

					<TextField
						id='other'
						name='other'
						placeholder='Specify your answer'
						value={ otherValue }
						onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
							setOtherValue(e.target.value);
							debounceOtherInputFn(e.target.value);
						} }
						className='rounded-[5px] ring-1 ring-inset ring-grey-1/50 focus:ring-steel focus:ring-1 focus:ring-inset py-[9px] sm:py-1.5 px-3.5 sm:px-[9px] text-sm sm:text-xs leading-120% placeholder:text-grey-1 sm:placeholder:text-light-grey text-steel'
						disabled={ disabled }
					/>
				</div>
			);
		}

		return <span>{ item.name }</span>;
	};

	return (
		<>
			<Popover>
				{ ({ open }) => (
					<div className='relative'>
						<Popover.Button
							// disabled={ disabled }
							className='relative w-full focus:outline-none cursor-pointer disabled:cursor-default'>
							<>
								{ label && (
									<Label
										text={ label }
										required={ required }
										overlappingLabel={ overlappingLabel }
										className={ clsxm(
											'transform transition-all duration-100',
											disabled ? 'cursor-default' : 'cursor-pointer',
											overlappingLabel && valid && (value?.length ? false : !open)
												? 'opacity-0'
												: 'opacity-100'
										) }
										isValid={ valid }
									/>
								) }

								<span className={ clsxm(
									className,
									'flex w-full text-left items-center justify-between bg-transparent',
									open || value?.length ? '!ring-steel !ring-opacity-100 !ring-inset' : '',
									value?.length ? 'text-steel' : '!text-light-grey'
								) }>
									{ value?.length
										? value?.map((item: SelectOption) => item.value).join(', ')
										: placeholder }

									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='13'
										height='6'
										viewBox='0 0 13 6'
										fill='none'>
										<path
											d='M12 1L6.5 5L1 1'
											stroke='#062A30'
											strokeLinecap='round' />
									</svg>
								</span>
							</>
						</Popover.Button>
						<Popover.Panel className='absolute z-50 max-h-[231px] bg-white px-3 py-0.5 inset-x-2 top-4 shadow-[8px_24px_25px_-1px_rgba(188,187,187,0.25)] rounded-[5px] overflow-x-hidden overflow-y-auto custom-scrollbar'>
							{ options?.map((item: SelectOption, idx: number) => {
								const selected = value?.findIndex((selectedItem: SelectOption) => selectedItem.name === item.name) > -1;

								return (
									<div
										key={ idx }
										className='py-2.5 flex'
									>
										<label
											htmlFor={ `${ idx }-${ item.name }` }
											className={ clsxm('flex items-baseline gap-2.5 !text-steel text-sm leading-120%', !disabled ? 'cursor-pointer' : '') }
										>
											<input
												id={ `${ idx }-${ item.name }` }
												checked={ selected }
												onChange={ () => onSelect(item, selected) }
												type='checkbox'
												className='text-purple w-3 h-3 bg-light-grey bg-opacity-50 border-0 rounded-sm focus:ring-purple'
												disabled={ disabled }
											/>

											{ renderOptionName(item) }
										</label>
									</div>
								);
							}) }
						</Popover.Panel>
					</div>
				) }
			</Popover>

			{ !valid && (
				<ErrorMessage message={ errorMessage } />
			) }
		</>
	);
};

export default MultipleSelect;
