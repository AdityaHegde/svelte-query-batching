<script lang="ts">
	import Root from '$lib/Root.svelte';
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retryDelay: 10000,
				refetchInterval: Infinity,
				refetchOnMount: false,
				refetchOnReconnect: false,
				refetchOnWindowFocus: false,
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<Root />
</QueryClientProvider>
