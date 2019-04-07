import { GetDailyHoursRequest, GetDailyHoursResponse, metadata } from './contract';
import { formatUrl, ensureSuccessStatusCode, readJson } from '../../shared/http';

export const getDailyHours = async (req: GetDailyHoursRequest): Promise<GetDailyHoursResponse> => {
    const response = await fetch(formatUrl(metadata.url, req), { method: metadata.method });

    ensureSuccessStatusCode(response);

    const body = await readJson(response);

    const result: GetDailyHoursResponse = body.map((x: any) => {
        const date = new Date(Date.parse(x.date));
        const count = x.count;

        return { date, count };
    });

    return result;
};