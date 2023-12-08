import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CloseIcon from 'public/images/icons/close.svg';

import { classNames } from '@/helpers/style';
import { InputTypes } from '@/typings';

const Label = dynamic(() => import('./Label'), { ssr: false });
const ProgressBar = dynamic(() => import('../ProgressBar'), { ssr: false });
const ErrorMessage = dynamic(() => import('./ErrorMessage'), { ssr: false });

const Upload: React.FC<InputTypes.UploadProps> = ({
	id,
	name,
	value,
	src,
	valid = true,
	label,
	errorMessage,
	wrapperInputClassName,
	onChange,
	onDrop,
	required,
	renderInputFile,
	onReset,
	...props
}) => {
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		if (src) {
			const timer = setTimeout(() => setProgress(100), 500);

			return () => clearTimeout(timer);
		}
	}, [src]);

	const handleDragOver = (e: React.DragEvent<HTMLInputElement>) => e.preventDefault();

	const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
		e.preventDefault();

		if (onDrop) onDrop(e);
	};

	const renderInputFileHTML = () => {
		return (
			<input
				id={ id }
				name={ name }
				type='file'
				className='sr-only'
				accept='image/*'
				multiple={ false }
				onChange={ onChange }
				{ ...props }
			/>
		);
	};

	return (
		<>
			{ label && (
				<Label
					id={ id }
					text={ label }
					required={ required }
				/>
			) }

			<div className='w-full'>
				<div className='relative'>
					<label htmlFor={ id }>
						{ renderInputFile
							? (
								<div>
									<div className='flex justify-center'>
										{ renderInputFile() }
										{ renderInputFileHTML() }
									</div>
								</div>
							)
							: (
								<div
									onDrop={ value && src ? undefined : handleDrop }
									onDragOver={ value && src ? undefined : handleDragOver }
									className={ classNames(
										'flex items-center justify-center rounded-[5px] border border-light-grey bg-super-light-grey flex-shrink-0 w-full',
										value && src ? '' : 'hover:opacity-70 cursor-pointer',
										wrapperInputClassName
									) }
								>
									{ value && src
										? (
											<div className='flex items-center gap-2.5 w-full px-6'>
												<div className='relative overflow-hidden w-50px h-50px'>
													<Image
														src={ src }
														alt=''
														className='object-cover'
														fill
													/>
												</div>

												<div className='flex flex-col items-start gap-1'>
													<p className='text-steel text-10px leading-126%'>
														{ value && value instanceof File
															? value.name
															: '' }
													</p>

													<div className='grid grid-cols-12 items-center space-x-4'>
														<div className='w-full col-span-11'>
															<ProgressBar progress={ progress } />
														</div>

														<CloseIcon
															className='w-5 h-5 cursor-pointer text-steel'
															onClick={ onReset }
														/>
													</div>
												</div>
											</div>
										)
										: (
											<>
												<div className='py-9 flex-shrink-0 flex flex-col items-center justify-center text-center leading-140%'>
													<p className='text-steel text-base font-medium'>
														Drag and drop or browse to choose a file
													</p>
													{ /* <p className='text-steel text-xs'>
														Or choose an image below.
													</p> */ }
												</div>

												{ renderInputFileHTML() }
											</>
										) }
								</div>
							) }
					</label>
				</div>
			</div>

			{ /* { !renderInputFile && !value && (
				<span className='max-sm:hidden'>
					Drag and drop or{ ' ' }
					<label
						htmlFor={ id }
						className='relative cursor-pointer'>
						<span className='underline'>
							browse
						</span>

						{ renderInputFileHTML() }
					</label>{ ' ' }
					to choose a file
				</span>
			) } */ }

			<div className='max-sm:hidden'>
				{ !valid && (
					<ErrorMessage message={ errorMessage } />
				) }
			</div>
		</>
	);
};

export default Upload;