import { RequestMetadata } from '../../shared/http';
import { EntityList } from '../../shared/dataSource';
import { Issue } from '../../shared/types';
import Schema from '../../shared/schema';

export const metadata: RequestMetadata = {
    url: '/api/issue',
    method: 'GET',
    schema: {
        querystring: Schema.object({
            limit: Schema.int(),
            offset: Schema.int(),
            project: Schema.string(),
            author: Schema.string(),
            assigned: Schema.string(),
            status: Schema.string(),
            query: Schema.string(),
        }),
    },
};

export type QueryIssueRequest = {
    limit?: number,
    offset?: number,
    project?: string,
    author?: string,
    assigned?: string,
    status?: string,
    query?: string,
};

export type QueryIssuesResponse = EntityList<Issue>;