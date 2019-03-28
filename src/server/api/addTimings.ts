import { RegisterHandler, authenticate, getCredentials } from './shared';
import { TimesheetEntry, TimesheetEntrySchema, NamedId } from '../../shared/types';
import { toISODate } from '../../shared/date';

const entityName = 'time_entries';

const mapIncoming = (x: TimesheetEntry) => ({
    time_entry: {
        hours: x.hours,
        comments: x.comments,
        spent_on: typeof x.spentOn === 'string' ? (<string>x.spentOn).split('T')[0] : toISODate(x.spentOn),
        activity_id: parseInt(x.activity.id, 10),
        issue_id: x.issue === undefined ? undefined : parseInt(x.issue.id, 10),
        project_id: x.project === undefined ? undefined : parseInt(x.project.id, 10),
}});
const mapOutgoing = ({ time_entry: x }: any, issue?: NamedId) => {
    return {
        id: x['id'],
        project: x['project'],
        issue: issue === undefined ? undefined : { id: issue.id, name: issue.name },
        user: x['user'],
        activity: x['activity'],
        comments: x['comments'],
        hours: x['hours'],
        spentOn: new Date(x['spent_on']),
    }
};

type AddResponse = Array<{
    code: 'Success',
    entry: TimesheetEntry,
} | {
    code: 'Error',
    entry: TimesheetEntry,
    message: string,
}>;
export const addHandler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'POST',
    url: '/api/time/',
    preHandler: authenticate,
    schema: {
        body: {
            type: 'array',
            items: {
                ...TimesheetEntrySchema,
                required: [ 'project', 'activity', 'hours', 'comments' ],
            },
        },
    },
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const entries:  TimesheetEntry[] = req.body;

        const promises = entries.map(x => redmine.insert(entityName, mapIncoming(x), auth));
        const responses = await Promise.all(promises);

        const result: AddResponse = [];

        let idx = 0;
        for (const x of responses) {
            const entry = entries[idx];
            switch (x.code) {
                case 'Success':
                    result.push({ code: 'Success', entry: mapOutgoing(x.data, entry.issue) });
                    break;
                case 'NotAuthenticated':
                    resp.code(401);
                    return '';
                case 'Error':
                    resp.code(500);
                    result.push({
                        entry,
                        code: 'Error',
                        message: `Unable to create entry. Response status code (${x.status}) does not indicate success.`,
                    });
                    break;
            }
            idx++;
        }

        return result;
    },
});

export const updateHandler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'PUT',
    url: '/api/time/',
    preHandler: authenticate,
    schema: {
        body: {
            ...TimesheetEntrySchema,
            required: [ 'id' ],
        },
    },
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const entry = mapIncoming(req.body);
        console.log(entry);
        const id = req.body.id;

        const response = await redmine.update(entityName, id, entry, auth);

        switch (response.code) {
            case 'Success':
                resp.code(204);
                return;
            case 'NotAuthenticated':
                resp.code(401);
                return '';
            case 'Error':
                resp.code(response.status);
                return '';
            default:
                resp.code(500);
                return '';
        }
    },
});

export const deleteHandler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'DELETE',
    url: '/api/time/:id',
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const id = req.params.id;

        const response = await redmine.delete(entityName, id, auth);

        switch (response.code) {
            case 'Success':
                resp.code(204);
                return;
            case 'NotAuthenticated':
                resp.code(401);
                return '';
            case 'Error':
                resp.code(response.status);
                return '';
            default:
                resp.code(500);
                return '';
        }
    },
});