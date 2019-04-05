import { RegisterHandler } from '../../server/shared';
import { metadata } from './contract';

const signOutHandler: RegisterHandler = server => server.route({
    ...metadata,
    handler: async (_, resp) => {
        resp.status(401);
        return {};
    },
});

export default signOutHandler;