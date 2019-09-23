import { RegisterHandler } from 'server/shared';
import { authenticate, getCredentials } from 'server/auth';
import { metadata, FetchTimingResponse } from './contract';
import { getTimeEntry } from 'server/getTimesheetData';
import { assertNever } from 'shared/utils';

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp): Promise<FetchTimingResponse | ''> => {
        const auth = getCredentials(req);
        const entryId = req.params.id;

        const result = await getTimeEntry(redmine, { auth, entryId, includeIssueName: true });

        switch (result.code) {
            case 'Success':
                return result;
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
            default:
                assertNever(result);
                resp.code(500);
                return '';
        }
    },
});

export default handler;