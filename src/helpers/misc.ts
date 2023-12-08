import { DateRange } from 'react-day-picker';
import { Time } from '@internationalized/date';
import {
	addMinutes, format, isSameDay, isValid, parse
} from 'date-fns';

import { ProfileCategoryResp } from '@/openapi';

export const filterObject = (obj: ObjectKey) => {
	return Object.keys(obj).reduce((acc: ObjectKey, key: string) => {
		if (obj[key]) {
			acc[key] = obj[key];
		}

		return acc;
	}, {});
};

export const generateListOfHours = (maxHour = 13) => {
	const hours: SelectOption[] = [];

	for (let i = 1; i < maxHour; i++) {
		const hour = (i < 10 ? '0' : '') + i;

		hours.push({
			name: hour,
			value: hour
		});
	}

	return hours;
};

export const getBase64 = (file: File | null) => {
	return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		} else {
			resolve('');
		}
	});
};

export const pad = (num: number, size: number) => {
	let str = num.toString();

	for (str; str.length < size;) {
		str = '0' + str;
	}

	return str;
};

export const insertString = (index: number, str: string, valueToInsert: string) => {
	if (index > 0) {
		return str.substring(0, index) + valueToInsert + str.substring(index, str.length);
	}

	return str;
};

export const convertIntTime = (timeNum: number, referenceDate: Date, timeFormat = 'h:mm a') => {
	const parsedTime = parse(insertString(2, pad(timeNum, 4), ':'), 'HH:mm', referenceDate);

	if (isValid(parsedTime)) {
		return format(parsedTime, timeFormat);
	}

	return '';
};

export const convertTimeToNumber = (time: Date) => {
	return Number(format(time, 'Hmm'));
};

export const getGreetings = (name: string): string => {
	const currentHour = new Date().getHours();

	if (currentHour >= 5 && currentHour < 12) {
		return 'Good morning, ' + name + '!';
	} else if (currentHour >= 12 && currentHour < 18) {
		return 'Good afternoon, ' + name + '!';
	} else if (currentHour >= 18 && currentHour < 22) {
		return 'Good evening, ' + name + '!';
	} else {
		return 'Good night, ' + name + '!';
	}
};

export const getRandomIntInclusive = (minLimit: number, maxLimit: number) => {
	const min = Math.ceil(minLimit);
	const max = Math.floor(maxLimit);
	const randomNum = Math.floor(Math.random() * (max - min + 1) + min);

	return randomNum;
};

export const formatTimezone = (gmtOffset: number) => {
	return `GMT${ gmtOffset < 0 ? '-' : '+' }${ (Math.abs(gmtOffset)).toString()
		.padStart(2, '0') }:00`;
};

export const formatTimezoneOffsetToHhMm = (timezoneOffset: number, isInSeconds = true) => {
	const stdTimezoneOffset = (isInSeconds ? timezoneOffset : (-timezoneOffset * -3600)) / -60;
	const offset = Math.abs(stdTimezoneOffset);
	const offsetOperator = stdTimezoneOffset < 0 ? '+' : '-';
	const offsetHours = Math.floor(offset / 60).toString()
		.padStart(2, '0');
	const offsetMinutes = Math.floor(offset % 60).toString()
		.padStart(2, '0');

	return `GMT${ offsetOperator }${ offsetHours }:${ offsetMinutes }`;
};

export const parseTime = (timeData: string, referenceDate?: Date) => {
	return parse(`${ timeData }`, 'h:mm a', referenceDate ?? new Date());
};

export const isStartTimeLessThanEndTime = (timeStart: string | null, timeEnd: string | null, date?: DateRange) => {
	if (date?.from && date?.to && isSameDay(date.from as Date, date.to as Date) && timeStart && timeEnd) {
		const numTimeStart = convertTimeToNumber(parseTime(timeStart, date?.from));
		const numTimeEnd = convertTimeToNumber(parseTime(timeEnd, date?.to));

		return numTimeStart <= numTimeEnd;
	}

	return true;
};

export const isEarlierThanEndLimit = (timeValue: string, endLimit: string, lastValue?: string) => {
	const date = { from: new Date(), to: new Date() };
	const timeValueIsEarlier = isStartTimeLessThanEndTime(timeValue, endLimit, date);
	const timeValueIsLaterThanLastValue = lastValue === undefined ? true : isStartTimeLessThanEndTime(lastValue, timeValue, date);

	return timeValueIsEarlier && timeValueIsLaterThanLastValue;
};

export const generateListOfTime = (beginLimitProps: string, endLimitProps: string) => {
	let timeValue = beginLimitProps || '12:00 AM';
	let lastValue;
	const endLimit = endLimitProps || '11:30 PM';

	const options: string[] = [];
	options.push(timeValue);

	while (isEarlierThanEndLimit(timeValue, endLimit, lastValue)) {
		lastValue = timeValue;
		timeValue = format(addMinutes(parseTime(timeValue), 30), 'h:mm a');
		if (timeValue !== beginLimitProps) {
			options.push(timeValue);
		}
	}

	return options;
};

export const convertToTimeValue = (selectOpt?: SelectOption | null, date?: Date) => {
	if (selectOpt) {
		const formattedValue = selectOpt?.value
			? format(parse(`${ selectOpt?.value }`, 'h:mm a', date ?? new Date()), 'H:mm')
			: undefined;
		const formattedValueInTimeValue = formattedValue
			? new Time(Number(formattedValue?.split(':')[0]), Number(formattedValue?.split(':')[1]))
			: null;

		return formattedValueInTimeValue;
	}

	return null;
};

export const convertToDateTimeReq = (date: Date, time: string) => {
	const formattedDate = format(date, 'yyyy-MM-dd');
	const formattedTime = format(new Date(time), 'HH:mm:ss');

	return `${ formattedDate } ${ formattedTime }`;
};

export const showFormattedDate = (dateToFormat: Date | number, isMobile?: boolean) => {
	return format(dateToFormat, isMobile ? 'eee, LLL dd, yyyy' : 'eeee, LLL dd, yyyy');
};

export const getSupportedImageTypes = () => {
	const imageTypes = [
		'image/webp',
		'image/jpg',
		'image/jpeg',
		'image/png',
		'image/bmp',
		'image/tiff',
		'image/gif',
		'image/apng',
		'image/avif',
		'image/svg+xml',
		'image/x-icon'
	];

	return imageTypes;
};

export const transformObjectToParams = (object: {
	[key: string]: string | number | undefined | null;
}) => {
	const params = Object.entries(object)
		.filter(([, value]) => value !== undefined && value !== null)
		.map(
			([key, value]) =>
				`${ encodeURIComponent(key) }=${ encodeURIComponent(String(value)) }`,
		);

	return params.length > 0 ? `?${ params.join('&') }` : '';
};

export const removeTags = (str: string) => {
	if (!str)
		return '';
	else
		str = str.toString();

	return str.replace(/(<([^>]+)>)/ig, '');
};

export const isJson = (item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
	let value = typeof item !== 'string' ? JSON.stringify(item) : item;
	try {
		value = JSON.parse(value);
	} catch (e) {
		return false;
	}

	return typeof value === 'object' && value !== null;
};

export const titleCase = (str: string) => {
	const splitStr = str?.toLowerCase()?.split(' ');

	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}

	return splitStr.join(' ');
};

export const joinCategoriesData = (categories: ProfileCategoryResp[]) => {
	return (categories ?? [])?.map((category: ProfileCategoryResp) => category?.cat_name)?.join(', ');
};

export const isIncludeOtherOption = (optName: string) => {
	return ['other', 'others'].includes((optName ?? '').toLowerCase());
};