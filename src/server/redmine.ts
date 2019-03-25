import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';

export type RedminQueryParams = {
    limit?: number,
    offset?: number,
    [key: string]: string | number | boolean | undefined,

    login?: string,
    password?: string,
}

export type RedminQueryResponse = {
    code: 'Success',
    data: any[],
    limit: number,
    offset: number,
    totalCount: number,
};

export type RedmineErrorResponse = {
    code: 'Error' | 'NotAuthenticated',
    status: number,
};

const btoa = (str: string) => Buffer.from(str).toString('base64');

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

        const headers = login !== undefined && password !== undefined 
            ? { 'Authorization': `Basic ${btoa(`${login}:${password}`)}` }
            : { 'X-Redmine-API-Key': this.apiKey };

        const response = await fetch(uri.toString(), {
            headers: <any>headers,
        });

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
            };
        }
    }

    private getQueryParams(obj: any) {
        const pairs = Object
            .entries(obj)
            .filter(x => x[1] !== undefined)
            .map<[string, string]>(([a, b]) => [a, b.toString()]);

        return new URLSearchParams(pairs);
    }
}