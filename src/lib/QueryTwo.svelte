<script lang="ts">
	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';
	import type { V1QueryTwoResponse } from '../client/gen';
	import { useBatchingServiceQueryTwo } from '../client/gen';

	export let name: string;

	let twoQuery: UseQueryStoreResult<V1QueryTwoResponse>
	$: twoQuery = useBatchingServiceQueryTwo(name, {
		argTwoZero: 21,
		argTwoOne: "TwoOne",
		argTwoTwo: Math.random() > 0.5,
	});
</script>

<div>
	<span>Two</span>
	<span>
		{#if $twoQuery}
			{#if $twoQuery.isError}
				Error: {$twoQuery.error}
			{:else if $twoQuery.isLoading}
				Loading..
			{:else if $twoQuery.data}
				{$twoQuery.data.respTwoZero}
			{/if}
		{/if}
	</span>
</div>
