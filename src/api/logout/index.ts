import { metadata } from './contract';

export async function logout() {
    const response = await fetch(metadata.url, { method: metadata.method });

    if (response.status === 401) {
        return;
    }

    throw new Error(`Unable to log out. Status code must be Not Authorized (401) but ${response.status} received.`);
}