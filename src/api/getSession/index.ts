import { metadata } from './contract';
import { ensureSuccessStatusCode, readJson } from '../../shared/http';
import { UserSession } from '../../shared/types';

export async function getSession(): Promise<UserSession> {
    const response = await fetch(metadata.url, { method: metadata.method });

    ensureSuccessStatusCode(response);

    const body = await readJson(response);

    return body;
}