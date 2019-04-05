import { metadata, GetMonthNormResponse } from './contract';
import { ensureSuccessStatusCode, readJson } from '../shared/http';

export const getMonthNorm = async (): Promise<GetMonthNormResponse> => {
    const response = await fetch(metadata.url, { method: metadata.method });

    ensureSuccessStatusCode(response);

    return await readJson(response);
};