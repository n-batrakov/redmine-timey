import { RegisterHandler, authenticate, getCredentials } from './shared';
import { Issue } from '../../shared/types';

const mapIssue = (x: any): Issue => ({
    id: x.id,
    subject: x.subject,
    description: x.description,
    createdOn: new Date(Date.parse(x.created_on)),
    updatedOn: new Date(Date.parse(x.updated_on)),
    author: x.author,
    assignedTo: x.assignedTo,
    priority: x.priority,
    status: x.status,
    project: x.project,
    parent: x.parent,
});

const handler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'GET',
    url: '/api/issue/',
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const response = await redmine.query('issues', {
            limit: 100,
            offset: 0,
            ...auth,
            status_id: '*',
            assigned_to_id: 'me',
        });

        switch (response.code) {
            case 'Success':
                return response.data.map(x => mapIssue(x));
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