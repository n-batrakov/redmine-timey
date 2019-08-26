import { RequestMetadata } from 'shared/http';
import { TimesheetEntry } from 'shared/types';
import schema from 'shared/schema';

export const metadata: RequestMetadata = {
    method: 'GET',
    url: '/api/time',
    schema: {
        querystring: schema.object(
            {
                start: schema.dateTime(),
                end: schema.dateTime(),
            },
            schema.required('start', 'end'),
        ),
    },
};

export type QueryTimingsRequest = {
    start: Date,
    end: Date,
};

export type QueryTimingResponse = {
    code: 'Success',
    limit: number,
    offset: number,
    totalCount: number,
    data: TimesheetEntry[],
};