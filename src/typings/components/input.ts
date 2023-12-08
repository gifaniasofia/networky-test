import { DateRange } from 'react-day-picker';
import { Country, Props as PhoneNumberInputProps } from 'react-phone-number-input';
import { ReactQuillProps } from 'react-quill';
import { FormikProps } from 'formik';

/* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */

type DefaultInputProps = {
	label?: string | React.ReactNode;
	valid?: boolean;
	errorMessage?: string;
	required?: boolean;
	leadingIcon?: React.ReactNode;
	trailingIcon?: React.ReactNode;
	labelClassName?: string;
	overlappingLabel?: boolean;
	overlappingLabelOnFocus?: boolean;
	wrapperClassName?: (focus: boolean) => string;
};

export type ErrorProps = { message?: string; };

export type LabelProps = {
	id?: string;
	text?: string | React.ReactNode;
	required?: boolean;
	className?: string;
	overlappingLabel?: boolean;
	isValid?: boolean;
};

export type PhoneProps = PhoneNumberInputProps<React.InputHTMLAttributes<HTMLInputElement>> & DefaultInputProps & {
	id?: string;
	filterCountries?: Country[];
	countryCodeClassName?: string;
	type?: 'phone' | 'phone_select';
	inputWrapperClassName?: (focus: boolean) => string;
};

export type TextFieldProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & DefaultInputProps;

export type TextAreaProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & DefaultInputProps & {
	autoSize?: boolean;
};

export type TimeRange = {
	from: string | null;
	to: string | null;
};

export type TimezoneData = {
	timezone: string;
	gmt_offset: number;
};

export type DateTimeChangeValue = {
	date: DateRange;
	time: {
		from: any;
		to: any;
	};
	timezone?: TimezoneData;
};

export type DateTimeProps = DefaultInputProps & {
	inputClassName?: string;
	placeholder?: string;
	onChange?: (dateTime: DateTimeChangeValue) => void;
	initialValue?: {
		date?: DateRange,
		time?: {
			from: any;
			to: any;
		};
		timezone?: TimezoneData;
	};
};

export type SelectProps = {
	defaultOptions?: SelectOption[];
	value: SelectOption | null | undefined;
	onChange: (selected: SelectOption) => void; // eslint-disable-line no-unused-vars
	label?: string;
	valid?: boolean;
	errorMessage?: string;
	placeholder?: string;
	optionsClassName?: string;
};

export type UploadProps = Omit<TextFieldProps, 'value'> & {
	value?: File | null;
	src?: string;
	wrapperInputClassName?: string;
	renderInputFile?: () => JSX.Element;
	onReset?: () => void;
};

export type EditorProps = ReactQuillProps;

export type InputElementTypes = HTMLInputElement | HTMLTextAreaElement;

export type InputFormikProps<T = any> = {
	formik?: FormikProps<T>;
	inputProps: Form & DefaultInputProps & { // TODO: update type props nya
		onFocus?: React.FocusEventHandler<InputElementTypes>;
		onBlur?: React.FocusEventHandler<InputElementTypes>;
		onChange?: (e: React.ChangeEvent<InputElementTypes>) => void;
		renderInputFile?: () => JSX.Element; // for upload component
		onKeyDown?: (e: React.KeyboardEvent<InputElementTypes>) => void;
		inputMode?: TextFieldProps['inputMode'];
		size?: number;
		autoSize?: boolean; // for textarea
		countryCodeClassName?: string; // for phone number
		filterCountries?: Country[]; // for phone number
		defaultCountry?: Country; // for phone number
		disabled?: boolean;
	};
};

export type MultipleSelectProps = DefaultInputProps & {
	value: SelectOption[];
	onChange: (selected: SelectOption[]) => void;
	options: SelectOption[];
	className?: string;
	placeholder?: string;
	disabled?: boolean;
};

export type ChangeInputValue = TextFieldProps['value']
	| TextAreaProps['value']
	| SelectProps['value']
	| UploadProps['value']
	| DateTimeChangeValue
	| PhoneProps['value']
	| EditorProps['value']
	| MultipleSelectProps['value'];

// === start Date Time Range component ===
export type TimePeriodOption = {
	name: string;
	icon: (props?: any) => React.JSX.Element; // eslint-disable-line no-unused-vars
};

export type TimeData = {
	hours: string;
	minutes: string;
};

export type TimeRangeSeparate = {
	from: TimeData;
	to: TimeData;
};

export type RangeType = 'to' | 'from';

export type PeriodType = 'AM' | 'PM';

export type TimePeriod = {
	from: PeriodType;
	to: PeriodType;
};

export type TemporaryDateTime = {
	date?: DateRange | Date;
	time: TimeRangeSeparate;
	activeRangeType?: RangeType;
	selectedTimePeriod?: TimePeriod;
};
// === end start Date Time Range component ===