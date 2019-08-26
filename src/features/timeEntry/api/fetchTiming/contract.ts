import { RequestMetadata } from 'shared/http';
import { TimesheetEntry } from 'shared/types';

export const metadata: RequestMetadata = {
    method: 'GET',
    url: '/api/time/:id',
};

export const getPath = (id: string) => `/api/time/${id}`;

export type FetchTimingResponse = {
    code: 'Success',
    data: TimesheetEntry,
} | {
    code: 'Error',
    message: string,
    errors: string[],
};