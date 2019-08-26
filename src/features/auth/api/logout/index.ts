import { ensureSuccessStatusCode } from 'shared/http';
import { metadata } from './contract';

export async function logout() {
    const response = await fetch(metadata.url, { method: metadata.method });

    ensureSuccessStatusCode(response);
}