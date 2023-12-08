import React, { useCallback, useRef } from 'react';
import ReactTags, { Tag, TagComponentProps } from 'react-tag-autocomplete';

type TagAutocompleteProps = {
	tags: Tag[];
	suggestions?: Tag[];
	onChange: (newTags: Tag[]) => void; // eslint-disable-line no-unused-vars
};

const TagAutocomplete: React.FC<TagAutocompleteProps> = ({
	tags,
	suggestions,
	onChange
}) => {
	const reactTags = useRef<ReactTags | null>(null);

	const onDelete = useCallback((tagIndex: number) => {
		onChange(tags.filter((_, i) => i !== tagIndex));
	}, [tags]);

	const onAddition = useCallback((newTag: Tag) => {
		onChange([...tags, newTag]);
	}, [tags]);

	const renderTagComponent = (props: TagComponentProps) => {
		return (
			<button
				type='button'
				className={ props.classNames.selectedTag }
				onClick={ props.onDelete }>
				<span className='inline-flex items-center gap-2'>
					<span className={ props.classNames.selectedTagName }>{ props.tag.name }</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='11'
						height='11'
						viewBox='0 0 11 11'
						fill='none'>
						<path
							d='M7.71094 2.57227L2.56641 7.7168'
							stroke='#062A30' />
						<path
							d='M7.71094 7.7168L2.56641 2.57227'
							stroke='#062A30' />
					</svg>
				</span>
			</button>
		);
	};

	return (
		<>
			<p className='!text-steel text-xs mb-[7px] leading-120%'>Options</p>

			<ReactTags
				allowNew
				ref={ reactTags }
				tags={ tags }
				suggestions={ suggestions ?? [] }
				minQueryLength={ 1 }
				onDelete={ onDelete }
				onAddition={ onAddition }
				tagComponent={ renderTagComponent }
				classNames={ {
					root: 'relative rounded-[7px] border-[0.5px] border-steel bg-base px-[5px] text-10px leading-120% cursor-text font-barlow',
					rootFocused: 'border-steel',
					selected: 'inline',
					selectedTag: 'inline-block box-border mt-1 mx-[5px] px-[7px] py-[5px] rounded border-[0.5px] border-steel',
					selectedTagName: 'text-steel text-10px leading-120%',
					search: 'react-tags__search',
					searchInput: 'react-tags__search-input',
					suggestions: 'react-tags__suggestions',
					suggestionActive: 'is-active',
					suggestionDisabled: 'is-disabled'
				} }
			/>

			<p className='mt-1.5 text-10px text-grey-1 leading-120%'>Press Enter or Tab key to add a new option.</p>
		</>
	);
};

export default TagAutocomplete;
