import { metadata, FetchIssueResponse, getPath } from './contract';
import { readJson } from 'shared/http';

const networkError: FetchIssueResponse = {
    code: 'Error',
    message: 'Unable to fetch entry. Network error.',
    errors: [],
};

export const fetchIssue = async (issueId: string): Promise<FetchIssueResponse> => {
    const response = await fetch(getPath(issueId), { method: metadata.method });

    const body: FetchIssueResponse = await readJson(response);

    switch (body.code) {
        case 'Success':
            return body;
        case 'Error':
            return body;
        default:
            return networkError;
    }
};