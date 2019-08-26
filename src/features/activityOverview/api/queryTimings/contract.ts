import { RequestMetadata } from 'shared/http';
import { TimesheetEntry } from 'shared/types';
import schema from 'shared/schema';
import { EntityList } from 'shared/dataSource';

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

export type QueryTimingResponse = EntityList<TimesheetEntry>;