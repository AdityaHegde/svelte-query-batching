<script lang="ts">
	import type { UseQueryStoreResult } from '@sveltestack/svelte-query';
	import type { V1QueryOneResponse } from '../client/gen';
	import { useBatchingServiceQueryOne } from '../client/gen';

	export let name: string;

	let oneQuery: UseQueryStoreResult<V1QueryOneResponse>
	$: oneQuery = useBatchingServiceQueryOne(name, {
		argOneZero: "OneZero"
	});
</script>

<div>
	<span>One</span>
	<span>
		{#if $oneQuery}
			{#if $oneQuery.isError}
				Error: {$oneQuery.error}
			{:else if $oneQuery.isLoading}
				Loading..
			{:else if $oneQuery.data}
				{$oneQuery.data.respOneZero} : {$oneQuery.data?.respOneOne}
			{/if}
		{/if}
	</span>
</div>
