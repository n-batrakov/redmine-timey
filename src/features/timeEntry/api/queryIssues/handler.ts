import { RegisterHandler } from 'server/shared';
import { authenticate, getCredentials } from 'server/auth';
import { Issue, NamedId } from 'shared/types';
import { isUndefined } from 'util';
import { metadata, QueryIssueRequest } from './contract';

const getProject = ({ id, name }: NamedId, redmineHost: string) => {
    return { id, name, href: `${redmineHost}/projects/${id}` };
};

const mapIssue = (x: any, redmineHost: string): Issue => ({
    id: x.id,
    subject: x.subject,
    description: x.description,
    createdOn: new Date(Date.parse(x.created_on)),
    updatedOn: new Date(Date.parse(x.updated_on)),
    author: x.author,
    assignedTo: x.assignedTo,
    priority: x.priority,
    status: x.status,
    project: getProject(x.project as NamedId, redmineHost),
    parent: x.parent,
    href: `${redmineHost}/issues/${x.id}`,
});

function choose<T>(fn: (x: T) => boolean, a: T, b: T): T {
    return fn(a) ? a : b;
}
const notUndefinedOrEmpty = (str?: string): boolean => !isUndefined(str) && str !== '';
const undefinedIfEmpty = (val: string | undefined) => choose(notUndefinedOrEmpty, val, undefined);

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req);

        const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit, 10);
        const offset = req.query.offset === undefined ? 0 : parseInt(req.query.offset, 10);
        const { project, author, assigned, status, query } = req.query as QueryIssueRequest;

        const response = await redmine.query('issues', {
            limit,
            offset,
            ...auth,
            status_id: choose(notUndefinedOrEmpty, status, '*'),
            assigned_to_id: undefinedIfEmpty(assigned),
            author_id: undefinedIfEmpty(author),
            project_id: undefinedIfEmpty(project),
            query_id: undefinedIfEmpty(query),
        });

        switch (response.code) {
            case 'Success':
                return {
                    ...response,
                    data: response.data.map(x => mapIssue(x, redmine.host))};
            case 'NotAuthenticated':
                resp.code(401);
                return '';
            case 'Error':
                if (response.status === 404) {
                    return {
                        limit, offset,
                        code: 'Success',
                        totalCount: 0,
                        data: [],
                    };
                }
                resp.code(response.status);
                return '';
        }
    },
});

export default handler;