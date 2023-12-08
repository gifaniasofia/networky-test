type InputType =
	| 'text'
	| 'email'
	| 'url'
	| 'password'
	| 'number'
	| 'date'
	| 'datetime'
	| 'month'
	| 'search'
	| 'tel'
	| 'time'
	| 'week'
	| 'checkbox'
	| 'radio'
	| 'file'
	| 'textarea'
	| 'select' // multiple select
	| 'phone'
	| 'phone_select'
	| 'editor'
	| 'single_select';

type SelectOption = {
	id?: number;
	name: string;
	value: any;
	disabled?: boolean;
};

type Form = {
	id: string;
	name?: string;
	label?: string;
	placeholder?: string;
	type?: InputType;
	options?: SelectOption[];
	wrapperInputClassName?: string;
	required?: boolean;
	className?: string;
};

type PropertyNames<T> = {
	[K in keyof T]: K;
}[keyof T];

type PropertyValues<T> = {
	[K in keyof T]: T[K];
}[keyof T];

type ObjectKey<T = any> = { [key: string]: T; };

type Dimensions = {
	width: number;
	height: number;
};

type Tagged<A, T> = A & { __tag?: T; };

type E164Number = Tagged<string, 'E164Number'>;

type NavMenu = {
	id?: string;
	name?: string;
	href: string;
	icon?: string;
	showInNavbar?: boolean;
};

type LocationState = null | {
	latitude?: number;
	longitude?: number;
};