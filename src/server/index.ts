import { RedmineClient } from './redmine';
import fastify from 'fastify';
import staticFiles from 'fastify-static';
import fastifyCookie from 'fastify-cookie';

import { fallback } from './middleware/fallback';
import path from 'path';
import fs from 'fs';

import api from './api';
import { AppContainer } from './shared';
import { getCalendar } from './workHoursNorm';

import app from 'commander';
import { SecureServerOptions } from 'http2';

const catchErrors = (callback: () => Promise<void>) => {
    const onError = (e: Error) => {
        console.log(e.stack, 'err');
    };
    try {
        callback()
        .catch((e) => {
            onError(e);
            process.exit(1);
        });
    } catch (e) {
        onError(e);
        process.exit(1);
    }
};


const logger = process.env.NODE_ENV !== 'production'
    ? {
        base: null,
        timestamp: false,
        prettyPrint: process.env.NODE_ENV !== 'production',
    }
    : {
        level: 'info',
    };

app
.name('timey')
.version('0.1.0');

app
.command('start')
.option('-r|--redmine <redmine>', 'Redmine host address.', process.env.REDMINE_HOST)
.option('--apiKey [key]', 'Redmine admin API key', process.env.REDMINE_API_KEY)
.option('-h|--host [host]', 'Address to bind server to.', '0.0.0.0')
.option('-p|--port [port]', 'Host address to bind server to.', 8080)
.option('--https [certDir]', 'Enables HTTPS connection; `dir` should point to certificate directory with `pub.key` and `pub.cert` files reside.')
.option('--http2', 'Enables HTTP/2 support. HTTPS must be enabled too.')
.action(cmd => catchErrors(async () => {
    const https: SecureServerOptions = cmd.https === undefined
        ? {}
        : {
            allowHTTP1: true,
            key: fs.readFileSync(path.join(cmd.https, 'pub.key')),
            cert: fs.readFileSync(path.join(cmd.https, 'pub.cert')),
        };
    const http2: any = cmd.http2 === true;

    const server = fastify({ logger, https, http2 });
    server.register(fastifyCookie);

    const { redmine, host } = cmd;
    if (redmine === undefined) {
        throw new Error('Redmine host address is not defined. Unable to continue.');
    }

    const parsedPort = parseInt(cmd.port, 10);
    const port = isNaN(parsedPort) ? 8080 : parsedPort;

    const container: AppContainer = {
        redmine: new RedmineClient({ host: redmine, apiKey: cmd.apiKey }),
        calendar: await getCalendar('calendar.csv'),
    };

    api.forEach(addRoute => addRoute(server, container));

    if (process.env.NODE_ENV !== 'production') {
        const { devServer } = require('./middleware/devServer');
        server.use(devServer());
    } else {
        const staticPath = path.join(__dirname, 'public');
        if (fs.existsSync(staticPath)) {
            server.use(fallback(path.join(staticPath, 'index.html')));
            server.register(staticFiles, {
                root: staticPath,
                cacheControl: true,
                maxAge: '30d',
                immutable: true,
            });
        }
    }

    const redmineStatus = await container.redmine.checkStatus();
    if (!redmineStatus) {
        server.log.warn(`Specified Redmine host (${redmine}) may be invalid - server is unavalilable.`);
    }

    await server.listen(port, host);
    console.log('Server is up and running...');
}));

app.parse(process.argv);