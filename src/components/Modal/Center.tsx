import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CloseIcon from 'public/images/icons/close.svg';

import clsxm from '@/helpers/clsxm';
import { ModalTypes } from '@/typings';

const Center: React.FC<ModalTypes.ModalCenterProps> = ({
	open,
	setOpen,
	onClose,
	children,
	closeIcon = true,
	panelClassName
}) => {
	const completeButtonRef = useRef(null);

	const onCloseModal = () => {
		if (onClose) onClose();
		setOpen(false);
	};

	return (
		<Transition.Root
			show={ open }
			as={ Fragment }
		>
			<Dialog
				as='div'
				className='relative z-[999]'
				onClose={ onCloseModal }
				initialFocus={ completeButtonRef }
			>
				<Transition.Child
					as={ Fragment }
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-white bg-opacity-80 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-[999] overflow-y-auto'>
					<div className='flex min-h-full justify-center p-4 text-center items-center sm:p-0'>
						<Transition.Child
							as={ Fragment }
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className={ clsxm(
								'relative transform overflow-hidden bg-white bg-opacity-80 px-2.5 py-3.5 border-2 border-primary transition-all sm:my-8 w-full max-w-2xl',
								panelClassName
							) }>
								{ closeIcon && (
									<button
										className='absolute top-0 right-0 focus:outline-0 focus:ring-0 focus:border-0'
										ref={ completeButtonRef }
										onClick={ onCloseModal }
									>
										<CloseIcon className='text-primary' />
									</button>
								) }

								{ children }
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default Center;
