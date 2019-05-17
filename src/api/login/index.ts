import { metadata } from './contract';
import { jsonContentType } from '../../shared/http';

export type AuthenticationResponse = {
    status: 'success',
} | {
    status: 'notAuthenticated',
} | {
    status: 'error',
};

export async function login(credentials: {login: string, password: string}): Promise<AuthenticationResponse> {
    const response = await fetch(metadata.url, {
        method: metadata.method,
        headers: jsonContentType,
        body: JSON.stringify(credentials),
    });

    switch (response.status) {
        case 200:
            return { status: 'success' };
        case 401:
            return { status: 'notAuthenticated' };
        default:
            return { status: 'error' };
    }
}