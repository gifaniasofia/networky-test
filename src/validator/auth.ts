import * as yup from 'yup';

export const SignUpSchema = yup.object().shape({
	fname: yup.string()
		.required()
		.label('First name'),
	lname: yup.string()
		.required()
		.label('Last name'),
	email: yup.string().email()
		.required()
		.label('Email')
});