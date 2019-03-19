import fastify from 'fastify';
import { RedmineClient } from '../redmine';

export type AppContainer = {
    redmine: RedmineClient,
};

export type RegisterHandler = (server: fastify.FastifyInstance, container: AppContainer) => void;

export function authenticate(req: any, resp: any, done: any) {
    const authHeader = <string>req.headers.authorization;

    if (authHeader === undefined) {
        resp.header('WWW-Authenticate', 'Basic realm="Redmine", charset="UTF-8"');
        resp.code(401);
        done();
    }

    done();
}

export function getCredentials(authHeader: string) {
    const atob = (str: string) => Buffer.from(str, 'base64').toString();

    const [_, credentials] = authHeader.split(' ');
    const [login, password] = atob(credentials).split(':');

    return {login, password};
}