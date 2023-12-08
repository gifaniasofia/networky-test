import React, { Fragment, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Popover, Transition } from '@headlessui/react';
import { TimeValue } from '@react-aria/datepicker';
import { format, isAfter, parse } from 'date-fns';
import EventsOutlineIcon from 'public/images/icons/events_outline.svg';

import timezoneList from '@/constant/data/timezoneList.json';
import clsxm from '@/helpers/clsxm';
import {
	convertToTimeValue,
	formatTimezoneOffsetToHhMm,
	generateListOfTime,
	isStartTimeLessThanEndTime,
	parseTime,
	showFormattedDate
} from '@/helpers/misc';
import { screens } from '@/helpers/style';
import { useWindowDimensions } from '@/hooks';
import { InputTypes } from '@/typings';

import { Calendar } from '../Calendar';

import TextField from './TextField';
import TimePicker from './TimePicker';

const DateTime: React.FC<InputTypes.DateTimeProps> = ({
	inputClassName,
	onChange,
	initialValue
}) => {
	const [date, setDate] = useState<DateRange>({
		from: new Date(),
		to: new Date()
	});
	const [time, setTime] = useState<InputTypes.TimeRange>({
		from: '',
		to: ''
	});
	const [timezoneData, setTimezoneData] = useState<InputTypes.TimezoneData>({
		timezone: '',
		gmt_offset: -1
	});
	const [searchTimezone, setSearchTimezone] = useState<string>('');

	const windowDimensions = useWindowDimensions();
	const isMobile = windowDimensions.width < screens.sm;

	useEffect(() => {
		if (initialValue?.date?.from || initialValue?.date?.to) {
			setDate(prevDate => ({
				...prevDate,
				from: initialValue?.date?.from,
				to: initialValue?.date?.to
			}));
		}

		if (initialValue?.time?.from && initialValue?.time?.to) {
			setTime({
				from: initialValue?.time?.from,
				to: initialValue?.time?.to
			});
		}

		if (initialValue?.timezone) {
			setTimezoneData(initialValue?.timezone);
		}
	}, [
		initialValue?.date?.from,
		initialValue?.date?.to,
		initialValue?.time?.from,
		initialValue?.time?.to,
		initialValue?.timezone?.timezone,
		initialValue?.timezone?.gmt_offset,
	]);

	const onChangeValue = (newDate?: DateRange, newTime?: InputTypes.TimeRange, timezone?: InputTypes.TimezoneData) => {
		if (onChange) {
			return onChange({
				date: newDate ?? {
					from: undefined,
					to: undefined
				},
				time: {
					from: newTime?.from ? parseTime(newTime?.from, newDate?.from) : '',
					to: newTime?.to ? parseTime(newTime?.to, newDate?.to) : ''
				},
				timezone
			});
		}
	};

	useEffect(() => {
		onChangeValue(date, time, timezoneData);
	}, [
		date,
		time?.from,
		time?.to,
		timezoneData?.timezone,
		timezoneData?.gmt_offset
	]);

	const onSelectCalendar = (type: string, selectedDate?: Date) => {
		if (selectedDate) {
			if (type === 'from') {
				const isStartDateLargerThanEndDate = isAfter(selectedDate, date?.to as Date);
				const updatedDate = {
					from: selectedDate,
					...isStartDateLargerThanEndDate ? { to: selectedDate } : {}
				};

				if (!isStartTimeLessThanEndTime(time?.from, time?.to, { ...date, ...updatedDate })) {
					setTime(prevTime => ({
						...prevTime,
						to: null
					}));
				}

				setDate(prevDate => ({
					...prevDate,
					...updatedDate
				}));
			} else {
				if (!isStartTimeLessThanEndTime(time?.from, time?.to, { ...date, [type]: selectedDate })) {
					setTime(prevTime => ({
						...prevTime,
						to: null
					}));
				}

				setDate(prevDate => ({
					...prevDate,
					[type]: selectedDate
				}));
			}
		}
	};

	const onSelectTime = (type: string, selectedTime: SelectOption) => {
		setTime(prevTime => ({
			...prevTime,
			[type]: selectedTime?.value,
			// ...type === 'from' && !isStartTimeLessThanEndTime(selectedTime?.value, prevTime?.to, date)
			// 	? { to: null }
			// 	: {},
			// ...type === 'to' && !isStartTimeLessThanEndTime(prevTime?.from, selectedTime?.value, date)
			// 	? { from: null }
			// 	: {}
		}));
	};

	const renderClockEmoji = () => {
		return (
			<div className='flex-shrink-0 w-[18px]'>
				<EventsOutlineIcon className='w-18px h-18px sm:w-[13px] sm:h-3.5 flex-shrink-0 text-steel' />
			</div>
		);
	};

	const renderSelectDate = (type: string, dataDate?: Date) => {
		return (
			<Popover.Group>
				<Popover className='relative w-full'>
					<Popover.Button className='text-sm leading-126% w-full rounded bg-[#E6E6E6] !text-wording border-none py-1 px-2 sm:px-2.5 text-left focus:ring-0 focus:border-light-grey focus:outline-none'>
						{ dataDate
							? showFormattedDate(dataDate as Date | number, isMobile)
							: 'Select Date' }
					</Popover.Button>

					<Transition
						as={ Fragment }
						enter='transition ease-out duration-200'
						enterFrom='opacity-0 translate-y-1'
						enterTo='opacity-100 translate-y-0'
						leave='transition ease-in duration-150'
						leaveFrom='opacity-100 translate-y-0'
						leaveTo='opacity-0 translate-y-1'
					>
						<Popover.Panel className='z-50 rounded mt-1.5 w-full xxs:min-w-[220px] sm:w-[278px] left-0 absolute transform bg-base shadow-blur-1'>
							<Calendar
								initialFocus
								mode='single'
								defaultMonth={ new Date() }
								selected={ dataDate }
								onSelect={ (selectedDate?: Date) => onSelectCalendar(type, selectedDate) }
								numberOfMonths={ 1 }
								disabled={ {
									before: type === 'from'
										? new Date()
										: date?.from as Date
								} }
							/>
						</Popover.Panel>
					</Transition>
				</Popover>
			</Popover.Group>
		);
	};

	const renderSelectTime = (type: string, dataTime: string | null, dataDate?: Date) => {
		const beginLimit = '12:00 AM';
		const endLimit = '11:30 PM';

		const options = generateListOfTime(beginLimit, endLimit)?.map(option => ({
			name: option,
			value: option
		}));
		// const options = generateListOfTime(beginLimit, endLimit)?.reduce((filtered: SelectOption[], option: string) => {
		// 	if (type === 'to') {
		// 		const isAvailable = isStartTimeLessThanEndTime(time?.from, option, date);

		// 		if (isAvailable) {
		// 			filtered.push({
		// 				name: option,
		// 				value: option,
		// 				disabled: false
		// 			});
		// 		} else {
		// 			filtered.push({
		// 				name: option,
		// 				value: option,
		// 				disabled: true
		// 			});
		// 		}
		// 	} else {
		// 		filtered.push({
		// 			name: option,
		// 			value: option,
		// 			disabled: false
		// 		});
		// 	}

		// 	return filtered;
		// }, []);

		const value = options?.find(opt => opt.value === dataTime) ?? {
			value: dataTime,
			name: dataTime ?? ''
		};

		return (
			<TimePicker
				value={ value }
				onChange={ (selected: SelectOption) => onSelectTime(type, selected) }
				defaultOptions={ options }
				timeValue={ convertToTimeValue(value) }
				onChangeTimeValue={ (timeValChanged: TimeValue | null) => {
					if (timeValChanged) {
						const formattedTimeValueChanged = format(parse(`${ timeValChanged?.hour }:${ timeValChanged?.minute }`, 'H:mm', dataDate ?? new Date()), 'h:mm a');

						onSelectTime(type, {
							name: formattedTimeValueChanged,
							value: formattedTimeValueChanged
						});
					} else {
						onSelectTime(type, {
							name: '',
							value: null
						});
					}
				} }
			/>
		);
	};

	const renderSelectTimezone = () => {
		const timezoneOptions = timezoneList.data;
		const filteredTimezoneOptions =
			searchTimezone === ''
				? timezoneOptions
				: timezoneOptions.filter(opt =>
					opt.zoneName
						.toLowerCase()
						.replace(/[^A-Z0-9]/ig, '')
						.includes(searchTimezone.toLowerCase().replace(/[^A-Z0-9]/ig, ''))
				);

		return (
			<Popover.Group>
				<Popover className='relative w-full'>
					<Popover.Button className='!text-wording text-sm leading-126% w-full rounded bg-[#E6E6E6] border-none py-1 px-2 sm:px-2.5 text-right sm:text-left focus:ring-0 focus:border-light-grey focus:outline-none'>
						{ timezoneData.timezone
							? (
								<>
									{ formatTimezoneOffsetToHhMm(timezoneData.gmt_offset) } { timezoneData.timezone }
								</>
							)
							: 'Select timezone' }
					</Popover.Button>

					<Transition
						as={ Fragment }
						enter='transition ease-out duration-200'
						enterFrom='opacity-0 translate-y-1'
						enterTo='opacity-100 translate-y-0'
						leave='transition ease-in duration-150'
						leaveFrom='opacity-100 translate-y-0'
						leaveTo='opacity-0 translate-y-1'
					>
						<Popover.Panel className='z-50 rounded mt-1.5 w-full xxs:min-w-[300px] right-0 absolute transform bg-base shadow-blur-1'>
							{ ({ close }) => (
								<>
									<TextField
										value={ searchTimezone }
										placeholder='Search'
										onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setSearchTimezone(e.target.value) }
										className='text-sm !bg-transparent placeholder:text-grey-1 leading-126% text-steel border-b-[0.5px] border-grey-1 !py-1.5 !px-[11px] focus:border-b-[0.5px] focus:border-grey-1'
									/>

									<div className='max-h-44 overflow-y-auto custom-scrollbar px-1'>
										{ filteredTimezoneOptions.map((opt, optIdx) => {
											const isSelected = opt.zoneName === timezoneData.timezone;

											return (
												<div
													key={ optIdx }
													className={ clsxm(
														'flex items-center justify-between space-x-2 text-sm leading-126% rounded py-1.5 px-[7px] my-1 cursor-pointer',
														isSelected ? 'bg-purple' : 'hover:bg-grey-1/10'
													) }
													onClick={ () => {
														setTimezoneData({
															timezone: opt.zoneName,
															gmt_offset: opt.gmtOffset
														});
														close();
														setSearchTimezone('');
													} }
												>
													<p className={ isSelected ? 'text-white' : 'text-steel' }>
														{ opt.zoneName }
													</p>
													<p className={ clsxm(isSelected ? 'text-white' : 'text-grey-1', 'text-right') }>
														{ formatTimezoneOffsetToHhMm(opt.gmtOffset) }
													</p>
												</div>
											);
										}) }
									</div>
								</>
							) }
						</Popover.Panel>
					</Transition>
				</Popover>
			</Popover.Group>
		);
	};

	const renderButtonInput = () => {
		const arrDateTime = [{
			type: 'from',
			title: 'Start',
			date: date?.from,
			time: time?.from
		}, {
			type: 'to',
			title: 'End',
			date: date?.to,
			time: time?.to
		}];

		return (
			<div className='flex items-start space-x-9px lg:space-x-3'>
				<div className='mt-1.5'>
					{ renderClockEmoji() }
				</div>

				<span className='flow-root text-sm lg:text-base leading-126% text-steel w-full'>
					<ul
						role='list'
						className='list-none space-y-1.5'
					>
						{ arrDateTime?.map((data, dataIdx) => (
							<li key={ dataIdx }>
								<div className='grid grid-cols-8 sm:grid-cols-6 space-x-1.5 items-center w-full'>
									<div className='col-span-1 !text-wording text-sm leading-126%'>{ data.title }</div>
									<div className='col-span-4 sm:col-span-3'>
										{ renderSelectDate(data.type, data.date) }
									</div>
									<div className='col-span-3 sm:col-span-2'>
										{ renderSelectTime(data.type, data.time, data.date) }
									</div>
								</div>
							</li>
						)) }
					</ul>
					<div className='mt-2.5 pt-9px border-t border-med-grey'>
						<div className='grid grid-cols-8 sm:grid-cols-6 space-x-1.5 items-center w-full text-steel'>
							<div className='col-span-2 sm:col-span-1 text-sm leading-126% !text-wording'>Time zone</div>
							<div className='col-span-6 sm:col-span-5'>
								{ renderSelectTimezone() }
							</div>
						</div>
					</div>
				</span>
			</div>
		);
	};
	return (
		<div className={ clsxm('relative block w-full text-left focus:ring-0 focus:outline-0', inputClassName) }>
			{ renderButtonInput() }
		</div>
	);
};

export default DateTime;