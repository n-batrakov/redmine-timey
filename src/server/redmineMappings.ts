import { IncomingTimesheetEntry, NamedId } from '../shared/types';
import { toISODate } from '../shared/date';

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

export const mapOutgoing = ({ time_entry: x }: any, issue?: NamedId) => {
    return {
        id: x['id'],
        project: x['project'],
        issue: issue === undefined ? x['issue'] : { id: issue.id, name: issue.name },
        user: x['user'],
        activity: x['activity'],
        comments: x['comments'],
        hours: x['hours'],
        spentOn: new Date(x['spent_on']),
    };
};