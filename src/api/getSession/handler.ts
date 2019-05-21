import { metadata, GetSessionResponse } from './contract';
import { RegisterHandler } from '../../server/shared';
import { getCredentials } from '../../server/auth';

const handler: RegisterHandler = (server, { }) => server.route({
    ...metadata,
    handler: async (req): Promise<GetSessionResponse> => {
        const { login } = getCredentials(req);

        return {
            username: login,
        };
    },
});

export default handler;