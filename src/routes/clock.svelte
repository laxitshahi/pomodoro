<script lang="ts">
	import {Button} from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Settings from '../../static/icons/settings.svelte';
	import {pomodoroTimer, breakTimer} from '../store/stores';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let time: number;
	export let updateTimers: (pTime: number, bTime: number) => void;

	let curTime: number;

	let intervalId: number;
	let running: boolean = false;

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
		curTime = time;
	};

	const updateTimersOnClick = () => {
		if (!editButtonIsDisabled) {
			updateTimers(
				Number(newPomodoroMinutes) * 60 + Number(newPomodoroSeconds),
				Number(newBreakMinutes) * 60 + Number(newBreakSeconds)
			);
		}
	};
</script>

<div class="xl:[w-800px] grid rounded-2xl border-2 border-black px-10 pb-5 pt-10 md:w-96 lg:w-[500px]">
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
