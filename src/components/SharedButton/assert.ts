{ /* eslint-disable @typescript-eslint/no-explicit-any */ }

class AssertionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AssertionError';
	}
}

const assert = (value: any, message: string) => {
	if (!value) {
		throw new AssertionError(message);
	}
};

export default assert;