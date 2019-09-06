import { TimesheetEntry, TimesheetEntrySchema, IncomingTimesheetEntry } from 'shared/types';
import { RequestMetadata } from 'shared/http';

export const metadata: RequestMetadata = {
    method: 'POST',
    url: '/api/time',
    schema: {
        body: {
            type: 'array',
            items: {
                ...TimesheetEntrySchema,
                required: ['issue', 'activity', 'hours', 'comments'],
            },
        },
    },
};

export type AddTimingsResponse = Array<{
    code: 'Success',
    entry: TimesheetEntry,
} | {
    code: 'Error',
    entry: IncomingTimesheetEntry,
    message: string,
    errors: string[],
}>;