import { RegisterHandler } from '../../server/shared';
import { authenticate, getCredentials } from '../../server/auth';
import { metadata, FetchTimingResponse } from './contract';
import { mapOutgoing } from '../../server/redmineMappings';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp): Promise<FetchTimingResponse | ''> => {
        const auth = getCredentials(req);
        const id = req.params.id;

        const entry = await redmine.getById('time_entries', id, auth);

        switch (entry.code) {
            case 'Success':
                return {
                    code: 'Success',
                    data: mapOutgoing(entry.data),
                };
            case 'NotAuthenticated':
                resp.code(401);
                return '';
            case 'Error':
                resp.code(entry.status);
                return {
                    code: 'Error',
                    errors: entry.errors,
                    message: `Unable to fetch entry. Response status code (${entry.status}) does not indicate success.`,
                };
        }
    },
});

export default handler;