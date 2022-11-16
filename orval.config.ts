import { defineConfig } from 'orval';

export default defineConfig({
	api: {
		input: 'server/api/api.swagger.json',
		output: {
			workspace: './src/client/gen/',
			target: 'index.ts',
			client: 'svelte-query',
			mode: 'tags-split',
			mock: false,
			prettier: true,
			override: {
				mutator: {
					path: 'http-client.ts', // Relative to workspace path set above
					name: 'httpClient'
				},
				operations: {
					BatchingService_QueryZero: {
						query: {
							useQuery: true
						}
					},
					BatchingService_QueryOne: {
						query: {
							useQuery: true
						}
					},
					BatchingService_QueryTwo: {
						query: {
							useQuery: true
						}
					},
				}
			}
		}
	}
});
