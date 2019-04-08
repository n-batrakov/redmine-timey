import { metadata, QueryTimingsRequest, QueryTimingResponse } from './contract';
import { ensureSuccessStatusCode, readJson, formatUrl } from '../../shared/http';
import { TimesheetEntry } from '../../shared/types';

export const queryTimings = async (req: QueryTimingsRequest): Promise<QueryTimingResponse> => {
    const query = {
        start: req.start.toISOString(),
        end: req.end.toISOString(),
    };
    const response = await fetch(formatUrl(metadata.url, query), { method: metadata.method });

    ensureSuccessStatusCode(response);

    const body = await readJson(response);

    const data: TimesheetEntry[] = body.data.map((item: any) => {
        const { spentOn, ...rest } = item;
        return <TimesheetEntry>{
            ...rest,
            spentOn: new Date(Date.parse(spentOn)),
        };
    });

    return { ...body, data };
};