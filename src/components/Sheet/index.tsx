'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';

import clsxm from '@/helpers/clsxm';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = ({
	className,
	...props
}: SheetPrimitive.DialogPortalProps) => (
	<SheetPrimitive.Portal
		className={ clsxm(className) }
		{ ...props } />
);
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Overlay
		className={ clsxm(
			'fixed inset-0 z-[999] bg-[#E1E1E1]/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className
		) }
		{ ...props }
		ref={ ref }
	/>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
	'fixed z-[999] focus:border-0 focus:ring-0 focus:outline-none gap-4 bg-base p-6 shadow-blur-1 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
	{
		variants: {
			side: {
				top: 'inset-x-0 top-0 border-light-grey border-[0.5px] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
				bottom:
					'inset-x-0 bottom-0 border-light-grey border-[0.5px] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
				left: 'inset-y-0 left-0 top-[10%]  h-3/4 w-3/4 border-light-grey border-l-0 border-t-[2px] border-b-[2px] border-r-[2px] data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
				right:
					'inset-y-0 right-0 h-full w-3/4 border-light-grey border-r-0 border-[0.5px] data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
				center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]  h-3/4 w-3/4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
			},
		},
		defaultVariants: {
			side: 'center',
		},
	}
);

interface SheetContentProps
	extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
	VariantProps<typeof sheetVariants> { }

const SheetContent = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Content>,
	SheetContentProps
>(({ side = 'center', className, children, ...props }, ref) => (
	<SheetPortal>
		<SheetOverlay />
		<SheetPrimitive.Content
			ref={ ref }
			className={ clsxm(sheetVariants({ side }), className) }
			{ ...props }
		>
			{ children }
		</SheetPrimitive.Content>
	</SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={ clsxm(
			'flex flex-col space-y-2 text-center sm:text-left',
			className
		) }
		{ ...props }
	/>
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={ clsxm(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className
		) }
		{ ...props }
	/>
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Title
		ref={ ref }
		className={ clsxm('text-lg font-semibold text-foreground', className) }
		{ ...props }
	/>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof SheetPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
	<SheetPrimitive.Description
		ref={ ref }
		className={ clsxm('text-sm text-muted-foreground', className) }
		{ ...props }
	/>
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
};
