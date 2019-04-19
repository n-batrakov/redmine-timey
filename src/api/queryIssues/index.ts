import { metadata, QueryIssuesResponse, QueryIssueRequest } from './contract';
import { ensureSuccessStatusCode, readJson, formatUrl } from '../../shared/http';

export const queryIssues = async (req?: QueryIssueRequest): Promise<QueryIssuesResponse> => {
    const url = formatUrl(metadata.url, req);

    const response = await fetch(url, { method: metadata.method });

    ensureSuccessStatusCode(response);

    const body = await readJson(response);

    return body;
};