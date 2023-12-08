import React, { Fragment, useEffect, useState } from 'react';
import { Country, isSupportedCountry, parsePhoneNumber } from 'react-phone-number-input';
import Input, { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import { Popover, Transition } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import clsxm from '@/helpers/clsxm';
import { filterObject } from '@/helpers/misc';
import { InputTypes } from '@/typings';

import TextField from './TextField';

{ /* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */ }

const ArrowPhoneInput: React.FC = () => {
	return (
		<svg
			width='13'
			height='6'
			viewBox='0 0 13 6'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M6.5 6L0.870835 0.75L12.1292 0.750001L6.5 6Z'
				fill='#062A30' />
		</svg>
	);
};

type CountrySelectProps = {
	value: Country;
	onChange: (value: Country) => void;
	options?: Country[];
	disabled?: boolean;
	onClickInternational?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	filterOptions?: Country[];
	labels: any;
};

const getFlagsUrl = (countryCode: Country) => {
	return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${ countryCode }.svg`;
};

const getCountryCode = (optionValue: Country) => {
	return optionValue && isSupportedCountry(optionValue)
		? getCountryCallingCode(optionValue)
		: '';
};

type CountrySelectType = {
	country_code: Country;
	country_name: string;
};

const CountrySelect: React.FC<CountrySelectProps> = ({
	value,
	onChange,
	options: optionsProps,
	disabled,
	onClickInternational,
	filterOptions = [],
	labels
}) => {
	const [search, setSearch] = useState<string>('');

	const countryList = (optionsProps ?? getCountries());
	const options = countryList.reduce((filtered: CountrySelectType[], option: Country) => {
		if (!filterOptions.includes(option)) {
			filtered.push({
				country_code: option,
				country_name: labels[option]
			});
		}
		return filtered;
	}, [])?.sort((a, b) => a.country_name.toLowerCase().localeCompare(b.country_name.toLowerCase()));

	const filteredOptions =
		search === ''
			? options
			: options.filter((opt: CountrySelectType) => {
				const countryName = opt.country_name;
				const countryCode = `+${ getCountryCode(opt.country_code) }`;
				const foundByCountryName = countryName
					.toLowerCase()
					.replace(/[^A-Z0-9]/ig, '')
					.includes(search.toLowerCase().replace(/[^A-Z0-9]/ig, ''));
				const foundByCountryCode = countryCode
					.toLowerCase()
					.replace(/\s+/g, '')
					.includes(search.toLowerCase().replace(/\s+/g, ''));

				return foundByCountryName || foundByCountryCode;
			});

	const renderFlagImage = (optionValue: Country) => {
		return (
			<div className='relative overflow-hidden w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0'>
				<Image
					src={ getFlagsUrl(optionValue) }
					alt=''
					className='object-contain'
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					fill
				/>
			</div>
		);
	};

	const renderOption = (optionValue: CountrySelectType) => {
		return (
			<span className='flex items-center text-left gap-1.5'>
				{ renderFlagImage(optionValue.country_code) }
				<span>{ optionValue.country_name } (+{ getCountryCode(optionValue.country_code) })</span>
			</span>
		);
	};

	return (
		<Popover>
			<div className='relative'>
				<Popover.Button className='flex min-w-[76px] w-full h-11 px-[11px] py-1.5 bg-super-light-grey bg-opacity-80 text-steel text-body-4 rounded-[7px] focus:outline-none focus:ring-0 no-scrollbar'>
					<span className='flex justify-between items-center gap-[7px] h-full'>
						{ renderFlagImage(value) }
						<ArrowPhoneInput />
					</span>
				</Popover.Button>

				<Transition
					as={ Fragment }
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<Popover.Panel className='z-50 absolute mt-2 text-sm text-steel w-full min-w-[200px] rounded-[7px] overflow-x-hidden bg-super-light-grey shadow-blur-1'>
						{ ({ close }) => (
							<>
								<TextField
									value={ search }
									placeholder='Search'
									onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value) }
									className='text-sm !bg-transparent placeholder:text-grey-1 leading-126% text-steel border-b-[0.5px] border-grey-1 !py-1.5 !px-[11px] focus:border-b-[0.5px] focus:border-grey-1'
								/>
								<div className='max-h-60 overflow-y-auto no-scrollbar'>
									{ filteredOptions.map((option: CountrySelectType, optionIdx: number) => (
										<button
											type='button'
											key={ `${ optionIdx }-${ option.country_code }` }
											onClick={ !disabled
												? () => {
													onChange(option.country_code);
													close();
													setTimeout(() => {
														setSearch('');
													}, 300);
												}
												: undefined }
											className={ clsxm('relative w-full flex cursor-pointer px-3 py-1 hover:bg-light-grey focus:outline-none', option.country_code === value ? 'bg-grey-1/10' : '') }
										>
											{ renderOption(option) }
										</button>
									)) }

									{ optionsProps && (
										<button
											type='button'
											className='relative cursor-pointer px-3 py-2 hover:bg-light-grey text-center focus:outline-none flex w-full items-center justify-center'
											onClick={ onClickInternational }
										>
											Other
										</button>
									) }
								</div>
							</>
						) }
					</Popover.Panel>
				</Transition>
			</div>
		</Popover>
	);
};

// country: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2

const Phone: React.FC<InputTypes.PhoneProps> = ({
	value,
	onChange,
	placeholder = 'Your phone number',
	countries,
	disabled,
	filterCountries = [],
	defaultCountry,
	className,
	countryCodeClassName = 'text-steel text-sm sm:text-lg md:text-xl leading-[100%] tracking-0.005em',
	type = 'phone_select',
	wrapperClassName,
	inputWrapperClassName
}) => {
	const router = useRouter();
	const {
		utm_source,
		utm_medium,
		utm_campaign,
		utm_id,
		utm_term,
		utm_content,
		callbackUrl,
		eventCode,
		code
	} = router.query;
	const utmData = filterObject({
		utm_source,
		utm_medium,
		utm_campaign,
		utm_id,
		utm_term,
		utm_content,
		callbackUrl,
		eventCode,
		code
	});

	const [country, setCountry] = useState<Country>(defaultCountry ?? 'HK');
	const [inputFocus, setInputFocus] = useState<boolean>(false);

	const options = (countries ?? getCountries())?.filter(item => !filterCountries.includes(item));

	useEffect(() => {
		if (defaultCountry) {
			setCountry(defaultCountry);
		}
	}, [defaultCountry]);

	const onClickInternational = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.push({
			pathname: '/auth/signup',
			query: { ...utmData }
		});
	};

	const renderCountrySelectComponent = () => (
		<CountrySelect
			labels={ en }
			value={ country }
			onChange={ setCountry }
			options={ countries }
			disabled={ disabled }
			onClickInternational={ onClickInternational }
			filterOptions={ filterCountries }
		/>
	);

	return (
		<div className={ clsxm('flex items-center', wrapperClassName ? wrapperClassName(inputFocus) : '') }>
			{ type === 'phone_select' && renderCountrySelectComponent() }

			<div className={ clsxm('flex items-center w-full', inputWrapperClassName ? inputWrapperClassName(inputFocus) : '') }>
				<span className={ clsxm('text-steel', countryCodeClassName) }>
					+{ getCountryCode(country) }
				</span>
				<Input
					{ ...type === 'phone_select'
						? {
							international: true,
							country
						} : {} }
					value={ value }
					onChange={ (valueChange?: E164Number) => {
						onChange(valueChange);
						if (valueChange) {
							const countryVal = parsePhoneNumber(valueChange)?.country;
							if (countryVal && options?.includes(countryVal)) setCountry(countryVal);
						}
					} }
					placeholder={ placeholder }
					disabled={ disabled }
					onFocus={ () => setInputFocus(true) }
					onBlur={ () => setInputFocus(false) }
					className={ className ? className : 'rounded-none pl-1 pr-3 lg:pr-5 bg-transparent !py-1.5 !border-0 focus:!outline-none !outline-none !ring-0 focus:ring-0 placeholder:text-light-grey text-steel text-sm sm:text-lg md:text-xl leading-[100%] tracking-0.005em !w-full' }
				/>
			</div>
		</div>
	);
};

export default Phone;
