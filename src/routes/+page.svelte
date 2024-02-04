<script lang="ts">
	import Clock from './clock.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import {pomodoroTimer, breakTimer} from '../store/stores.ts';
</script>

<div class="mx-auto grid justify-center">
	<Tabs.Root value="pomorodo" class="w-[400px]">
		<Tabs.List>
			<Tabs.Trigger value="pomorodo">Pomodoro</Tabs.Trigger>
			<Tabs.Trigger value="break">Break</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="pomorodo">
			<Clock timer={$pomodoroTimer} />
		</Tabs.Content>
		<Tabs.Content value="break">
			<Clock timer={$breakTimer} />
		</Tabs.Content>
	</Tabs.Root>
	<div>Tasks</div>
</div>
