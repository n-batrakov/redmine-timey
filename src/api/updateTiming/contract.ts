import { TimesheetEntrySchema } from '../../shared/types';
import { RequestMetadata } from '../shared';

export const metadata: RequestMetadata = {
    method: 'PUT',
    url: '/api/time',
    schema: {
        body: {
            ...TimesheetEntrySchema,
            required: ['id'],
        },
    },
};