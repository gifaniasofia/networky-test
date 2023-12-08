import React from 'react';
import Link from 'next/link';

import { regex } from '@/constant';
import { isJson } from '@/helpers/misc';
import { QuestionAnswerReq } from '@/openapi';
import { MutualsTypes } from '@/typings';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const QuestionnaireList: React.FC<MutualsTypes.BoxEventDetailProps> = ({ eventDetail }) => {
	const renderQuestionnaireTitle = () => {
		return (
			<span className='text-sm font-semibold !text-steel leading-140%'>
				Event Questionnaires
			</span>
		);
	};

	const parseAnswer = (answer: string) => {
		if (isJson(answer)) {
			const answerParsed = JSON.parse(answer);

			if (Array.isArray(answerParsed)) return answerParsed?.join(', ');
			return `${ answerParsed }`;
		}

		return answer;
	};

	const renderAnswer = (answer: string) => {
		const questionnaireAnswer = parseAnswer(answer) || '-';

		if (questionnaireAnswer && regex.url.test(questionnaireAnswer)) {
			return (
				<Link
					href={ questionnaireAnswer }
					target='_blank'
					rel='noopener noreferrer'
					className='text-sm text-steel hover:underline'
				>
					{ questionnaireAnswer }
				</Link>
			);
		}

		return <p className='text-sm text-steel'>{ questionnaireAnswer }</p>;
	};

	const renderQuestionnaire = () => {
		if (eventDetail?.questionnaire_answers?.length) {
			return (
				<div className='md:py-[9px]'>
					<div className='flex flex-col text-left md:max-h-[30vh] md:overflow-y-auto custom-scrollbar'>
						{ eventDetail?.questionnaire_answers?.map((questionnaire: QuestionAnswerReq, questionnaireIdx: number) => {
							return (
								<div
									key={ questionnaireIdx }
									className='flex flex-col gap-y-[5px] pt-2.5 pb-[13px] border-b border-grey-1/30'
								>
									<p className='text-grey-2 text-xs'>{ questionnaire.question }</p>
									<span className='flex'>
										{ renderAnswer(questionnaire.answer ?? '') }
									</span>
								</div>
							);
						}) }
					</div>
				</div>
			);
		}

		return (
			<div className='mt-1 md:mt-2.5'>
				<p className='text-sm md:text-xs text-grey-1'>You disabled questionnaires on this event.</p>
			</div>
		);
	};

	return (
		<div>
			{ renderQuestionnaireTitle() }
			{ renderQuestionnaire() }
		</div>
	);
};

export default QuestionnaireList;