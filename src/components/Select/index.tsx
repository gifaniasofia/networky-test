'use client';

import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import clsxm from '@/helpers/clsxm';

import Label from '../Input/Label';

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const Select: React.FC<SelectPrimitive.SelectProps & {
	label?: string;
	overlappingLabel?: boolean;
	valid?: boolean;
}> = ({ children, label, required, overlappingLabel, valid = true, onValueChange, ...props }) => {
	const [isOpen, setIsOpen] = React.useState<boolean>(false);
	const [value, setValue] = React.useState<string>('');

	const onSelectValueChange = (selected: string) => {
		if (onValueChange) onValueChange(selected);
		setValue(selected);
	};

	return (
		<SelectPrimitive.Root
			onOpenChange={ setIsOpen }
			onValueChange={ onSelectValueChange }
			{ ...props }
		>
			<div className={ overlappingLabel ? 'relative' : '' }>
				{ label && (
					<Label
						text={ label }
						required={ required }
						overlappingLabel={ overlappingLabel }
						className={ clsxm(
							'transform transition-all duration-100',
							overlappingLabel && valid && (value ? false : !isOpen)
								? 'opacity-0'
								: 'opacity-100'
						) }
						isValid={ valid }
					/>
				) }
				{ children }
			</div>
		</SelectPrimitive.Root>
	);
};
Select.displayName = SelectPrimitive.Root.displayName;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ ref }
		className={ clsxm(
			'flex w-full items-center text-xs justify-between bg-transparent px-1 py-2 data-[placeholder]:!text-light-grey text-steel focus:outline-none disabled:cursor-default',
			className
		) }
		{ ...props }
	>
		{ children }
		<SelectPrimitive.Icon asChild>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='13'
				height='6'
				viewBox='0 0 13 6'
				fill='none'>
				<path
					d='M12 1L6.5 5L1 1'
					stroke='#AEAEAE'
					strokeLinecap='round' />
			</svg>
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ ref }
			className={ clsxm(
				'relative z-[999] overflow-hidden rounded-[5px] shadow-blur-1 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				position === 'popper' &&
				'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				className
			) }
			position={ position }
			{ ...props }
		>
			<SelectPrimitive.Viewport
				className={ clsxm(
					'min-w-[var(--radix-select-trigger-width)]',
					position === 'popper' &&
					'h-[var(--radix-select-trigger-height)] max-h-[231px] w-full'
				) }
			>
				{ children }
			</SelectPrimitive.Viewport>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ ref }
		className={ clsxm('block !text-wording mb-9px sm:mb-3 text-sm !font-medium leading-126%', className) }
		{ ...props }
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ ref }
		className={ clsxm(
			'relative flex w-full p-1 font-normal !text-steel select-none bg-white items-center py-1.5 pl-2.5 pr-8 text-sm leading-120% outline-none focus:bg-white focus:text-steel data-[disabled]:pointer-events-none',
			'data-[state=checked]:bg-light-grey data-[highlighted]:bg-light-grey cursor-pointer',
			className
		) }
		{ ...props }
	>
		{ /* <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<SelectPrimitive.ItemIndicator>
				<Check className='h-4 w-4' />
			</SelectPrimitive.ItemIndicator>
		</span> */ }

		<SelectPrimitive.ItemText>{ children }</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ ref }
		className={ clsxm('-mx-1 my-1 h-px bg-steel', className) }
		{ ...props }
	/>
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
