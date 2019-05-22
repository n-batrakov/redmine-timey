import { metadata } from './contract';
import { jsonContentType } from '../../shared/http';
import { wait } from '../../shared';
import { UserSession } from '../../shared/types';

export type AuthenticationResponse = {
    status: 'success',
    session: UserSession,
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
            // Slow down sign-in a bit to avoid flickering.
            const [session] = await Promise.all([response.json(), wait(1000)]);

            return { session, status: 'success' };
        case 401:
            return { status: 'notAuthenticated' };
        default:
            return { status: 'error' };
    }
}