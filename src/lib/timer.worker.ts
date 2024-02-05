let time: number = 3;
let intervalId: number;

onmessage = ({ data }) => {
	const { message, payload } = data;

	if (message === 'stop') {
		clearInterval(intervalId);
		intervalId = 0;
	} else if (message === 'start') {
		time = payload.curTime;
		intervalId = setInterval(() => {
			if (time <= 0 && intervalId) {
				clearInterval(intervalId);
			} else {
				time -= 1;
				postMessage({ message: 'tick', payload: { curTime: time } });
			}
		}, 1000);
	}
};

export {};
