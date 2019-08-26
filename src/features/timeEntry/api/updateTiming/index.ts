import { TimesheetEntry } from 'shared/types';
import { jsonContentType, ensureSuccessStatusCode } from 'shared/http';
import { metadata } from './contract';

export const updateTiming = async (entry: TimesheetEntry): Promise<void> => {
    const response = await fetch(metadata.url, {
        method: metadata.method,
        body: JSON.stringify(entry),
        headers: jsonContentType,
    });

    ensureSuccessStatusCode(response);
};