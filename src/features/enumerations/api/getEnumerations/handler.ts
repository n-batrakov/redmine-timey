import { RegisterHandler } from 'server/shared';
import { authenticate, getCredentials } from 'server/auth';
import { Enumeration, EnumerationsLookup } from 'shared/types';
import { RedmineEnumerationResponse, RedmineClient, RedminQueryParams, RedminQueryResponse } from 'server/redmine';
import { metadata } from './contract';

let enumerationsCache: Partial<EnumerationsLookup> | undefined = undefined;


const mapEnum = (data: Array<{id: number, name: string, is_default?: boolean}>): Enumeration => {
    if (data.length === 0) {
        return { defaultValue: '', values: {} };
    }
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

const mapUsers = (data: Array<{ id: number, firstname: string, lastname: string }>): Enumeration => {
    const defaultValue = '';

    if (data.length === 0) {
        return { defaultValue, values: {} };
    }

    const values = data.reduce<any>(
        (acc, x) => {
            acc[x.id] = `${x.firstname} ${x.lastname}`;

            return acc;
        },
        {},
    );

    return { defaultValue, values };
};

const fetchCachedEnumerations = async (redmine: RedmineClient, auth: { login: string, password?: string }): Promise<Partial<EnumerationsLookup>> => {
    const params = {
        ...auth,
        limit: 100,
    };

    const responses = await Promise.all([
        redmine.getEnumeration('issue_priorities', params),
        redmine.query('issue_statuses', params),
        redmine.getEnumeration('time_entry_activities', params),
        queryOrIgnore(redmine, 'users', { limit: 100 }),
    ]);

    for (const response of responses) {
        if (response.code !== 'Success') {
            throw new Error(
                `Unable to fulfil the enumerations cache. Server responded with ${response.status}:\n(${response.errors.join('\n')})`,
            );
        }
    }

    const [priorities, statuses, activities, users] = responses as RedmineEnumerationResponse[];

    return {
        priority: mapEnum(priorities.data),
        status: mapEnum(statuses.data),
        activity: mapEnum(activities.data),
        users: mapUsers(users.data as any),
    };
};

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    preHandler: authenticate,
    handler: async (req, resp) => {
        const auth = getCredentials(req);

        if (enumerationsCache === undefined) {
            enumerationsCache = await fetchCachedEnumerations(redmine, auth);
        }

        const cachedEnums$ = enumerationsCache === undefined ? fetchCachedEnumerations : enumerationsCache;
        const userQueries$ = queryOrThrow(redmine, 'queries', { ...auth, limit: 100 });
        const userProjects$ = queryOrThrow(redmine, 'projects', { ...auth, limit: 100 });

        const [cachedEnums, userQueries, userProjects] = await Promise.all(
              [cachedEnums$, userQueries$, userProjects$],
        );

        return {
            ...cachedEnums,
            queries: mapEnum(userQueries.data),
            projects: mapEnum(userProjects.data),
        } as EnumerationsLookup;
    },
});

export default handler;



async function queryOrThrow(redmine: RedmineClient, entity: string, params?: RedminQueryParams) {
    const response = await redmine.query(entity, params);
    switch (response.code) {
        case 'Error':
            throw new Error(`Unable to load ${entity} - server responded with ${response.status}:\n${response.errors.join('\n')}`);
        case 'NotAuthenticated':
            throw new Error(`Unable to load ${entity} - user is not authorized.`);
        case 'Success':
            return response;
    }
}

async function queryOrIgnore(redmine: RedmineClient, entity: string, params?: RedminQueryParams): Promise<RedminQueryResponse> {
    const response = await redmine.query(entity, params);
    switch (response.code) {
        case 'Success':
            return response;
        case 'Error':
        case 'NotAuthenticated':
            return {
                code: 'Success',
                totalCount: 0,
                limit: 0,
                offset: 0,
                data: [],
            };
    }
}