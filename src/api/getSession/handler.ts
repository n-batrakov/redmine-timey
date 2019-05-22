import { metadata, GetSessionResponse } from './contract';
import { RegisterHandler } from '../../server/shared';
import { getCredentials, authenticate } from '../../server/auth';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req): Promise<GetSessionResponse> => {
        const { login } = getCredentials(req);

        server.log.info({ login }, 'USER_SESSION');

        return {
            username: login,
            redmineHost: redmine.host,
        };
    },
});

export default handler;