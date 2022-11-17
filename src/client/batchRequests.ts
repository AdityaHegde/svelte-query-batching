import { streamingFetchWrapper } from './fetchWrapper';
import type {
	V1QueryBatchResponse,
	V1QueryOneRequest,
	V1QueryRequest,
	V1QueryTwoRequest,
	V1QueryType,
	V1QueryZeroRequest
} from './gen';
import type { V1QueryBatchRequest } from './gen';
import { throttle } from './throttle';

type RespType = Array<[(value: any) => any, (err: any) => any]>;
let responses: RespType = [];
let batchedRequest: V1QueryBatchRequest = {
	queries: []
};
let batchedSignals = new Array<AbortSignal | undefined>();

const throttleCallback = () => {
	sendBatch(batchedRequest, responses, batchedSignals);
	batchedRequest = {
		queries: []
	};
	responses = [];
	batchedSignals = [];
};

export function batchRequests(
	type: V1QueryType,
	request: V1QueryZeroRequest | V1QueryOneRequest | V1QueryTwoRequest,
	signal: AbortSignal | undefined
): Promise<any> {
	return new Promise((resolve, reject) => {
		if (!batchedRequest.queries) {
			batchedRequest.queries = [];
		}

		const req: V1QueryRequest = {
			id: batchedRequest.queries.length,
			type
		};
		switch (type) {
			case 'Zero':
				req.zeroRequest = request;
				break;
			case 'One':
				req.oneRequest = request;
				break;
			case 'Two':
				req.twoRequest = request;
				break;
		}
		batchedRequest.queries.push(req);
		responses.push([resolve, reject]);
		batchedSignals.push(signal);

		throttle(throttleCallback);
	});
}

export async function sendBatch(
	request: V1QueryBatchRequest,
	resp: RespType,
	signals: Array<AbortSignal | undefined>
) {
	const controller = new AbortController();
	const stream = streamingFetchWrapper<V1QueryBatchResponse>(
		'/v1/query/batch',
		'post',
		request as any,
		controller.signal
	);

	signals.forEach((signal) => {
		signal?.addEventListener(
			'abort',
			() => {
				if (controller.signal.aborted) return;
				controller.abort();
				stream.throw(new Error('cancelled'));
			},
			{
				once: true
			}
		);
	});

	const hit = new Set<number>();

	for await (let s of stream) {
		s = s.result as any;
		if (!s?.result) continue;

		const idx = s.result.id ?? 0;
		hit.add(idx);
		if (s.result.error) {
			resp[idx][1](new Error(s.result.error));
			continue;
		}
		resp[idx][0](s.result.zeroResponse ?? s.result.oneResponse ?? s.result.twoResponse);
	}

	for (let i = 0; i < resp.length; i++) {
		if (hit.has(i)) continue;
		resp[i][1](new Error('No response'));
	}
}
