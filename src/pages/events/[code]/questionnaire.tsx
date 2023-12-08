import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import https from 'https';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getServerSession, Session } from 'next-auth';
import * as yup from 'yup';

import { Button, Formik, Layout } from '@/components';
import { endpoints, regex } from '@/constant';
import navigationDataLocal from '@/constant/data/navigation.json';
import clsxm from '@/helpers/clsxm';
import { handleCatchError } from '@/helpers/handleError';
import { isIncludeOtherOption } from '@/helpers/misc';
import { useApiClient } from '@/hooks';
import { EventRespDetail, ProfileCategoryList200Response, ProfileCategoryResp, ShowEventByCode200Response } from '@/openapi';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

type QuestionairePageProps = InferGetServerSidePropsType<typeof getServerSideProps> & {
	eventDetail: EventRespDetail;
	attendanceStatus: number;
	sessionData: Session;
	code: string;
	questionnaireForm: Form[];
	categoriesOptions: ProfileCategoryResp[];
};

const Questionaire: NextPage<QuestionairePageProps> = ({
	navigationData,
	code,
	attendanceStatus,
	questionnaireForm,
	categoriesOptions
}) => {
	const router = useRouter();
	const [enableValidation, setEnableValidation] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const apiClient = useApiClient();

	const setYupSchemaValue = (type?: InputType, required?: boolean) => {
		if (type === 'select') {
			const schemaSelect = yup.array().of(yup.object().shape({
				name: yup.string(),
				value: yup.string()
			}));

			if (required) return schemaSelect.min(1, 'Your answer is required');
			return schemaSelect;
		}

		if (type === 'text' || type === 'textarea') {
			const schemaText = yup.string();

			if (required) return schemaText.required('Your answer is required');
			return schemaText;
		}
	};

	const setValidationSchema = () => {
		let objYup = {};

		for (let i = 0; i < questionnaireForm?.length; i++) {
			const questionnaire = questionnaireForm[i];

			objYup = {
				...objYup,
				[questionnaire.id]: questionnaire?.label?.toLowerCase()?.includes('linkedin')
					? yup.string()
						.matches(regex.url, 'LinkedIn must be a valid URL')
						.required('Your answer is required')
					: setYupSchemaValue(questionnaire.type, questionnaire.required)
			};
		}

		return yup.object().shape({ ...objYup });
	};

	const setInitialValues = () => {
		let initialValues = {};

		for (let i = 0; i < questionnaireForm?.length; i++) {
			initialValues = {
				...initialValues,
				[questionnaireForm[i].id]: questionnaireForm[i].type === 'select'
					? []
					: ''
			};
		}

		return initialValues;
	};

	const formik = useFormik<ObjectKey<any>>({ // eslint-disable-line @typescript-eslint/no-explicit-any
		validateOnBlur: enableValidation,
		validateOnChange: enableValidation,
		validationSchema: setValidationSchema(),
		initialValues: setInitialValues(),
		onSubmit: async reqFormQuestionare => {
			try {
				setLoading(true);
				const questionnairesWithAnswer = Object.values(reqFormQuestionare)?.map((answer: string | SelectOption[], i: number) => {
					return {
						question: questionnaireForm[i].label as string,
						answer: answer && Array.isArray(answer)
							? JSON.stringify(answer.map(item => item.value))
							: answer
					};
				}) ?? [];

				const questionnaireMultipleSelect = Object.values(reqFormQuestionare)?.find((answer: string | SelectOption[]) => answer && Array.isArray(answer));

				if (questionnaireMultipleSelect) {
					const otherCategory = questionnaireMultipleSelect?.find((option: SelectOption) => isIncludeOtherOption(option.name));

					if (otherCategory) {
						const isCategoryExist = categoriesOptions?.find((category: ProfileCategoryResp) => category?.cat_name?.toLowerCase() === otherCategory?.value?.toLowerCase());

						if (!isCategoryExist) {
							await (await apiClient.authApi()).addProfileCategory({ cat_name: otherCategory?.value ?? '' });
						}
					}
				}

				const response = await (await apiClient.eventsApi()).answerQuestionnaires(code, {
					attendance_status: Number(attendanceStatus),
					questionnaires: questionnairesWithAnswer
				});
				const status = response.status;

				if (status === 200) {
					router.push(`/events/${ code }/success`);
				}
			} catch (error) {
				handleCatchError(error);
			} finally {
				setLoading(false);
			}
		},
	});

	const onSubmitForm = (event: React.SyntheticEvent) => {
		event.preventDefault();

		setEnableValidation(true);
		formik.handleSubmit();
	};
	const renderInput = (props: Form) => {
		const id = props.id;
		const error = formik?.errors[id] as string;
		const isValid = !error;

		return (
			<Formik
				inputProps={ {
					...props,
					className: clsxm(
						'!py-[15px] !px-4 rounded-[7px] !text-steel placeholder:text-light-grey bg-transparent !ring-1 focus:!ring-1 ring-inset focus:ring-inset text-base leading-126%',
						isValid ? 'ring-grey-1 ring-opacity-50 data-[state=open]:ring-steel data-[state=open]:ring-opacity-100 data-[state=open]:ring-inset' : '!ring-red',
						props.type === 'select' ? '' : isValid ? 'focus:ring-steel focus:ring-opacity-100' : 'focus:!ring-red'
					),
					overlappingLabel: true,
					overlappingLabelOnFocus: true
				} }
				formik={ formik }
			/>
		);
	};

	const renderBtnSubmit = () => {
		return (
			<div className='mt-[38px] sm:mt-[34px] flex flex-col gap-[29px] sm:gap-[23px] items-center'>
				<Button
					type='submit'
					disabled={ loading }
					className='btn btn-primary text-base sm:text-sm font-medium leading-126% px-20 sm:px-[60px]'
				>
					RSVP
				</Button>
				<span className='max-w-[287px] sm:max-w-[344px] mx-auto text-center text-sm sm:text-xs leading-126% text-grey-1'>
					{ navigationData.notesRegister ?? 'By registering to this event, the host will receive your contact information such as your name, email and phone number.' }
				</span>
			</div >
		);
	};

	const renderForm = () => {
		const formPropsList = questionnaireForm ?? [];

		return (
			<form
				className='w-full'
				onSubmit={ e => onSubmitForm(e) }
			>
				<div className='flex flex-col gap-8'>
					{ formPropsList?.map((props: Form) => (
						<div key={ props.id }>{ renderInput(props) }</div>
					)) }
				</div>
				<p className='text-steel text-10px mt-[13px] sm:mt-[21px]'>*required answer</p>

				{ renderBtnSubmit() }
			</form>
		);
	};

	return (
		<Layout
			type='webapp'
			data={ navigationData }
			title='Questionnaire'
			showFooter={ false }
			showNavbarWebApp={ false }
		>
			<div className='container-center mt-60px w-full pb-32'>
				<div className='max-w-[542px] mx-auto pt-[27px] lg:pt-[56px]'>
					<h2 className='text-lg sm:text-center sm:text-base leading-[130%] sm:leading-126% font-semibold mb-[35px] !text-steel'>Questions from the Host</h2>
					{ renderForm() }
				</div>
			</div>
		</Layout>
	);
};

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(context.req, context.res, authOptions(context.req?.cookies));
	if (!session?.token) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false,
			},
		};
	}

	const code = context.params?.code ?? '';
	const attendance_status = context.query.attendance_status ?? '';

	try {
		const navigation = await axios.get(endpoints.navigationData);

		const eventDetail = await axios.get<ShowEventByCode200Response>(process.env.NEXT_PUBLIC_BASE_URL_API + `/v1/events/${ code }`,
			{
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
				headers: {
					Authorization: `Bearer ${ session?.token }`
				}
			}
		);

		if (eventDetail.data.data?.attendance_status !== undefined) {
			return {
				redirect: {
					permanent: false,
					destination: `/events/${ code }/success`,
				},
				props: {},
			};
		}

		if (!eventDetail.data.data?.is_questionnaire_active || eventDetail.data.data?.set_questionnaire?.length === 0) {
			const resAnswers = await axios.put(
				process.env.NEXT_PUBLIC_BASE_URL_API + `/v1/events/${ code }/questionnaires`,
				{
					attendance_status: Number(attendance_status),
					questionnaires: []
				},
				{
					httpsAgent: new https.Agent({ rejectUnauthorized: false }),
					headers: {
						Authorization: `Bearer ${ session?.token }`
					},
				}
			);

			const status = resAnswers.status;

			if (status === 200) {
				return {
					redirect: {
						permanent: false,
						destination: `/events/${ code }/success`,
					},
					props: {},
				};
			}
		}

		const categoriesRes = await axios.get<ProfileCategoryList200Response>(process.env.NEXT_PUBLIC_BASE_URL_API + '/v1/categories',
			{
				httpsAgent: new https.Agent({ rejectUnauthorized: false }),
				headers: {
					Authorization: `Bearer ${ session?.token }`
				}
			}
		);

		const form: Form[] = eventDetail.data?.data?.set_questionnaire?.filter((e => e.is_active))?.map((e, idx) => {
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

		return {
			props: {
				navigationData: navigation.data,
				code,
				sessionData: session,
				attendanceStatus: attendance_status,
				eventDetail: eventDetail.data.data,
				questionnaireForm: form,
				categoriesOptions: categoriesRes?.data?.data ?? []
			}
		};
	} catch (error) {
		return {
			props: {
				navigationData: navigationDataLocal,
				code,
				sessionData: session,
				attendanceStatus: attendance_status,
				questionnaireForm: [],
				categoriesOptions: []
			}
		};
	}
};

export default Questionaire;