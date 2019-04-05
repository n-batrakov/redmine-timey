import { metadata, QueryIssuesResponse, QueryIssueRequest } from './contract';
import { ensureSuccessStatusCode, readJson, formatUrl } from '../shared/http';

export const queryIssues = async (req?: QueryIssueRequest): Promise<QueryIssuesResponse> => {
    const response = await fetch(formatUrl(metadata.url, req), { method: metadata.method });

    ensureSuccessStatusCode(response);

    const body = await readJson(response);

    return body;
};