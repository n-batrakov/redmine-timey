import { metadata } from './contract';
import { RegisterHandler } from 'server/shared';
import { authenticate, getCredentials } from 'server/auth';
import { timeEntryEntity, mapIncoming } from 'server/redmineMappings';

const updateHandler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req);

        const entry = mapIncoming(req.body);
        const id = req.body.id;

        const response = await redmine.update(timeEntryEntity, id, entry, auth);

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

export default updateHandler;