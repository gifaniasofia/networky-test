export const classNames = (...classes: (false | null | undefined | string)[]) => {
	return classes.filter(Boolean).join(' ');
};

export const screens = {
	xxs: 300,
	xs: 450,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280
};

export const getNumofCols = (numCols: number) => {
	return 'grid-cols-' + numCols;
};