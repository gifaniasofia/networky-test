import {
	isAfter,
	isBefore,
	isEqual,
	isValid
} from 'date-fns';
import * as yup from 'yup';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const UploadCoverSchema = yup.object().shape({
	poster_img: yup
		.mixed()
		.test('type', 'This file type is invalid or unsupported', (value: any) => {
			return value && (/^image\//.test(value?.type));
		})
		.test('fileSize', 'Your file is larger than 2MB', (value: any) => {
			return value && value?.size / 1024 / 1024 <= 2;
		})
		.required()
		.label('Cover')
});

export const FormEventSchema = yup.object().shape({
	title: yup.string().required()
		.label('Event name'),
	datetime: yup.object({
		date: yup.object({
			from: yup.date().required()
				.label('Start date'),
			to: yup.date().required()
				.label('End date')
		}),
		time: yup
			.object({
				from: yup.mixed().test({
					name: 'validator-time',
					test: function(startTime: any, context: any) {
						if (startTime) {
							if (isValid(startTime)) {
								const formValue = context.parent;
								const endTime: Date | null = formValue.to;
								if (isValid(endTime) && endTime) {
									if (isEqual(endTime, startTime) || isAfter(startTime, endTime) || isBefore(endTime, startTime)) {
										return this.createError({
											message: 'Start time should be before end time',
											path: 'datetime.time.from',
										});
									}
									return true;
								}
								return true;
							}
							return this.createError({
								message: 'Invalid time',
								path: 'datetime.time.from',
							});
						}
						return this.createError({
							message: 'Start time is a required field',
							path: 'datetime.time.from',
						});
					},
				}),
				to: yup.mixed().test({
					name: 'validator-time',
					test: function(endTime: any, context: any) {
						if (endTime) {
							if (isValid(endTime)) {
								const formValue = context.parent;
								const startTime: Date | null = formValue.from;
								if (isValid(startTime) && startTime) {
									if (isEqual(endTime, startTime) || isAfter(startTime, endTime) || isBefore(endTime, startTime)) {
										return this.createError({
											message: 'Start time should be before end time',
											path: 'datetime.time.to',
										});
									}
									return true;
								}
								return true;
							}
							return this.createError({
								message: 'invalid time',
								path: 'datetime.time.to',
							});
						}
						return this.createError({
							message: 'End time is a required field',
							path: 'datetime.time.to',
						});
					},
				}),
			})
	})
});

export const FormEventSettingchema = yup.object().shape({
	reminder: yup.boolean().required(),
	rsvp: yup.object().shape({
		accept_rsvp: yup.boolean().required(),
		max_capacity: yup.number(),
		is_max_capacity_active: yup.boolean(),
	}),
	is_questionnaire_active: yup.boolean().required(),
	questionnaire: yup.array().of(
		yup.object().shape({
			id: yup.number(),
			input_type: yup.string().required(),
			input_description: yup.string().required(),
			is_required: yup.boolean().required(),
			is_active: yup.boolean().required(),
			is_default: yup.boolean(),
			answer_list: yup.array().of(
				yup.object().shape({
					answer: yup.string().required(),
					is_active: yup.boolean().required(),
					is_added: yup.boolean().default(false),
				})
			)
		})
	)
});