import { metadata } from './contract';
import { ensureSuccessStatusCode } from '../../shared/http';

export async function logout() {
    const response = await fetch(metadata.url, { method: metadata.method });

    ensureSuccessStatusCode(response);
}