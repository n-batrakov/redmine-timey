import { RequestMetadata } from 'shared/http';
import { RedmineErrorResponse } from 'server/redmine';
import schema from 'shared/schema';

export const metadata: RequestMetadata = {
    url: '/api/time/norm',
    method: 'GET',
    schema: {
        querystring: schema.object(
            {
                year: schema.int(),
                month: schema.int(),
            },
            schema.required('year', 'month')),
    }
};

export type GetMonthNormRequest = {
    year: number,
    month: number,
};

export type GetMonthNormResponse = RedmineErrorResponse | {
    code: 'Success',
    data: { actualValue: number, expectedValue: number },
};