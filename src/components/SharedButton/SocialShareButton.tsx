import React, { Ref } from 'react';

import {
	CustomWindow,
	getPositionOnScreenCenter,
	getPositionOnWindowCenter,
	isPromise,
} from './utils';

{ /* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars, @typescript-eslint/no-unused-vars */ }

type NetworkLink<LinkOptions> = (url: string, options: LinkOptions) => string;

type WindowPosition = 'windowCenter' | 'screenCenter';

interface CustomProps<LinkOptions> {
	children: React.ReactNode;
	/**
	 * Disables click action and adds `disabled` class
	 */
	disabled?: boolean;
	/**
	 * Style when button is disabled
	 * @default { opacity: 0.6 }
	 */
	disabledStyle?: React.CSSProperties;
	forwardedRef?: Ref<HTMLButtonElement>;
	networkName: string;
	networkLink: NetworkLink<LinkOptions>;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>, link: string) => void;
	openShareDialogOnClick?: boolean;
	opts: LinkOptions;
	/**
	 * URL of the shared page
	 */
	url: string;
	style?: React.CSSProperties;
	windowWidth?: number;
	windowHeight?: number;
	windowPosition?: WindowPosition;
	/**
	 *  Takes a function that returns a Promise to be fulfilled before calling
	 * `onClick`. If you do not return promise, `onClick` is called immediately.
	 */
	beforeOnClick?: () => Promise<void> | void;
	/**
	 * Takes a function to be called after closing share dialog.
	 */
	onShareWindowClose?: () => void;
	resetButtonStyle?: boolean;
	blankTarget?: boolean;
}

export type Props<LinkOptions> = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	keyof CustomProps<LinkOptions>
> &
	CustomProps<LinkOptions>;

// eslint-disable-next-line comma-spacing
const SocialShareButton = <LinkOptions,>({
	disabledStyle = { opacity: 0.6 },
	openShareDialogOnClick = true,
	resetButtonStyle = true,
	...props
}: Props<LinkOptions>) => {
	const openShareDialog = (link: string) => {
		const {
			onShareWindowClose,
			windowHeight = 400,
			windowPosition = 'windowCenter',
			windowWidth = 550,
			blankTarget = false,
		} = props;

		const windowConfig = {
			height: windowHeight,
			width: windowWidth,
			...(windowPosition === 'windowCenter'
				? getPositionOnWindowCenter(windowWidth, windowHeight)
				: getPositionOnScreenCenter(windowWidth, windowHeight)),
		};

		CustomWindow(link, windowConfig, blankTarget, onShareWindowClose);
	};

	const handleClick = async(event: React.MouseEvent<HTMLButtonElement>) => {
		const {
			beforeOnClick,
			disabled,
			networkLink,
			onClick,
			url,
			// openShareDialogOnClick,
			opts,
		} = props;

		const link = networkLink(url, opts);

		if (disabled) {
			return;
		}

		event.preventDefault();

		if (beforeOnClick) {
			const returnVal = beforeOnClick();

			if (isPromise(returnVal)) {
				await returnVal;
			}
		}

		if (openShareDialogOnClick) {
			openShareDialog(link);
		}

		if (onClick) {
			onClick(event, link);
		}
	};

	const render = () => {
		const {
			children,
			forwardedRef,
			networkName,
			style,
			...rest
		} = props;

		const newStyle = {
			backgroundColor: 'transparent',
			border: 'none',
			padding: 0,
			font: 'inherit',
			color: 'inherit',
			cursor: 'pointer',
			outline: 'none',
			...style,
		};

		return (
			<button
				aria-label={ rest['aria-label'] ?? networkName }
				onClick={ handleClick }
				ref={ forwardedRef }
				style={ newStyle }
			>
				{ children }
			</button>
		);
	};

	return render();
};

export default SocialShareButton;
