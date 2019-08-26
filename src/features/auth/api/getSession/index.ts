import { ensureSuccessStatusCode, readJson } from 'shared/http';
import { UserSession } from 'shared/types';
import { metadata } from './contract';

export async function getSession(): Promise<UserSession> {
    const response = await fetch(metadata.url, { method: metadata.method });

    ensureSuccessStatusCode(response);

    const body = await readJson(response);

    return body;
}