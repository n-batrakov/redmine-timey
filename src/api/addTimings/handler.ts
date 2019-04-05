import { metadata, AddTimingsResponse } from './contract';
import { RegisterHandler, authenticate, getCredentials } from '../../server/shared';
import { TimesheetEntry } from '../../shared/types';
import { timeEntryEntity, mapIncoming, mapOutgoing } from '../shared/timeEntries';
import { FastifyRequest } from 'fastify';
import { IncomingMessage } from 'http';


type Request = FastifyRequest<IncomingMessage, any, any, any, TimesheetEntry[]>;

const addHandler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req: Request, resp) => {
        const auth = getCredentials(req.headers.authorization);

        const entries = req.body;

        const promises = entries.map(x => redmine.insert(timeEntryEntity, mapIncoming(x), auth));
        const responses = await Promise.all(promises);

        const result: AddTimingsResponse = [];

        let idx = 0;
        for (const x of responses) {
            const entry = entries[idx];
            switch (x.code) {
                case 'Success':
                    result.push({ code: 'Success', entry: mapOutgoing(x.data, entry.issue) });
                    break;
                case 'NotAuthenticated':
                    resp.code(401);
                    return '';
                case 'Error':
                    resp.code(x.status);
                    result.push({
                        entry,
                        code: 'Error',
                        message: `Unable to create entry. Response status code (${x.status}) does not indicate success.`,
                        errors: x.errors,
                    });
                    break;
            }
            idx++;
        }

        return result;
    },
});

export default addHandler;