import { RequestMetadata } from '../../shared/http';
import schema from '../../shared/schema';

export const metadata: RequestMetadata = {
    method: 'GET',
    url: '/api/time/hours',
    schema: {
        querystring: schema.object(
            {
                start: schema.dateTime(),
                end: schema.dateTime(),
            },
            schema.required('start', 'end')),
    },
};

export type GetDailyHoursRequest = {
    start: Date,
    end: Date,
};

export type GetDailyHoursResponse = Array<{
    count: number,
    date: Date,
}>;