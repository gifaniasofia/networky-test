import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { TimeValue } from '@react-aria/datepicker';
import { ChevronDown } from 'lucide-react';

import clsxm from '@/helpers/clsxm';
import { classNames } from '@/helpers/style';
import { InputTypes } from '@/typings';

import TimeField from './TimeField';

const Select: React.FC<InputTypes.SelectProps & { timeValue?: TimeValue | null; onChangeTimeValue?: (timeVal: TimeValue | null) => void; }> = ({ // eslint-disable-line no-unused-vars
	defaultOptions,
	value,
	onChange,
	optionsClassName,
	timeValue,
	onChangeTimeValue
}) => {
	const resolveClassName = (active: boolean, selected: boolean, disabled: boolean) => {
		if (disabled) return 'cursor-default text-grey-1';
		if (selected) return 'bg-purple text-white cursor-pointer';
		if (active) return 'bg-grey-1/10 text-steel cursor-pointer';
		return 'text-steel cursor-pointer';
	};

	return (
		<Listbox
			value={ value }
			onChange={ onChange }
		>
			{ ({ open }) => (
				<div className='relative'>
					<div className={ clsxm(
						'text-sm leading-126% border relative w-full rounded bg-[#E6E6E6] py-1 px-2 sm:px-2.5 flex items-center justify-center space-x-2 text-steel placeholder:!text-steel focus:ring-0',
						open ? 'border-steel' : 'border-transparent'
					) }>
						<TimeField
							label='time'
							hourCycle={ 12 }
							value={ timeValue }
							onChange={ onChangeTimeValue }
						/>

						<Listbox.Button className='cursor-pointer focus:outline-none focus:border-0 focus:ring-0'>
							<ChevronDown className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-steel' />
						</Listbox.Button>
					</div>
					<Transition
						as={ Fragment }
						enter='transition duration-100 ease-out'
						enterFrom='transform scale-95 opacity-0'
						enterTo='transform scale-100 opacity-100'
						leave='transition duration-75 ease-out'
						leaveFrom='transform scale-100 opacity-100'
						leaveTo='transform scale-95 opacity-0'
					>
						<Listbox.Options className={ classNames(
							'absolute z-50 px-1 mt-1.5 max-h-44 w-full overflow-auto rounded bg-base shadow-blur-1 focus:outline-none custom-scrollbar',
							optionsClassName
						) }>
							{ defaultOptions?.map((option: SelectOption) => (
								<Listbox.Option
									key={ option.value }
									value={ option }
									className={ ({ active, selected, disabled }) =>
										classNames(
											'relative select-none flex justify-center rounded py-1.5 my-1 text-sm',
											resolveClassName(active, selected, disabled)
										) }
									disabled={ option.disabled }
								>
									<span className='block'>{ option.name }</span>
								</Listbox.Option>
							)) }
						</Listbox.Options>
					</Transition>
				</div>
			) }
		</Listbox>
	);
};

export default Select;