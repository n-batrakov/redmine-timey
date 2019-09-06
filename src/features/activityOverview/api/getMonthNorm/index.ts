import { metadata, GetMonthNormResponse, GetMonthNormRequest } from './contract';
import { ensureSuccessStatusCode, readJson, formatUrl } from 'shared/http';

export const getMonthNorm = async (params: GetMonthNormRequest): Promise<GetMonthNormResponse> => {
    const { year, month } = params;
    const url = formatUrl(metadata.url, {
        year,
        month: month + 1,
    });

    const response = await fetch(url, { method: metadata.method });

    ensureSuccessStatusCode(response);

    return await readJson(response);
};