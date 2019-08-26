import { metadata, formatUrl } from './contract';
import { ensureSuccessStatusCode } from 'shared/http';

export async function deleteTiming(id: string) {
    const response = await fetch(formatUrl(id), {
        method: metadata.method,
    });

    ensureSuccessStatusCode(response);
}