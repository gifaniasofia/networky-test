import React, { forwardRef, Ref } from 'react';

import SocialShareButton, { Props as ShareButtonProps } from './SocialShareButton';

{ /* eslint-disable @typescript-eslint/no-explicit-any, no-unused-vars */ }

const createShareButton = <
	OptionProps extends Record<string, any>,
	LinkOptions = OptionProps,
>(
		networkName: string,
		link: (url: string, options: LinkOptions) => string,
		optsMap: (props: OptionProps) => LinkOptions,
		defaultProps: Partial<ShareButtonProps<LinkOptions> & OptionProps>,
	) => {
	type Props = Omit<
		ShareButtonProps<LinkOptions>,
		'forwardedRef' | 'networkName' | 'networkLink' | 'opts'
	> &
		OptionProps;

	const CreatedButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
		const opts: any = optsMap(props);
		const passedProps: any = { ...props };

		const optsKeys = Object.keys(opts);
		optsKeys.forEach((key: string) => {
			delete passedProps[key];
		});

		return (
			<SocialShareButton<LinkOptions>
				{ ...defaultProps }
				{ ...passedProps }
				forwardedRef={ ref }
				networkName={ networkName }
				networkLink={ link }
				opts={ optsMap(props) }
			/>
		);
	};

	CreatedButton.displayName = `ShareButton-${ networkName }`;

	return forwardRef(CreatedButton);
};

export default createShareButton;