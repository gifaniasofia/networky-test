import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';

import clsxm from '@/helpers/clsxm';
import { getBase64 } from '@/helpers/misc';
import { toastify } from '@/helpers/toast';
import { InputTypes } from '@/typings';

import { Editor, Label, Phone } from '../Input';
import ErrorMessage from '../Input/ErrorMessage';
import MultipleSelect from '../MultipleSelect';
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../Select';

const DateTime = dynamic(() => import('../Input/DateTime'), { ssr: false });
const TextField = dynamic(() => import('../Input/TextField'), { ssr: false });
const TextArea = dynamic(() => import('../Input/TextArea'), { ssr: false });
const Upload = dynamic(() => import('../Input/Upload'), { ssr: false });

const InputFormik = <T, >({
	formik,
	inputProps
}: InputTypes.InputFormikProps<T>) => {
	const [uploadSrc, setUploadSrc] = useState<string>('');

	const onChangeFormDefault = (name: string, value: InputTypes.ChangeInputValue) => {
		formik?.setFieldValue(name, value);
	};

	const onChangeUploadFile = useCallback(async(event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const selectedFile: File | null = event.target.files && event.target.files.length
				? event.target.files[0]
				: null;
			const imageBase64: string | ArrayBuffer | null = await getBase64(selectedFile);

			if (imageBase64 && typeof imageBase64 === 'string') setUploadSrc(imageBase64);

			onChangeFormDefault(event.target.name, selectedFile);

		} catch (error) {
			toastify('error-default');
		}
	}, []);

	const onDropUploadFile = useCallback(async(event: React.DragEvent<HTMLDivElement>, keyName: string) => {
		try {
			const droppedFile: File | null = event.dataTransfer.files && event.dataTransfer.files?.length
				? event.dataTransfer.files[0]
				: null;
			const imageBase64: string | ArrayBuffer | null = await getBase64(droppedFile);

			if (imageBase64 && typeof imageBase64 === 'string') setUploadSrc(imageBase64);

			onChangeFormDefault(keyName, droppedFile);
		} catch (error) {
			toastify('error-default');
		}
	}, []);

	const renderInput = () => {
		const {
			type,
			label,
			onChange,
			options,
			renderInputFile,
			countryCodeClassName,
			filterCountries,
			wrapperClassName,
			defaultCountry,
			...defaultInputProps
		} = inputProps;
		const id = inputProps.id as PropertyNames<T>;
		const name = id as string;
		const error = formik?.errors[id] as string;
		const isValid = !error;

		if (type === 'datetime') {
			return (
				<DateTime
					inputClassName={ inputProps.className }
					initialValue={ formik?.initialValues[id] as InputTypes.DateTimeChangeValue }
					onChange={ (dateTime: InputTypes.DateTimeChangeValue) => onChangeFormDefault(name, dateTime) }
				/>
			);
		}

		if (type === 'phone' || type === 'phone_select') {
			return (
				<div className={ inputProps.overlappingLabel ? 'relative' : '' }>
					<Label
						id={ name }
						text={ label }
						className={ inputProps.labelClassName }
						required={ inputProps.required }
						overlappingLabel={ inputProps.overlappingLabel }
					/>

					<Phone
						placeholder={ inputProps.placeholder }
						value={ formik?.values[id] as E164Number | undefined }
						onChange={ (value?: E164Number) => onChangeFormDefault(name, value) }
						className={ inputProps.className }
						countryCodeClassName={ countryCodeClassName }
						filterCountries={ filterCountries }
						type={ type }
						wrapperClassName={ wrapperClassName }
						defaultCountry={ defaultCountry }
					/>
				</div>
			);
		}

		if (type === 'select') {
			return (
				<MultipleSelect
					label={ label }
					overlappingLabel={ inputProps.overlappingLabel }
					value={ formik?.values[id] as SelectOption[] }
					onChange={ (selected: SelectOption[]) => onChangeFormDefault(name, selected) }
					valid={ isValid }
					errorMessage={ error }
					options={ options ?? [] }
					{ ...defaultInputProps }
				/>
			);
		}

		if (type === 'single_select') {
			return (
				<>
					<Select
						label={ label }
						overlappingLabel={ inputProps.overlappingLabel }
						value={ formik?.values[id] as string }
						onValueChange={ selected => onChangeFormDefault(name, selected) }
						valid={ isValid }
						errorMessage={ error }
						{ ...defaultInputProps }
					>
						<SelectTrigger className={ clsxm(
							inputProps.className,
							formik?.values[id] ? '!ring-steel' : '',
							'w-full'
						) }>
							<SelectValue placeholder={ defaultInputProps.placeholder } />
						</SelectTrigger>
						<SelectContent>
							{
								options?.map((e, idx) => {
									return (
										<SelectItem
											key={ idx }
											value={ e.value }
										>{ e.name }
										</SelectItem>
									);
								})
							}
						</SelectContent>
					</Select>

					{ !isValid && (
						<ErrorMessage message={ error } />
					) }
				</>
			);
		}

		if (type === 'textarea') {
			return (
				<TextArea
					label={ label }
					value={ formik?.values[id] as InputTypes.TextAreaProps['value'] }
					onChange={ onChange
						? onChange
						: (event: React.ChangeEvent<HTMLTextAreaElement>) => onChangeFormDefault(event.target.name, event.target.value) }
					valid={ isValid }
					errorMessage={ error }
					name={ name }
					{ ...defaultInputProps }
				/>
			);
		}

		if (type === 'file') {
			return (
				<Upload
					type={ type }
					value={ formik?.values[id] as InputTypes.UploadProps['value'] }
					name={ name }
					label={ label }
					src={ uploadSrc }
					onChange={ onChange
						? onChange
						: onChangeUploadFile }
					onDrop={ (event: React.DragEvent<HTMLInputElement>) => onDropUploadFile(event, name) }
					valid={ isValid }
					errorMessage={ error }
					renderInputFile={ renderInputFile }
					onReset={ () => {
						setUploadSrc('');
						formik?.resetForm();
					} }
					{ ...defaultInputProps }
				/>
			);
		}

		if (type === 'editor') {
			return (
				<Editor
					value={ formik?.values[id] as string }
					onChange={ (value: string) => onChangeFormDefault(name, value) }
					placeholder={ inputProps.placeholder }
					className={ inputProps.className }
				/>
			);
		}

		return (
			<TextField
				type={ type }
				value={ formik?.values[id] as InputTypes.TextFieldProps['value'] }
				name={ name }
				label={ label }
				onChange={ onChange
					? onChange
					: (event: React.ChangeEvent<HTMLInputElement>) => onChangeFormDefault(event.target.name, event.target.value) }
				valid={ isValid }
				errorMessage={ error }
				{ ...defaultInputProps }
			/>
		);
	};

	return renderInput();
};

export default InputFormik;
