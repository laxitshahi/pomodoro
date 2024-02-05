<script lang="ts">
	import {Button} from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Settings from '../../static/icons/settings.svelte';
	import {pomodoroTimer, breakTimer} from '../store/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import {onMount} from 'svelte';

	export let time: number;
	export let updateTimers: (pTime: number, bTime: number) => void;

	let curTime: number;
	let running: boolean = false;
	let syncWorker: Worker | undefined = undefined;

	// Ensure that curTime is up to date with changes made to time (pomodoro/break)
	$: curTime = time;
	$: minutes = Math.floor(curTime / 60);
	$: seconds = curTime % 60;

	// For new values in settings
	$: newPomodoroMinutes = Math.floor($pomodoroTimer / 60);
	$: newPomodoroSeconds = $pomodoroTimer % 60;
	$: newBreakMinutes = Math.floor($breakTimer / 60);
	$: newBreakSeconds = $breakTimer % 60;

	const inRangeInclusive = (num: number, min: number, max: number) => {
		return num >= min && num <= max;
	};
	$: editButtonIsDisabled =
		inRangeInclusive(newPomodoroMinutes, 0, 99999) &&
			inRangeInclusive(newBreakMinutes, 0, 99999) &&
			inRangeInclusive(newPomodoroSeconds, 0, 59) &&
			inRangeInclusive(newBreakSeconds, 0, 59)
			? false
			: true;

	const playBell = () => {
		let bellAudio = new Audio('../../bell.wav');
		bellAudio.play();
	};

	const playClick = () => {
		let jumpAudio = new Audio('../../click.wav');
		jumpAudio.play();
	};

	const startInterval = () => {
		playClick();
		if (running) {
			syncWorker?.postMessage({message: 'stop', play: {}});
			running = false;
			return;
		}
		running = true;

		// Ensure web worker was loaded
		if (syncWorker) {
			//1. Mesage is post to worker first
			syncWorker.postMessage({message: 'start', payload: {curTime: curTime}});

			//2. then the worker fires a message back
			syncWorker.onmessage = ({data}) => {
				if (syncWorker) {
					curTime = data.payload.curTime;
					if (curTime === 0) {
						playBell();
						running = false;
						syncWorker?.postMessage({message: 'stop', payload: {}});
					}
				}
			};
		}
	};

	const resetTime = async () => {
		playClick();
		running = false;
		curTime = time;
		syncWorker?.postMessage({message: 'stop', payload: {}});
	};

	const updateTimersOnClick = () => {
		if (!editButtonIsDisabled) {
			updateTimers(
				Number(newPomodoroMinutes) * 60 + Number(newPomodoroSeconds),
				Number(newBreakMinutes) * 60 + Number(newBreakSeconds)
			);
		}
	};

	// Load the worker for timer on mount
	const loadWorker = async () => {
		const SyncWorker = await import('$lib/timer.worker.ts?worker');
		syncWorker = new SyncWorker.default();
	};

	onMount(loadWorker);
</script>

<div class="grid rounded-2xl border-black px-10 pb-5 pt-10 shadow-black sm:w-[500px] sm:border-2 md:w-96">
	<AlertDialog.Root>
		<AlertDialog.Trigger class="ml-auto flex justify-end">
			<Settings />
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Settings</AlertDialog.Title>
				<AlertDialog.Description>
					<div class="mx-auto flex justify-between">
						<div class="grid">
							<Label for="pomodoroMinutes">Pomodoro Minutes</Label>
							<div class="pb-2" />
							<Input id="pomodoroMinutes" type="number"
								bind:value={newPomodoroMinutes}></Input>
						</div>
						<div class="px-2 sm:px-0" />
						<div class="px-2" />
						<div class="grid">
							<Label for="pomodoroSeconds">Pomodoro Seconds</Label>
							<div class="pb-2" />
							<Input id="pomodoroSeconds" type="number"
								bind:value={newPomodoroSeconds}></Input>
						</div>
					</div>

					<div class="pb-2" />

					<div class="mx-auto flex justify-between">
						<div class="grid">
							<Label for="breakMinutes">Break Minutes</Label>
							<div class="pb-2" />
							<Input id="breakMinutes" type="number"
								bind:value={newBreakMinutes}></Input>
						</div>
						<div class="px-2 sm:px-0" />
						<div class="grid">
							<Label for="breakSeconds">Break Seconds</Label>
							<div class="pb-2" />
							<Input id="Break " type="number"
								bind:value={newBreakSeconds}></Input>
						</div>
					</div>
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel disabled={editButtonIsDisabled ? true : false}
					class="bg-black text-white" on:click={updateTimersOnClick}>Change
				</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
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
