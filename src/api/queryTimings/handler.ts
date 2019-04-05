import { RegisterHandler, authenticate, getCredentials } from '../../server/shared';
import { getTimesheetData } from '../../server/getTimesheetData';
import { metadata } from './contract';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const start = new Date(Date.parse(req.query.start));
        const end = new Date(Date.parse(req.query.end));

        const data = await getTimesheetData(redmine, { auth, from: start, to: end });

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