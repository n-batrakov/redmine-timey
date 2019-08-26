import { metadata, GetEnumerationsResponse } from './contract';
import { ensureSuccessStatusCode, readJson } from 'shared/http';

let enumerationsCache: GetEnumerationsResponse | undefined = undefined;

export const getEnumerations = async (): Promise<GetEnumerationsResponse> => {
    if (enumerationsCache === undefined) {
        const response = await fetch(metadata.url, { method: metadata.method });

        ensureSuccessStatusCode(response);

        const body = await readJson(response);
        enumerationsCache = body as GetEnumerationsResponse;
    }

    return enumerationsCache;
};