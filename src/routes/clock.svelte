<script lang="ts">
	import {Button} from '$lib/components/ui/button';
	import {Input} from '$lib/components/ui/input';
	import {Label} from '$lib/components/ui/label';
	import {pomodoroTimer, breakTimer} from '../store/stores.ts';
	import Settings from '../../icons/settings.svg';

	export let timer: number;
	let curTime = timer;
	let intervalId: number;
	let running: boolean = false;

	let tmpPomodoroTimer: number = 0;
	let tmpBreakTimer: number = 0;

	$: {
		console.log(tmpBreakTimer);
		console.log(tmpPomodoroTimer);
	}

	$: minutes = Math.floor(curTime / 60);
	$: seconds = curTime % 60;

	const playAudio = () => {
		let bellAudio = new Audio('../../bell.wav');
		bellAudio.play();
	};

	const startInterval = () => {
		if (running) {
			running = false;
			return;
		}
		running = true;
		if (intervalId) return;
		intervalId = setInterval(() => {
			if (curTime > 0 && running) {
				curTime -= 1;
			} else if (curTime <= 0) {
				running = false;
				clearInterval(intervalId);
				intervalId = 0;
				playAudio();
			}
		}, 1000);
	};

	const resetTime = () => {
		running = false;
		curTime = timer;
	};

	const setTime = () => {
		$pomodoroTimer = tmpPomodoroTimer;
		$breakTimer = tmpBreakTimer;
	};
</script>

<div class="xl:[w-800px] grid rounded-2xl border-2 border-black px-10 pb-5 pt-10 md:w-96 lg:w-[500px]">
	<svg>
		<use xlink:href={Settings} />
	</svg>
	<div class="grid place-items-center rounded-xl">
		<div class="pt-6" />
		<span class="text-8xl">{minutes}:{seconds > 9 ? seconds : `0${seconds}`}</span>
	</div>
	<div class="mb-16" />
	<p class="flex justify-between">
		<!-- Passing in Text such as Start and Reset is casuing error -->
		<Button variant="default" on:click={startInterval}>{running ? 'Pause' : 'Start'}</Button>
		<Button variant="destructive" on:click={resetTime}>Reset</Button>
	</p>
</div>
