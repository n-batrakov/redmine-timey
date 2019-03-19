import { RegisterHandler, authenticate, getCredentials } from './shared';
import { getTimesheetData } from '../getTimesheetData';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'GET',
    url: '/api/time',
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);
        const data = await getTimesheetData(redmine, { auth });

        switch (data.code) {
            case 'Success':
                return data;
            case 'Error':
                resp.code(500);
                return {};
            case 'NotAuthenticated':
                resp.code(401);
                return {};
        }
    },
});

export default handler;