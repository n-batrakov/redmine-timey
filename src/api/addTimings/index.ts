import { TimesheetEntry } from '../../shared/types';
import * as http from '../../shared/http';
import { metadata, AddTimingsResponse } from './contract';

export const addTimings = async (entries: TimesheetEntry[]): Promise<AddTimingsResponse> => {
    const response = await fetch(metadata.url, {
        method: metadata.method,
        body: JSON.stringify(entries),
        headers: http.jsonContentType,
    });

    const body: AddTimingsResponse = await http.readJson(response);

    return body.map((result) => {
        if (typeof result.entry.spentOn === 'string') {
            return {
                ...result,
                entry: {
                    ...result.entry,
                    spentOn: new Date(Date.parse(result.entry.spentOn)),
                },
            };
        } else {
            return result;
        }
    });
};