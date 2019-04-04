import { RegisterHandler, getCredentials, authenticate } from './shared';
import { Enumeration, EnumerationsLookup } from '../../shared/types';
import { RedmineEnumerationResponse } from '../redmine';

let enumerationsCache: EnumerationsLookup | undefined = undefined;


const mapEnum = (data: Array<{id: number, name: string, is_default?: boolean}>): Enumeration => {
    let defaultValue: string = data[0].id.toString();
    const values = data.reduce<any>(
        (acc, x) => {
            const key = x.id.toString();
            if (x.is_default) {
                defaultValue = key;
            }
            acc[key] = x.name;
            return acc;
        },
        {},
    );

    return { defaultValue, values };
};

const handler: RegisterHandler = (server, { redmine }) => server.route({
    method: 'GET',
    url: '/api/enumerations',
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req.headers.authorization);

        if (enumerationsCache === undefined) {
            console.log('LOAD ENUMS');

            const responses = await Promise.all([
                redmine.getEnumeration('issue_priorities', auth),
                redmine.query('issue_statuses', auth),
                redmine.getEnumeration('time_entry_activities', auth),
            ]);

            for (const response of responses) {
                if (response.code !== 'Success') {
                    resp.code(response.status);
                    return '';
                }
            }

            const [priorities, statuses, activities] = responses as RedmineEnumerationResponse[];
            enumerationsCache = {
                priority: mapEnum(priorities.data),
                status: mapEnum(statuses.data),
                activity: mapEnum(activities.data),
            };
        }

        return enumerationsCache;
    },
});

export default handler;