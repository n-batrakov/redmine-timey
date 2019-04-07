import { TimesheetEntry } from '../../shared/types';
import * as http from '../../shared/http';
import { metadata, AddTimingsResponse } from './contract';

export const addTimings = async (entries: TimesheetEntry[]): Promise<AddTimingsResponse> => {
    const response = await fetch(metadata.url, {
        method: metadata.method,
        body: JSON.stringify(entries),
        headers: http.jsonContentType,
    });

    return await http.readJson(response);
};