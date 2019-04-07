import { RequestMetadata } from '../../shared/http';
import { EntityList } from '../../shared/dataSource';
import { Issue } from '../../shared/types';

export const metadata: RequestMetadata = {
    url: '/api/issue',
    method: 'GET',
};

export type QueryIssueRequest = {
    limit?: number,
    offset?: number,
};

export type QueryIssuesResponse = EntityList<Issue>;