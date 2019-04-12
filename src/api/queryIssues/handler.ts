import { RegisterHandler, authenticate, getCredentials } from '../../server/shared';
import { Issue, NamedId } from '../../shared/types';
import { metadata } from './contract';

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

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit, 10);
        const offset = req.query.offset === undefined ? 0 : parseInt(req.query.offset, 10);

        const response = await redmine.query('issues', {
            limit,
            offset,
            ...auth,
            status_id: '*',
            assigned_to_id: 'me',
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
                resp.code(response.status);
                return '';
        }
    },
});

export default handler;