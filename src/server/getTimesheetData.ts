import { toISODate } from 'shared/date';
import { TimesheetEntry } from 'shared/types';
import { assertNever } from 'shared/utils';
import { RedmineClient, RedmineErrorResponse } from './redmine';
import { mapOutgoing } from './redmineMappings';






export type TimeEntryResponse = {
    code: 'Success',
    data: TimesheetEntry,
};
export type TimeEntryRequest = {
    entryId: string,
    auth?: {
        login: string,
        password?: string,
    },
    includeIssueName?: boolean,
};
export async function getTimeEntry(redmine: RedmineClient, request: TimeEntryRequest): Promise<TimeEntryResponse | RedmineErrorResponse> {
    const { entryId, auth } = request || defaultRequest;
    const { login, password } = auth || { login: undefined, password: undefined };

    const response = await redmine.getById('time_entries', entryId, { login, password });

    switch (response.code) {
        case 'Success':
            const entry: any = Object.values(response.data)[0];
            if (entry.issue === undefined || request.includeIssueName !== true) {
                return {
                    code: 'Success',
                    data: mapRedmineDataToTimesheetEntry(entry, {}, redmine.host),
                };
            } else {
                const issueId = entry.issue.id;
                const issues = await fetchIssues(redmine, [issueId], login, password);
                return {
                    code: 'Success',
                    data: mapRedmineDataToTimesheetEntry(entry, issues, redmine.host),
                };
            }
        case 'Error':
        case 'NotAuthenticated':
            return response;
        default:
            assertNever(response);
            throw new Error('Unexpected case.');
    }
}


export type TimesheetResponse = {
    code: 'Success',
    data: TimesheetEntry[],
    totalCount: number,
    offset: number,
    limit: number,
};
export type TimesheetRequest = {
    limit?: number,
    offset?: number,
    userId?: string,
    projectId?: string,
    from?: Date,
    to?: Date,
    auth?: {
        login: string,
        password?: string,
    },
};
const defaultRequest: TimesheetRequest = {};

export async function getTimesheetData(redmine: RedmineClient, request?: TimesheetRequest): Promise<TimesheetResponse | RedmineErrorResponse> {
    const { userId, projectId, from, to, limit, offset, auth } = request || defaultRequest;
    const { login, password } = auth || { login: undefined, password: undefined };

    const response = await redmine.query('time_entries', {
        login,
        password,
        limit,
        offset,
        user_id: userId || 'me',
        project_id: projectId,
        from: from === undefined ? undefined : toISODate(from),
        to: to === undefined ? undefined : toISODate(to),
    });

    switch (response.code) {
        case 'Success':
            const issuesIds = response.data.filter(x => x.issue !== undefined).map(x => x.issue.id);
            const issues = await fetchIssues(redmine, issuesIds, login, password);
            return {
                ...response,
                data: response.data.map(x => mapRedmineDataToTimesheetEntry(x, issues, redmine.host)),
            };
        case 'Error':
        case 'NotAuthenticated':
            return response;
        default:
            assertNever(response);
            throw new Error('Unexpected case.');
    }
}


async function fetchIssues(redmine: RedmineClient, ids: string[], login?: string, password?: string) {
    const limit = 100;
    const batches = batch(ids, limit);

    const promises = batches.map(async (idsBatch) => {
        const response = await redmine.query('issues', {
            login,
            password,
            limit,
            issue_id: idsBatch.join(','),
            status_id: '*',
        });

        if (response.code === 'Success') {
            return response.data;
        } else {
            return [];
        }
    });

    const issues = new Array<{id: string, subject: string}>().concat(...(await Promise.all(promises)));

    return issues.reduce<any>(
        (acc, x) => {
            acc[x.id] = x;
            return acc;
        },
        {});
}

function batch<T>(source: T[], batchSize: number): T[][] {
    const batchesCount = Math.ceil(source.length / batchSize);

    return new Array(batchesCount).fill(undefined).map((_, i) => {
        const start = batchSize * i;
        const end = start + batchSize - 1;
        return source.slice(start, end);
    });
}

function mapRedmineDataToTimesheetEntry(entry: any, issues: {[key: string]: {subject: string}}, host: string): TimesheetEntry {
    const getIssue = () => {
        if (entry.issue === undefined) {
            return undefined;
        }

        const id = entry.issue.id;
        const { subject: name } = issues[id] || { subject: undefined };

        return { id, name };
    };

    return mapOutgoing(entry, getIssue(), host);
}