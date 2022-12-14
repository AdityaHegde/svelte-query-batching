import { batchRequests } from '../batchRequests';
import { fetchWrapper } from '../fetchWrapper';

export const httpClient = async <T>({
	url,
	method,
	params,
	data,
	headers,
	signal
}: {
	url: string;
	method: 'get' | 'post' | 'put' | 'delete' | 'patch';
	params?: any;
	data?: any;
	headers?: any;
	signal?: AbortSignal;
}): Promise<T> => {
	if (url.startsWith('/v1/query/')) {
		const type = url.split('/')[3].replace(/^\w/, (substring) => substring.toUpperCase());
		return batchRequests(type as any, params ?? data, signal);
	}
	return fetchWrapper(url, method, data, headers, signal);
};

export default httpClient;
