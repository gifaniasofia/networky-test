import { Fragment, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { FormikProps } from 'formik';
import CloseIcon from 'public/images/icons/close.svg';
import PinIcon from 'public/images/icons/pin.svg';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

import { TextField } from '../Input';

type PlacesAutocompleteProps = {
	onAddressSelect?: (suggestion: google.maps.places.AutocompletePrediction) => void; // eslint-disable-line no-unused-vars
	renderLeadingIcon?: () => React.JSX.Element | null;
	formik?: FormikProps<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
	initialValues?: {
		addr_name?: string;
		addr_detail?: string;
		location?: string;
	};
};

export interface StructuredFormatting extends Omit<google.maps.places.StructuredFormatting, 'main_text_matched_substrings'> {
	main_text_matched_substrings?: google.maps.places.PredictionSubstring[];
}

export interface AutocompleteSelected {
	description?: string;
	distance_meters?: number;
	matched_substrings?: google.maps.places.PredictionSubstring[];
	place_id?: string;
	structured_formatting?: StructuredFormatting;
	terms?: google.maps.places.PredictionTerm[];
	types?: string[];
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
	// onAddressSelect,
	renderLeadingIcon,
	formik,
	initialValues
}) => {
	const [selected, setSelected] = useState<AutocompleteSelected | null>(null);

	const {
		ready,
		value,
		suggestions: { status, data },
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete({
		debounce: 300,
		cache: 86400,
	});

	useEffect(() => {
		if (initialValues?.location) {
			setValue(initialValues?.location);
		}

		if (initialValues?.location || initialValues?.addr_name || initialValues?.addr_detail) {
			setSelected({
				description: initialValues?.location ?? '',
				structured_formatting: {
					main_text: initialValues?.addr_name || initialValues?.location?.split(', ')[0] || '',
					secondary_text: initialValues?.addr_detail || initialValues?.location?.split(', ')?.slice(1)
						?.join(', ') || ''
				}
			});
		}
	}, [initialValues?.location, initialValues?.addr_name, initialValues?.addr_detail]);

	const onClearState = () => {
		setSelected(null);
		setValue('');
		clearSuggestions();

		if (formik) {
			formik?.setFieldValue('addr_ltd', '');
			formik?.setFieldValue('addr_lng', '');
			formik?.setFieldValue('addr_name', '');
			formik?.setFieldValue('addr_detail', '');
			formik?.setFieldValue('addr_note', '');
			formik?.setFieldValue('location', '');
		}
	};

	const onAddressSelect = (suggestion: google.maps.places.AutocompletePrediction) => {
		const address = suggestion?.description;

		if (address) {
			getGeocode({ address: address }).then(results => {
				const { lat, lng } = getLatLng(results[0]);

				formik?.setFieldValue('addr_ltd', `${ lat }`);
				formik?.setFieldValue('addr_lng', `${ lng }`);
				formik?.setFieldValue('addr_name', suggestion?.structured_formatting?.main_text);
				formik?.setFieldValue('addr_detail', suggestion?.structured_formatting?.secondary_text);
				formik?.setFieldValue('location', address);
			});
		}
	};

	const renderSuggestions = (closeDropdown: () => void) => {
		return data.map((suggestion: google.maps.places.AutocompletePrediction) => {
			const {
				place_id,
				structured_formatting: { main_text, secondary_text },
				description,
			} = suggestion;

			return (
				<div
					key={ place_id }
					onClick={ () => {
						setValue(description, false);
						// clearSuggestions();
						if (onAddressSelect) {
							onAddressSelect(suggestion);
						}
						closeDropdown();
						setSelected(suggestion);
					} }
					className='p-1 cursor-pointer group'
				>
					<div className='group-hover:bg-[#F2F2F2] rounded-[5px] py-[7px] px-[15px] flex items-center'>
						<div className='w-[14px] flex-shrink-0 mr-3'>
							<PinIcon className='text-steel w-[14px] h-[17px]' />
						</div>
						<div>
							<p className='text-base leading-126% text-steel'>{ main_text }</p>
							<p className='text-xs leading-126% text-grey-2'>{ secondary_text }</p>
						</div>
					</div>
				</div>
			);
		});
	};

	const render = () => {
		return (
			<Popover.Group>
				<Popover className='relative w-full'>
					<span className='flex items-center justify-between bg-super-light-grey !border-light-grey !border-[0.5px] rounded-[5px]'>
						<Popover.Button className='w-full text-left focus:ring-0 focus:border-0 focus:outline-none py-2.5 pl-[15px] pr-2.5'>
							<span className='inline-flex items-center gap-9px lg:gap-3'>
								{ renderLeadingIcon ? renderLeadingIcon() : null }
								{ !selected
									? (
										<p className='text-base lg:text-sm leading-126% !text-steel'>Add Event Location</p>
									)
									: (
										<span>
											<p className='text-base sm:text-sm !text-steel leading-126%'>{ selected?.structured_formatting?.main_text }</p>
											<p className='text-xs text-grey-2 leading-126% mt-[3px] sm:mt-px'>{ selected?.structured_formatting?.secondary_text }</p>
										</span>
									) }
							</span>
						</Popover.Button>
						{ selected &&
							<span
								onClick={ onClearState }
								className='cursor-pointer px-2.5'>
								<CloseIcon className='text-steel w-[22px] h-[22px]' />
							</span> }
					</span>

					<Transition
						as={ Fragment }
						enter='transition ease-out duration-200'
						enterFrom='opacity-0 translate-y-1'
						enterTo='opacity-100 translate-y-0'
						leave='transition ease-in duration-150'
						leaveFrom='opacity-100 translate-y-0'
						leaveTo='opacity-0 translate-y-1'
					>
						<Popover.Panel
							focus
							className='z-50 rounded mt-1.5 w-full xxs:min-w-[300px] lg:max-w-[360px] left-0 absolute transform bg-base shadow-blur-1'>
							{ ({ close }) => (
								<>
									<TextField
										value={ value }
										placeholder='Enter Location'
										disabled={ !ready }
										onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value) }
										className='text-base !bg-transparent placeholder:text-grey-2 leading-126% text-steel shadow-blur-1 !py-3 !px-3.5'
									/>

									<div className='max-h-44 overflow-y-auto custom-scrollbar'>
										{ status === 'OK'
											? (
												<div>{ renderSuggestions(close) }</div>
											)
											: (
												<div className='h-[172px] py-2 px-3.5'>
													<p className='text-sm leading-126% text-grey-2'>No recent locations</p>
												</div>
											) }
									</div>
								</>
							) }
						</Popover.Panel>
					</Transition>
				</Popover>
			</Popover.Group>
		);
	};

	return render();
};

export default PlacesAutocomplete;