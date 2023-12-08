import React, { useEffect, useState } from 'react';
import { Country, isSupportedCountry, parsePhoneNumber } from 'react-phone-number-input';
import axios from 'axios';
import { FormikProps, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { getSession, signIn, signOut } from 'next-auth/react';

import { endpoints } from '@/constant';
import clsxm from '@/helpers/clsxm';
import { gtagEvent } from '@/helpers/gtag';
import { filterObject } from '@/helpers/misc';
import { toastify } from '@/helpers/toast';
import useGetLocation from '@/hooks/useGetLocation';
import { IGeocode } from '@/interfaces';
import { AuthRegister } from '@/openapi';
import { AuthTypes } from '@/typings';
import { AuthValidator } from '@/validator';

import Button from '../Button';
import Formik from '../Formik';

const FormSignUp: React.FC<AuthTypes.FormSignUpProps> = ({
	data: authData,
	fname: fnameProps,
	lname: lnameProps,
	email: emailProps,
	phone: phoneProps,
	callbackUrl,
	registerType = '',
	eventCode
}) => {
	const formSignUpData = authData.formSignUp;

	const router = useRouter();

	const [defaultCountry, setDefaultCountry] = useState<Country | null>(null);
	const [enableValidation, setEnableValidation] = useState<boolean>(false);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const formik: FormikProps<AuthRegister> = useFormik<AuthRegister>({
		validateOnBlur: enableValidation,
		validateOnChange: enableValidation,
		validationSchema: AuthValidator.SignUpSchema,
		initialValues: {
			fname: fnameProps ?? '',
			lname: lnameProps ?? '',
			email: emailProps ?? '',
			phone: phoneProps ?? '',
			provider: registerType ?? ''
		},
		onSubmit: async(reqFormSignUp: AuthRegister) => {
			setLoadingSubmit(true);
			const {
				utm_source,
				utm_medium,
				utm_campaign,
				utm_id,
				utm_term,
				utm_content
			} = router.query;
			const utmData = filterObject({
				utm_source,
				utm_medium,
				utm_campaign,
				utm_id,
				utm_term,
				utm_content
			});
			await signOut({
				redirect: false
			});
			signIn('register', {
				redirect: false,
			}, {
				...reqFormSignUp,
				...utmData,
				...eventCode
					? { event_code: eventCode }
					: {}
			}).then(async response => {
				if (response?.ok) {
					gtagEvent({ action: 'UserDetails' });
					if (callbackUrl) {
						gtagEvent({ action: 'LoginSuccess' });
						window.location.href = callbackUrl;
					} else {
						const session = await getSession();
						router.push({
							pathname: session?.user?.is_host === true ? '/events' : '/auth/success',
							query: { ...utmData }
						}).then(() => gtagEvent({ action: 'LoginSuccess' }));
					}
				} else {
					toastify('error', response?.error ?? 'error-default');
				}
			})
				.finally(() => {
					setLoadingSubmit(false);
				});
		},
	});

	const location = useGetLocation(registerType !== 'phone' && !phoneProps);

	const getPlacesAutoComplete = async() => {
		try {
			const response = await axios.get<IGeocode.ResGoogleGeocode>(
				endpoints.urlApiGeocode,
				{
					params: {
						latlng: `${ location?.latitude },${ location?.longitude }`,
					}
				}
			);
			const data = response?.data;

			if (data?.status?.toLowerCase() === 'ok') {
				const result = data?.results?.[0]?.address_components;
				const country = result?.find(address => address.types?.includes('country'));

				if (country) {
					const countryCode = country?.short_name;
					if (isSupportedCountry(countryCode)) {
						setDefaultCountry(countryCode);
					}
				}
			} else {
				if (data?.errorMessage) toastify('error', data?.errorMessage);
			}
		} catch (error) {
			toastify('error-default');
		}
	};

	useEffect(() => {
		if (location?.latitude && location?.longitude) {
			getPlacesAutoComplete();
		}
	}, [location]);

	useEffect(() => {
		if (phoneProps) {
			const countryVal = parsePhoneNumber(phoneProps)?.country;
			if (countryVal && isSupportedCountry(countryVal)) {
				setDefaultCountry(countryVal);
			}
		}
	}, [phoneProps]);

	const onSubmitForm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		setEnableValidation(true);
		formik.handleSubmit();
	};

	const resolveWrapperInputClassName = (focus: boolean, type: string) => {
		if (type === 'phone_select') return clsxm(
			'rounded-[7px] ring-1 ring-inset pl-[13.5px] pt-1',
			focus ? 'ring-opacity-100 ring-steel' : 'ring-grey-1 ring-opacity-50'
		);

		return '';
	};

	const resolveInputClassName = (type: string, isValid: boolean) => {
		const borderClassName = '!ring-1 !ring-inset focus:!ring-1 focus:ring-inset !ring-grey-1 !ring-opacity-50 focus:!ring-steel focus:!ring-opacity-100';
		const defaultPhoneClassName = '!w-full rounded-none pl-0 bg-transparent !border-0 focus:!outline-none !outline-none focus:!ring-0 placeholder:text-med-grey md:placeholder:text-light-grey !text-steel text-base leading-126%';

		if (type === 'phone_select') return clsxm(defaultPhoneClassName, 'py-5 pr-[13.5px]');

		return clsxm(
			'py-[14.5px] px-[13.5px] rounded-[7px] !text-steel placeholder:text-med-grey md:placeholder:text-light-grey bg-transparent ring-inset focus:ring-inset text-base leading-126%',
			isValid ? borderClassName : 'ring-red focus:ring-red'
		);
		// const defaultPhoneClassName = 'rounded-none pr-3 pl-0 lg:pr-5 bg-transparent !border-0 !border-b-[0.5px] focus:!outline-none !outline-none !ring-0 focus:ring-0 placeholder:text-med-grey md:placeholder:text-light-grey !text-steel text-base md:text-sm leading-140% md:leading-126% !w-full !border-light-grey';

		// if (type === 'phone_select') return clsxm(defaultPhoneClassName, 'py-1 sm:py-[5px]');
		// if (type === 'phone') return clsxm(defaultPhoneClassName, 'pb-1 sm:pb-[5px] pt-0');

		// return clsxm(
		// 	'pt-0 pb-1 sm:pb-[5px] pr-5 !pl-0 !text-steel placeholder:text-med-grey md:placeholder:text-light-grey bg-transparent !border-b-[0.5px] text-base md:text-sm leading-140% md:leading-126%',
		// 	isValid ? 'border-light-grey focus:border-light-grey' : 'border-red focus:border-red'
		// );
	};

	const renderInput = (props: Form) => {
		const id = props.id as PropertyNames<AuthRegister>;
		const error = id
			? formik.errors[id] as string
			: '';
		const isValid = !error;

		return (
			<Formik<AuthRegister>
				inputProps={ {
					...props,
					wrapperClassName: (focus: boolean) => resolveWrapperInputClassName(focus, props.type ?? ''),
					className: resolveInputClassName(props.type ?? '', isValid),
					countryCodeClassName: 'text-base leading-126% ml-3 mr-1',
					overlappingLabel: true,
					...defaultCountry
						? { defaultCountry }
						: {}
				} }
				formik={ formik }
			/>
		);
	};

	const renderBtnSubmit = () => {
		return (
			<div className='mt-[75px] sm:mt-[57px] flex flex-col items-center'>
				<Button
					type='submit'
					className='btn btn-primary !py-2 !px-[50px] md:!px-[30px]'
					disabled={ loadingSubmit }
				>
					{ eventCode
						? formSignUpData.submitRsvp
						: formSignUpData.submitSignUp }
				</Button>
			</div >
		);
	};

	const setFormProps = () => {
		const formProps = formSignUpData.formProps as Form[];

		if (registerType === 'email' || registerType === 'gmail') {
			return formProps.filter((form: Form) => !formSignUpData.filterEmailRegister?.includes(form.type ?? ''));
		} else if (registerType === 'phone') {
			return formProps.filter((form: Form) => !formSignUpData.filterPhoneRegister?.includes(form.type ?? ''));
		} else {
			return formProps.filter((form: Form) => !formSignUpData.filterDefaultRegister?.includes(form.type ?? ''));
		}
	};

	const renderForm = () => {
		const formPropsList = setFormProps();

		return (
			<form
				className='mt-[47.5px] md:mt-10 w-full'
				onSubmit={ onSubmitForm }
			>
				<div className='flex flex-col gap-[33px] mb-[15px] sm:mb-[13px]'>
					{ formPropsList.map((props: Form) => (
						<div key={ props.id }>{ renderInput(props) }</div>
					)) }
				</div>

				<p className='text-steel text-sm'>*required answer</p>

				{ renderBtnSubmit() }
			</form>
		);
	};

	return (
		<>
			<h5 className='text-lg md:text-xl md:leading-[111%] text-center font-semibold leading-[130%] !text-wording'>{ formSignUpData.subtitle }</h5>

			{ renderForm() }
		</>
	);
};

export default FormSignUp;
