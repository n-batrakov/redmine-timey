import { JsonSchema } from '../schema';
import { NotAuthorizedError } from './errors';

export type RequestMetadata = {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS',
    schema?: {
        body?: JsonSchema,
        querystring?: JsonSchema,
        param?: JsonSchema,
        headers?: JsonSchema,
    },
};

export const isSuccessStatusCode = (response: Response) =>
    response.status >= 200 && response.status < 300;

export const ensureSuccessStatusCode = (response: Response, message?: string) => {
    if (isSuccessStatusCode(response)) {
        return;
    } else if (response.status === 401) {
        throw new NotAuthorizedError();
    } else {
        throw new Error(`Response status code ${response.status} does not indicate success. ${message || ''}`);
    }
};

export const jsonContentType = {
    'Content-Type': 'application/json',
};

export const readJson = (response: Response): Promise<any> => {
    return response.json();
};

const getQueryParams = (obj: any) => {
    const pairs: [string, any][] = Object.entries(obj).filter(x => x[1] !== undefined);
    return new URLSearchParams(pairs);
};
export const formatUrl = (path: string, queryParams?: { [name: string]: any }) => {
    if (queryParams === undefined) {
        return path;
    }
    const query = getQueryParams(queryParams).toString();
    return `${path}?${query}`;
};