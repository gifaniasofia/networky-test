import React, {
	useMemo,
	useRef,
	useState
} from 'react';
import { Modifier, usePopper } from 'react-popper';
import { Portal, Transition } from '@headlessui/react';

import { PortalSelectTypes } from '@/typings';

{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

const PortalSelect: React.FC<PortalSelectTypes.PortalSelectProps> = ({
	open,
	renderTargetElement,
	afterLeave,
	children
}) => {
	const popperElRef = useRef<any>(null);
	const targetElement = useRef<any>(null);

	const [popperElement, setPopperElement] = useState<any>(null);
	const modifiers: Partial<Modifier<string, object>>[] = useMemo(() => [
		{
			name: 'sameWidth',
			enabled: true,
			fn: ({ state }: any) => {
				state.styles.popper.width = `${ state.rects.reference.width }px`;
			},
			phase: 'beforeWrite',
			requires: ['computeStyles']
		}, {
			name: 'offset',
			options: { offset: [0, 8] }
		}
	], []);

	const { styles, attributes } = usePopper(targetElement?.current, popperElement, {
		placement: 'bottom-start',
		modifiers
	});

	return (
		<>
			<div
				ref={ targetElement }
				className='w-full h-full'>
				{ renderTargetElement() }
			</div>

			<Portal>
				<div
					ref={ popperElRef }
					style={ styles.popper }
					{ ...attributes.popper }
				>
					<Transition
						show={ open }
						unmount={ false }
						enter='transition ease-out duration-100'
						enterFrom='transform opacity-0 scale-95'
						enterTo='transform opacity-100 scale-100'
						leave='transition ease-in duration-75'
						leaveFrom='transform opacity-100 scale-100'
						leaveTo='transform opacity-0 scale-95'
						beforeEnter={ () => setPopperElement(popperElRef.current) }
						afterLeave={ () => {
							setPopperElement(null);

							if (afterLeave) afterLeave();
						} }
					>
						{ children }
					</Transition>
				</div>
			</Portal>
		</>
	);
};

export default PortalSelect;
