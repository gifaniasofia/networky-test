import React, { useEffect, useState } from 'react';
import { FormikProps, useFormik } from 'formik';
import Image from 'next/image';
import CloseIcon from 'public/images/icons/close.svg';
import InfoSquareIcon from 'public/images/icons/info_square.svg';
import PinIcon from 'public/images/icons/pin.svg';
import UserIcon from 'public/images/icons/user.svg';

import createEventDataLocal from '@/constant/data/create.json';
import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { convertToDateTimeReq, getBase64 } from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useApiClient, useAppSelector, useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { EventReq } from '@/openapi';
import { CreateEventTypes, InputTypes } from '@/typings';
import { CreateEventValidator } from '@/validator';

import Button from '../Button';
import Formik from '../Formik';
import GoogleMaps from '../GoogleMaps';
import ErrorMessage from '../Input/ErrorMessage';
import { Sheet, SheetContent, SheetHeader } from '../Sheet';

import ButtonEditCover from './ButtonEditCover';
import Cover from './Cover';
import GeneralSettings from './GeneralSettings';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const emptyInitialValuesFormik: IEvent.FormEventReq = {
	title: '',
	location: '',
	map_link: '',
	// additional_msg: '',
	max_spot: '',
	description: '',
	poster_img: '',
	start_date: '',
	end_date: '',
	tz_name: '',
	background_name: '',
	effect_name: '',
	datetime: {
		date: {
			from: undefined,
			to: undefined
		},
		time: {
			from: '6:00 AM',
			to: '6:30 AM'
		},
		timezone: {
			timezone: '',
			gmt_offset: 0
		}
	},
	addr_name: '',
	addr_detail: '',
	addr_note: '',
	addr_ltd: '',
	addr_lng: '',
};

const FormCreate: React.FC<CreateEventTypes.FormProps> = ({
	data,
	initialValues = emptyInitialValuesFormik,
	eventCode,
	detailEvent,
	loading
}) => {
	const createEventData = data ?? createEventDataLocal;
	const createEventState = useAppSelector(state => state.createEventReducers);
	const windowDimensions = useWindowDimensions();
	const apiClient = useApiClient();

	const [enableValidation, setEnableValidation] = useState<boolean>(false);
	const [coverImageSrc, setCoverImageSrc] = useState<string>(initialValues?.poster_img ?? '');
	const [tempCoverImageSrc, setTempCoverImageSrc] = useState<string>('');
	const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
	const [loadingSave, setLoadingSave] = useState<boolean>(false);
	const [openModalEditCover, setOpenModalEditCover] = useState<boolean>(false);

	const formikCover: FormikProps<IEvent.FormCover> = useFormik<IEvent.FormCover>({
		validateOnBlur: enableValidation,
		validateOnChange: enableValidation,
		validationSchema: CreateEventValidator.UploadCoverSchema,
		initialValues: {
			poster_img: null
		},
		onSubmit: async(formCover: IEvent.FormCover) => {
			try {
				if (formCover.poster_img) {
					setLoadingUpload(true);

					const resUpload = await (await apiClient.uploadApi()).uploadFile(formCover.poster_img);

					if (resUpload?.status === 200) {
						const fileUrl = resUpload?.data?.data?.file_url;

						if (fileUrl) {
							setCoverImageSrc(fileUrl);
						}

						onCloseFormCover();
					}
				}
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoadingUpload(false);
			}
		},
	});

	const formik: FormikProps<IEvent.FormEventReq> = useFormik<IEvent.FormEventReq>({
		validateOnBlur: enableValidation,
		validateOnChange: enableValidation,
		validationSchema: CreateEventValidator.FormEventSchema,
		initialValues,
		enableReinitialize: true,
		onSubmit: async(reqForm: IEvent.FormEventReq) => {
			try {
				setLoadingSave(true);

				const eventReqData: EventReq = {
					title: reqForm.title,
					description: reqForm.description,
					location: reqForm.location ?? '',
					addr_name: reqForm.addr_name ?? '',
					addr_detail: reqForm.addr_detail ?? '',
					addr_note: reqForm.addr_note ?? '',
					addr_ltd: reqForm.addr_ltd ?? '',
					addr_lng: reqForm.addr_lng ?? '',
					background_name: 'background-linear-gradient-light-blue',
					effect_name: createEventState.isEffectActive
						? createEventData.defaultEffect.name
						: '',
					// max_spot: + reqForm.max_spot,
					poster_img: coverImageSrc,
					start_date: reqForm.datetime.date?.from && reqForm.datetime.time?.from
						? convertToDateTimeReq(reqForm.datetime.date?.from, reqForm.datetime.time?.from)
						: '',
					end_date: reqForm.datetime.date?.to && reqForm.datetime.time?.to
						? convertToDateTimeReq(reqForm.datetime.date?.to, reqForm.datetime.time?.to)
						: '',
					tz_name: reqForm.datetime.timezone?.timezone,
					tz_offset: reqForm.datetime.timezone?.gmt_offset
				};

				if (eventCode) {
					const response = await (await apiClient.eventsApi()).editEvent(eventCode, eventReqData);
					const status = response?.status;

					if (status === 200) {
						return eventCode;
					}
				} else {
					const response = await (await apiClient.eventsApi()).createEvent(eventReqData);
					const status = response?.status;

					if (status === 200) {
						const respEventCode = response?.data?.data?.event_code;
						return respEventCode;
					}
				}
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoadingSave(false);
			}
		}
	});

	useEffect(() => {
		const onHandleTempCoverImage = async() => {
			const imageBase64: string | ArrayBuffer | null = await getBase64(formikCover.values['poster_img']);

			if (imageBase64 && typeof imageBase64 === 'string') setTempCoverImageSrc(imageBase64);

			setOpenModalEditCover(true);
		};

		if (formikCover.values['poster_img']) {
			onHandleTempCoverImage();
		}
	}, [formikCover.values['poster_img']]);

	useEffect(() => {
		if (initialValues?.poster_img) {
			setCoverImageSrc(initialValues?.poster_img);
		}
	}, [initialValues?.poster_img]);

	useEffect(() => {
		if (!formik?.isValid && !formik?.isValidating && formik?.isSubmitting) {
			if (window) {
				window.scrollTo({
					top: 0,
					left: 0
				});
			}
		}
	}, [formik?.isValid, formik?.isValidating, formik?.isSubmitting]);

	const onSubmitForm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		setEnableValidation(true);
		formik.handleSubmit();
	};

	const onSubmitFormCover = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		setEnableValidation(true);
		formikCover.handleSubmit();
	};

	const onCloseFormCover = () => {
		formikCover.resetForm();
		setOpenModalEditCover(false);
	};

	const onClickButtonEditCover = () => {
		setOpenModalEditCover(true);

		formikCover.resetForm();
	};

	const preventEnterKeySubmission = (e: React.KeyboardEvent<HTMLFormElement>) => {
		const target = e.target as HTMLFormElement;
		if (e.key === 'Enter' && !['TEXTAREA'].includes(target.tagName)) {
			e.preventDefault();
		}
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<InputTypes.InputElementTypes>) => {
		if (e.key === 'Enter') {
			const formEl: any = document.getElementById('form-create-event');

			if (formEl) {
				const index = [...formEl].indexOf(e.target);

				if (index < formEl?.length - 1) {
					formEl.elements[index + 1]?.focus();
				}
			}
		}
	};

	const resolveInputClassName = (id: string, withLeadingIcon: boolean, type?: InputType) => {
		if (id === 'title') {
			return 'text-[26px] font-semibold leading-[100%] tracking-0.005em bg-super-light-grey text-steel placeholder:text-light-grey !border-[0.5px] !border-light-grey focus:!border-light-grey py-[11px] px-[13px] rounded-[5px]';
		}

		if (id === 'description') {
			return 'bg-white bg-opacity-50';
		}

		return clsxm(
			withLeadingIcon ? 'pl-[41px] lg:pl-11 py-2.5 pr-15px' : 'py-2.5 px-15px',
			type === 'datetime'
				? 'bg-super-light-grey rounded-[5px] !border-[0.5px] !border-light-grey'
				: 'bg-transparent',
			id === 'max_spot'
				? '!pr-[60px] sm:!pr-[55px]'
				: '',
			id === 'addr_note'
				? 'text-sm lg:text-xs leading-126% !text-steel placeholder:!text-med-grey'
				: 'text-base lg:text-sm leading-126% !text-steel placeholder:!text-steel'
		);
	};

	const resolveInputLeadingIconProps = (id: string) => {
		switch (id) {
			case 'additional_msg':
				return {
					icon: InfoSquareIcon,
					className: 'w-[15px] h-[17px] sm:w-[13px] sm:h-[13px]'
				};
			case 'location':
				return {
					icon: PinIcon,
					className: 'w-4 h-5 sm:w-[11px] sm:h-[15px]'
				};
			case 'max_spot':
				return {
					icon: UserIcon,
					className: 'w-4 h-[17px] sm:w-3 sm:h-[13px]'
				};
			default:
				return null;

		}
	};

	const renderLeadingIcon = (id: string) => {
		const leadingIconProps = resolveInputLeadingIconProps(id);
		const LeadingIcon = leadingIconProps?.icon;

		if (LeadingIcon) {
			return (
				<div className='flex-shrink-0 w-[18px]'>
					<LeadingIcon
						className={ clsxm(
							'flex-shrink-0 text-steel',
							id === 'location' ? 'cursor-pointer' : '',
							leadingIconProps?.className
						) }
					/>
				</div>
			);
		}

		return null;
	};

	const renderInput = (props: Form) => {
		const leadingIconProps = resolveInputLeadingIconProps(props.id);
		const isInputMaxSpots = props.id === 'max_spot';
		const additionalInputSize = windowDimensions.width < screens.sm ? 2 : 0;

		return (
			<Formik<any>
				inputProps={ {
					...props,
					placeholder: props.placeholder,
					className: resolveInputClassName(props.id, !!leadingIconProps, props.type),
					leadingIcon: renderLeadingIcon(props.id),
					onChange: isInputMaxSpots
						? (e: React.ChangeEvent<InputTypes.InputElementTypes>) => {
							const value = e.target.value.replace(/\D|^0+/g, '');

							formik.setFieldValue(e.target.name, + value < 0 ? '0' : value);
						} : undefined,
					size: isInputMaxSpots
						? ((formik.values['max_spot']?.length) || (props.placeholder ?? 'max')?.length) + additionalInputSize
						: undefined,
					inputMode: isInputMaxSpots ? 'numeric' : undefined,
					onKeyDown: props.type !== 'textarea' ? handleInputKeyDown : undefined
				} }
				formik={ formik }
			/>
		);
	};

	const resolveWrapperInputClassName = (id: string, type?: InputType) => {
		if (id === 'title') return 'mb-[11px] lg:mb-[23px]';
		if (type === 'datetime') return 'mb-[11px] lg:mb-[9px]';

		const bgClassName = 'bg-super-light-grey !border-light-grey';

		if (id === 'location') return '';

		if (id === 'description') {
			return clsxm('mb-0 rounded-[5px] py-2.5 pl-[15px] pr-2.5 border-[0.5px] border-light-grey', bgClassName);
		}

		return clsxm('mb-[11px] lg:mb-[9px] rounded-[5px] !border-[0.5px]', bgClassName);
	};

	const renderErrorMessageDatetime = (type?: string) => {
		if (type && type === 'datetime') {
			const message = formik.errors?.datetime?.date?.from
				|| formik.errors?.datetime?.date?.to
				|| formik.errors?.datetime?.time?.from
				|| formik.errors?.datetime?.time?.to;

			if (message) {
				return <ErrorMessage message={ message as string } />;
			}
		}

		return null;
	};

	const renderFormItem = (props: Form) => {
		if (props.id === 'description') {
			return (
				<>
					<span className='inline-flex items-center gap-9px lg:gap-3 mb-2.5 lg:mb-2'>
						{ renderLeadingIcon('additional_msg') }
						<p className='text-base lg:text-sm leading-126% !text-steel'>Event Description</p>
					</span>

					<div className='pl-[26px] lg:pl-[29px]'>
						{ renderInput(props) }
					</div>
				</>
			);
		}

		if (props.id === 'location') {
			const addr_ltd = formik.values['addr_ltd'];
			const addr_lng = formik.values['addr_lng'];

			return (
				<GoogleMaps.Wrapper>
					<div className='mb-[11px] lg:mb-[9px]'>
						<GoogleMaps.PlacesAutocomplete
							renderLeadingIcon={ () => renderLeadingIcon('location') }
							formik={ formik }
							initialValues={ initialValues
								? {
									addr_detail: initialValues?.addr_detail,
									addr_name: initialValues?.addr_name,
									location: initialValues?.location ?? initialValues?.addr_name
								}
								: undefined }
						/>
					</div>

					{ addr_ltd && addr_lng
						? (
							<div className='h-[122px] w-full mb-[11px] lg:mb-[9px]'>
								<GoogleMaps.Maps
									mapId='form-maps'
									center={ { lat: + addr_ltd, lng: + addr_lng } } />
							</div>
						)
						: null }
				</GoogleMaps.Wrapper>
			);
		}

		return (
			<div className={ props.id === 'max_spot' ? 'inline-flex items-center relative' : '' }>
				{ renderInput(props) }
				{ props.id === 'max_spot' &&
					<span className='text-base lg:text-sm leading-126% absolute right-0 pr-15px !text-steel'>spots</span> }
			</div>
		);
	};

	const renderForm = () => {
		const formProps = createEventData.formProps as Form[];
		const formPropsList = formik.values['addr_name']
			? formProps
			: formProps.filter((props: Form) => props.id !== 'addr_note');

		return (
			<form
				id='form-create-event'
				className='w-full'
				onSubmit={ onSubmitForm }
				onKeyDown={ preventEnterKeySubmission }
			>
				<div className='flex flex-col mb-[11px] lg:mb-[34px]'>
					{ formPropsList.map((props: Form) => (
						<div
							key={ props.id }
							className={ resolveWrapperInputClassName(props.id, props.type) }
						>
							{ renderFormItem(props) }
							{ renderErrorMessageDatetime(props.type) }
						</div>
					)) }
				</div>
			</form>
		);
	};

	const renderInputCover = () => {
		const isMobile = windowDimensions.width < screens.sm;

		return (
			<Formik<any>
				inputProps={ {
					id: createEventData?.uploadCoverProps?.id,
					type: createEventData?.uploadCoverProps?.type as InputType,
					wrapperInputClassName: 'h-[300px] sm:h-[110px]',
					...isMobile ? { renderInputFile: () => <ButtonEditCover onClick={ () => formikCover.resetForm() } /> } : {}
				} }
				formik={ formikCover }
			/>
		);
	};

	const renderContentModalUploadCover = () => {
		return (
			<>
				<div className='hidden sm:flex flex-col items-center py-7 px-20'>
					<p className='text-heading-5 !text-steel mb-[5px]'>Upload your image</p>
					<p className='text-sm md:text-base leading-140% !text-steel mb-5'>PNG, JPG, and GIF files are allowed</p>

					{ renderInputCover() }

					{ formikCover?.values && formikCover.values['poster_img']
						? (
							<div className='flex justify-center mt-8 w-full'>
								<Button
									type='submit'
									onClick={ onSubmitFormCover }
									className='btn btn-primary text-dtp-btn'
									disabled={ loadingUpload }
								>Upload</Button>
							</div>
						)
						: null }
				</div>

				<div
					className='sm:hidden w-full h-full flex-grow flex flex-col justify-between container-center'
					style={ { height: windowDimensions.height ?? '100vh' } }
				>
					<div className='relative overflow-hidden flex-1 h-full flex flex-col items-center justify-center w-full'>
						<div className='flex items-center pb-6 justify-center text-center !text-steel text-body-5'>
							Choose Cover
						</div>

						{ tempCoverImageSrc && (
							<div className='relative overflow-hidden w-full h-full max-w-[300px] mx-auto'>
								<div className='flex items-center justify-center h-full'>
									<Image
										src={ tempCoverImageSrc }
										alt=''
										className='object-cover'
										width={ 300 }
										height={ 300 }
									/>
								</div>
							</div>
						) }

						<div className='flex justify-center text-center my-3 w-full'>
							{ formikCover.errors['poster_img']
								? <ErrorMessage message={ formikCover.errors['poster_img'] as string } />
								: null }
						</div>
					</div>

					<div className='sticky bottom-0 flex items-center justify-between text-steel text-body-5 pt-1.5 pb-6'>
						<Button
							onClick={ onCloseFormCover }
							disabled={ loadingUpload }
							className='disabled:text-grey-1'
						>Cancel</Button>
						<Button
							type='submit'
							onClick={ onSubmitFormCover }
							disabled={ loadingUpload }
							className='disabled:text-grey-1'
						>Choose</Button>
					</div>
				</div>
			</>
		);
	};

	const renderModalEditCover = () => {
		return (
			<Sheet
				onOpenChange={ onCloseFormCover }
				open={ openModalEditCover }
			>
				<SheetContent
					side='center'
					className='px-0 sm:px-2.5 py-3.5 max-sm:!min-h-screen max-sm:!overflow-y-auto max-sm:!top-0 max-sm:!left-0 max-sm:!translate-x-0 max-sm:!translate-y-0 max-sm:border-none sm:h-auto bg-base w-full max-w-2xl'
				>
					<SheetHeader>
						<button
							className='absolute p-1 sm:p-5 top-0 right-0 focus:outline-0 focus:ring-0 focus:border-0 z-10'
							onClick={ onCloseFormCover }
						>
							<CloseIcon className='text-primary sm:text-steel w-[45px] h-[45px] sm:w-[29px] sm:h-[29px]' />
						</button>
					</SheetHeader>
					{ renderContentModalUploadCover() }
				</SheetContent>
			</Sheet>
		);
	};

	const renderCover = () => {
		const isMobile = windowDimensions.width < screens.sm;

		return (
			<Cover
				imageSrc={ coverImageSrc }
				onClickButtonEdit={ onClickButtonEditCover }
				renderInputCover={ renderInputCover }
				isMobile={ isMobile }
				loading={ loading }
			/>
		);
	};

	const renderGeneralSettings = () => {
		return (
			<GeneralSettings
				detailEvent={ detailEvent }
				onSaveDraft={ formik.submitForm }
				eventCode={ eventCode }
				loadingSave={ loadingSave }
				isEffectActive={ !!formik.values['effect_name'] }
			/>
		);
	};

	const renderDesktopCoverAndGeneralSettings = () => {
		const isMobile = windowDimensions.width < screens.lg;

		if (!isMobile) {
			return (
				<div className='hidden lg:col-span-5 lg:flex flex-col items-center'>
					{ renderCover() }
					{ renderGeneralSettings() }
				</div>
			);
		}

		return null;
	};

	const renderFloatingGeneralSettings = () => {
		const isMobile = windowDimensions.width < screens.lg;

		if (isMobile) {
			return (
				<div className='lg:hidden w-full sticky bottom-0 h-full pb-[76px] md:pb-6 z-[60]'>
					{ renderGeneralSettings() }
				</div>
			);
		}

		return null;
	};

	return (
		<>
			<div className='container-center w-full max-w-2xl lg:max-w-4xl pt-[11px] lg:pt-[35px] pb-[98px] sm:pb-[305px]'>
				<div className='flex flex-col lg:grid lg:grid-cols-11 gap-6 lg:gap-10 xl:gap-24'>
					<div className='lg:hidden px-1.5 sm:px-10'>
						{ renderCover() }
					</div>

					<div className='lg:col-span-6 w-full'>
						{ renderForm() }
					</div>

					{ renderDesktopCoverAndGeneralSettings() }
				</div>
			</div>

			{ renderFloatingGeneralSettings() }
			{ renderModalEditCover() }
		</>
	);
};

export default FormCreate;