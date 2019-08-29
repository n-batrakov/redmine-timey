import { RegisterHandler } from 'server/shared';
import { authenticate, getCredentials } from 'server/auth';
import { metadata, FetchIssueResponse } from './contract';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp): Promise<FetchIssueResponse | ''> => {
        const auth = getCredentials(req);
        const id = req.params.id;

        const result = await redmine.getById('issues', id, auth);

        switch (result.code) {
            case 'Success':
                const [entry] = Object.values(result.data);
                return {
                    code: 'Success',
                    data: entry,
                };
            case 'NotAuthenticated':
                resp.code(401);
                return '';
            case 'Error':
                resp.code(result.status);
                return {
                    code: 'Error',
                    errors: result.errors,
                    message: `Unable to fetch entry. Response status code (${result.status}) does not indicate success.`,
                };
        }
    },
});

export default handler;