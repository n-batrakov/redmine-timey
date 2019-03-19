import { RedmineClient } from './redmine';
import fastify from 'fastify';
import staticFiles from 'fastify-static';
import api from './api';
import path from 'path';

const server = fastify({ logger: true });

const container = {
    redmine: new RedmineClient({ host: 'https://rm.itexpert.ru' }),
};

api.forEach(addRoute => addRoute(server, container));

server.register(staticFiles, {
    root: path.join(__dirname, '..', 'public'),
});

(async function () {
    try {
        await server.listen(3000);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();