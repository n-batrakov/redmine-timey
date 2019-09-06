import { IncomingTimesheetEntry, NamedId, TimesheetEntry } from 'shared/types';
import { toISODate } from 'shared/date';

export const timeEntryEntity = 'time_entries';

export const mapIncoming = (x: IncomingTimesheetEntry) => ({
    time_entry: {
        hours: x.hours,
        comments: x.comments,
        spent_on: typeof x.spentOn === 'string' ? (<string>x.spentOn).split('T')[0] : toISODate(x.spentOn),
        activity_id: parseInt(x.activity.id, 10),
        issue_id: x.issue === undefined ? undefined : parseInt(x.issue.id, 10),
        project_id: x.project === undefined ? undefined : parseInt(x.project.id, 10),
}});

export const mapOutgoing = (entry: any, issue?: NamedId, host?: string): TimesheetEntry => {
    const getIssue = () => {
        const entryIssue = issue === undefined ? entry.issue as NamedId : issue;
        if (entryIssue === undefined) {
            return undefined;
        }

        const { id, name } = entryIssue;
        const href = `${host}/issues/${id}`;
        return { id, name, href };
    };
    const getProject = () => {
        const { id, name } = <NamedId>entry.project;
        const href = `${host}/projects/${id}`;
        return { id, name, href };
    };

    return {
        id: entry.id.toString(),
        project: getProject(),
        issue: getIssue(),
        user: entry.user,
        activity: entry.activity,
        comments: entry.comments,
        hours: entry.hours,
        spentOn: new Date(entry.spent_on),
    };
};