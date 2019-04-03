import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';
const btoa = (str: string) => Buffer.from(str).toString('base64');

export type RedmineRequestParams = {
    login?: string,
    password?: string,
};

export type RedminQueryParams = RedmineRequestParams & {
    limit?: number,
    offset?: number,
    [key: string]: string | number | boolean | undefined,
};

export type RedmineSuccessResponse = {
    code: 'Success',
};

export type RedminQueryResponse = RedmineSuccessResponse & {
    data: any[],
    limit: number,
    offset: number,
    totalCount: number,
};

export type RedmineEnumerationResponse = RedmineSuccessResponse & {
    data: Array<{
        id: number,
        name: string,
        is_default?: boolean,
    }>,
};

export type RedmineErrorResponse = {
    code: 'Error' | 'NotAuthenticated',
    status: number,
    errors: string[],
};

export class RedmineClient {
    public readonly host: string;
    private apiKey?: string;

    constructor(config : {host: string,  apiKey?: string}) {
        this.host = config.host;
        this.apiKey = config.apiKey;
    }

    public async query(entity: string, params?: RedminQueryParams): Promise<RedminQueryResponse | RedmineErrorResponse> {
        const uri = new URL(`${entity}.json`, this.host);

        const { login, password, ...rest } = params || <RedminQueryParams>{};

        if (params !== undefined) {
            uri.search = new URLSearchParams(this.getQueryParams(rest)).toString();
        }

        const response = await fetch(uri.toString(), { headers: this.getHeaders(params) });

        if (response.status === 200) {
            const body = await response.json();

            return {
                code: 'Success',
                data: body[entity],
                limit: body.limit,
                offset: body.offset,
                totalCount: body['total_count'],
            }
        } else {
            return {
                code: response.status === 401 ? 'NotAuthenticated' : 'Error',
                status: response.status,
                errors: [],
            };
        }
    }

    public async getEnumeration(enumeration: string, params?: RedmineRequestParams): Promise<RedmineEnumerationResponse | RedmineErrorResponse> {
        const uri = new URL(`enumerations/${enumeration}.json`, this.host);

        const response = await fetch(uri.toString(), { headers: this.getHeaders(params) });

        if (response.status === 200) {
            const body = await response.json();

            return {
                code: 'Success',
                data: body[enumeration],
            }
        } else {
            return {
                code: response.status === 401 ? 'NotAuthenticated' : 'Error',
                status: response.status,
                errors: [],
            };
        }
    }

    public async insert(entity: string, object: any, params?: RedmineRequestParams):
        Promise<RedmineSuccessResponse & { data: any } | RedmineErrorResponse> {

        const uri = new URL(`${entity}.json`, this.host);

        const response = await fetch(uri.toString(), {
            method: 'POST',
            headers: {
                ...this.getHeaders(params),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        });

        switch (response.status) {
            case 201:
                const body = await response.json();
                return { code: 'Success', data: body };
            case 401:
                return { code: 'NotAuthenticated', status: 401, errors: [] };
            case 422:
                const { errors } = await response.json();
                return { errors, code: 'Error', status: response.status };
            default:
                return { code: 'Error', status: response.status, errors: [] };
        }
    }

    public async update(entity: string, id: string, object: any, params?: RedmineRequestParams): Promise<RedmineSuccessResponse | RedmineErrorResponse> {
        const uri = new URL(`${entity}/${id}.json`, this.host);

        const response = await fetch(uri.toString(), {
            method: 'PUT',
            headers: {
                ...this.getHeaders(params),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
        });

        return this.getResponseCode(response);
    }

    public async delete(entity: string, id: string, params?: RedmineRequestParams): Promise<RedmineSuccessResponse | RedmineErrorResponse> {
        const uri = new URL(`${entity}/${id}.json`, this.host);

        const response = await fetch(uri.toString(), {
            method: 'DELETE',
            headers: this.getHeaders(params)
        });

        return this.getResponseCode(response);
    }

    private getQueryParams(obj: any) {
        const pairs = Object
            .entries(obj)
            .filter(x => x[1] !== undefined)
            .map<[string, string]>(([a, b]) => [a, b.toString()]);

        return new URLSearchParams(pairs);
    }

    private getHeaders(params?: RedmineRequestParams) {
        if (params === undefined) {
            return { 'X-Redmine-API-Key': this.apiKey };
        }

        const { login, password } = params;
        if (login === undefined || password === undefined) {
            return { 'X-Redmine-API-Key': this.apiKey };
        }

        return { 'Authorization': `Basic ${btoa(`${login}:${password}`)}` }
    }

    private getResponseCode({ status } : {status: number}): RedmineSuccessResponse | RedmineErrorResponse {
        if (status >= 200 && status < 300) {
            return { code: 'Success' };
        }
        if (status === 401) {
            return { status, code: 'NotAuthenticated' };
        }

        return { status, code: 'Error' };
    }
}