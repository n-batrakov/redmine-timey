import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { encodeBasicCredentials } from 'server/auth';
import { secret, tokenSignOptions, cookieName, cookieOptions } from 'server/authSettings';
import { RegisterHandler } from 'server/shared';
import { metadata, LoginRequest, LoginResponse } from './contract';

const verifyRedmineCredentials = async (redmineHost: string, login: string, password: string) => {
    const response = await fetch(`${redmineHost}/trackers.json`, {
        headers: { Authorization: encodeBasicCredentials(login, password) },
    });

    switch (response.status) {
        case 200:
            return true;
        case 401:
            return false;
        default:
            throw new Error(`Unable to verify user credentials. Server responded with status ${response.status} (${response.statusText}).`);
    }
};

const handler: RegisterHandler = (server, { redmine }) => server.route({
    ...metadata,
    handler: async (req, resp): Promise<LoginResponse> => {
        const { login, password } = await req.body as LoginRequest;

        const isCredentialsValid = await verifyRedmineCredentials(redmine.host, login, password);

        if (isCredentialsValid) {
            const token = jwt.sign({ login }, secret, tokenSignOptions);
            resp.setCookie(cookieName, token, cookieOptions);
        } else {
            resp.status(401);
        }

        return {
            username: login,
            redmineHost: redmine.host,
        };
    },
});

export default handler;