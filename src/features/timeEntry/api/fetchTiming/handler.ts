import { RegisterHandler } from 'server/shared';
import { authenticate, getCredentials } from 'server/auth';
import { mapOutgoing } from 'server/redmineMappings';
import { metadata, FetchTimingResponse } from './contract';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp): Promise<FetchTimingResponse | ''> => {
        const auth = getCredentials(req);
        const id = req.params.id;

        const result = await redmine.getById('time_entries', id, auth);

        switch (result.code) {
            case 'Success':
                const [entry] = Object.values(result.data);
                return {
                    code: 'Success',
                    data: mapOutgoing(entry, undefined, redmine.host),
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