const ServerUrl = 'http://localhost:8081';

export async function fetchWrapper(
	path: string,
	method: string,
	body?: BodyInit | Record<string, unknown>,
	headers: HeadersInit = { 'Content-Type': 'application/json' },
	signal?: AbortSignal
) {
	const resp = await fetch(`${ServerUrl}${path}`, {
		method,
		...(body ? { body: serializeBody(body) } : {}),
		headers,
		signal
	});
	signal?.throwIfAborted();
	if (!resp.ok) {
		const err = new Error();
		(err as any).response = await resp.json();
		return Promise.reject(err);
	}
	return resp.json();
}

export async function* streamingFetchWrapper<T>(
	path: string,
	method: string,
	body?: Record<string, unknown>,
	signal?: AbortSignal
): AsyncGenerator<T> {
	let response: Response;
	try {
		response = await fetch(`${ServerUrl}${path}`, {
			method,
			...(body ? { body: JSON.stringify(body) } : {}),
			headers: { 'Content-Type': 'application/json' },
			signal
		});
	} catch (err) {
		return;
	}
	if (!response.body) {
		return;
	}
	const reader = response.body.getReader();
	const decoder = new TextDecoder();

	let readResult = await reader.read();
	while (!readResult.done && !signal?.aborted) {
		const str = decoder.decode(readResult.value);
		const parts = str.split('\n');
		for (const part of parts) {
			if (part === '') continue;
			try {
				const json = JSON.parse(part);
				yield json;
			} catch (err) {
				console.error(err);
			}
		}
		readResult = await reader.read();
	}
}

function serializeBody(body: BodyInit | Record<string, unknown>): BodyInit {
	return body instanceof FormData ? body : JSON.stringify(body);
}
