import { TimesheetEntry, TimesheetEntrySchema } from '../../shared/types';
import { RequestMetadata } from '../../shared/http';

export const metadata: RequestMetadata = {
    method: 'POST',
    url: '/api/time',
    schema: {
        body: {
            type: 'array',
            items: {
                ...TimesheetEntrySchema,
                required: ['project', 'activity', 'hours', 'comments'],
            },
        },
    },
};

export type AddTimingsResponse = Array<{
    code: 'Success',
    entry: TimesheetEntry,
} | {
    code: 'Error',
    entry: TimesheetEntry,
    message: string,
    errors: string[],
}>;