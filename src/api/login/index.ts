import { metadata } from './contract';

export type AuthenticationResponse = {
    status: 'success',
} | {
    status: 'notAuthenticated',
} | {
    status: 'error',
};

export async function login(): Promise<AuthenticationResponse> {
    const response = await fetch(metadata.url, { method: metadata.method });

    switch (response.status) {
        case 200:
            return { status: 'success' };
        case 401:
            return { status: 'notAuthenticated' };
        default:
            return { status: 'error' };
    }
}