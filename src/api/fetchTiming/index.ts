import { metadata, FetchTimingResponse, getPath } from './contract';
import { readJson } from '../../shared/http';
import { tryParseDate } from '../../shared/date';

const networkError: FetchTimingResponse = {
    code: 'Error',
    message: 'Unable to fetch entry. Network error.',
    errors: [],
};

const unexpectedResponseError: FetchTimingResponse = {
    code: 'Error',
    message: 'Unexpected server response. This is a bug in out system.',
    errors: [],
};

export const fetchTiming = async (entryId: string): Promise<FetchTimingResponse> => {
    const response = await fetch(getPath(entryId), { method: metadata.method });

    const body: FetchTimingResponse = await readJson(response);

    switch (body.code) {
        case 'Success':
            const spentOn = tryParseDate(body.data.spentOn as any);

            if (spentOn === undefined) {
                return unexpectedResponseError;
            }

            return {
                code: body.code,
                data: { ...body.data, spentOn },
            };
        case 'Error':
            return body;
        default:
            return networkError;
    }
};