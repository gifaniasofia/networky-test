import { Dispatches } from '@/constant';

export default {
	toggleEffect: (isActive?: boolean) => {
		return {
			type: Dispatches.TOGGLE_CREATE_EVENT_EFFECT,
			...typeof isActive !== undefined ? { payload: isActive } : {}
		};
	}
};
