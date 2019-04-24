import fastify from 'fastify';
import { RedmineClient } from './redmine';
import { Calendar } from './workHoursNorm';

export type AppContainer = {
    redmine: RedmineClient,
    calendar: Calendar,
};

export type RegisterHandler = (server: fastify.FastifyInstance, container: AppContainer) => void;

export function authenticate(req: any, resp: any, done: any) {
    const authHeader = <string>req.headers.authorization;

    if (authHeader === undefined) {
        resp.header('WWW-Authenticate', 'Basic realm="Please enter your Redmine credentials", charset="UTF-8"');
        resp.code(401);

        done();
    }

    done();
}

export function getCredentials(authHeader: string) {
    if (authHeader === undefined) {
        throw new Error('Not authenticated');
    }

    const atob = (str: string) => Buffer.from(str, 'base64').toString();

    const [_, credentials] = authHeader.split(' ');
    const [login, password] = atob(credentials).split(':');

    return { login, password };
}