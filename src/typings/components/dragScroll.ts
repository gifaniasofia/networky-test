export type DragScrollProps = {
	wrapperId: string;
	className?: string;
	children?: React.ReactNode;
	scrollbar?: true | string;
	onScroll?: () => void;
};