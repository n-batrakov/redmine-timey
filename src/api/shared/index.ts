import { JsonSchema } from '../../schema';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type RequestMetadata = {
    url: string,
    method: HttpMethod,
    schema?: {
        body?: JsonSchema,
        querystring?: JsonSchema,
        param?: JsonSchema,
        headers?: JsonSchema,
    },
};