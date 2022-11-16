<script lang="ts">
	import QueryOne from '$lib/QueryOne.svelte';
	import QueryTwo from '$lib/QueryTwo.svelte';
	import QueryZero from '$lib/QueryZero.svelte';

	let name: string;
</script>

<div>
	<input on:change={(e) => {name = e.target.value}} />

	<QueryZero {name} />
	<QueryOne {name} />
	<QueryTwo {name} />
</div>
