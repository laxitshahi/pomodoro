<script lang="ts">
	import Clock from './clock.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import {pomodoroTimer, breakTimer} from '../store/stores';

	const updateTimers = (pTimer: number, bTimer: number) => {
		// This syntax can only be used in const
		// Compiler handles the rest
		$pomodoroTimer = pTimer;
		$breakTimer = bTimer;
		// pomodoroTimer.set(pTimer);
		// breakTimer.set(bTimer);
	};

	let value = 'pomodoro';

	const updateTimerType = () => {
		if (value === 'pomodoro') {
			value = 'break';
		} else if (value === 'break') {
			value = 'pomodoro';
		}
	};
</script>

<div class="mx-auto grid justify-center">
	<Tabs.Root bind:value>
		<Tabs.List>
			<Tabs.Trigger value="pomodoro">Pomodoro</Tabs.Trigger>
			<Tabs.Trigger value="break">Break</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="pomodoro">
			<Clock time={$pomodoroTimer} {updateTimers} {updateTimerType} />
		</Tabs.Content>
		<Tabs.Content value="break">
			<Clock time={$breakTimer} {updateTimers} {updateTimerType} />
		</Tabs.Content>
	</Tabs.Root>
</div>
