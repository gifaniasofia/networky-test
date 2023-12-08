export type PortalSelectProps = {
	open: boolean;
	renderTargetElement: () => JSX.Element;
	afterLeave?: () => void;
	children?: React.ReactNode;
};