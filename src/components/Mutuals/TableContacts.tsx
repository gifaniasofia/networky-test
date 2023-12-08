import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';

import { screens } from '@/helpers/style';
import { useWindowDimensions } from '@/hooks';
import { IEvent } from '@/interfaces';
import { MutualsTypes } from '@/typings';

import DescribeTags from '../DescribeTags';
import Spinner from '../Spinner';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

// const TriangleLeft = (props?: React.SVGProps<SVGSVGElement>) => (
// 	<svg
// 		xmlns='http://www.w3.org/2000/svg'
// 		width='9'
// 		height='13'
// 		viewBox='0 0 9 13'
// 		fill='currentColor'
// 		{ ...props }>
// 		<path
// 			d='M5.66234e-07 6.5L8.25 0.00480947L8.25 12.9952L5.66234e-07 6.5Z'
// 			fill='currentColor' />
// 	</svg>
// );

const columns = [
	'Basic Info',
	'Email',
	'Category',
	// 'Company',
	'Phone',
	// 'Events',
	'Date Added'
];

const TableContacts: React.FC<MutualsTypes.TableContactsProps> = ({
	loading,
	data,
	onClickRow
}) => {
	const windowDimensions = useWindowDimensions();
	const isMobile = windowDimensions?.width < screens.md;
	// const renderButtonPagination = (type: 'prev' | 'next') => {
	// 	const iconClassName = clsxm(
	// 		type === 'next' ? 'rotate-180' : '',
	// 		'flex-shrink-0 text-steel md:text-soft-blue-2'
	// 	);

	// 	return (
	// 		<Button
	// 			type='button'
	// 			className='bg-soft-blue-3 md:bg-white md:bg-opacity-50 rounded-[3px] w-[25px] h-[25px] flex items-center justify-center'
	// 		>
	// 			<TriangleLeft className={ iconClassName } />
	// 		</Button>
	// 	);
	// };

	const renderData = () => {
		if (loading) {
			return (
				<div className='flex flex-col items-center justify-center my-24'>
					<Spinner className='text-purple w-8 h-8' />
				</div>
			);
		}

		if (!data?.length && !loading) {
			return (
				<div className='flex flex-col items-center justify-center my-24'>
					<p>You have no contacts yet</p>
				</div>
			);
		}

		return (
			<table className='w-full text-left border-separate -my-[8px] md:-my-[5px] border-spacing-y-[8px] md:border-spacing-y-[5px]'>
				<thead className='uppercase max-md:hidden text-left text-10px font-semibold leading-[83%] -tracking-[0.15px]'>
					<tr>
						{ columns.map((columnName: string) => (
							<th
								key={ columnName }
								scope='col'
								className='py-15px px-3'
							>
								{ columnName }
							</th>
						)) }
					</tr>
				</thead>
				<tbody>
					{ data?.map((person: IEvent.ContactRespExt) => {
						return (
							<tr
								key={ person.profile_id }
								className='md:bg-super-light-grey md:hover:bg-med-grey/20 cursor-pointer text-xs leading-[83%] -tracking-[0.18px] rounded-lg'
								onClick={ () => onClickRow(person, 'guest') }
							>
								<td className='relative md:py-2 pr-3 md:px-3 text-sm font-semibold -tracking-[0.21px] rounded-l-lg'>
									<span className='flex items-center gap-2.5 sm:gap-3'>
										<span className='relative overflow-hidden w-[25px] h-[25px] rounded-full flex-shrink-0 bg-grey-1'>
											{ person.avatar && (
												<Image
													src={ person.avatar }
													alt=''
													sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
													fill
												/>
											) }
										</span>
										<span>{ person.fname } { person.lname }</span>
									</span>
								</td>
								<td className='hidden px-3 md:py-2 md:table-cell'>{ person.email || '-' }</td>
								<td className='px-[9px] md:px-3 md:py-2 md:table-cell md:max-w-[200px]'>
									{ person.categories?.length
										? (
											<DescribeTags
												tags={ (person.categories ?? [])?.map(category => category?.cat_name ?? '') }
												tagClassName='md:!text-[10px] md:leading-[83%] md:-tracking-[0.015em]'
												wrapperTagClassName='md:!bg-light-grey md:!rounded-[2px]'
												maxShowLength={ isMobile ? 1 : 6 }
												className='md:justify-start md:gap-y-[3px]'
											/>
										)
										: <span className='max-md:hidden'>-</span> }
								</td>
								{ /* <td className='hidden px-3 md:py-2 md:table-cell'>{ person.company }</td> */ }
								<td className='hidden px-3 md:py-2 md:table-cell'>{ person.phone }</td>
								{ /* <td className='hidden px-3 md:py-2 md:table-cell'>
										<span className='flex items-center gap-2 flex-wrap'>
											{ person.events.length }
											<span className='text-10px underline'>
												see details
											</span>
										</span>
									</td> */ }
								<td className='hidden px-3 md:py-2 md:table-cell rounded-r-lg'>{ person.created_at ? format(new Date(person.created_at), 'dd/MM/yyyy') : '-' }</td>
								<td className='md:hidden relative pl-0.5 py-3 flex items-center justify-end'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='8'
										height='13'
										viewBox='0 0 8 13'
										fill='none'>
										<path
											d='M0.999999 12L7 6.5L1 1'
											stroke='#999999' />
									</svg>
								</td>
							</tr>
						);
					}) }
				</tbody>
			</table>
		);
	};

	return (
		<div className='container-center mt-60px w-full text-steel pb-[137px] md:pb-[104px]'>
			<div className='flex justify-between items-center pt-5 md:pt-[26px]'>
				<div className='flex gap-[11px] md:gap-7 items-baseline max-sm:justify-between w-full'>
					<h1 className='text-heading-3 sm:text-heading-4'>My Contacts</h1>
					{ !loading && (
						<p className='text-sm leading-[83%] -tracking-[0.21px]'>
							{ data?.length ?? '0' } People
						</p>
					) }
				</div>
				{ /* <div className='flex items-center gap-[5px]'>
					{ renderButtonPagination('prev') }
					{ renderButtonPagination('next') }
				</div> */ }
			</div>
			<div className='mt-6 md:mt-[26px] flow-root overflow-hidden'>
				{ renderData() }
			</div>
		</div>
	);
};

export default TableContacts;
