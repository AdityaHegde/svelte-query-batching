<script lang="ts">
	import QueryOne from '$lib/QueryOne.svelte';
	import QueryTwo from '$lib/QueryTwo.svelte';
	import QueryZero from '$lib/QueryZero.svelte';
	import { useQueryClient } from '@sveltestack/svelte-query';
	import {
		getBatchingServiceQueryOneQueryKey,
		getBatchingServiceQueryTwoQueryKey,
		getBatchingServiceQueryZeroQueryKey
	} from '../client/gen';

	let name: string;

	const query = useQueryClient();

	function invalidateQueries() {
		query.refetchQueries([
			getBatchingServiceQueryZeroQueryKey(name, undefined),
			getBatchingServiceQueryOneQueryKey(name, undefined),
			getBatchingServiceQueryTwoQueryKey(name, undefined)
		])
	}
</script>

<div>
	<input on:change={(e) => {name = e.target.value}} />
	<button on:click={invalidateQueries}>Refresh</button>

	<QueryZero name={name + "_0"} />
	<QueryOne name={name + "_0"} />
	<QueryTwo name={name + "_0"} />

	<QueryZero name={name + "_1"} />
	<QueryOne name={name + "_1"} />
	<QueryTwo name={name + "_1"} />

	<QueryZero name={name + "_2"} />
	<QueryOne name={name + "_2"} />
	<QueryTwo name={name + "_2"} />

	<QueryZero name={name + "_3"} />
	<QueryOne name={name + "_3"} />
	<QueryTwo name={name + "_3"} />

	<QueryZero name={name + "_4"} />
	<QueryOne name={name + "_4"} />
	<QueryTwo name={name + "_4"} />
</div>
