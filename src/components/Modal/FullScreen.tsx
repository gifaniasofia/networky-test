import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import CloseIcon from 'public/images/icons/close.svg';

import { ModalTypes } from '@/typings';

const FullScreen: React.FC<ModalTypes.ModalFullScreenProps> = ({
	open,
	setOpen,
	onClose,
	children,
	dialogTitle,
	closeIcon = true,
	dialogDescriptionClassName = 'mt-4 w-full overflow-y-auto min-h-screen'
}) => {
	const completeButtonRef = useRef(null);

	return (
		<Transition.Root
			show={ open }
			as={ Fragment }
		>
			<Dialog
				id='FullScreen'
				className='fixed inset-0 z-[9999] overflow-y-auto'
				onClose={ setOpen }
				initialFocus={ completeButtonRef }
				static
			>
				<div className='min-h-screen'>
					<div className='inline-flex flex-col overflow-hidden w-full'>
						<Transition.Child
							as={ Fragment }
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className='relative transform overflow-hidden background-linear-gradient-light-blue text-left transition-all w-full'>
								{ (dialogTitle || closeIcon)
									? (
										<Dialog.Title
											as='div'
											className='relative h-12 w-full'
										>
											{ dialogTitle }

											{ closeIcon && (
												<button
													className='absolute top-0 right-0 px-2'
													ref={ completeButtonRef }
													onClick={ () => {
														if (onClose) onClose();
														setOpen(false);
													} }
												>
													<CloseIcon className='text-primary' />
												</button>
											) }
										</Dialog.Title>
									)
									: null }
								<Dialog.Description
									as='div'
									className={ dialogDescriptionClassName }
								>
									{ children }
								</Dialog.Description>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default FullScreen;
