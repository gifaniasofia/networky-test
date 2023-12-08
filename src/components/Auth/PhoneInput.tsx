import React from 'react';
import {
	Country,
	formatPhoneNumberIntl,
	isSupportedCountry,
	parsePhoneNumber
} from 'react-phone-number-input';
import Image from 'next/image';

import authDataLocal from '@/constant/data/auth.json';
import clsxm from '@/helpers/clsxm';
import { AuthTypes } from '@/typings';

import { Phone } from '../Input';

const PhoneInput: React.FC<AuthTypes.PhoneInputProps> = ({
	value,
	onChange,
	disabled,
	data
}) => {
	const authData = data ?? authDataLocal;

	const getDefaultCountry = () => {
		if (value) {
			const countryVal = parsePhoneNumber(value)?.country;
			if (countryVal) {
				return countryVal;
			}
		}
	};

	const renderPhoneInput = () => {
		const initDefaultCountry = getDefaultCountry();
		const defaultCountry = initDefaultCountry ?? authData?.phoneInput?.defaultCountry as Country;

		return (
			<Phone
				value={ value ? formatPhoneNumberIntl(value) : value }
				onChange={ onChange }
				placeholder={ authData?.phoneInput?.placeholder }
				defaultCountry={ isSupportedCountry(defaultCountry)
					? defaultCountry
					: undefined }
				disabled={ disabled }
				countries={ authData.availableCountry as Country[] }
				inputWrapperClassName={ (focus: boolean) => clsxm(
					'ml-2 rounded-[7px] ring-1 w-full pl-3.5 ring-inset h-11',
					focus ? 'ring-opacity-100 ring-steel' : 'ring-grey-1 ring-opacity-50'
				) }
			/>
		);
	};

	return (
		<>
			<div>
				{ renderPhoneInput() }
			</div>

			{ authData?.phoneInput.info?.image && authData?.phoneInput?.info?.text
				? (
					<div className='flex items-center gap-2.5 mt-2 sm:mt-5'>
						<Image
							src={ authData?.phoneInput.info.image }
							alt='info'
							width={ 17 }
							height={ 17 }
						/>

						<p className='text-grey-3 text-body-4 lg:leading-126% font-normal'>{ authData?.phoneInput?.info.text }</p>
					</div>
				)
				: null }
		</>
	);
};

export default PhoneInput;
