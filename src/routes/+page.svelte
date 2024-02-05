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
</script>

<div class="mx-auto grid justify-center">
	<Tabs.Root value="pomorodo">
		<Tabs.List>
			<Tabs.Trigger value="pomorodo">Pomodoro</Tabs.Trigger>
			<Tabs.Trigger value="break">Break</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="pomorodo">
			<Clock time={$pomodoroTimer} {updateTimers} />
		</Tabs.Content>
		<Tabs.Content value="break">
			<Clock time={$breakTimer} {updateTimers} />
		</Tabs.Content>
	</Tabs.Root>
</div>
