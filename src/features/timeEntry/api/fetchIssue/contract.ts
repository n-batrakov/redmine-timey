import { RequestMetadata } from 'shared/http';
import { Issue } from 'shared/types';

export const metadata: RequestMetadata = {
    method: 'GET',
    url: '/api/issue/:id',
};

export const getPath = (id: string) => `/api/issue/${id}`;

export type FetchIssueResponse = {
    code: 'Success',
    data: Issue,
} | {
    code: 'Error',
    message: string,
    errors: string[],
};