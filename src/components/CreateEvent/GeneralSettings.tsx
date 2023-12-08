/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react';
import { Tag } from 'react-tag-autocomplete';
import { FieldArray, FormikProps, FormikProvider, useFormik } from 'formik';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import BackgroundIcon from 'public/images/create/background.svg';
import EffectIcon from 'public/images/create/effect.svg';
import PreviewIcon from 'public/images/create/preview.svg';
import SettingsIcon from 'public/images/create/settings.svg';
import ChevronLeftIcon from 'public/images/icons/chevron_left.svg';
import * as yup from 'yup';

import createEventDataLocal from '@/constant/data/create.json';
import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { classNames } from '@/helpers/style';
import { toastify } from '@/helpers/toast';
import { useApiClient } from '@/hooks';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { AnswerList, EventSetQuestion } from '@/openapi';
import { Actions } from '@/store';
import { CreateEventTypes } from '@/typings';
import { CreateEventValidator } from '@/validator';

import Button from '../Button';
import FormikComponent from '../Formik';
import { TextField } from '../Input';
import TextFieldSetting from '../Input/TextFieldSetting';
import { Sheet, SheetContent } from '../Sheet';
import Spinner from '../Spinner';
import { Switch } from '../Switch';
import TagAutocomplete from '../TagAutocomplete';

type FormEventSettingReq = yup.InferType<typeof CreateEventValidator.FormEventSettingchema>;
interface EventSetQuestionState extends EventSetQuestion {
	id?: number;
	is_default?: boolean;
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const GeneralSettings: React.FC<CreateEventTypes.GeneralSettingsProps> = ({
	data,
	onSaveDraft,
	eventCode,
	loadingSave,
	isEffectActive,
	detailEvent
}) => {
	const createEventData = data ?? createEventDataLocal;

	const apiClient = useApiClient();
	const router = useRouter();

	const createEventState = useAppSelector(state => state.createEventReducers);

	const toggleEffect = useAppDispatch(Actions.createEventAction.toggleEffect);

	const [showSetting, setShowSetting] = useState<boolean>(false);
	const [enableValidation, setEnableValidation] = useState<boolean>(false);
	const [loadingRoute, setLoadingRoute] = useState<boolean>(false);
	const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
	const [showPreviewQuestionnaire, setShowPreviewQuestionnaire] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<string>('1');
	const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
	const [categories, setCategories] = useState<Tag[]>([]);

	useEffect(() => {
		if (router?.query?.state && router?.query?.state === 'settings') {
			setShowSetting(true);
		}
	}, [router?.query?.state]);

	useEffect(() => {
		if (isEffectActive) toggleEffect(true);
	}, [isEffectActive]);

	useEffect(() => {
		const getCategoriesSuggestions = async() => {
			try {
				const response = await (await apiClient.profileCategoryApi()).profileCategoryList();
				if (response?.status === 200) {
					const categoriesData: Tag[] = (response?.data?.data ?? []).map(category => ({
						id: category.cat_name ?? '',
						name: category.cat_name ?? ''
					}));
					const currentEventTags = detailEvent?.set_questionnaire?.find(questionnaire => questionnaire?.answer_list?.length && questionnaire?.input_type === 'select')?.answer_list ?? [];
					const initTagSuggestions = currentEventTags?.map(suggestion => ({
						id: suggestion.answer ?? '',
						name: suggestion.answer ?? ''
					}));
					const newSuggestions = [...initTagSuggestions, ...categoriesData];

					const tagSuggestionsUnique = uniqBy(newSuggestions.map(suggestion => ({
						...suggestion,
						name: suggestion.name.toLowerCase()
					})), 'name');

					setTagSuggestions(tagSuggestionsUnique);
					setCategories(categoriesData);
				}
			} catch (error) {
				handleCatchError(error);
			}
		};

		if (detailEvent?.set_questionnaire && showSetting) {
			getCategoriesSuggestions();
		}
	}, [detailEvent?.set_questionnaire, showSetting]);

	const closeEventSetting = () => {
		setShowSetting(false);
		formik.resetForm();
		router.replace({
			pathname: router.pathname,
			query: { code: eventCode }
		},
		undefined,
		{ shallow: true }
		);
	};

	const formik: FormikProps<FormEventSettingReq> = useFormik<FormEventSettingReq>({
		validateOnBlur: enableValidation,
		validateOnChange: enableValidation,
		validationSchema: CreateEventValidator.FormEventSettingchema,
		initialValues: {
			reminder: true,
			rsvp: {
				accept_rsvp: true,
				max_capacity: 0,
				is_max_capacity_active: false,
			},
			is_questionnaire_active: true,
			questionnaire: []
		},
		onSubmit: async form => {
			try {
				setLoadingSettings(true);

				const questionnaireOptions = form.questionnaire?.find(questionnaire => questionnaire?.answer_list?.length && questionnaire?.input_type === 'select')?.answer_list ?? [];

				if (questionnaireOptions) {
					const newSuggestions = questionnaireOptions?.filter(questionnaire => {
						return categories.every((suggestion: Tag) => {
							return suggestion?.name?.toLowerCase() !== questionnaire?.answer?.toLowerCase();
						});
					});

					if (newSuggestions?.length) {
						await Promise.all(newSuggestions.map(async(suggestion: AnswerList, suggestionIdx: number) => {
							if (suggestion.answer) {
								await sleep(suggestionIdx * 500);
								await (await apiClient.authApi()).addProfileCategory({ cat_name: suggestion.answer ?? '' });
							}
						}));
					}
				}

				const response = await (await apiClient.eventsApi()).editEventSetting(router?.query?.code as string, {
					...form,
					rsvp: {
						accept_rsvp: form.rsvp.accept_rsvp,
						max_capacity: form.rsvp.is_max_capacity_active
							? + (form.rsvp.max_capacity ?? '0')
							: 0
					},
					is_questionnaire_active: form.questionnaire?.filter(questionnaire => questionnaire?.is_active === false)?.length !== form?.questionnaire?.length
				});
				const status = response?.status;

				if (status === 200) {
					closeEventSetting();
				}
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoadingSettings(false);
			}
		}
	});

	useEffect(() => {
		if (detailEvent) {
			formik.setFieldValue('is_questionnaire_active', detailEvent?.is_questionnaire_active);
			formik.setFieldValue('rsvp.accept_rsvp', detailEvent?.set_rsvp?.accept_rsvp);
			formik.setFieldValue('rsvp.max_capacity', detailEvent?.set_rsvp?.max_capacity);
			if (typeof detailEvent?.set_rsvp?.max_capacity === 'number') {
				formik.setFieldValue('rsvp.is_max_capacity_active', !!(detailEvent?.set_rsvp?.max_capacity > 0));
			}
			formik.setFieldValue('reminder', detailEvent?.set_reminder);
			formik.setFieldValue('questionnaire', detailEvent?.set_questionnaire?.map((questionnaire: EventSetQuestion, questionnaireIdx: number) => ({
				...questionnaire,
				id: questionnaireIdx + 1
			})));
		}
	}, [detailEvent]);

	const handleSaveAndPushToEventDetail = (isPreview: boolean) => {
		if (onSaveDraft) {
			onSaveDraft()
				.then((respEventCode: string) => {
					if (respEventCode) {
						setLoadingRoute(true);

						const url = `/events/${ respEventCode }${ isPreview ? '/preview' : '' }`;

						router.replace(url).then(() => setLoadingRoute(false));
					}
				})
				.catch(() => toastify('error-default'));
		}
	};

	const onClickSettings = () => {
		if (onSaveDraft) {
			onSaveDraft()
				.then((respEventCode: string) => {
					if (respEventCode) {
						setLoadingRoute(true);

						const url = `/events/${ respEventCode }/edit?state=settings`;

						router.replace(url).then(() => setLoadingRoute(false));
					}
				})
				.catch(() => toastify('error-default'));
		} else {
			setShowSetting(true);
		}
	};

	const onClickGeneralSetting = (id: string) => {
		if (id === 'effect') return toggleEffect();
		if (id === 'preview') return handleSaveAndPushToEventDetail(true);
		if (id === 'settings') return onClickSettings();
	};

	const handleSaveSettings = () => {
		setEnableValidation(true);
		formik.handleSubmit();
	};

	const renderTagAutocomplete = (e: EventSetQuestionState, formikQuestionnaireIdx?: number) => {
		const tags = (e.answer_list ?? [])?.filter((answerData: AnswerList) => answerData.is_active)?.map((answerData: AnswerList) => ({
			id: answerData.answer ?? '',
			name: answerData.answer ?? ''
		}));

		const newSuggestions = tagSuggestions?.filter(suggestion => {
			return tags.every(tag => tag?.name?.toLowerCase() !== suggestion?.name?.toLowerCase());
		});

		return (
			<div className='mt-3'>
				<TagAutocomplete
					tags={ tags }
					onChange={ newTags => {
						formik.setFieldValue(`questionnaire.${ formikQuestionnaireIdx }.answer_list`, newTags.map(tag => ({
							is_active: true,
							answer: tag.name
						})));
					} }
					suggestions={ newSuggestions }
				/>
			</div>
		);
	};

	const renderQuestionnaireList = (questionaireList: EventSetQuestionState[], isDefaultList?: boolean) => {
		return (
			<div className={ clsxm(
				'grid gap-5 lg:gap-18px w-full',
				questionaireList?.length && !isDefaultList ? 'pb-3 mt-5' : ''
			) }>
				{ questionaireList?.map((e: EventSetQuestionState) => {
					const formikQuestionnaireIdx = formik?.values?.questionnaire?.findIndex(questionnaire => questionnaire?.id === e.id);
					const defaultTextFieldSettingProps = {
						isChecked: e.is_active,
						onChecked: (res: boolean) => {
							formik.setFieldValue(`questionnaire.${ formikQuestionnaireIdx }.is_active`, res);
							formik.setFieldValue(`questionnaire.${ formikQuestionnaireIdx }.is_required`, res);
						},
						isRequired: e.is_required,
						onToggleRequired: (res: boolean) => formik.setFieldValue(`questionnaire.${ formikQuestionnaireIdx }.is_required`, res),
						label: null,
						value: e.input_description,
						name: `questionnaire.${ formikQuestionnaireIdx }.input_description`,
						onChange: (eInput: React.ChangeEvent<HTMLInputElement>) => {
							formik.setFieldValue(eInput.target.name, eInput.target.value);
						},
						placeholder: e.input_description === '' ? 'Type your question' : e.input_description,
						inputDisabled: !!isDefaultList
					};

					return (
						<div key={ e.id }>
							{
								e.input_type === 'select' ? (
									<div className='flex flex-col gap-3.5 w-full relative'>
										<div className='w-full'>
											<TextFieldSetting
												showCheckbox
												renderSelect={ e.is_active
													? () => renderTagAutocomplete(e, formikQuestionnaireIdx)
													: undefined }
												{ ...defaultTextFieldSettingProps }
											/>
										</div>
									</div>
								) : (
									<TextFieldSetting
										showCheckbox={ isDefaultList }
										showRemove={ !isDefaultList }
										onRemove={ () => {
											const updatedQuestionnaireList = formik?.values?.questionnaire?.filter((questionnaire: EventSetQuestionState) => {
												return `${ questionnaire.id }` !== `${ e.id }`;
											});

											formik.setFieldValue('questionnaire', updatedQuestionnaireList);
										} }
										{ ...defaultTextFieldSettingProps }
									/>
								)
							}
						</div>
					);
				}) }
			</div>
		);
	};

	const dataSettings = [
		{
			value: '1',
			title: 'RSVPs',
			content: (
				<div className='flex flex-col gap-[25px]'>
					<div>
						<div className='flex items-center justify-between max-lg:bg-white max-lg:py-10px max-lg:px-5'>
							<h5 className='text-base lg:text-sm font-semibold leading-120% text-steel'>Accept RSVPs</h5>
							<Switch
								name='rsvp.accept_rsvp'
								checked={ formik?.values?.rsvp.accept_rsvp }
								onCheckedChange={ e => formik.setFieldValue('rsvp.accept_rsvp', e) }
							/>
						</div>
						<div className='max-lg:px-5 text-left'>
							<p className='text-sm text-steel mt-2 lg:mt-1'>Control whether this event is accepting new RSVPs.</p>
							<p className='text-sm font-medium text-steel'>RSVPs is closed 2 hours after the event starts.</p>
						</div>
					</div>

					<div>
						<div className='flex items-center justify-between max-lg:bg-white max-lg:py-10px max-lg:px-5'>
							<h5 className='text-base lg:text-sm font-semibold leading-120% text-steel'>Set Max Capacity</h5>
							<Switch
								name='rsvp.is_max_capacity_active'
								checked={ formik?.values?.rsvp.is_max_capacity_active }
								onCheckedChange={ res => {
									formik.setFieldValue('rsvp.is_max_capacity_active', res);
									if (res) formik.setFieldValue('rsvp.max_capacity', `${ formik?.values?.rsvp?.max_capacity ?? 50 }`);
								} }
							/>
						</div>
						<div className='max-lg:px-5 text-left'>
							<p className='text-sm text-steel mt-2 lg:mt-1'>Set the maximum event capacity. Limit the number of guests who can RSVP.</p>

							{ formik?.values?.rsvp.is_max_capacity_active && (
								<div className='flex items-center gap-[7px] mt-3'>
									<label
										htmlFor='max_capacity'
										className='text-sm text-grey-1 leading-140%'
									>Maximum spots</label>

									<div className='flex'>
										<TextField
											id='max_capacity'
											name='rsvp.max_capacity'
											value={ formik?.values?.rsvp?.max_capacity?.toString() === '0' ? '' : `${ formik?.values?.rsvp?.max_capacity }` }
											onChange={ (eInput: React.ChangeEvent<HTMLInputElement>) => {
												const value = eInput.target.value.replace(/\D|^0+/g, '');

												formik.setFieldValue(eInput.target.name, value);
											} }
											type='text'
											className='rounded border-[0.5px] border-grey-2 focus:border-grey-2 bg-base py-0.5 text-center text-base leading-126% !text-steel placeholder:text-grey-1 !w-20'
										/>
									</div>
								</div>
							) }
						</div>
					</div>
				</div>
			)
		},
		{
			value: '2',
			title: 'Questionnaire',
			content: (
				<div className='flex flex-col gap-6'>
					<div>
						<p className='text-sm text-steel text-left max-lg:px-5'>
							Ask guests questions when they RSVP. By default, guests are asked to provide their Phone<br />
							Number, Email, First Name, and Last Name to RSVP. Add any additional questions below.
						</p>
					</div>

					<div>
						<div className='max-lg:px-5'>
							<div>
								<div className='flex items-center gap-2'>
									<div className='flex-shrink-0 w-4'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='16'
											height='16'
											viewBox='0 0 16 16'
											fill='none'>
											<path
												d='M7.12903 9.97609C7.08295 9.97609 7.04147 9.96203 7.00461 9.9339C6.97696 9.89639 6.96313 9.8542 6.96313 9.80731V9.23066C6.96313 8.78059 7.07373 8.4196 7.29493 8.14768C7.51613 7.86639 7.83871 7.57103 8.26267 7.2616C8.63134 6.98969 8.90783 6.7459 9.09217 6.53024C9.2765 6.3052 9.36866 6.0286 9.36866 5.70042C9.36866 5.33474 9.24424 5.04407 8.99539 4.82841C8.74654 4.60338 8.41935 4.49086 8.01382 4.49086C7.58986 4.49086 7.24885 4.60806 6.99078 4.84248C6.73272 5.07689 6.60369 5.37693 6.60369 5.74262V6.03797C6.60369 6.14112 6.54839 6.19269 6.43779 6.19269L5.1659 6.13643C5.11982 6.13643 5.07834 6.11767 5.04147 6.08017C5.01382 6.04266 5 6.00047 5 5.95359V5.74262C5 5.20816 5.12903 4.73465 5.3871 4.32208C5.64516 3.90014 6.00461 3.57665 6.46544 3.35162C6.92627 3.11721 7.45622 3 8.0553 3C8.94931 3 9.66359 3.24379 10.1982 3.73136C10.7327 4.20956 11 4.84716 11 5.64416C11 6.05673 10.9263 6.41303 10.7788 6.71308C10.6406 7.01313 10.4747 7.25692 10.2811 7.44444C10.0968 7.63197 9.84332 7.84294 9.52074 8.07736C9.19816 8.31177 8.95853 8.51805 8.80184 8.6962C8.64516 8.86498 8.56682 9.07595 8.56682 9.32911V9.80731C8.56682 9.8542 8.54839 9.89639 8.51152 9.9339C8.48387 9.96203 8.447 9.97609 8.40092 9.97609H7.12903ZM7.7235 13C7.43779 13 7.20276 12.9062 7.01843 12.7187C6.8341 12.5312 6.74194 12.2921 6.74194 12.0014C6.74194 11.7107 6.8341 11.4763 7.01843 11.2982C7.20276 11.1106 7.43779 11.0169 7.7235 11.0169C8.00922 11.0169 8.23963 11.1106 8.41475 11.2982C8.59908 11.4763 8.69124 11.7107 8.69124 12.0014C8.69124 12.2921 8.59908 12.5312 8.41475 12.7187C8.23041 12.9062 8 13 7.7235 13Z'
												fill='#062A30' />
											<rect
												x='0.5'
												y='0.5'
												width='15'
												height='15'
												rx='2.5'
												stroke='#062A30' />
										</svg>
									</div>
									<p className='text-base lg:text-sm font-semibold leading-120% !text-steel'>Add Template Questions</p>
								</div>
								<div className='pl-6'>
									<p className='mt-0.5 text-sm leading-140% !text-steel'>All answers will be saved in <span className='underline'>My Contacts</span>.</p>
								</div>
							</div>

							<div className='w-full mt-3 lg:pl-6'>
								{ renderQuestionnaireList((formik.values?.questionnaire ?? [])?.filter((questionnaire: EventSetQuestionState) => questionnaire?.is_default === true || (typeof questionnaire?.is_default === 'undefined')), true) }
							</div>
						</div>

						<FieldArray
							name='questionnaire'
							render={ arrayHelper => (
								<div className='max-lg:px-5'>
									<div className='mt-7'>
										<div>
											<div className='flex items-center gap-2'>
												<div className='flex-shrink-0 w-4'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='16'
														height='16'
														viewBox='0 0 16 16'
														fill='none'>
														<rect
															x='0.5'
															y='0.5'
															width='15'
															height='15'
															rx='2.5'
															stroke='#062A30' />
														<line
															x1='3'
															y1='4.5'
															x2='13'
															y2='4.5'
															stroke='#062A30' />
														<line
															x1='3'
															y1='7.5'
															x2='10'
															y2='7.5'
															stroke='#062A30' />
														<line
															x1='3'
															y1='11.5'
															x2='13'
															y2='11.5'
															stroke='#062A30' />
													</svg>
												</div>
												<p className='text-base lg:text-sm font-semibold leading-120% !text-steel'>Add Custom Questions</p>
											</div>
											<div className='pl-6'>
												<p className='text-sm leading-140% !text-steel mt-0.5'>Add your own question for guests.</p>
											</div>
										</div>

										<div className='w-full lg:pl-6'>
											<div className='w-full'>
												{ renderQuestionnaireList((formik.values?.questionnaire ?? [])?.filter((questionnaire: EventSetQuestionState) => questionnaire?.is_default === false)) }
											</div>
											<div className='mt-[11px]'>
												<Button
													onClick={ () => {
														arrayHelper.push({
															id: formik?.values?.questionnaire
																? (formik.values.questionnaire[formik?.values?.questionnaire?.length - 1]?.id ?? 0) + 1
																: 1,
															input_type: 'text',
															input_description: '',
															is_required: true,
															is_default: false,
															is_active: true,
															answer_list: [],
														});
													} }
													className='btn inline-flex items-center gap-[5px] bg-opacity-20 bg-grey-1 !px-3 !py-[9px] !text-steel text-xs leading-120%'
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														width='8'
														height='9'
														viewBox='0 0 8 9'
														fill='none'>
														<path
															d='M7.81043 3.92417C7.93681 3.92417 8 3.99526 8 4.13744V5.03317C8 5.17535 7.93681 5.24645 7.81043 5.24645H4.66351C4.61295 5.24645 4.58768 5.27488 4.58768 5.33175V8.78673C4.58768 8.92891 4.52449 9 4.3981 9H3.6019C3.47551 9 3.41232 8.92891 3.41232 8.78673V5.33175C3.41232 5.27488 3.38705 5.24645 3.33649 5.24645H0.189573C0.0631912 5.24645 0 5.17535 0 5.03317V4.13744C0 3.99526 0.0631912 3.92417 0.189573 3.92417H3.33649C3.38705 3.92417 3.41232 3.89573 3.41232 3.83886V0.21327C3.41232 0.07109 3.47551 0 3.6019 0H4.3981C4.52449 0 4.58768 0.07109 4.58768 0.21327V3.83886C4.58768 3.89573 4.61295 3.92417 4.66351 3.92417H7.81043Z'
															fill='#062A30' />
													</svg>
													Add Question
												</Button>
											</div>
										</div>

										<div className='w-full mt-10 pb-6 flex justify-center'>
											<Button
												className='btn btn-primary !px-[30px] !py-2.5 lg:!py-1.5 text-sm font-medium leading-126%'
												onClick={ () => setShowPreviewQuestionnaire(true) }
											>
												Preview Questionnaire
											</Button>
										</div>
									</div>
								</div>
							) } />
					</div>
				</div>
			)
		},
		{
			value: '3',
			title: 'Auto-Reminders',
			content: (
				<div className='flex flex-col'>
					<div>
						<div className='flex items-center justify-between max-lg:bg-white max-lg:py-10px max-lg:px-5'>
							<h5 className='text-base lg:text-sm font-semibold leading-120% !text-steel'>Auto-Reminder</h5>
							<Switch
								checked={ formik?.values?.reminder }
								onCheckedChange={ e => formik.setFieldValue('reminder', e) } />
						</div>
						<p className='text-sm leading-120% !text-steel text-left max-lg:px-5 mt-2 lg:mt-[5px]'>Send automatic SMS or Email reminders to your guests.</p>
					</div>
					<div className='pl-6 flex flex-col gap-3.5 text-steel max-lg:pl-7 pr-5 text-left mt-[17px]'>
						<div>
							<h6 className='text-sm !text-steel font-semibold leading-120%'>Reminders to RSVP</h6>
							<p className='text-sm !text-steel leading-120% mt-1'>Sent to <span className='italic'>Invited</span> guests.</p>
							<p className='text-sm !text-steel leading-140% mt-px'>Scheduled in 2 weeks, 1 week, and 1 day before the event.</p>
						</div>
						<div>
							<h6 className='text-sm font-semibold !text-steel'>Event Reminders</h6>
							<p className='text-sm !text-steel leading-[143.5%] mt-[3px]'>Scheduled in 24 hours and 2 hours before the event starts. Reminders are sent to guests who RSVPed.</p>
						</div>
					</div>
				</div>
			)
		}
	];

	const resolveIcon = (id: string) => {
		switch (id) {
			case 'preview': return PreviewIcon;
			case 'effect': return EffectIcon;
			case 'settings': return SettingsIcon;
			case 'background':
			default:
				return BackgroundIcon;
		}
	};

	const resolveIconClassName = (id: string) => {
		switch (id) {
			case 'preview': return 'w-4 h-4';
			case 'effect': return 'w-5 h-[21px]';
			case 'settings': return 'w-4 h-[17px]';
			case 'background':
			default:
				return 'w-5 h-5';
		}
	};

	const renderIcon = (id: string) => {
		const Icon = resolveIcon(id);

		return <Icon className={ classNames(resolveIconClassName(id), 'relative z-10') } />;
	};

	const renderInput = (props: Form) => {
		// const isWhatsappNumberQuestion = props.label?.toLowerCase()?.includes('whatsapp');

		return (
			<FormikComponent
				inputProps={ {
					...props,
					className: '!py-[15px] !px-4 rounded-[7px] !text-steel placeholder:text-light-grey bg-transparent !ring-1 focus:!ring-1 ring-inset focus:ring-inset text-base leading-126% ring-grey-1 ring-opacity-50 focus:ring-steel focus:ring-opacity-100 data-[state=open]:ring-steel data-[state=open]:ring-opacity-100 data-[state=open]:ring-inset',
					overlappingLabel: true,
					overlappingLabelOnFocus: true,
					// inputMode: isWhatsappNumberQuestion ? 'numeric' : undefined,
					disabled: true
				} }
			/>
		);
	};

	const renderContentSettingDesktop = () => {
		const dataSetting = dataSettings.find(setting => setting.value === activeTab);

		if (dataSetting) {
			return (
				<div className='lg:px-5 lg:pb-3 lg:pt-5 max-lg:hidden'>
					{ dataSetting?.content }
				</div>
			);
		}

		return null;
	};

	const renderPreviewQuestionnaireDialog = () => {
		const formPropsList: Form[] = formik?.values?.questionnaire?.filter((e => e.is_active))?.map((e, idx) => {
			return {
				id: 'question_' + idx,
				label: e.input_description,
				placeholder: `${ e.input_description }${ e.is_required ? '*' : '' }`,
				required: e.is_required,
				type: e.input_type === 'text' ? 'text' : 'select',
				options: e.answer_list?.filter(a => a.is_active === true).map(item => {
					return {
						name: item.answer ?? '',
						value: item.answer ?? ''
					};
				})
			};
		}) ?? [];

		return (
			<Sheet
				onOpenChange={ () => setShowPreviewQuestionnaire(prev => !prev) }
				open={ showPreviewQuestionnaire }
			>
				<SheetContent
					side='center'
					className='w-screen max-lg:!h-screen overflow-y-auto lg:custom-scrollbar max-lg:!top-0 max-lg:!left-0 max-lg:!translate-x-0 max-lg:!translate-y-0 max-lg:border-none !bg-base lg:max-w-screen-md px-0 py-0'
				>
					<div className='max-lg:sticky max-lg:inset-0 bg-base max-lg:z-10 px-5 lg:px-3 max-lg:py-3 lg:py-2 lg:items-end flex flex-col'>
						<div className='flex items-center justify-between lg:hidden'>
							<div
								className='flex items-center gap-4'
								onClick={ () => setShowPreviewQuestionnaire(false) }
							>
								<ChevronLeftIcon className='flex-shrink-0 text-primary lg:hidden' />
								<h5 className='text-lg font-medium leading-[130%] text-steel lg:hidden'>Guest Questionnaire</h5>
							</div>
							<button
								onClick={ () => setShowPreviewQuestionnaire(false) }
								className='lg:hidden text-lg flex items-center font-medium leading-[111%] text-orange focus:outline-none focus:border-none'
							>
								Close
							</button>
						</div>

						<span className='text-xs leading-140% !text-steel max-lg:mt-[3px] max-lg:pl-[26px]'>
							*All guest information will be saved in <span className='underline'>My Contacts</span>.
						</span>
					</div>
					<div className='pt-6 lg:pt-[30px] pb-[35px] px-5 lg:px-[55px] flex flex-col items-center w-full'>
						<p className='!text-steel text-base font-semibold leading-126% text-center'>Questions from the Host</p>
						<div className='mt-[35px] lg:mt-6 w-full'>
							{ !formPropsList?.length
								? (
									<p className='text-sm text-grey-1 text-center'>You disabled questionnaires on this event.</p>
								)
								: (
									<>
										<div className='flex flex-col gap-y-[34px] lg:gap-y-6 w-full'>
											{ formPropsList?.map((props: Form) => (
												<div key={ props.id }>{ renderInput(props) }</div>
											)) }
										</div>

										<p className='mt-[13px] lg:mt-2.5 text-10px !text-steel'>*required answer</p>
									</>
								) }
						</div>
						<div className='mt-10 flex justify-center w-full max-lg:hidden'>
							<Button
								className='btn btn-primary !py-1.5'
								onClick={ () => setShowPreviewQuestionnaire(false) }
							>
								Close Preview
							</Button>
						</div>
						<div className='mt-[72px] lg:hidden flex items-center justify-center max-w-[278px] w-full'>
							<p className='text-sm leading-126% text-grey-1 text-center'>
								{ createEventData.notesRegister }
							</p>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		);
	};

	const renderSettingDialog = () => {
		const badgeClassName = 'py-1 lg:py-2.5 border rounded-full flex items-center justify-start lg:justify-center px-5 lg:px-12 border-med-grey w-full';

		return (
			<FormikProvider value={ formik }>
				<Sheet
					onOpenChange={ closeEventSetting }
					open={ showSetting }
				>
					<SheetContent
						side='center'
						className='w-screen max-lg:!h-screen overflow-y-auto lg:custom-scrollbar max-lg:!top-0 max-lg:!left-0 max-lg:!translate-x-0 max-lg:!translate-y-0 max-lg:border-none !bg-base lg:max-w-screen-md px-0 py-0'
					>
						<div className='sticky z-10 inset-0 lg:py-3 lg:px-5 bg-base'>
							<div className='flex items-center justify-between max-lg:px-5 max-lg:py-3'>
								<div
									className='flex items-center gap-4'
									onClick={ closeEventSetting }>
									<ChevronLeftIcon className='flex-shrink-0 text-primary lg:hidden' />
									<h5 className='text-lg font-medium leading-[130%] text-steel'>Event Settings</h5>
								</div>
								<button
									type='submit'
									onClick={ handleSaveSettings }
									className='text-lg flex items-center font-medium leading-[111%] text-orange focus:outline-none focus:border-none'
								>
									{ loadingSettings
										? <Spinner className='text-primary w-4 h-4' />
										: 'Save' }
								</button>
							</div>
							<div className='max-lg:hidden lg:pt-[18px] lg:pb-[5px]'>
								<div className='flex items-center justify-between gap-[11px]'>
									{ dataSettings.map(setting => (
										<Button
											key={ `trigger-${ setting.value }` }
											className={ clsxm(
												setting.value === activeTab
													? 'bg-steel text-white'
													: 'text-steel',
												badgeClassName,
												'text-sm leading-120% font-semibold'
											) }
											onClick={ () => setActiveTab(setting.value) }
										>
											{ setting.title }
										</Button>
									)) }
								</div>
							</div>
						</div>

						{ renderContentSettingDesktop() }

						<div className='lg:hidden pt-3'>
							<div className='flex flex-col gap-y-30px pb-10'>
								{ dataSettings.map(setting => (
									<div key={ `mobile-${ setting.value }` }>
										<div className='px-4 mb-[13px]'>
											<div className={ clsxm(badgeClassName, 'bg-steel text-white text-lg font-semibold leading-120%') }>
												{ setting.title }
											</div>
										</div>
										{ setting.content }
									</div>
								)) }
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</FormikProvider>
		);
	};

	const renderGeneralSettingsBox = () => {
		const options = createEventData?.generalSettings?.options;

		return (
			<div className='bg-super-light-grey flex h-50px rounded-10px max-md:w-full max-md:justify-center max-md:drop-shadow-super-light-grey'>
				{ options?.map((option: CreateEventTypes.GeneralSettingOption, optionIdx: number) => {
					const isToggleEffectActive = option.id === 'effect' && createEventState.isEffectActive;

					return (
						<Button
							key={ option.id }
							className={ classNames(
								'py-3 px-2 xxs:px-18px max-md:w-full max-md:justify-center group disabled:bg-light-grey disabled:text-grey-2 disabled:cursor-default cursor-pointer relative flex items-center space-x-2',
								optionIdx === 0 ? 'rounded-l-10px' : '',
								optionIdx === options.length - 1 ? 'rounded-r-10px' : '',
								isToggleEffectActive ? 'bg-purple text-white' : 'text-wording lg:hover:[&:not([disabled])]:bg-light-grey'
							) }
							onClick={ () => onClickGeneralSetting(option.id) }
							disabled={ loadingSave || loadingRoute }
						>
							{ renderIcon(option.id) }

							<p className='text-sm lg:text-xs'>{ option.name }</p>
						</Button>
					);
				}) }
			</div>
		);
	};

	return (
		<>
			<div className='flex flex-col items-center max-md:container-center'>
				<div className='lg:mt-5 flex max-md:w-full'>
					{ renderGeneralSettingsBox() }
				</div>

				<Button
					type='submit'
					className='btn btn-primary mt-[5px] lg:mt-2.5 text-lg lg:text-sm font-medium leading-126% max-md:w-full lg:w-full'
					onClick={ () => handleSaveAndPushToEventDetail(false) }
					disabled={ loadingSave || loadingRoute }
				>{ eventCode ? createEventData.saveChanges : createEventData.saveDraft }</Button>
			</div>

			{ renderSettingDialog() }
			{ renderPreviewQuestionnaireDialog() }
		</>
	);
};

export default GeneralSettings;