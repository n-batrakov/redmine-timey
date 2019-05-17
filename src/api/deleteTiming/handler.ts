import { timeEntryEntity } from '../../server/redmineMappings';
import { RegisterHandler } from '../../server/shared';
import { authenticate, getCredentials } from '../../server/auth';
import { metadata } from './contract';

const deleteHandler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req);

        const id = req.params.id;

        const response = await redmine.delete(timeEntryEntity, id, auth);

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

export default deleteHandler;