<script lang="ts">
	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';
	import type { V1QueryZeroResponse } from '../client/gen';
	import { useBatchingServiceQueryZero } from '../client/gen';

	export let name: string;

	let zeroQuery: UseQueryStoreResult<V1QueryZeroResponse>
	$: zeroQuery = useBatchingServiceQueryZero(name, {
		argZeroZero: "ZeroZero",
		argZeroOne: 1,
	});
</script>

<div>
	<span>Zero</span>
	<span>
		{#if $zeroQuery}
			{#if $zeroQuery.isError}
				Error: {$zeroQuery.error}
			{:else if $zeroQuery.isLoading}
				Loading..
			{:else if $zeroQuery.data}
				{$zeroQuery.data.respZeroZero}
			{/if}
		{/if}
	</span>
</div>
