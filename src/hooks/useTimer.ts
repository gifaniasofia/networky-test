import { useCallback, useState } from 'react';

const defaultCount = 10;
const intervalGap = 1000;

const useTimer = (count?: number) => {
	const initCounter = count ?? defaultCount;

	const [timerCount, setTimerCount] = useState(initCounter); // in seconds

	const startTimerWrapper = useCallback((func: (intervalfn: NodeJS.Timeout) => void) => { // eslint-disable-line no-unused-vars
		let timeInterval: NodeJS.Timer;
		return () => {
			if (timeInterval) {
				clearInterval(timeInterval);
			}
			setTimerCount(initCounter);
			timeInterval = setInterval(() => {
				func(timeInterval);
			}, intervalGap);
		};
	}, []);

	const startTimer = useCallback(startTimerWrapper((intervalfn: NodeJS.Timeout) => {
		setTimerCount(val => {
			if (val === 0) {
				clearInterval(intervalfn);
				return val;
			}
			return val - 1;
		});
	}), []);

	return { startTimer, timerCount };
};

export default useTimer;
