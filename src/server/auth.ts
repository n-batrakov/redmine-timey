import jwt from 'jsonwebtoken';
import { secret, cookieName } from './authSettings';

type AppTokenPayload = {
    login: string,
};
export function authenticate(req: any, resp: any, done: any) {
    const notAuthenticated = () => {
        resp.code(401);
        done();
    };

    if (req.headers.authorization !== undefined) {
        done();
        return;
    }

    const token = req.cookies[cookieName];

    if (token === undefined) {
        notAuthenticated();
        return;
    }

    jwt.verify(token, secret, (err: jwt.VerifyErrors, payload: AppTokenPayload) => {
        if (err !== undefined && err !== null) {
            notAuthenticated();
        } else {
            done();
        }
    });
}

const atob = (str: string) => Buffer.from(str, 'base64').toString();
const btoa = (str: string) => Buffer.from(str).toString('base64');

export const encodeBasicCredentials = (login: string, password: string) => {
    return `Basic ${btoa(`${login}:${password}`)}`;
};

export const decodeBasicCredentials = (req: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader === undefined) {
        return undefined;
    }

    const [_, credentials] = authHeader.split(' ');
    const [login, password] = atob(credentials).split(':');

    return { login, password };
};

export function getCredentials(req: { cookies: any }) {
    const token = req.cookies[cookieName];

    if (token !== undefined) {
        const payload = jwt.verify(token, secret) as AppTokenPayload;
        return payload;
    } else {
        const credentials = decodeBasicCredentials(req);

        if (credentials === undefined) {
            throw new Error('Not authenticated');
        } else {
            return credentials;
        }
    }
}