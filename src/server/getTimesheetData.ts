import { RedmineClient, RedmineErrorResponse } from './redmine';

type NamedId = {id: string, name?: string};

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
}

export type TimesheetEntry = {
    id: string,
    project: NamedId,
    issue: NamedId,
    user: NamedId,
    activity: NamedId,
    hours: number,
    comments: string,
    spentOn: Date,
}

export type TimesheetResponse = {
    code: 'Success',
    data: TimesheetEntry[],
    totalCount: number,
    offset: number,
    limit: number,
};

function toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
}

function mapRedmineDataToTimesheetEntry(entry: any): TimesheetEntry {
    return {
        id: entry['id'],
        project: <NamedId>entry['project'],
        issue: <NamedId>entry['issue'],
        user: <NamedId>entry['user'],
        activity: <NamedId>entry['activity'],
        comments: entry['comments'],
        hours: entry['hours'],
        spentOn: new Date(entry['spent_on']),
    }
}

const defaultRequest: TimesheetRequest = {};

const assertNever = (_: never) => {};

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

    switch(response.code) {
        case 'Success':
            return {
                ...response,
                data: response.data.map(x => mapRedmineDataToTimesheetEntry(x)),
            };
        case 'Error':
        case 'NotAuthenticated':
            return response;
        default:
            assertNever(response);
            throw new Error('Unexpected case.');
    }
}