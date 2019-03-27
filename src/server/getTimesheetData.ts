import { RedmineClient, RedmineErrorResponse } from './redmine';
import { toISODate } from '../date';
import { NamedId, TimesheetEntry } from '../shared/types';
import { assertNever } from '../shared';

export type TimesheetRequest = {
    limit?: number,
    offset?: number,
    userId?: string,
    projectId?: string,
    from?: Date,
    to?: Date,
    auth?: {
        login: string,
        password: string,
    },
};

export type TimesheetResponse = {
    code: 'Success',
    data: TimesheetEntry[],
    totalCount: number,
    offset: number,
    limit: number,
};

const defaultRequest: TimesheetRequest = {};

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

        const href = `${host}/issues/${id}`;

        return { id, name, href };
    };
    const getProject = () => {
        const { id, name } = <NamedId>entry.project;
        const href = `${host}/projects/${id}`;
        return { id, name, href };
    };

    return {
        id: entry['id'],
        project: getProject(),
        user: <NamedId>entry['user'],
        issue: getIssue(),
        activity: <NamedId>entry['activity'],
        comments: entry['comments'],
        hours: entry['hours'],
        spentOn: new Date(entry['spent_on']),
    };
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